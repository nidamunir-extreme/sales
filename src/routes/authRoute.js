const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const router = express.Router();

// Mock user data (replace with database logic)

// Login route
router.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User found:", user);

    // Decrypt user password using bcrypt
    // const saltRounds = 8;
    // const decryptedPassword = await bcrypt.hash(user.password, saltRounds);
    // console.log("Decrypted password:", decryptedPassword);

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log();

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
