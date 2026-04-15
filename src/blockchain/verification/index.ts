/**
 * Verification Canister
 * ──────────────────────
 * Immutably records counterfeit alerts and makes them queryable.
 * Every alert is permanent — even if later resolved, the original flag remains.
 * This creates an auditable history that regulators and public health agencies
 * can use to track counterfeit hotspots over time.
 *
 * Alert sources:
 *   1. Automated — FastAPI submits alerts when the three-point check fails:
 *        - verify_hash returns false (batch not on-chain)
 *        - ResNet-50 confidence < threshold (packaging looks fake)
 *        - Isolation Forest flags the supply route as anomalous
 *   2. Manual — a pharmacist or patient reports a suspicious drug via the app
 */

import { IDL, query, update, caller, time } from "azle";

// ─── Interface Definitions ─────────────────────────────────

interface AlertType {
  packaging_mismatch?: null;
  hash_not_found?: null;
  supply_anomaly?: null;
  expired_batch?: null;
  recalled_batch?: null;
  citizen_report?: null;
}

interface AlertRecord {
  alert_id: string;
  batch_id: string;
  reporter_principal: string;
  alert_type: AlertType;
  timestamp: bigint;
  location: string;
  evidence_hash: Uint8Array;
  ai_confidence: number;
  resolved: boolean;
}

interface AlertSummary {
  alert_id: string;
  batch_id: string;
  alert_type: AlertType;
  timestamp: bigint;
  location: string;
  resolved: boolean;
}

interface AlertStats {
  total_alerts: number;
  active_alerts: number;
  resolved_alerts: number;
  batches_flagged: number;
}

interface Result<T, E> {
  ok?: T;
  err?: E;
}

// ─── IDL Type Definitions ──────────────────────────────────

const AlertTypeIdl = IDL.Variant({
  packaging_mismatch: IDL.Null,
  hash_not_found: IDL.Null,
  supply_anomaly: IDL.Null,
  expired_batch: IDL.Null,
  recalled_batch: IDL.Null,
  citizen_report: IDL.Null,
});

const AlertRecordIdl = IDL.Record({
  alert_id: IDL.Text,
  batch_id: IDL.Text,
  reporter_principal: IDL.Text,
  alert_type: AlertTypeIdl,
  timestamp: IDL.Nat64,
  location: IDL.Text,
  evidence_hash: IDL.Vec(IDL.Nat8),
  ai_confidence: IDL.Float64,
  resolved: IDL.Bool,
});

const AlertSummaryIdl = IDL.Record({
  alert_id: IDL.Text,
  batch_id: IDL.Text,
  alert_type: AlertTypeIdl,
  timestamp: IDL.Nat64,
  location: IDL.Text,
  resolved: IDL.Bool,
});

const ResultIdl = IDL.Variant({
  ok: IDL.Text,
  err: IDL.Text,
});

const StatsIdl = IDL.Record({
  total_alerts: IDL.Nat32,
  active_alerts: IDL.Nat32,
  resolved_alerts: IDL.Nat32,
  batches_flagged: IDL.Nat32,
});

// ─── Main Canister Class ───────────────────────────────────

export default class {
  private alertStore: Record<string, AlertRecord> = {};
  private batchAlertIndex: Record<string, string[]> = {};
  private locationAlertIndex: Record<string, string[]> = {};

  // Helper method to generate unique alert IDs
  private generateAlertId(): string {
    const ts = time().toString();
    const callerSlice = caller().toText().slice(0, 10);
    return `ALERT-${ts}-${callerSlice}`;
  }

  // Helper method to append to index
  private appendToIndex(
    indexMap: Record<string, string[]>,
    key: string,
    value: string
  ): void {
    const existing = indexMap[key] || [];
    existing.push(value);
    indexMap[key] = existing;
  }

  // ── Alert Management Methods ──────────────────────────

  /**
   * flag_counterfeit
   * Immutably records a counterfeit or safety alert.
   * Called by FastAPI after the three-point verification fails,
   * or directly by authenticated pharmacist/regulator principals.
   *
   * The evidence_hash is a SHA-256 of whatever evidence was submitted:
   *   - For AI alerts: hash of (scan_image + inference_result_json)
   *   - For citizen reports: hash of (photo + report_text)
   * The actual evidence stays off-chain (FastAPI / SQLite). The hash
   * creates a tamper-proof link — if the evidence is later disputed,
   * anyone can verify the hash matches what was originally submitted.
   */
  @update(
    [IDL.Text, AlertTypeIdl, IDL.Text, IDL.Vec(IDL.Nat8), IDL.Float64],
    ResultIdl
  )
  flagCounterfeit(
    batchId: string,
    alertType: AlertType,
    location: string,
    evidenceHash: Uint8Array,
    aiConfidence: number
  ): Result<string, string> {
    try {
      if (batchId.trim() === "") {
        return { err: "batch_id cannot be empty" };
      }
      if (aiConfidence < 0 || aiConfidence > 1) {
        return { err: "ai_confidence must be between 0.0 and 1.0" };
      }

      const alertId = this.generateAlertId();
      const alert: AlertRecord = {
        alert_id: alertId,
        batch_id: batchId,
        reporter_principal: caller().toText(),
        alert_type: alertType,
        timestamp: time(),
        location,
        evidence_hash: evidenceHash,
        ai_confidence: aiConfidence,
        resolved: false,
      };

      this.alertStore[alertId] = alert;
      this.appendToIndex(this.batchAlertIndex, batchId, alertId);

      // Index by location prefix (city-level: first segment before comma)
      const city = location.split(",")[0].trim();
      this.appendToIndex(this.locationAlertIndex, city, alertId);

      return { ok: alertId };
    } catch (error) {
      return { err: `Failed to flag counterfeit: ${error}` };
    }
  }

  /**
   * resolve_alert
   * Marks an alert as resolved (e.g., after regulator investigation).
   * The original alert remains — only the `resolved` flag changes.
   * Only regulators should call this; enforce at FastAPI layer.
   */
  @update([IDL.Text], ResultIdl)
  resolveAlert(alertId: string): Result<string, string> {
    try {
      const alert = this.alertStore[alertId];
      if (!alert) {
        return { err: `Alert ${alertId} not found` };
      }

      this.alertStore[alertId] = { ...alert, resolved: true };
      return { ok: `Alert ${alertId} marked as resolved` };
    } catch (error) {
      return { err: `Failed to resolve alert: ${error}` };
    }
  }

  // ── Query Methods ──────────────────────────────────────

  /**
   * get_alert
   * Fetch a single alert by ID. Full record including evidence_hash.
   */
  @query([IDL.Text], IDL.Opt(AlertRecordIdl))
  getAlert(alertId: string): [AlertRecord] | [] {
    try {
      const alert = this.alertStore[alertId];
      return alert ? [alert] : [];
    } catch (error) {
      return [];
    }
  }

  /**
   * get_alerts_for_batch
   * Returns all alerts filed against a specific batch_id.
   * Frontend calls this directly after a failed verify_hash to show
   * the user exactly why the drug is flagged.
   */
  @query([IDL.Text], IDL.Vec(AlertRecordIdl))
  getAlertsForBatch(batchId: string): AlertRecord[] {
    try {
      const alertIds = this.batchAlertIndex[batchId];
      if (!alertIds) return [];

      const alerts: AlertRecord[] = [];
      for (const alertId of alertIds) {
        const alert = this.alertStore[alertId];
        if (alert) alerts.push(alert);
      }

      return alerts.sort((a, b) =>
        a.timestamp < b.timestamp ? -1 : 1
      );
    } catch (error) {
      return [];
    }
  }

  /**
   * get_alerts_by_location
   * Returns alerts for a given city prefix.
   * Powers the regulator geographic hotspot map.
   * Location is matched on the city segment (text before first comma).
   */
  @query([IDL.Text], IDL.Vec(AlertSummaryIdl))
  getAlertsByLocation(city: string): AlertSummary[] {
    try {
      const alertIds = this.locationAlertIndex[city.trim()];
      if (!alertIds) return [];

      const summaries: AlertSummary[] = [];
      for (const alertId of alertIds) {
        const alert = this.alertStore[alertId];
        if (alert) {
          summaries.push({
            alert_id: alert.alert_id,
            batch_id: alert.batch_id,
            alert_type: alert.alert_type,
            timestamp: alert.timestamp,
            location: alert.location,
            resolved: alert.resolved,
          });
        }
      }

      return summaries.sort((a, b) =>
        a.timestamp < b.timestamp ? -1 : 1
      );
    } catch (error) {
      return [];
    }
  }

  /**
   * get_active_alerts
   * Returns all unresolved alerts across all batches.
   * Paginated via offset + limit to avoid hitting query response size limits.
   * Used by the regulator dashboard for the active incidents view.
   */
  @query([IDL.Nat32, IDL.Nat32], IDL.Vec(AlertSummaryIdl))
  getActiveAlerts(offset: number, limit: number): AlertSummary[] {
    try {
      const all: AlertSummary[] = [];

      // Iterate through all alerts
      for (const alertId in this.alertStore) {
        const alert = this.alertStore[alertId];
        if (!alert.resolved) {
          all.push({
            alert_id: alert.alert_id,
            batch_id: alert.batch_id,
            alert_type: alert.alert_type,
            timestamp: alert.timestamp,
            location: alert.location,
            resolved: alert.resolved,
          });
        }
      }

      all.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1)); // newest first

      const start = offset;
      const end = start + limit;
      return all.slice(start, end);
    } catch (error) {
      return [];
    }
  }

  /**
   * get_stats
   * Returns counts of total, active, and resolved alerts.
   * Also returns count of unique batches that have ever been flagged.
   */
  @query([], StatsIdl)
  getStats(): AlertStats {
    try {
      let active = 0;
      let resolved = 0;

      for (const alertId in this.alertStore) {
        const alert = this.alertStore[alertId];
        if (alert.resolved) resolved++;
        else active++;
      }

      return {
        total_alerts: Object.keys(this.alertStore).length,
        active_alerts: active,
        resolved_alerts: resolved,
        batches_flagged: Object.keys(this.batchAlertIndex).length,
      };
    } catch (error) {
      return {
        total_alerts: 0,
        active_alerts: 0,
        resolved_alerts: 0,
        batches_flagged: 0,
      };
    }
  }
}
