// src/utils/emailSender.js

const nodemailer = require('nodemailer');

// Mailtrap Configuration
const transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 587,
    auth: {
        user: '487fcc123301ad',
        pass: '97300d91ec0832' // Replace with your actual password from Mailtrap dashboard
    }
});

exports.sendWelcomeEmail = async (to, name) => {
    const mailOptions = {
        from: '"TalentHub" <noreply@talenthub.com>',
        to,
        subject: 'Welcome to TalentHub!',
        html: `<h1>Hello ${name},</h1><p>Welcome to TalentHub! We're thrilled to have you on board.</p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('✅ Welcome email sent successfully');
    } catch (error) {
        console.error('❌ Failed to send welcome email:', error);
    }
};
