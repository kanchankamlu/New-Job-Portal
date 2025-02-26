import React, { useState, useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets';


const userLogin = () => {

  const [formData, setFormData] = useState({ email: "", password: "", name: "", phone: "" });
  const [errors, setErrors] = useState({});

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate form
  const validateForm = () => {
    let newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("User Login Data:", formData);
      alert(`Welcome, ${formData.email}!`);
      // Send data to an API for authentication if needed
    }
  };

  const [state, setState] = useState('Login')

  const { setShowUserLogin } = useContext(AppContext)

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">

      <form onSubmit={handleSubmit} className=" bg-white p-7 rounded-lg shadow-lg w-96 space-y-4  text-slate-500">

        <img onClick={e => setShowUserLogin(false)} className='absolute right-[37%] cursor-pointer' src={assets.cross_icon} alt="" />
        {
          state !== "Login"
            ?
            <div>
              <h2 className="text-center text-2xl text-neutral-700 font-medium">Create your profile</h2>
              <p className='text-sm text-gray-600
         text-center pb-2'>Connecting dreams with destination !</p>
            </div>
            : <div><h2 className="text-center text-2xl text-neutral-700 font-medium">User Login</h2>
              <p className='text-sm text-gray-600
         text-center pb-2'>Welcome back! Please sign in to continue</p></div>

        }

        {state !== 'Login' && (
          <div>
            <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
              <img src={assets.person_icon} alt="" />
              <input
                placeholder='Full Name'
                required
                type="text"
                name='name'
                value={formData.name}
                onChange={handleChange}
                className="outline-none text-sm "
              />
            </div>
            <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
              <img src="https://img.icons8.com/?size=100&id=9659&format=png&color=737373" className='h-[20px]' alt="" />
              <input
                placeholder='Phone Number'
                type="tel"
                inputMode="numeric"
                name="phone"
                pattern="[0-9]{10,15}"
                value={formData.phone}
                onChange={handleChange}
                className="outline-none text-sm "
              />
            </div>
          </div>

        )}

        {/* Email Input */}

        <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
          {/* <label className="block font-medium">Email</label> */}
          <img src={assets.email_icon} alt="" />
          <input
            placeholder='Email'
            required
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="outline-none text-sm "
          />

        </div>

        {/* Password Input */}
        <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
          {/* <label className="block font-medium">Password</label> */}
          <img src={assets.lock_icon} alt="" />
          <input
            required
            placeholder='Password'
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="outline-none text-sm"
          />

        </div>
        {state === "Login" && <p className='text-sm text-blue-600 mt-4 cursor-pointer'>Forgot password</p>}


        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 hover:bg-blue-600 transition rounded-full  "
        >  {state === 'Login' ? 'Login' : "Register now"}

        </button>

        {
          state === 'Login'
            ? <p className='mt-5 text-center text-gray-600'>Don't have an account? <span className='text-blue-600 cursor-pointer' onClick={() => setState("Sign Up")}>Sign Up</span></p>
            : <p className='mt-5 text
            text-center text-gray-600'>Already have an account? <span className='text-blue-600 cursor-pointer ' onClick={() => setState("Login")}>Login</span></p>
        }
      </form>

    </div>

  )
}

export default userLogin