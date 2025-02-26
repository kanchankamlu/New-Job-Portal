import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import './Style.css'
import {Link, useNavigate} from 'react-router-dom'
import { AppContext } from '../context/AppContext'


const Navbar = () => {

  
  const [isUser,setUser] = useState(false)

  const navigate = useNavigate()

  
  const {setShowRecruiterLogin,setShowUserLogin} = useContext(AppContext)

  return (
    <div>
      <div className='container px-4 2xl:px-2 mx-auto h-[70px] shadow-xl flex justify-between items-center'>
        <img onClick={() => navigate('/')}  src={assets.logo01} alt="" className='logo cursor-pointer'/>
        {
          isUser
          ? <div className='flex items-center gap-3'>
           <Link to = {'./applications'} >Applied Jobs</Link>
            <p>|</p>
            <p className='max-sm:hidden'>Hi, { isUser.firstName+" "+isUser.lastName}</p>
           
          </div>
          : <div className='button flex gap-4 max-sm:text-xs'>
          <button onClick={e=> setShowRecruiterLogin(true)} className= 'login text-gray-600'>Recruiter Login</button>
          <button onClick={e => setShowUserLogin(true) } className='bg-blue-600 text-white px-6 sm:px9 py-2 rounded-full'>Login</button>
        </div>
        }
       
      </div>
    </div>
  )
}

export default Navbar