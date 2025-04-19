import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import Loading from '../components/Loading'
import Navbar from '../components/Navbar'
import kconvert from 'k-convert'
import moment from 'moment'
import JobCard from '../components/JobCard'
import Footer from '../components/Footer'
import axios from 'axios'
import { toast } from 'react-toastify'

const ApplyJob = () => {

  const { id } = useParams()
  
  const navigate = useNavigate()

  const { jobs, backendUrl, user , userApplications, fetchUserApplications} = useContext(AppContext)

  const [JobData, setJobData] = useState(null)
  const [isAlreadyApplied, setIsAlreadyApplied] = useState(false)

  const fetchJob = async () => {
    try {
      const { data } = await axios.get(backendUrl + `/api/jobs/${id}`)

      if (data.success) {
        setJobData(data.job)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  const applyHandler = async () => {
    try {
        if (!user) {
            return toast.error("Login to apply for jobs");
        }

        if (!user.resume) {
            navigate("/applications");
            return toast.error("Upload resume to apply");
        }

        if (!JobData || !JobData._id) {
            return toast.error("Job data is not available. Try again later.");
        }

        const userToken = localStorage.getItem("userToken");
        if (!userToken) {
            return toast.error("User token is missing. Please log in again.");
        }

        console.log("jobdata",JobData)
        console.log("Applying for job:", JobData._id);
        console.log("User Token:", userToken);

        const { data } = await axios.post(
            backendUrl +'/api/user/apply',
            { jobId: JobData?._id },
            { headers: { Authorization: `Bearer ${userToken}` } }
        );

        if (data.success) {
            toast.success(data.message);
            fetchUserApplications()
        } else {
            console.error("Application Error:", data);
            toast.error(data.message);
        }

    } catch (error) {
        console.error("API Error:", error.response?.data || error.message);
        toast.error(error.response?.data?.message || "Something went wrong");
    }
};


const checkAlreadyApplied = () => {
    const hasApplied = userApplications.some(item => item.jobId._id === JobData._id)

    setIsAlreadyApplied(hasApplied)
}


  useEffect(() => {
    fetchJob()
  }, [id])

  useEffect(() => {
       if (userApplications.length > 0 && JobData) {
           checkAlreadyApplied()
       }
  },[JobData,userApplications,id])

  
  useEffect(() => {
   console.log(JobData)
  }, [JobData])

 
  return JobData ? (
    <div>
      <>
        <Navbar />

        <div className='min-h-screen flex flex-col py-10 container px-4 2xl:px-20 mx-auto '>
          <div className='bg-white text-black rounded-lg w-ful'>
            <div className='flex justify-center md:justify-between flex-wrap gap-8 px-14 mb-6 bg-purple-50 border border-purple-400 rounded-xl py-24'>
              <div className='flex flex-col md:flex-row items-center'>
                <img className='h-24 bg-white rounded-lg p-4 mr-4 max-md:mb-4 border' src={`http://localhost:7866/${JobData.companyId.image.replace(/^.*[\\/](uploads[\\/].*)$/, '$1')}`}
                  alt="" />
                <div className='text-center md:text-left text-neutral-700 '>
                  <h1 className='text-2xl sm:text-4xl font-medium py-3'>{JobData.title} </h1>
                  <div className='flex flex-row flex-wrap max-md:justify-center gap-y-2 gap-6 items-center text-gray-mt-2'>
                    <span className='flex items-center gap-1'>
                      <img src={assets.suitcase_icon} alt="" />
                      {JobData.companyId.name}
                    </span>
                    <span className='flex items-center gap-1'>
                      <img src={assets.location_icon} alt="" />
                      {JobData.location}
                    </span>
                    <span className='flex items-center gap-1'>
                      <img src={assets.person_icon} alt="" />
                      {JobData.level}
                    </span>
                    <span className='flex items-center gap-1'>
                      <img src={assets.money_icon} alt="" />
                      CTC: {kconvert.convertTo(JobData.salary)}
                    </span>
                  </div>
                </div>
              </div>

              <div className='flex flex-col justify-center text-end text-sm max-md:mx-auto max-md:text-center'>
                <button  onClick={applyHandler}className='bg-purple-600 p-2.5 px-10 text-white rounded '>{isAlreadyApplied ? 'Already Applied' : 'Apply Now'}</button>
                <p className='mt-1 text-gray-600 '>Posted {moment(JobData.date).fromNow()}</p>
              </div>
            </div>

            <div className='flex flex-col lg:flex-row justify-between items-start'>
              <div className='w-full lg:w-2/3'>
                <h2 className='font-bold text-2xl mb-4'>Job description</h2>
                <div className='rich-text' dangerouslySetInnerHTML={{ __html: JobData.description }}></div>
                <button onClick= {applyHandler} className='bg-purple-600 p-2.5 px-10 text-white rounded mt-10'>{isAlreadyApplied ? 'Already Applied' : 'Apply Now'}</button>
              </div>
              {/* Right section More jobs */}
              <div className='w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 space-y-5'>
                <h2> More jobs from {JobData.companyId.name}</h2>
                {jobs.filter(job => job._id !== JobData._id && job.companyId._id === JobData.companyId._id).
                  filter(job => {
                    // set all applied jobIds
                    const appliedJobsIds = new Set(userApplications.map(app => app.jobId && app.jobId._id))

                    // Return true if the user has not already applied for this job
                    return !appliedJobsIds.has(job._id)
                  }).slice(0, 4).map((job, index) => <JobCard key={index} job={job} />)}
              </div>
            </div>

          </div>
        </div>

        <Footer />

      </>
    </div>
  ) : (
    <Loading />
  )
}

export default ApplyJob