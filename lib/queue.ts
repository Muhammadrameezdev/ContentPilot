import Bull from "bull";

const redisUrl = process.env.REDIS_URL ?? "redis://localhost:6379";

export const publishQueue = new Bull("publish-queue", redisUrl, {
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
  },
});

export const analyticsQueue = new Bull("analytics-queue", redisUrl, {
  defaultJobOptions: {
    removeOnComplete: 10,
    removeOnFail: 10,
  },
});

export const emailQueue = new Bull("email-queue", redisUrl, {
  defaultJobOptions: {
    removeOnComplete: 50,
    removeOnFail: 20,
    attempts: 3,
  },
});
