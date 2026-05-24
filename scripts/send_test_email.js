const nodemailer = require('nodemailer');

async function run() {
  // If SMTP environment variables are present, use them; otherwise fall back to Ethereal test account
  let transporter;
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    console.log('Using SMTP host:', process.env.SMTP_HOST);
  } else {
    const testAccount = await nodemailer.createTestAccount();
    console.log('Ethereal account created:', testAccount.user);
    transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
  }

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || 'SmartFlow AI <no-reply@smartflow.local>',
    to: process.env.CONTACT_RECEIVER || 'brondsisjean180310@gmail.com',
    subject: 'SmartFlow AI — SMTP test',
    text: 'This is a test message sent from SmartFlow AI using configured SMTP.',
    html: '<p>This is a test message sent from <strong>SmartFlow AI</strong> using configured SMTP.</p>',
  });

  console.log('Message sent: %s', info.messageId);
  const preview = nodemailer.getTestMessageUrl(info);
  if (preview) console.log('Preview URL:', preview);
}

run().catch(err => {
  console.error('Test send failed:', err);
  process.exitCode = 1;
});
