const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

async function sendEmail({ to, subject, text, html }) {
    await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject,
        text,
        html
    });
}

module.exports = {
    sendEmail
};