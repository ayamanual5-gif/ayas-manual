import { prisma } from "@/server/prisma";
import type { Settings } from "@/lib/types";

const SETTINGS_ID = 1;

const defaults: Settings = {
  instapayHandle: "ayasmanual@instapay",
  vodafoneCashNumber: "010 0123 4567",
  whatsappNumber: "",
  contactPhone: "",
  contactEmail: "",
  contactAddress: "",
  socialInstagram: "",
  socialTiktok: "",
};

function toSettings(row: {
  instapayHandle: string;
  vodafoneCashNumber: string;
  whatsappNumber: string;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  socialInstagram: string;
  socialTiktok: string;
}): Settings {
  return {
    instapayHandle: row.instapayHandle,
    vodafoneCashNumber: row.vodafoneCashNumber,
    whatsappNumber: row.whatsappNumber,
    contactPhone: row.contactPhone,
    contactEmail: row.contactEmail,
    contactAddress: row.contactAddress,
    socialInstagram: row.socialInstagram,
    socialTiktok: row.socialTiktok,
  };
}

async function get(): Promise<Settings> {
  const row = await prisma.settings.findUnique({ where: { id: SETTINGS_ID } });
  if (row) return toSettings(row);

  const created = await prisma.settings.create({ data: { id: SETTINGS_ID, ...defaults } });
  return toSettings(created);
}

async function update(patch: Partial<Settings>): Promise<Settings> {
  const current = await get();
  const next = { ...current, ...patch };
  const row = await prisma.settings.upsert({
    where: { id: SETTINGS_ID },
    update: next,
    create: { id: SETTINGS_ID, ...next },
  });
  return toSettings(row);
}

export const settingsService = { get, update };
