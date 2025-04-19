import axios from "axios";

const API = axios.create({
  baseURL: "https://your-api.com/api", // Replace with your actual backend API URL
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically add token to requests if available
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * User Login API
 * @param {Object} credentials - { email, password }
 */
export const loginUser = async (credentials) => {
  try {
    const response = await API.post("/auth/login", credentials);
    localStorage.setItem("token", response.data.token); // Save token for future requests
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Login failed";
  }
};

/**
 * User Registration API
 * @param {Object} userData - { name, email, password, phone, profileImage }
 */
export const registerUser = async (userData) => {
  try {
    const formData = new FormData();
    Object.keys(userData).forEach((key) => {
      formData.append(key, userData[key]);
    });

    const response = await API.post("/auth/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Registration failed";
  }
};

/**
 * Get User Profile API (for authenticated users)
 */
export const getUserProfile = async () => {
  try {
    const response = await API.get("/auth/profile");
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch user profile";
  }
};

/**
 * Logout User
 */
export const logoutUser = () => {
  localStorage.removeItem("token"); // Remove token on logout
};

export default API;
