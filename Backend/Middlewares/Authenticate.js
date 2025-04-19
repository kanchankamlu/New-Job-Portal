const JWT_PROVIDER = require('../Config/JWT');
const User_Service = require('../Services/User_Service');

const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).send({ message: 'Token Not Found' });
    }

    // Extract user ID from token
    const userId = JWT_PROVIDER.getUserIdFromToken(token);

    if (!userId) {
      return res.status(401).send({ message: 'Invalid Token' });
    }

    // Find user by ID
    const user = await User_Service.Find_User_By_Id(userId);

    if (!user) {
      return res.status(404).send({ message: 'User Not Found' });
    }

    // Attach user to request object
    req.user = user;

    // ✅ Proceed to next middleware or controller
    next();
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

module.exports = authenticate;
