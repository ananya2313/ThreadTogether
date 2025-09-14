

const User = require("../models/user-model");
const jwt = require("jsonwebtoken");

// requires cookie-parser: app.use(require("cookie-parser")())
const auth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ msg: "No token provided." });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return res.status(401).json({ msg: "Invalid or expired token." });
    }

    // Align with your controllers: { userId: ... }
    // Keep backward-compat for older tokens: { id: ... } or { token: ... }
    const userId = decoded.userId || decoded.id || decoded.token;
    if (!userId) {
      return res.status(401).json({ msg: "Malformed token payload." });
    }

    const user = await User.findById(userId)
      .populate("followers")
      .populate("threads")
      .populate("replies")
      .populate("reposts");

    if (!user) {
      return res.status(401).json({ msg: "User not found." });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json({ msg: "Error in auth.", err: err.message });
  }
};

module.exports = auth;
