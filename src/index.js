require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { start } = require("./services/email.service");
const { scheduleJobs } = require("./services/cronJobs.service");

const app = express();
app.use(express.json());

// Connect Mongo
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/users", require("./routes/users"));
app.use("/products", require("./routes/products"));
app.use("/roles", require("./routes/roles"));
app.use("/invoices", require("./routes/invoices"));
app.use("/reports", require("./routes/report"));
app.use("/login", require("./routes/authRoute"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Call the start method to begin listening to the RabbitMQ queue after the server starts
  start().catch((err) => {
    console.error("Error starting the email service:", err);
    process.exit(1);
  });
  scheduleJobs();
});
