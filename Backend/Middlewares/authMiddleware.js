const jwt = require('jsonwebtoken');
const Company = require('../Models/Company');

const protectCompany = async (req, res, next) => {
    const token = req.headers.token; // Ensure correct token header key

    if (!token) {
        return res.status(401).json({ success: false, message: "Not authorized, Login Again" });
    }

    try {
        if (!process.env.JWT_PROVIDER) {
            throw new Error("JWT_SECRET is missing from environment variables.");
        }

        const decoded = jwt.verify(token, process.env.JWT_PROVIDER); // ✅ Correct environment variable

        console.log("Decoded Token Data:", decoded); // ✅ Debugging step

        const company = await Company.findById(decoded.id || decoded.userId).select('-password');

        if (!company) {
            console.log("Company not found for ID:", decoded.id || decoded.userId);
            return res.status(401).json({ success: false, message: "Unauthorized: No company found" });
        }

        req.Company = company; // ✅ Attach found company to request

        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message); // ✅ Log error for debugging
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};

module.exports = { protectCompany };
