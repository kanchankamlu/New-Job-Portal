import React, { useState } from 'react'
import axios from 'axios'
const a = () => {
const [user,setuser] = useState()

    const fetchUserProfile = async () =>{
        try {
            const res = await axios.get("api");
            setuser(res.data)
            
        } catch (error) {
              console.log('first')
        }
    }
  return (
    <div>
        {
            false ? (
                 <div className="profile_bxo">{user.name}</div>
            ):(
              <button>Login</button>
            )
        }
    </div>
  )
}

export default a