import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";


const UserLogin = () => {

  const { setUser, setShowUserLogin } = useContext(AppContext); // Get setUser from context
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    photo: null, 
    
  });

  const [errors, setErrors] = useState({});
  const [state, setState] = useState("Login");


  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "photo") {
      setFormData({ ...formData, photo: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (state !== "Login") {
      if (!formData.name) newErrors.name = "Name is required";
      if (!formData.phone) newErrors.phone = "Phone number is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    try {
      let url =
        state === "Login"
          ? "http://localhost:7866/api/user/login"
          : "http://localhost:7866/api/user/register";
  
      let data;
      let headers = {};
  
      if (state === "Login") {
        data = { email: formData.email, password: formData.password };
        headers["Content-Type"] = "application/json";
      } else {
        data = new FormData();
        data.append("name", formData.name);
        data.append("email", formData.email);
        data.append("password", formData.password);
        data.append("phone", formData.phone);
        if (formData.photo) {
          data.append("photo", formData.photo);
          data.append("resume", formData.resume);
        }
        headers["Content-Type"] = "multipart/form-data";
      }
  
      const response = await axios.post(url, data, { headers });
  
      alert(`Success: ${response.data.message}`);
  
      if (state === "Login") {
        localStorage.setItem("user", JSON.stringify(response.data.user)); // Store user
        localStorage.setItem("userToken", response.data.token);
  
        setUser(response.data.user); // 🔥 Update global state
        setShowUserLogin(false);
      } else {
        setState("Login");
      }
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || "Something went wrong"}`);
    }
  };
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
      <form onSubmit={handleSubmit} className="bg-white p-7 rounded-lg shadow-lg w-96 space-y-4 text-slate-500">
        <img
          onClick={() => setShowUserLogin(false)}
          className="absolute right-[37%] cursor-pointer"
          src={assets.cross_icon}
          alt="Close"
        />
        <h2 className="text-center text-2xl text-neutral-700 font-medium">
          {state === "Login" ? "User Login" : "Create your profile"}
        </h2>
        <p className="text-sm text-gray-600 text-center pb-2">
          {state === "Login" ? "Welcome back! Please sign in to continue" : "Connecting dreams with destination!"}
        </p>

        {state !== "Login" && (
          <div>
            <div className="border px-4 py-2 flex items-center gap-2 rounded-full">
            <img src={assets.person_icon} alt="Person Icon" />
            <input
              placeholder="Full Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="outline-none text-sm"
              required
            />
          </div>
          <div className="border px-4 py-2 flex items-center mt-3 gap-2 rounded-full">
            <img src="https://img.icons8.com/?size=100&id=9659&format=png&color=737373" className="h-[20px]" alt="Phone Icon" />
            <input
              placeholder="Phone Number"
              type="tel"
              inputMode="numeric"
              name="phone"
              pattern="[0-9]{10,15}"
              value={formData.phone}
              onChange={handleChange}
              className="outline-none text-sm"
              required
            />
          </div>
          </div>
        )}

        <div className="border px-4 py-2 flex items-center gap-2 rounded-full">
          <img src={assets.email_icon} alt="Email Icon" />
          <input
            placeholder="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="outline-none text-sm"
            required
          />
        </div>

        <div className="border px-4 py-2 flex items-center gap-2 rounded-full">
          <img src={assets.lock_icon} alt="Lock Icon" />
          <input
            placeholder="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="outline-none text-sm"
            required
          />
        </div>

              {/* Photo Upload (Only for Sign Up) */}
              {state !== "Login" && (
          <div className="border px-4 py-2 flex items-center gap-2 rounded-full">
            <label htmlFor="photo">
              <img
                className="w-16 rounded-full"
                src={formData.photo ? URL.createObjectURL(formData.photo) : assets.upload_area}
                alt="Profile Preview"
              />
              <input onChange={handleChange} type="file" id="photo" name="photo" required hidden />
            </label>
            <p>Upload profile <br /> picture</p>
          </div>
        )}
        {state === "Login" && <p className="text-sm text-blue-600 mt-4 cursor-pointer">Forgot password?</p>}

       

        <button type="submit" className="w-full bg-blue-500 text-white py-2 hover:bg-blue-600 transition rounded-full">
          {state === "Login" ? "Login" : "Register now"}
        </button>

        {
            state === 'Login'
            ? <p className='mt-5 text-center'>Don't have an account? <span className='text-blue-600 cursor-pointer' onClick={()=> setState("Sign Up")}>Sign Up</span></p>
            :<p className='mt-5 text
            text-center'>Already have an account? <span className='text-blue-600 cursor-pointer' onClick={()=> setState("Login")}>Login</span></p>
        } 
      </form>
    </div>
  );
};

export default UserLogin;
