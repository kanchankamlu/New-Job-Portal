import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const RecruiterLogin = () => {

  const navigate = useNavigate()

  const [state, setState] = useState('Login')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')

  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null);

  const [isTextDataSubmited, setIsDataSubmited] = useState(false)

  const { setShowRecruiterLogin, backendUrl, setCompanyToken, setCompanyData } = useContext(AppContext)

  useEffect(() => {
    if (!image) return; 
    if (image && image instanceof File && image.type.startsWith("image/")) {
      try {
        const objectURL = URL.createObjectURL(image);
        setPreview(objectURL);

        console.log("Generated preview URL:", objectURL); // Debugging log

        return () => {
          console.log("Revoking preview URL:", objectURL);
          URL.revokeObjectURL(objectURL);
        };
      } catch (error) {
        console.error("Error creating object URL:", error);
      }
    } else {
      console.warn("Invalid file selected, cannot generate preview.");
    }
  }, [image]);

  useEffect(() => {
    if (image) {
      console.log("Updated image state:", image);
    }
  }, [image]); // Runs whenever image changes
  


  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (state == "Sign Up" && !isTextDataSubmited) {
      return setIsDataSubmited(true)
    }

    try {

      if (state === "Login") {

        const { data } = await axios.post(backendUrl + '/api/company/login', { email, password })

        if (data.success) {
          setCompanyData(data.company)
          setCompanyToken(data.token)
          localStorage.setItem('companyToken', data.token)
          setShowRecruiterLogin(false)
          navigate('/dashboard')
        } else {
          toast.error(data.message)
        }
      }
      else {
        const formData = new FormData()
        formData.append('name', name)
        formData.append('password', password)
        formData.append('email', email)
        if (image) {
          formData.append('image', image)
        }
        // const headers = { "Content-Type": "multipart/form-data" };
        // headers["Content-Type"] = "multipart/form-data";
        const { data } = await axios.post(backendUrl + '/api/company/register', formData)

        if (data.success) {
          setCompanyData(data.company)
          setCompanyToken(data.token)
          localStorage.setItem("companyToken", response.data.token); 
          setShowRecruiterLogin(false)
          navigate('/dashboard')
        } else {
          toast.error(data.message)
        }

      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'

    }
  }, [])

  return (
    <div className='absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
      <form onSubmit={onSubmitHandler} className='relative bg-white p-10 rounded-xl text-slate-500 '>
        <h1 className='text-center text-2xl text-neutral-700 font-medium'>Recruiter {state}</h1>
        <p className='text-sm'>Welcome back! Please sign in to continue</p>
        {state === "Sign Up" && isTextDataSubmited
          ? <>

            <div className='flex items-center gap-4 my-10'>
              <label htmlFor="image">
                <img
                  className="w-16 rounded-full"
                  src={preview || assets.upload_area}
                  alt="Upload Preview"
                  onError={(e) => console.error("Image failed to load:", e)}
                />
                
                <input
                  onChange={(e) => {
                    const file = e.target.files[0];

                    if (file && file.type.startsWith("image/")) {
                      console.log("File selected:", file);
                      setImage(file);
                    } else {
                      console.error("Invalid file selected:", file);
                      setImage(null); // Ensure state is reset if the file is invalid
                    }
                  }}
                  type="file"
                  id="image"
                  hidden
                />

              </label>
              <p>Upload Company <br /> logo </p>
            </div>

          </>
          : <>

            {state !== 'Login' && (
              <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
                <img src={assets.person_icon} alt="" />
                <input className='outline-none text-sm' onChange={e => setName(e.target.value)} value={name} type="text" placeholder='Company Name' required />

              </div>)}

            <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
              <img src={assets.email_icon} alt="" />
              <input className='outline-none text-sm' onChange={e => setEmail(e.target.value)} value={email} type="email" placeholder='Email Id' required />

            </div>
            <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
              <img src={assets.lock_icon} alt="" />
              <input className='outline-none text-sm' onChange={e => setPassword(e.target.value)} value={password} type="password" placeholder='Password ' required />

            </div>
          </>}
        {state === "Login" && <p className='text-sm text-blue-600 mt-4 cursor-pointer'>Forgot password</p>}



        <button type='submit' className='bg-blue-600 w-full text-white py-2 rounded-full  mt-4'>
          {state === 'Login' ? 'login' : isTextDataSubmited ? 'create account' : 'Next'}
        </button>

        {
          state === 'Login'
            ? <p className='mt-5 text-center'>Don't have an account? <span className='text-blue-600 cursor-pointer' onClick={() => setState("Sign Up")}>Sign Up</span></p>
            : <p className='mt-5 text
            text-center'>Already have an account? <span className='text-blue-600 cursor-pointer' onClick={() => setState("Login")}>Login</span></p>
        }

        <img onClick={e => setShowRecruiterLogin(false)} className='absolute top-5 right-5 cursor-pointer' src={assets.cross_icon} alt="" />

      </form>
    </div>
  )
}

export default RecruiterLogin