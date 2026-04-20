const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    return res.status(500).json({ err: "Server JWT configuration is missing" });
  }

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ err: "no token was given" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.UserId = decoded.UserId;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
}
module.exports = authMiddleware;
