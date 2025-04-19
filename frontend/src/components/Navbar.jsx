import React, { useContext, useEffect, useRef, useState } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";

const Navbar = () => {
  const dropdownRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ Get user and setters from context
  const { user, setUser, setShowRecruiterLogin, setShowUserLogin } = useContext(AppContext);


  const BASE_URL = "http://localhost:7866";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const userToken = localStorage.getItem("userToken");
    console.log("user Token", userToken)
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // ✅ Restore user from localStorage
    }
  }, [setUser]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("userToken");

      if (!token) {
        console.error("No token found. Redirecting to login.");
        setUser(null);
        navigate("/");
        return;
      }

      const response = await axios.post(
        "http://localhost:7866/api/user/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      console.log("Logout response:", response.data);

      // ✅ Clear user session
      localStorage.removeItem("userToken");
      localStorage.removeItem("user");
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error.response?.data || error.message);

      // ✅ Handle expired JWT in frontend
      if (error.response?.data?.error === "jwt expired") {
        console.warn("Token expired. Logging out...");
        localStorage.removeItem("userToken");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/");
      }
    }
  };



  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  let firstAndLast = "User"; // Default value

  if (user && typeof user.name === "string") {
    const nameParts = user.name.trim().split(" ");
    firstAndLast = nameParts.length > 1
      ? `${nameParts[0]} ${nameParts[nameParts.length - 1]}`
      : user.name;
  }


  return (
    <div className="container px-4 2xl:px-2 mx-auto h-[70px] shadow-xl flex justify-between items-center">
      {/* Logo */}
      <img
        onClick={() => navigate("/")}
        src={assets.logo01}
        alt="logo"
        className="logo cursor-pointer"
      />

      {/* If user is logged in */}
      {user ? (
        <div className="relative">
          <div className="flex items-center gap-3">
            <Link to={"/applications"}>Applied Jobs</Link>
            <p>|</p>
            <div className="flex items-center gap-2">
              {/* Display user name safely */}
              <span>
                Hi, {firstAndLast}
              </span>
              {/* User profile picture */}
              <p
                className="cursor-pointer flex items-center gap-2"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <img
                  src={
                    user.photo
                      ? user.photo.startsWith("http") // ✅ Check if it's a full URL
                        ? user.photo
                        : `${BASE_URL}${user.photo}`
                      : assets.default_avatar
                  }
                  alt="User Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-300 shadow-md transition-transform duration-300 hover:scale-110"
                />
              </p>
            </div>
          </div>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border border-gray-200 z-50"
            >
              <Link
                to="/profile"
                className="block px-4 py-2 text-gray-700 hover:bg-blue-500 hover:text-white transition rounded-t-lg"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-red-500 hover:text-white transition rounded-b-lg"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        // If user is NOT logged in
        <div className="button flex gap-4 max-sm:text-xs">
          <button
            onClick={() => setShowRecruiterLogin(true)}
            className="login text-gray-600"
          >
            Recruiter Login
          </button>
          <button
            onClick={() => setShowUserLogin(true)}
            className="bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full"
          >
            Login
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
