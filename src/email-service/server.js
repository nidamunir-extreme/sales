require("dotenv").config();
const { consumeQueue, DAILY_SALES_REPORT_QUEUE } = require("../config/rabitmq");
const nodemailer = require("nodemailer");
const { generateDailySalesReportTemplate } = require("../utils/helpers");

// Create a test (ethereal) or real nodemailer transporter
const createTransporter = async () => {
  if (process.env.NODE_ENV === "development") {
    const testAccount = await nodemailer.createTestAccount();

    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  // For production, use real SMTP
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Send email
const sendEmail = async (options) => {
  const transporter = await createTransporter();

  const { to, subject, html } = options;

  const mailOptions = {
    from: process.env.EMAIL_FROM || "noreply@example.com",
    to,
    subject,
    html,
  };

  const info = await transporter.sendMail(mailOptions);

  console.log("Email sent:", info.messageId);

  if (process.env.NODE_ENV === "development") {
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
  }

  return info;
};

// Process daily sales report
const processDailySalesReport = async (report) => {
  try {
    console.log("Processing daily sales report:", report.date);
    const html = generateDailySalesReportTemplate(report);

    const emailOptions = {
      to: report.recipientEmail,
      subject: `Daily Sales Report - ${report.date}`,
      html,
    };

    await sendEmail(emailOptions);
    console.log("Report email sent successfully.");
  } catch (error) {
    console.error("Error sending daily sales report email:", error);
  }
};

// Start consuming messages from the queue
const start = async () => {
  try {
    await consumeQueue(DAILY_SALES_REPORT_QUEUE, async (msg) => {
      const report = JSON.parse(msg.content.toString());
      await processDailySalesReport(report);
    });

    console.log(`Listening for messages on queue: ${DAILY_SALES_REPORT_QUEUE}`);
  } catch (err) {
    console.error("Failed to start email service:", err);
    process.exit(1);
  }
};

start();
