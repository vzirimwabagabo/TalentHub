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
