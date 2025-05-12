const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied. No token provided." });
  }

  try {
    const secretKey = process.env.JWT_SECRET;
    const verified = jwt.verify(token, secretKey);
    req.user = verified;
    console.log("User verified:", req.user);
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token." });
  }
};
