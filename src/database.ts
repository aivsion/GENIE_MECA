import fs from "fs";
import path from "path";

export interface AnalyzedVehicle {
  id: string;
  vinOrPlate: string;
  analyzedAt: string;
  vehicleDetails: any;
}

export class VehicleTable {
  private filePath: string;

  constructor() {
    this.filePath = path.join(process.cwd(), "vehicle_logs_db.json");
    this.initTable();
  }

  private initTable() {
    if (!fs.existsSync(this.filePath)) {
      try {
        fs.writeFileSync(this.filePath, JSON.stringify([], null, 2), "utf8");
      } catch (e) {
        console.error("Failed to initialize database table file:", e);
      }
    }
  }

  private readRows(): AnalyzedVehicle[] {
    try {
      this.initTable();
      if (!fs.existsSync(this.filePath)) return [];
      const content = fs.readFileSync(this.filePath, "utf8");
      return JSON.parse(content) || [];
    } catch (e) {
      console.error("Error reading database table:", e);
      return [];
    }
  }

  private writeRows(rows: AnalyzedVehicle[]) {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(rows, null, 2), "utf8");
    } catch (e) {
      console.error("Error writing database table:", e);
    }
  }

  /**
   * Check if a VIN/Plate has already been analyzed
   */
  public exists(vinOrPlate: string): boolean {
    if (!vinOrPlate) return false;
    const cleanId = this.cleanIdentifier(vinOrPlate);
    if (!cleanId) return false;
    const rows = this.readRows();
    return rows.some(row => this.cleanIdentifier(row.vinOrPlate) === cleanId);
  }

  /**
   * Insert a new record
   */
  public insert(vinOrPlate: string, vehicleDetails: any = null): AnalyzedVehicle {
    const cleanId = this.cleanIdentifier(vinOrPlate);
    const rows = this.readRows();
    
    // De-duplicate if already exists
    const existing = rows.find(row => this.cleanIdentifier(row.vinOrPlate) === cleanId);
    if (existing) {
      return existing;
    }

    const newRecord: AnalyzedVehicle = {
      id: "rec_" + Math.random().toString(36).substring(2, 11),
      vinOrPlate: cleanId,
      analyzedAt: new Date().toISOString(),
      vehicleDetails
    };

    rows.push(newRecord);
    this.writeRows(rows);
    return newRecord;
  }

  /**
   * Clear all records
   */
  public clear() {
    this.writeRows([]);
  }

  /**
   * Get all logs
   */
  public getAll(): AnalyzedVehicle[] {
    return this.readRows();
  }

  /**
   * Utility to clean up spaces and dashes, keeping it case insensitive
   */
  private cleanIdentifier(str: string): string {
    if (!str) return "";
    return str.toString().trim().toUpperCase().replace(/[\s-]/g, "");
  }
}

export const vehicleTable = new VehicleTable();
