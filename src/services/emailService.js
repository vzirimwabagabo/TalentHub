const emailQueue = require('../queues/emailQueue');

async function enqueueWelcomeEmail(to, name) {
  await emailQueue.add({ type: 'welcome', payload: { to, name } });
}

async function enqueueResetPasswordEmail(to, resetUrl) {
  await emailQueue.add({ type: 'reset_password', payload: { to, resetUrl } });
}

async function enqueueMatchNotification(to, name, status, opportunityTitle) {
  await emailQueue.add({ type: 'match_notification', payload: { to, name, status, opportunityTitle } });
}

module.exports = {
  enqueueWelcomeEmail,
  enqueueResetPasswordEmail,
  enqueueMatchNotification,
};
