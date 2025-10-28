const Queue = require('bull');

const emailQueue = new Queue('emailQueue', {
  redis: { host: 'localhost', port: 6379 } // Adapt redis config as needed
});

module.exports = emailQueue;
