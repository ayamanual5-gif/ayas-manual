import fs from "fs/promises";
import path from "path";

export interface Settings {
  instapayHandle: string;
  vodafoneCashNumber: string;
}

const filePath = path.join(__dirname, "..", "..", "data", "settings.json");

const defaults: Settings = {
  instapayHandle: "ayasmanual@instapay",
  vodafoneCashNumber: "010 0123 4567",
};

async function ensureFile(): Promise<void> {
  try {
    await fs.access(filePath);
  } catch {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(defaults, null, 2), "utf-8");
  }
}

async function get(): Promise<Settings> {
  await ensureFile();
  const raw = await fs.readFile(filePath, "utf-8");
  return { ...defaults, ...(raw.trim() ? JSON.parse(raw) : {}) };
}

async function update(patch: Partial<Settings>): Promise<Settings> {
  const current = await get();
  const next = { ...current, ...patch };
  await fs.writeFile(filePath, JSON.stringify(next, null, 2), "utf-8");
  return next;
}

export const settingsService = { get, update };
