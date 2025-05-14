const cron = require("node-cron");
const Invoice = require("../models/invoice");
const { getDayRange, formatDate } = require("../utils/helpers");
const { DAILY_SALES_REPORT_QUEUE, sendToQueue } = require("../config/rabitmq");

/**
 * Generate daily sales report
 * Fetches all invoices for the current day, calculates total sales and items sold
 */
let isJobRunning = false;

const generateDailySalesReport = async () => {
  if (isJobRunning) {
    console.log(
      "Daily sales report job is already running. Skipping new execution."
    );
    return;
  }

  isJobRunning = true;

  try {
    console.log(`Generating sales report for all invoices`);

    const invoices = await Invoice.find({})
      .populate("user", "name email")
      .populate("product", "name price");

    const totalSales = invoices.reduce(
      (total, invoice) => total + invoice.total,
      0
    );

    const itemsSoldMap = new Map();

    invoices.forEach((invoice) => {
      invoice.product.forEach((product) => {
        const productId = product._id.toString();
        const price = product.price;
        const qty = invoice.quantity || 1;

        if (itemsSoldMap.has(productId)) {
          const existing = itemsSoldMap.get(productId);
          itemsSoldMap.set(productId, {
            product: product.name,
            qty: existing.qty + qty,
            amount: existing.amount + qty * price,
          });
        } else {
          itemsSoldMap.set(productId, {
            product: product.name,
            qty,
            amount: qty * price,
          });
        }
      });
    });

    const itemsSold = Array.from(itemsSoldMap.values());

    const report = {
      generatedOn: new Date().toDateString(),
      amount: totalSales,
      totalInvoices: invoices.length,
      itemsSold,
    };

    console.log("Daily sales report generated");

    await sendToQueue(DAILY_SALES_REPORT_QUEUE, report);

    return report;
  } catch (error) {
    console.error("Error generating sales report:", error);
    throw error;
  } finally {
    isJobRunning = false;
  }
};

const scheduleJobs = () => {
  // Schedule daily sales report job
  // Runs every day at 12:00 PM
  cron.schedule("0 12 * * *", async () => {
    console.log("Running daily sales report job");
    try {
      await generateDailySalesReport();
    } catch (error) {
      console.error("Daily sales report job failed:", error);
    }
  });

  console.log("Cron jobs scheduled");
};

module.exports = {
  scheduleJobs,
  generateDailySalesReport,
};
