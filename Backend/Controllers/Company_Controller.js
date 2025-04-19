const Company = require('../Models/Company');
const bcrypt = require('bcrypt');
const JWT_PROVIDER = require('../Config/JWT');
const Job = require('../Models/Jobs');
const JobApplication = require('../Models/JobApplication');



// Register a company
const registerCompany = async (req, res) => {
  console.log("Uploaded File:", req.file); // Debugging

  const { name, email, password } = req.body;
  const imageFile = req.file; // Get uploaded file

  if (!name || !email || !password || !imageFile) {
    return res.json({ success: false, message: "Missing details" });
  }

  try {
    const companyExist = await Company.findOne({ email });
    if (companyExist) {
      return res.json({ success: false, message: "Company already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password.toString(), salt); // Ensure password is a string

    const imagePath = imageFile.path; // Store the image path

    const company = await Company.create({
      name,
      email,
      password: hashPassword,
      image: imagePath,
    });

    res.json({
      success: true,
      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image,
      },
      token: JWT_PROVIDER.generateToken(company._id),
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Company login
const loginCompany = async (req, res) => {
  const { email, password } = req.body;

  try {
    const company = await Company.findOne({ email });

    if (!company) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password.toString(), company.password); // Fix bcrypt.compare
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    res.json({
      success: true,
      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image,
      },
      token: JWT_PROVIDER.generateToken(company._id),
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get company data (Fixed req & res order)
const getCompanyData = async (req, res) => {

  try {
    const company = req.Company
    
    res.json({success:true, company})
  } catch (error) {
    res.json({
      success:false, meassage:error.message
    })
  }

};

// Post a new job
const postJob = async (req, res) => {
  const { title, description, location, salary, level, category } = req.body;

  if (!req.Company) {
    return res.json({ success: false, message: "Unauthorized: No company found" });
  }

  const companyId = req.Company._id;
  console.log(companyId, { title, description, location, salary });

  try {

    const newJob = new Job({
      title,
      description,
      location,
      salary,
      companyId,
      date: Date.now(),
      level,
      category
    })

    await newJob.save()

    res.json({ success: true, newJob })

  } catch (error) {

    res.json({ success: false, message: error.message })
  }


};

// Get company job applicants
const getCompanyJobApplicants = async (req, res) => {
    try {
      
      const companyId = req.Company._id

      //find job applications for the user and populate related jobs
      const applications = await JobApplication.find({companyId})
      .populate('userId', 'name photo resume')
      .populate('jobId','title location category level salary')
      .exec()

      return res.json({success:true, applications})

    } catch (error) {
        res.json({success:false, message:error.message})
    }
};

// Get Company posted jobs
const getCompanyPostedJobs = async (req, res) => {
  try {
    
     const companyId = req.Company._id

     const jobs = await Job.find({companyId})

     //  Adding No. of applicants info in data  
     const jobsData = await Promise.all(jobs.map(async (job) => {
         const applicants = await JobApplication.find({jobId: job._id});
         return {...job.toObject(), applicants: applicants.length}
     }))


     res.json({success:true, jobsData})

  } catch (error) {
    res.json({success:false, message:error.message})
  }
};

// Change job application status
const ChangeJobApplicationStatus = async (req, res) => {
    
   try {
    const {id , status} = req.body

    // find Job Application and update status
    await JobApplication.findOneAndUpdate({_id: id}, {status})

    res.json({success:true, message:'Status Changed'})

   } catch (error) {
       
    res.json({success:false, message: error.message})
   }
};

// Change job visibility
const changeVisibility = async (req, res) => {
     try {

      const {id} = req.body

      const companyId = req.Company._id

      const job = await Job.findById(id)

      if (companyId.toString() === job.companyId.toString()) {

        job.visible = !job.visible
        
      }
      await job.save()

      res.json({success:true,job})
      
     } catch (error) {
         res.json({success:false, message:error.message})
     }
};

module.exports = {
  registerCompany,
  loginCompany,
  getCompanyData,
  changeVisibility,
  ChangeJobApplicationStatus,
  getCompanyPostedJobs,
  getCompanyJobApplicants,
  postJob,
};
