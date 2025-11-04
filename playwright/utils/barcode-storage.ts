import { promises as fs } from "fs";
const BARCODE_FILE = "./barcodes.json";

export async function storeBarcode(barcode: string) {
  let barcodes: string[] = [];
  try {
    const data = await fs.readFile(BARCODE_FILE, "utf-8");
    barcodes = JSON.parse(data);
  } catch {
    // File might not exist yet, ignore
  }
  barcodes.push(barcode);
  await fs.writeFile(BARCODE_FILE, JSON.stringify(barcodes, null, 2));
}
