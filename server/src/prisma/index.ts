import { PrismaClient, Achievement } from '@prisma/client';

const prisma = new PrismaClient();

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error

// Workaround: BigInts are stored as strings on Postgres, but we should return
// them as numbers in JSON responses
BigInt.prototype.toJSON = function () {
  return parseInt(this.toString());
};

interface ModifiedAchievement extends Omit<Achievement, 'threshold'> {
  threshold: number;
}

function fixAchievement(achievement: Achievement): ModifiedAchievement {
  return { ...achievement, threshold: parseInt(achievement.threshold.toString()) };
}

export default prisma;
export { ModifiedAchievement as AchievementModel, fixAchievement };
