require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

console.log("Connecting to MongoDB at:", process.env.MONGO_URI);

// Connect Mongo
mongoose
  .connect(
    process.env.MONGO_URI
    //   , {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    // }
  )
  .then(() => console.log("MongoDB Connected"));

app.use("/users", require("./routes/users"));
app.use("/products", require("./routes/products"));
app.use("/roles", require("./routes/roles"));
app.use("/invoices", require("./routes/invoices"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
