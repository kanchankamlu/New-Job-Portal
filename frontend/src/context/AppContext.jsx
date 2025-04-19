import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";


export const AppContext = createContext()

export const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [user, setUser] = useState(() => {
        return JSON.parse(localStorage.getItem("user")) || null; // ✅ Load from localStorage
      });

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const [searchFilter, setSearchFilter] = useState({
        title: '',
        location: ''
    })


    const [isSearched, setIsSearched] = useState(false)

    const [jobs, setJobs] = useState([])

    const [showRecruiterLogin, setShowRecruiterLogin] = useState(false)

    const [showUserLogin, setShowUserLogin] = useState(false)

    const [companyToken, setCompanyToken] = useState(localStorage.getItem("companyToken") || null);
    const [companyData, setCompanyData] = useState({});

    const [userApplications,setUserApplications] = useState([])

    // function to fetech job data
    const fetchJobs = async () => {
        try {
            
            const {data} = await axios.get(backendUrl + '/api/jobs')

            if (data.success) {
                setJobs(data.jobs)
                console.log(data.jobs)
            }  else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
           
    }

     // Function to fetch company data
     const fetchCompanyData = async () => {
         try {
            
            const {data} = await axios.get(backendUrl + '/api/company/company', {headers:{token:companyToken}})

            if (data.success) {
                setCompanyData(data.company)
                console.log(data)
            } else{
                toast.error(data.message)
            }

         } catch (error) {
            toast.error(error.message)
         }
     }

     // Function to fetch user's applied applications data

     const fetchUserApplications = async () => {
        try {
           const token = localStorage.getItem('userToken')
        
           const {data} = await axios.get(backendUrl + '/api/user/applications',
            {headers: {Authorization: `Bearer ${token}`}}
           )

           if (data.success) {
              setUserApplications(data.applications)
           } else {
             toast.error(data.message)
           }

        } catch (error) {
            toast.error(error.message)
        }
     }
    
    useEffect( () => {
        if(companyToken){
            fetchCompanyData()
        }
    },[companyToken])


   useEffect(() => {
       if (user) {
          fetchUserApplications()
       }
   },[user])
     
    useEffect( () => {
        fetchJobs()
    },[])

  

    const value = {
        backendUrl,
        searchFilter, setSearchFilter,
        isSearched, setIsSearched,
        jobs, setJobs,
        showRecruiterLogin, setShowRecruiterLogin,
        showUserLogin, setShowUserLogin,
        user,setUser,
        companyData,setCompanyData,
        companyToken,setCompanyToken,
        userApplications,setUserApplications,
        fetchUserApplications

    }
    return (<AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>
    )
}



