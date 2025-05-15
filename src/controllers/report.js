const { generateDailySalesReport } = require("../services/cronJobs.service");

exports.getDailySalesReport = async (req, res, next) => {
  try {
    const date = req.query.date;
    const report = await generateDailySalesReport(date);
    res.json(report);
  } catch (err) {
    next(err);
  }
};
