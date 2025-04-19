import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext"; // ✅ Import AppContext

const Profile = () => {
  const { user, setUser } = useContext(AppContext); // ✅ Get user from context
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const BASE_URL = "http://localhost:7866";

  // ✅ Ensure user is available by fetching from localStorage if necessary
  useEffect(() => {
    if (!user) {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        setUser(storedUser);
      }
    }
  }, [user, setUser]);

  // ✅ Initialize form data correctly
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    photo: null, // Default to null
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        photo: null,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    if (e.target.name === "photo") {
      setFormData({ ...formData, photo: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleUpdate = async () => {
    try {
      if (!user || !user._id) {
        alert("User not found! Please log in again.");
        return;
      }

      const token = localStorage.getItem("userToken");
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      if (formData.photo instanceof File) {
        formDataToSend.append("photo", formData.photo);
      }

      const response = await axios.put(
        `${BASE_URL}/api/user/update/${user._id}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser(response.data.user); // ✅ Ensure only user object is updated
      localStorage.setItem("user", JSON.stringify(response.data.user)); // ✅ Store updated user
      setIsEditing(false);
      alert("Profile updated successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.response?.data?.message || "Failed to update profile.");
    }
  };

  return (
    <div className="container mx-auto max-w-lg p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold text-center mb-4">User Profile</h2>

      {user && (
        <div className="text-center">
          <img
            src={
              user.photo
                ? user.photo.startsWith("http")
                  ? user.photo
                  : `${BASE_URL}${user.photo}`
                : assets.default_avatar
            }
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-gray-300 shadow-md"
          />
          <h3 className="text-lg font-semibold mt-3">{user.name}</h3>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-gray-600">{user.phone}</p>

          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Edit Profile
          </button>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            <div className="mb-2">
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700">Profile Picture</label>
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => {
                  setIsEditing(false);
                  navigate("/");
                }}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
