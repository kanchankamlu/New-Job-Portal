import React, { useContext } from 'react'
import { Route,Routes } from 'react-router-dom'
import Home from './pages/Home'
import ApplyJob from './pages/ApplyJob'
import Applications from './pages/Applications'
import RecruiterLogin from './components/RecruiterLogin'
import UserLogin from './components/userLogin'
import { AppContext } from './context/AppContext'
import Dashboard from './pages/Dashboard'
import ViewApplications from './pages/viewApplications'
import ManageJobs from './pages/ManageJobs'
import AddJob from './pages/AddJob'
import 'quill/dist/quill.snow.css'
import Profile from './components/Profile'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

const App = () => {

  const {showUserLogin} = useContext(AppContext)
  const {showRecruiterLogin, companyToken} = useContext(AppContext)
  return (
    <div>
      {showRecruiterLogin && <RecruiterLogin/>}
      {showUserLogin && <UserLogin/>}
      <ToastContainer/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path='/apply-job/:id' element={<ApplyJob/>} />
        <Route path='/applications' element={<Applications/>} />
        <Route path= '/dashboard' element={<Dashboard/>}>
        {companyToken  ? <>
          <Route path = 'add-job' element= {<AddJob/>}/>
            <Route path = 'manage-jobs' element= {<ManageJobs/>}/>
            <Route path = 'view-applications' element= {<ViewApplications/>}/>
        </>  : null
        }
            
        </Route>
      </Routes>

    </div>
  )
}

export default App