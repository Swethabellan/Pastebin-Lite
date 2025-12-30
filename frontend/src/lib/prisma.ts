import { PrismaClient } from "@/generated/client/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString || connectionString.trim() === "" || connectionString === "/") {
  throw new Error(
    "DATABASE_URL environment variable is not set or is invalid. " +
    "Please set DATABASE_URL to a valid PostgreSQL connection string."
  );
}

let pool: Pool;
let adapter: PrismaPg;
try {
  pool = new Pool({ connectionString });
  adapter = new PrismaPg(pool);
} catch (error) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  throw new Error(
    `Failed to initialize database connection: ${errorMessage}. ` +
    "Please check that DATABASE_URL is a valid PostgreSQL connection string."
  );
}

export const prisma =
  global.prisma ??
  new PrismaClient({
    adapter,
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}


