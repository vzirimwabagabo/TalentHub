const emailQueue = require('../queues/emailQueue');
const { sendWelcomeEmail, sendResetPasswordEmail, sendMatchNotification } = require('../utils/emailSender');

emailQueue.process(async (job) => {
  const { type, payload } = job.data;

  switch (type) {
    case 'welcome':
      await sendWelcomeEmail(payload.to, payload.name);
      break;
    case 'reset_password':
      await sendResetPasswordEmail(payload.to, payload.resetUrl);
      break;
    case 'match_notification':
      await sendMatchNotification(payload.to, payload.name, payload.status, payload.opportunityTitle);
      break;
    default:
      throw new Error(`Unknown email job type: ${type}`);
  }
});
