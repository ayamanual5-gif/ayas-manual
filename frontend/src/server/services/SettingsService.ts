import { prisma } from "@/server/prisma";
import type { Settings } from "@/lib/types";

const SETTINGS_ID = 1;

const defaults: Settings = {
  instapayHandle: "ayasmanual@instapay",
  vodafoneCashNumber: "010 0123 4567",
};

async function get(): Promise<Settings> {
  const row = await prisma.settings.findUnique({ where: { id: SETTINGS_ID } });
  if (row) return { instapayHandle: row.instapayHandle, vodafoneCashNumber: row.vodafoneCashNumber };

  const created = await prisma.settings.create({ data: { id: SETTINGS_ID, ...defaults } });
  return { instapayHandle: created.instapayHandle, vodafoneCashNumber: created.vodafoneCashNumber };
}

async function update(patch: Partial<Settings>): Promise<Settings> {
  const current = await get();
  const next = { ...current, ...patch };
  const row = await prisma.settings.upsert({
    where: { id: SETTINGS_ID },
    update: next,
    create: { id: SETTINGS_ID, ...next },
  });
  return { instapayHandle: row.instapayHandle, vodafoneCashNumber: row.vodafoneCashNumber };
}

export const settingsService = { get, update };
