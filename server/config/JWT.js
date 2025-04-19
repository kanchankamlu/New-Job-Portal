import jwtDecode from "jwt-decode";

export const generateToken = (userId) => {
  const payload = { userId };
  const secret = import.meta.env.VITE_JWT_PROVIDER; // Ensure this is set in your .env file
  const expiresIn = "48h";

  // Client-side apps usually don't generate JWTs; this is for demonstration only.
  return btoa(JSON.stringify({ payload, secret, expiresIn })); // Mock token
};

export const getUserIdFromToken = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.userId;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};
