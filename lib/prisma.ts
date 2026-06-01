import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const DATABASE_URL = process.env.DATABASE_URL ?? "";

function createClient() {
  const adapter = new PrismaPg({ connectionString: DATABASE_URL });
  if (DATABASE_URL.startsWith("prisma+postgres://")) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { withAccelerate } = require("@prisma/extension-accelerate");
    return new PrismaClient({ adapter }).$extends(withAccelerate());
  }
  return new PrismaClient({ adapter });
}

type PrismaClientSingleton = ReturnType<typeof createClient>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const db: PrismaClientSingleton =
  globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
