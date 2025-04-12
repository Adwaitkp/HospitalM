const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(400).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1]; // Extract token after "Bearer"
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
        req.user = decoded; // ✅ Attach user info
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid Token" });
    }
};

module.exports = authMiddleware;
