// services/cronJobs.js
const cron = require("node-cron");
const Invoice = require("../models/invoice");
const { getDayRange, formatDate } = require("../utils/helpers");
const { DAILY_SALES_REPORT_QUEUE, sendToQueue } = require("../config/rabitmq");

/**
 * Generate daily sales report
 * Fetches all invoices for the current day, calculates total sales and items sold
 */
const generateDailySalesReport = async () => {
  try {
    const { start, end } = getDayRange();

    console.log(`Generating sales report for ${formatDate(start)}`);

    // Get all invoices for the current day
    const invoices = await Invoice.find({
      date: { $gte: start, $lte: end },
    });

    // Calculate total sales
    const totalSales = invoices.reduce(
      (total, invoice) => total + invoice.amount,
      0
    );

    // Calculate items sold by SKU
    const itemsSoldMap = new Map();

    invoices.forEach((invoice) => {
      invoice.items.forEach((item) => {
        const { sku, qty, price } = item;

        if (itemsSoldMap.has(sku)) {
          const existing = itemsSoldMap.get(sku);
          itemsSoldMap.set(sku, {
            sku,
            qty: existing.qty + qty,
            amount: existing.amount + qty * price,
          });
        } else {
          itemsSoldMap.set(sku, {
            sku,
            qty,
            amount: qty * price,
          });
        }
      });
    });

    // Convert map to array
    const itemsSold = Array.from(itemsSoldMap.values());

    // Create report
    const report = {
      date: formatDate(start),
      totalSales,
      totalInvoices: invoices.length,
      itemsSold,
    };

    console.log("Daily sales report generated");

    // Send report to RabbitMQ queue
    await sendToQueue(DAILY_SALES_REPORT_QUEUE, report);

    return report;
  } catch (error) {
    console.error("Error generating daily sales report:", error);
    throw error;
  }
};

/**
 * Schedule daily sales report job
 * Runs every day at 12:00 PM
 */
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

// Export for manual testing
module.exports = {
  scheduleJobs,
  generateDailySalesReport,
};
