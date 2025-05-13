const { generateDailySalesReport } = require("../services/cronJobs");

exports.getDailySalesReport = async (req, res, next) => {
  try {
    // You might allow an optional `date` query param for historical reports
    const date = req.query.date;
    const report = await generateDailySalesReport(date);
    res.json(report);
  } catch (err) {
    next(err);
  }
};

exports.downloadDailySalesReportPdf = async (req, res, next) => {
  try {
    const pdfBuffer = await generateDailySalesReportPdf();
    res
      .status(200)
      .header("Content-Type", "application/pdf")
      .header("Content-Disposition", `attachment; filename="daily-report.pdf"`)
      .send(pdfBuffer);
  } catch (err) {
    next(err);
  }
};
