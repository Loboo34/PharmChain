import { IDL, query, update, caller, time } from "azle";

// ─── Interface Definitions ─────────────────────────────────

interface DrugStatus {
  active?: boolean;
  recalled?: boolean;
  suspended?: boolean;
}

interface BatchStatus {
  active?: boolean;
  recalled?: boolean;
  expired?: boolean;
  in_transit?: boolean;
}

interface DrugRecord {
  drug_id: string;
  name: string;
  manufacturer_principal: string;
  nafdac_number: string;
  who_qualified: boolean;
  registered_at: bigint;
  status: DrugStatus;
}

interface BatchRecord {
  batch_id: string;
  drug_id: string;
  batch_hash: Uint8Array;
  production_date: bigint;
  expiry_date: bigint;
  quantity: bigint;
  status: BatchStatus;
  registered_at: bigint;
  registered_by: string;
}

interface VerifyResult {
  exists: boolean;
  batch: [BatchRecord] | [];
}

interface Result<T, E> {
  ok?: T;
  err?: E;
}

interface DrugStats {
  total_drugs: number;
  total_batches: number;
  active_drugs: number;
  recalled_batches: number;
}

// ─── IDL Type Definitions ──────────────────────────────────

const DrugStatusIdl = IDL.Variant({
  active: IDL.Bool,
  recalled: IDL.Bool,
  suspended: IDL.Bool,
});

const BatchStatusIdl = IDL.Variant({
  active: IDL.Bool,
  recalled: IDL.Bool,
  expired: IDL.Bool,
  in_transit: IDL.Bool,
});

const DrugRecordIdl = IDL.Record({
  drug_id: IDL.Text,
  name: IDL.Text,
  manufacturer_principal: IDL.Text,
  nafdac_number: IDL.Text,
  who_qualified: IDL.Bool,
  registered_at: IDL.Nat64,
  status: DrugStatusIdl,
});

const BatchRecordIdl = IDL.Record({
  batch_id: IDL.Text,
  drug_id: IDL.Text,
  batch_hash: IDL.Vec(IDL.Nat8),
  production_date: IDL.Nat64,
  expiry_date: IDL.Nat64,
  quantity: IDL.Nat64,
  status: BatchStatusIdl,
  registered_at: IDL.Nat64,
  registered_by: IDL.Text,
});

const VerifyResultIdl = IDL.Record({
  exists: IDL.Bool,
  batch: IDL.Opt(BatchRecordIdl),
});

const ResultIdl = IDL.Variant({
  ok: IDL.Text,
  err: IDL.Text,
});

const StatsIdl = IDL.Record({
  total_drugs: IDL.Nat32,
  total_batches: IDL.Nat32,
  active_drugs: IDL.Nat32,
  recalled_batches: IDL.Nat32,
});

// ─── Main Canister Class ───────────────────────────────────

export default class {
  private drugStore: Record<string, DrugRecord> = {};
  private batchStore: Record<string, BatchRecord> = {};
  private nafdacIndex: Record<string, string> = {};
  private hashIndex: Record<string, string> = {};
  private regulatorStore: Record<string, boolean> = {};
  private manufacturerStore: Record<string, boolean> = {};

  // Helper method to generate unique IDs
  private generateId(prefix: string): string {
    const timestamp = time().toString();
    const callerSlice = caller().toText().slice(0, 10);
    return `${prefix}-${timestamp}-${callerSlice}`;
  }

  // Helper method to convert hash to hex string
  private hashToHex(hash: Uint8Array): string {
    return Array.from(hash)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  // Helper method to check if caller is a regulator
  private isRegulator(): boolean {
    return this.regulatorStore[caller().toText()] === true;
  }

  // ── Admin Methods ──────────────────────────────────────

  @update([IDL.Text])
  addRegulator(principalText: string): Result<string, string> {
    try {
      this.regulatorStore[principalText] = true;
      return { ok: `Regulator ${principalText} added` };
    } catch (error) {
      return { err: `Failed to add regulator: ${error}` };
    }
  }

  @update([IDL.Text])
  removeRegulator(principalText: string): Result<string, string> {
    try {
      delete this.regulatorStore[principalText];
      return { ok: `Regulator ${principalText} removed` };
    } catch (error) {
      return { err: `Failed to remove regulator: ${error}` };
    }
  }

  @update([IDL.Text])
  addManufacturer(principalText: string): Result<string, string> {
    try {
      this.manufacturerStore[principalText] = true;
      return { ok: `Manufacturer ${principalText} added` };
    } catch (error) {
      return { err: `Failed to add manufacturer: ${error}` };
    }
  }

  // ── Drug Registration Methods ──────────────────────────

  @update([IDL.Text, IDL.Text, IDL.Bool])
  registerDrug(
    name: string,
    nafdacNumber: string,
    whoQualified: boolean
  ): Result<string, string> {
    try {
      const userPrincipal = caller().toText();

      if (!this.manufacturerStore[userPrincipal]) {
        return {
          err: "Only registered manufacturers can register drugs",
        };
      }

      if (this.nafdacIndex[nafdacNumber] !== undefined) {
        return { err: `NAFDAC number ${nafdacNumber} already registered` };
      }

      const drugId = this.generateId("DRUG");

      const drug: DrugRecord = {
        drug_id: drugId,
        name,
        manufacturer_principal: userPrincipal,
        nafdac_number: nafdacNumber,
        who_qualified: whoQualified,
        registered_at: time(),
        status: { active: true },
      };

      this.drugStore[drugId] = drug;
      this.nafdacIndex[nafdacNumber] = drugId;

      return { ok: drugId };
    } catch (error) {
      return { err: `Failed to register drug: ${error}` };
    }
  }

  @query([IDL.Text])
  getDrug(drugId: string): [DrugRecord] | [] {
    try {
      const drug = this.drugStore[drugId];
      return drug ? [drug] : [];
    } catch (error) {
      return [];
    }
  }

  @query([IDL.Text])
  getDrugByNafdac(nafdacNumber: string): [DrugRecord] | [] {
    try {
      const drugId = this.nafdacIndex[nafdacNumber];
      if (!drugId) return [];
      const drug = this.drugStore[drugId];
      return drug ? [drug] : [];
    } catch (error) {
      return [];
    }
  }

  // ── Batch Registration Methods ─────────────────────────

  @update([IDL.Text, IDL.Vec(IDL.Nat8), IDL.Nat64, IDL.Nat64, IDL.Nat64])
  registerBatch(
    drugId: string,
    batchHash: Uint8Array,
    productionDate: bigint,
    expiryDate: bigint,
    quantity: bigint
  ): Result<string, string> {
    try {
      const userPrincipal = caller().toText();

      if (this.drugStore[drugId] === undefined) {
        return { err: `Drug ${drugId} not found` };
      }

      const hexHash = this.hashToHex(batchHash);
      if (this.hashIndex[hexHash] !== undefined) {
        return { err: "Batch with this hash already exists" };
      }

      const batchId = this.generateId("BATCH");

      const batch: BatchRecord = {
        batch_id: batchId,
        drug_id: drugId,
        batch_hash: batchHash,
        production_date: productionDate,
        expiry_date: expiryDate,
        quantity,
        status: { active: true },
        registered_at: time(),
        registered_by: userPrincipal,
      };

      this.batchStore[batchId] = batch;
      this.hashIndex[hexHash] = batchId;

      return { ok: batchId };
    } catch (error) {
      return { err: `Failed to register batch: ${error}` };
    }
  }

  @query([IDL.Text])
  getBatch(batchId: string): [BatchRecord] | [] {
    try {
      const batch = this.batchStore[batchId];
      return batch ? [batch] : [];
    } catch (error) {
      return [];
    }
  }

  @query([IDL.Vec(IDL.Nat8)])
  verifyHash(hash: Uint8Array): VerifyResult {
    try {
      const hexHash = this.hashToHex(hash);
      const batchId = this.hashIndex[hexHash];

      if (!batchId) {
        return { exists: false, batch: [] };
      }

      const batch = this.batchStore[batchId];
      return {
        exists: batch !== undefined,
        batch: batch ? [batch] : [],
      };
    } catch (error) {
      return { exists: false, batch: [] };
    }
  }

  // ── Recall Methods ────────────────────────────────────

  @update([IDL.Text])
  recallBatch(batchId: string): Result<string, string> {
    try {
      if (!this.isRegulator()) {
        return { err: "Only regulators can recall batches" };
      }

      const batch = this.batchStore[batchId];
      if (!batch) {
        return { err: `Batch ${batchId} not found` };
      }

      this.batchStore[batchId] = {
        ...batch,
        status: { recalled: true },
      };

      return { ok: `Batch ${batchId} recalled successfully` };
    } catch (error) {
      return { err: `Failed to recall batch: ${error}` };
    }
  }

  @update([IDL.Text])
  suspendDrug(drugId: string): Result<string, string> {
    try {
      if (!this.isRegulator()) {
        return { err: "Only regulators can suspend drugs" };
      }

      const drug = this.drugStore[drugId];
      if (!drug) {
        return { err: `Drug ${drugId} not found` };
      }

      this.drugStore[drugId] = {
        ...drug,
        status: { suspended: true },
      };

      return { ok: `Drug ${drugId} suspended successfully` };
    } catch (error) {
      return { err: `Failed to suspend drug: ${error}` };
    }
  }

  // ── Statistics Methods ────────────────────────────────

  @query([])
  getStats(): DrugStats {
    try {
      let activeDrugCount = 0;
      let recalledBatchCount = 0;

      Object.values(this.drugStore).forEach((drug) => {
        if (drug.status.active) activeDrugCount++;
      });

      Object.values(this.batchStore).forEach((batch) => {
        if (batch.status.recalled) recalledBatchCount++;
      });

      return {
        total_drugs: Object.keys(this.drugStore).length,
        total_batches: Object.keys(this.batchStore).length,
        active_drugs: activeDrugCount,
        recalled_batches: recalledBatchCount,
      };
    } catch (error) {
      return {
        total_drugs: 0,
        total_batches: 0,
        active_drugs: 0,
        recalled_batches: 0,
      };
    }
  }

  @query([])
  getDrugCount(): number {
    return Object.keys(this.drugStore).length;
  }

  @query([])
  getBatchCount(): number {
    return Object.keys(this.batchStore).length;
  }
}