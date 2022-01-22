import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error

// Workaround: BigInts are stored as strings on Postgres, but we should return
// them as numbers in JSON responses
BigInt.prototype.toJSON = function () {
  return parseInt(this.toString());
};

export default prisma;
