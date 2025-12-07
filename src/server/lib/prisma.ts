import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import dotenv from "dotenv";
import { PrismaClient } from "@/server/generated/prisma/client";

dotenv.config();

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set in environment variables");
}

const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL,
});

const prismaClientSingleton = () => {
    return new PrismaClient({ adapter });
};

// biome-ignore lint/suspicious/noShadowRestrictedNames: <IGNORE>
declare const globalThis: {
    prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
