const jwt = require('jsonwebtoken');

const generateToken = (userId) => { // ✅ Pass userId as a parameter
    return jwt.sign({ userId }, process.env.JWT_PROVIDER, { expiresIn: "51h" });
};

const getUserIdFromToken = (token) => {
    const decodedToken = jwt.verify(token, process.env.JWT_PROVIDER);
    return decodedToken.userId;  
};

module.exports = { generateToken, getUserIdFromToken };
