import Queue from 'bull';
import env, { isTesting } from '../../env';
import redisConfig from './redis';
import * as jobs from './instances';
import crons from './crons';
import * as logger from '../logger';

const PRIORITY_HIGH = 1;
const PRIORITY_MEDIUM = 2;
const PRIORITY_LOW = 3;

const jobQueues = [];

/**
 * Adds a new job to the queue, to be executed ASAP.
 */
function addJob(name, data, options?) {
  if (isTesting()) {
    return;
  }

  const queue = jobQueues.find(q => q.name === name);

  if (!queue) {
    throw new Error(`No job found for name ${name}`);
  }

  const priority = (options && options.priority) || PRIORITY_MEDIUM;
  queue.bull.add({ ...data, created: new Date() }, { ...options, priority });
}

/**
 * Adds new scheduled job, to be executed at the specified date.
 */
function scheduleJob(name, data, date) {
  const secondsTill = date - (new Date() as any);

  // Don't allow scheduling for past dates
  if (secondsTill >= 0) {
    addJob(name, data, { delay: secondsTill, priority: PRIORITY_MEDIUM });
  }
}

async function setupJobs() {
  jobQueues.push(
    ...Object.values(jobs).map((job: any) => ({
      bull: new Queue(job.name, redisConfig),
      ...job
    }))
  );

  // Initialize all queue processing
  jobQueues.forEach(queue => {
    queue.bull.process(5, queue.handle);

    // On Success callback
    queue.bull.on('completed', job => queue.onSuccess && queue.onSuccess(job.data));

    // On Failure callback
    queue.bull.on('failed', (job, error) => {
      if (queue.onFail) {
        queue.onFail(job.data, error);
      }

      logger.error(`Failed job (${job.queue.name})`, {
        data: job.data,
        error: { ...error, message: error.message || '' }
      });
    });
  });

  // If running through pm2 (production), only run cronjobs on the first CPU core.
  // Otherwise, on a 4 core server, every cronjob would run 4x as often.
  // Note: This will also run in development environments
  if (!env.pm_id || parseInt(env.pm_id, 10) === 0) {
    // Remove any active cron jobs
    jobQueues.forEach(async ({ bull }) => {
      const activeQueues = await bull.getRepeatableJobs();
      activeQueues.forEach(async job => bull.removeRepeatable({ cron: job.cron, jobId: job.id }));
    });

    // Start all cron jobs (with a 10 second delay, to wait for old jobs to be removed)
    // TODO: this can be improved to await for the removal above, instead of the hacky 10sec wait
    setTimeout(() => {
      crons.forEach(cron =>
        addJob(cron.jobName, null, { repeat: { cron: cron.cronConfig }, priority: PRIORITY_LOW })
      );
    }, 10000);
  }
}

export { jobQueues, addJob, scheduleJob, setupJobs, PRIORITY_MEDIUM, PRIORITY_LOW, PRIORITY_HIGH };
