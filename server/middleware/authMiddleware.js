const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Authentication Middleware
// Verify JWT and identify the logged-in user
const protect = async (req, res, next) => {
  try {
    // Get Authorization header
    const authHeader = req.headers.authorization;

    // Check whether Bearer token exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Not authorized. Token is missing",
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Find user in database
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    // Attach user details to request
    req.user = {
      id: user._id.toString(),
      role: user.role,
    };

    // Continue to next middleware
    next();

  } catch (error) {
    return res.status(401).json({
      message: "Not authorized. Invalid or expired token",
    });
  }
};


// Authorization Middleware
// Allow only admin users
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }

  return res.status(403).json({
    message: "Access denied. Admin permission required",
  });
};


module.exports = {
  protect,
  adminOnly,
};