// src/utils/emailService.js

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 587,
    auth: {
        user: process.env.EMAIL_USER, // e.g., '487fcc123301ad'
        pass: process.env.EMAIL_PASS  // e.g., '****0832'
    }
});

exports.sendResetPasswordEmail = async (to, resetUrl) => {
    const mailOptions = {
        from: '"TalentHub" <noreply@talenthub.com>',
        to,
        subject: 'Reset Your Password',
        text: `Hello,\n\nYou requested a password reset. Click the link below:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.`
    };

    await transporter.sendMail(mailOptions);
};

exports.sendMatchNotification = async (to, name, status, opportunityTitle) => {
  const subject = status === 'approved'
    ? '🎉 Your Opportunity Request Was Approved!'
    : 'Opportunity Request Update';

  const html = status === 'approved'
    ? `<h2>Hello ${name},</h2><p>Congratulations! Your request for <strong>${opportunityTitle}</strong> has been approved.</p><p>Please log in to your TalentHub dashboard for next steps.</p>`
    : `<h2>Hello ${name},</h2><p>Your request for <strong>${opportunityTitle}</strong> was not approved this time.</p><p>Keep exploring other opportunities on TalentHub!</p>`;

  const mailOptions = {
    from: '"TalentHub" <noreply@talenthub.com>',
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Match notification sent to ${to}`);
  } catch (error) {
    console.error('❌ Failed to send match notification:', error);
  }
};