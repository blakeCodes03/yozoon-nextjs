// import { PrismaClient } from '@prisma/client';

// declare global {
//   // Prevent multiple instances of Prisma Client in development
//   // eslint-disable-next-line no-var
//   var prisma: PrismaClient | undefined;
// }

// const prisma = global.prisma || new PrismaClient();

// if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

// export default prisma;

import { PrismaClient } from '../generated/prisma';

declare global {
  // Prevent multiple instances of Prisma Client in development
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Lazily instantiate PrismaClient on first access to avoid errors
// when modules import prisma at build/dev startup before generate ran.
let _cached: PrismaClient | undefined = global.prisma;

function createPrisma(): PrismaClient {
  if (_cached) return _cached;
  try {
    const client = new PrismaClient();
    if (process.env.NODE_ENV !== 'production') global.prisma = client;
    _cached = client;
    return client;
  } catch (err) {
    // Re-throw with additional context for easier debugging
    console.error('[prisma] failed to create PrismaClient:', err);
    throw err;
  }
}

// Export a Proxy that lazily creates PrismaClient when any property is used.
// This keeps the default import shape (an object with methods) while delaying
// the actual construction until first use.
const lazyPrisma = new Proxy({} as PrismaClient, {
  get(_, prop: string | symbol) {
    const client = createPrisma();
    // @ts-ignore delegate to real client
    return (client as any)[prop];
  },
  set(_, prop: string | symbol, value) {
    const client = createPrisma();
    // @ts-ignore delegate to real client
    (client as any)[prop] = value;
    return true;
  },
  has(_, prop: string | symbol) {
    const client = createPrisma();
    return prop in (client as any);
  },
});

export default lazyPrisma;