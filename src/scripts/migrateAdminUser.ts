/**
 * One-time migration: creates the ADMIN row in the `User` table from the
 * existing ADMIN_EMAIL / ADMIN_PASSWORD_HASH env vars, so the admin's
 * current password keeps working after auth moves off env-var checks.
 * Safe to re-run — does nothing if the user already exists.
 *
 * Run with: npm run migrate-admin
 */
import "dotenv/config";
import { prisma } from "@/server/prisma";

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const rawHash = process.env.ADMIN_PASSWORD_HASH;

  if (!email || !rawHash) {
    console.error("ADMIN_EMAIL / ADMIN_PASSWORD_HASH are not set — nothing to migrate.");
    process.exit(1);
  }

  // Local .env escapes "$" as "\$" so Next.js's own loader doesn't mangle it
  // (see the comment in .env) — but plain `dotenv/config` here does NOT
  // strip that escaping, so it must be normalized before storing, or the
  // hash gets corrupted with literal backslashes. Vercel's raw env var
  // (no escaping) passes through this unchanged.
  const passwordHash = rawHash.replace(/\\\$/g, "$");

  const normalizedEmail = email.trim().toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  if (existing) {
    if (existing.passwordHash === passwordHash) {
      console.log(`User ${normalizedEmail} already exists with the correct hash — nothing to do.`);
      return;
    }
    await prisma.user.update({ where: { id: existing.id }, data: { passwordHash, role: "ADMIN" } });
    console.log(`Updated ${normalizedEmail}'s stored hash to match ADMIN_PASSWORD_HASH.`);
    return;
  }

  const created = await prisma.user.create({
    data: {
      email: normalizedEmail,
      passwordHash,
      role: "ADMIN",
      name: "Admin",
    },
  });

  console.log(`Created ADMIN user ${created.email} (id ${created.id}). Existing password keeps working.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
