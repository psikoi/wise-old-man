import { Queue } from 'bull';
import redisConfig from './redis';
import * as jobs from './instances';

const queues = Object.values(jobs).map((job: any) => ({
  bull: new Queue(job.key, redisConfig),
  name: job.key,
  handle: job.handle,
  onFail: job.onFail,
  onSuccess: job.onSuccess
}));

// Supports cronjobs { repeat: { cron: "* * * * *" } }
function add(name, data, options?) {
  const queue = queues.find(q => q.name === name);

  if (!queue) {
    throw new Error(`No job found for name ${name}`);
  }

  return queue.bull.add(data, options);
}

function schedule(name, data, date) {
  const secondsTill = date - (new Date() as any);

  // Don't allow scheduling for past dates
  if (secondsTill >= 0) {
    add(name, data, { delay: secondsTill });
  }
}

function setup() {
  return queues.forEach(queue => {
    queue.bull.process(queue.handle);

    queue.bull.on('completed', job => {
      if (queue.onSuccess) {
        queue.onSuccess(job.data);
      }
    });

    queue.bull.on('failed', (job, err) => {
      if (queue.onFail) {
        queue.onFail(job.data, err);
      } else {
        console.log(`Job failed`, queue.name, job.data);
        console.log(err);
      }
    });
  });
}

export {
  queues,
  add,
  schedule,
  setup
};
