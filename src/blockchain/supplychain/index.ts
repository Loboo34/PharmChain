/**
 * Supply Chain Canister
 * ─────────────────────
 * Records an immutable, append-only log of custody events for each batch.
 * Every time a batch changes hands — manufacturer → distributor → pharmacy →
 * patient — a CustodyEvent is appended. Nothing is ever deleted or updated.
 *
 * Design choices:
 *   - Events are stored in a flat map (event_id → CustodyEvent) for O(1) fetch.
 *   - A secondary index (batch_id → event_id[]) enables ordered chain retrieval.
 *   - The canister does NOT cross-call drug_registry to validate batch_id.
 *     Integrity is enforced at the FastAPI layer before the update is submitted.
 *     This avoids inter-canister call fees and the async complexity they add.
 */

import { IDL, query, update, caller, time } from "azle";

// ─── Interface Definitions ─────────────────────────────────

interface EventType {
  manufactured?: null;
  quality_checked?: null;
  dispatched?: null;
  received?: null;
  in_customs?: null;
  delivered?: null;
  dispensed?: null;
}

interface CustodyEvent {
  event_id: string;
  batch_id: string;
  from_principal: string;
  to_principal: string;
  timestamp: bigint;
  location: string;
  event_type: EventType;
  notes: string;
}

interface CustodyStats {
  total_events: number;
  total_batches_tracked: number;
}

interface Result<T, E> {
  ok?: T;
  err?: E;
}

// ─── IDL Type Definitions ──────────────────────────────────

const EventTypeIdl = IDL.Variant({
  manufactured: IDL.Null,
  quality_checked: IDL.Null,
  dispatched: IDL.Null,
  received: IDL.Null,
  in_customs: IDL.Null,
  delivered: IDL.Null,
  dispensed: IDL.Null,
});

const CustodyEventIdl = IDL.Record({
  event_id: IDL.Text,
  batch_id: IDL.Text,
  from_principal: IDL.Text,
  to_principal: IDL.Text,
  timestamp: IDL.Nat64,
  location: IDL.Text,
  event_type: EventTypeIdl,
  notes: IDL.Text,
});

const ResultIdl = IDL.Variant({
  ok: IDL.Text,
  err: IDL.Text,
});

const StatsIdl = IDL.Record({
  total_events: IDL.Nat32,
  total_batches_tracked: IDL.Nat32,
});

// ─── Main Canister Class ───────────────────────────────────

export default class {
  private eventStore: Record<string, CustodyEvent> = {};
  private chainIndex: Record<string, string[]> = {};

  // Helper method to generate unique event IDs
  private generateEventId(): string {
    const ts = time().toString();
    const callerSlice = caller().toText().slice(0, 10);
    return `EVT-${ts}-${callerSlice}`;
  }

  // ── Event Management Methods ───────────────────────────

  /**
   * add_event
   * Appends a custody event to the chain for a given batch.
   * The caller's principal is recorded as `from_principal` automatically —
   * this is cryptographically guaranteed by ICP (can't be spoofed).
   *
   * Called by FastAPI after:
   *   1. Verifying the batch exists in drug_registry (SQLite mirror or query)
   *   2. Verifying the caller is authorised for this event_type
   *   3. Optionally running an Isolation Forest anomaly check on the route
   */
  @update([
    IDL.Text,
    IDL.Text,
    IDL.Text,
    EventTypeIdl,
    IDL.Text,
  ])
  addEvent(
    batchId: string,
    toPrincipal: string,
    location: string,
    eventType: EventType,
    notes: string
  ): Result<string, string> {
    try {
      // Basic input validation
      if (batchId.trim() === "") {
        return { err: "batch_id cannot be empty" };
      }
      if (location.trim() === "") {
        return { err: "location cannot be empty" };
      }

      const eventId = this.generateEventId();
      const event: CustodyEvent = {
        event_id: eventId,
        batch_id: batchId,
        from_principal: caller().toText(),
        to_principal: toPrincipal,
        timestamp: time(),
        location,
        event_type: eventType,
        notes,
      };

      // Append to flat event store
      this.eventStore[eventId] = event;

      // Append event_id to this batch's ordered chain
      const existingChain = this.chainIndex[batchId] || [];
      existingChain.push(eventId);
      this.chainIndex[batchId] = existingChain;

      return { ok: eventId };
    } catch (error) {
      return { err: `Failed to add event: ${error}` };
    }
  }

  /**
   * get_custody_chain
   * Returns all custody events for a batch in chronological order.
   * This is the "provenance trail" — every hand a drug passed through,
   * every location, every timestamp.
   *
   * The frontend calls this directly via @dfinity/agent (no backend hop)
   * to display the full chain when a user scans a batch QR code.
   */
  @query([IDL.Text])
  getCustodyChain(batchId: string): CustodyEvent[] {
    try {
      const eventIds = this.chainIndex[batchId];
      if (!eventIds) return [];

      const events: CustodyEvent[] = [];
      for (const eventId of eventIds) {
        const event = this.eventStore[eventId];
        if (event) {
          events.push(event);
        }
      }

      // Return ordered by timestamp ascending (they should already be in order,
      // but sort defensively in case of concurrent inserts)
      return events.sort((a, b) =>
        a.timestamp < b.timestamp ? -1 : a.timestamp > b.timestamp ? 1 : 0
      );
    } catch (error) {
      return [];
    }
  }

  /**
   * get_event
   * Fetch a single custody event by event_id.
   * Used for audit deep-dives and alert investigation.
   */
  @query([IDL.Text])
  getEvent(eventId: string): [CustodyEvent] | [] {
    try {
      const event = this.eventStore[eventId];
      return event ? [event] : [];
    } catch (error) {
      return [];
    }
  }

  /**
   * get_latest_custody
   * Returns only the most recent event for a batch.
   * Fast path for "where is this batch right now?" queries.
   */
  @query([IDL.Text])
  getLatestCustody(batchId: string): [CustodyEvent] | [] {
    try {
      const eventIds = this.chainIndex[batchId];
      if (!eventIds || eventIds.length === 0) return [];

      const latestId = eventIds[eventIds.length - 1];
      const event = this.eventStore[latestId];
      return event ? [event] : [];
    } catch (error) {
      return [];
    }
  }

  /**
   * get_chain_length
   * Returns the number of custody events for a batch.
   * An unusually long chain (e.g. > 15 hops) is itself an anomaly signal —
   * the AI layer uses this count as one Isolation Forest feature.
   */
  @query([IDL.Text])
  getChainLength(batchId: string): number {
    try {
      const eventIds = this.chainIndex[batchId];
      return eventIds ? eventIds.length : 0;
    } catch (error) {
      return 0;
    }
  }

  /**
   * get_stats
   * Total events recorded across all batches. Regulator dashboard metric.
   */
  @query([])
  getStats(): CustodyStats {
    try {
      return {
        total_events: Object.keys(this.eventStore).length,
        total_batches_tracked: Object.keys(this.chainIndex).length,
      };
    } catch (error) {
      return {
        total_events: 0,
        total_batches_tracked: 0,
      };
    }
  }
}