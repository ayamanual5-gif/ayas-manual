import { PrismaClient } from "@prisma/client";

// Reuse a single client across hot-reloads/serverless warm invocations
// instead of opening a fresh Postgres connection pool every time.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
