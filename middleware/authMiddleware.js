// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        // Authorization header se token lo
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: "Authorization header missing" });
        }

        // Format: "Bearer TOKEN"
        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Token missing" });
        }

        // JWT verify
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");

        // req.user me attach
        req.user = decoded; // decoded me usually { id, email, name } hoga

        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};