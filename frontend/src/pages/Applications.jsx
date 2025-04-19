import React, { useContext, useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { assets, jobsApplied } from '../assets/assets';
import moment from 'moment';
import Footer from '../components/Footer';
import { AppContext } from "../context/AppContext";
import axios from 'axios';
import { toast } from 'react-toastify';

const Applications = () => {
  const { user, setUser, userApplications, fetchUserApplications,backendUrl } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const BASE_URL = "http://localhost:7866";

  const [resume,setResume] = useState(null)

  const [formData, setFormData] = useState({
    resume: null,
  });

  useEffect(() => {
    if (user) {
      setFormData({ resume: null });
    }
  }, [user]);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResume(file); // Update the state with the selected file
    }
    if (e.target.name === "resume" && e.target.files.length > 0) {
      setFormData({ ...formData, resume: e.target.files[0] });
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

      if (formData.resume instanceof File) {
        formDataToSend.append("resume", formData.resume);
      } else {
        alert("Please select a resume file before updating.");
        return;
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

      setUser(response.data.user);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      toast.success("Resume uploaded successfully")
      setIsEdit(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.response?.data?.message || "Failed to update profile.");
    }
  };

  useEffect(() => {
     if (user) {
         fetchUserApplications()
     }
  },[user])

  useEffect(() => {
    if (user) {
      console.log("user data",user)
    }
   
  },[user])

  return (
    <>
      <Navbar />
      <div className='container px-4 min-h-[65vh] 2xl:px-20 mr-5 mt-8 min-w-full'>
        <div className='ml-20'>
          <h2 className='text-xl font-semibold'>Your Resume</h2>
          <div className='flex gap-2 mb-6 mt-3'>
            {isEdit || user && user.resume === ""
             ? (
              <>
                <label className='flex items-center' htmlFor="resumeUpload">
                  <p className='bg-blue-100 text-blue-600 px-4 py-2 rounded-lg mr-2 cursor-pointer'>
                    {resume ? resume.name : "Select Resume"}
                  </p>
                  <input
                    id='resumeUpload'
                    onChange={handleChange}
                    name='resume'
                    accept='application/pdf'
                    type="file"
                    hidden
                  />
                  <img src={assets.profile_upload_icon} alt="" />
                  {formData.resume && (
                    <img
                      src={URL.createObjectURL(formData.resume)}
                      className='cursor-pointer'
                      //alt="Selected Resume"
                    />
                  )}
                </label>
                <button
                  onClick={handleUpdate}
                  className='bg-green-100 border-green-400 rounded-lg px-4 py-2'>
                  Save
                </button>
              </>
            ) : (
              <div className='flex gap-2'>
                <a target='_blank' href={`${backendUrl}${user?.resume}`} className='cursor-pointer bg-blue-100 text-blue-600 px-4 py-2 rounded-lg'>
                  Resume
                </a>
                <button
                  onClick={() => setIsEdit(true)}
                  className='text-gray-500 border border-gray-300 rounded-lg px-4 py-2'>
                  Edit
                </button>
              </div>
            )}
          </div>

          <h2 className='text-xl font-semibold mb-4'>Job Applied</h2>
          <table className='min-w-[90%] bg-white border rounded-lg '>
            <thead>
              <tr>
                <th className='py-3 px-4 border-b text-left'>Company</th>
                <th className='py-3 px-4 border-b text-left'>Job Title</th>
                <th className='py-3 px-4 border-b text-left max-sm:hidden'>Location</th>
                <th className='py-3 px-4 border-b text-left max-sm:hidden'>Date</th>
                <th className='py-3 px-4 border-b text-left'>Status</th>
              </tr>
            </thead>
            <tbody>
              {userApplications.map((job, index) => (
                <tr key={index}>
                  <td className='py-3 px-4 flex items-center gap-2 border-b'>
                    <img className='w-8 h-8' src={`http://localhost:7866/${job.companyId.image.replace(/^.*[\\/](uploads[\\/].*)$/, '$1')}`} alt="" /> 
                    {job.companyId.name}
                  </td>
                  <td className='py-2 px-4 border-b'>{job.jobId.title}</td>
                  <td className='py-2 px-4 border-b max-sm:hidden'>{job.jobId.location}</td>
                  <td className='py-2 px-4 border-b max-sm:hidden'>
                    {moment(new Date(job.date)).format('ll')}
                  </td>

                  <td className='py-2 px-4 border-b'>
                    <span
                      className={`${job.status === 'Accepted' ? 'bg-green-100'
                        : job.status === 'Rejected' ? 'bg-red-100'
                          : 'bg-blue-100'} px-4 py-1.5 rounded`}>
                      {job.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Applications;
