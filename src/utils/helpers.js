// utils/helpers.js
const crypto = require("crypto");

/**
 * Generate a unique reference for invoices
 * Format: INV-YYYY-MM-DD-RANDOM
 */
exports.generateReference = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = crypto.randomBytes(4).toString("hex");

  return `INV-${year}-${month}-${day}-${random}`;
};

/**
 * Format date to YYYY-MM-DD
 */
exports.formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

/**
 * Get start and end of day for a given date
 */
exports.getDayRange = (date = new Date()) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

// utils/emailTemplates.js
/**
 * Generate daily sales report email template
 */
exports.generateDailySalesReportTemplate = (salesData) => {
  const { totalSales, date, itemsSold } = salesData;

  let itemsHtml = "";
  itemsSold.forEach((item) => {
    itemsHtml += `
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd;">${item.sku}</td>
        <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${
          item.qty
        }</td>
        <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">$${item.amount.toFixed(
          2
        )}</td>
      </tr>
    `;
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th { background-color: #f8f9fa; padding: 10px; border: 1px solid #ddd; text-align: left; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Daily Sales Report</h2>
          <p>Date: ${date}</p>
        </div>
        <div class="content">
          <p>Here is a summary of sales for ${date}:</p>
          <h3>Total Sales: $${totalSales.toFixed(2)}</h3>
          
          <h3>Items Sold:</h3>
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Quantity</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
        </div>
        <div class="footer">
          <p>This is an automated email. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
