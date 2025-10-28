"use strict";
// import { PrismaClient } from '@prisma/client';
Object.defineProperty(exports, "__esModule", { value: true });
// declare global {
//   // Prevent multiple instances of Prisma Client in development
//   // eslint-disable-next-line no-var
//   var prisma: PrismaClient | undefined;
// }
// const prisma = global.prisma || new PrismaClient();
// if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
// export default prisma;
var prisma_1 = require("../generated/prisma");
// Lazily instantiate PrismaClient on first access to avoid errors
// when modules import prisma at build/dev startup before generate ran.
var _cached = global.prisma;
function createPrisma() {
    if (_cached)
        return _cached;
    try {
        var client = new prisma_1.PrismaClient();
        if (process.env.NODE_ENV !== 'production')
            global.prisma = client;
        _cached = client;
        return client;
    }
    catch (err) {
        // Re-throw with additional context for easier debugging
        console.error('[prisma] failed to create PrismaClient:', err);
        throw err;
    }
}
// Export a Proxy that lazily creates PrismaClient when any property is used.
// This keeps the default import shape (an object with methods) while delaying
// the actual construction until first use.
var lazyPrisma = new Proxy({}, {
    get: function (_, prop) {
        var client = createPrisma();
        // @ts-ignore delegate to real client
        return client[prop];
    },
    set: function (_, prop, value) {
        var client = createPrisma();
        // @ts-ignore delegate to real client
        client[prop] = value;
        return true;
    },
    has: function (_, prop) {
        var client = createPrisma();
        return prop in client;
    },
});
exports.default = lazyPrisma;
