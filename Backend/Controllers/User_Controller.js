const User_Service = require('../Services/User_Service');
const JWT_PROVIDER = require('../Config/JWT');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');
const JobApplication = require('../Models/JobApplication');
const Job = require('../Models/Jobs');


// 📋 Register User
const Register_User = async (req, res) => {
    try {
        const { name, email, password,phone } = req.body;
        if (!name || !email || !password || !phone) {
            return res.status(400).send({ error: 'Name, email,phone and password are required.' });
        }

        const photoFile = req.files?.photo?.[0];
        const resumeFile = req.files?.resume?.[0];

        const user = await User_Service.Create_User({ name, email,phone, password }, photoFile, 
        resumeFile
        );
        const token = JWT_PROVIDER.generateToken(user._id);

        return res.status(201).send({ token, message: 'User registered successfully', user });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

// 🔑 Login User
const Login_User = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_Service.Find_User_By_Email(email);
        if (!user) return res.status(404).send({ message: 'User not found' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).send({ message: 'Invalid password' });

        const token = JWT_PROVIDER.generateToken(user._id);
        return res.status(200).send({ token, message: 'Login successful', user });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

// 🚪 Logout User

const Logout_User = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(400).json({ error: "Token not provided" });

        // ✅ Decode the token without verifying to extract expiration
        const decoded = jwt.decode(token);
        if (!decoded) return res.status(400).json({ error: "Invalid token" });

        // ✅ Check if token is expired (ignore expiration, allow logout)
        const isExpired = decoded.exp * 1000 < Date.now();
        if (isExpired) {
            console.warn("JWT expired, proceeding with logout.");
        }

        // ✅ Always blacklist the token, even if it's expired
        await User_Service.Logout_User(token);

        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


// ✏️ Update User
const Update_User = async (req, res) => {
    try {
        const userId = req.params.id;
        const updatedData = req.body;
        const photoFile = req.files?.photo?.[0];
        const resumeFile = req.files?.resume?.[0];

        const updatedUser = await User_Service.Update_User(userId, updatedData, photoFile, resumeFile);
        return res.status(200).send({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

// 🆔 Get User Profile by Token
const Get_User_Profile = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const user = await User_Service.Get_User_Profile_By_Token(token);
        return res.status(200).send({ user });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

// 📋 Get All Users
const Get_All_Users = async (req, res) => {
    try {
        const users = await User_Service.Get_All_Users();
        return res.status(200).send({ users });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

// Get user data
const getUserData = async(req, res) => {
    const userId = req.auth.userId
    try {
        const user = await User.findById(userId)

        if (!user) {

            return res.json({success:false, message: "user not found"})
        }

        res.json({success:true,user})
    } catch (error) {
        res.json({success:false,message:error.message})
        
    }
}

// Apply for a job
const applyForJob = async(req,res) => {

    const { jobId } = req.body
    const userId = req.user.id;

    try {
        
        const isAlreadyApplied = await JobApplication.find({jobId,userId})

        if (isAlreadyApplied.length > 0) {
            return res.json({success:false, message: "Alredy Applied"})
        }

        const jobData = await Job.findById(jobId)

        if (!jobData) {
            return res.json({success:false, message:"Job not found"})
        }

        await JobApplication.create({
            companyId : jobData.companyId,
            userId,
            jobId,
            date : Date.now()
        })

        res.json({success: true, message: "Applied Successfully"})
    } catch (error) {
        res.json({success:false, message:error.message})
    }
    
}

// Get user applied application
const getUserJobApplication = async(req,res) => {
      
    try {
        const userId = req.user.id
        const applications =await JobApplication.find({userId}).populate('companyId','name email image ')
        .populate('jobId','title description location category level salary')
        .exec()

        if (!applications) {
            return res.json({success:false,message:'No job application found for this user' })

        }
        return res.json({success:true,applications})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
    
}






// // ✅ Get All Applied Jobs
// const Get_All_Applied_Jobs = async (req, res) => {
//     try {
//       const userId = req.user.id;
  
//       const appliedJobs = await User_Service.Get_All_Applied_Jobs(userId);
  
//       // Filter out null jobs
//       const validAppliedJobs = appliedJobs.filter(app => app.job !== null);
  
//       if (!validAppliedJobs.length) {
//         return res.status(404).json({ message: 'No applied jobs found' });
//       }
  
//       res.status(200).json({ appliedJobs: validAppliedJobs });
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   };
  
//   // ✅ Get Related Applied Jobs
//   const Get_Related_Applied_Jobs = async (req, res) => {
//     try {
//       const userId = req.user.id;
//       const { jobId } = req.params;
  
//       const relatedJobs = await User_Service.Get_Related_Applied_Jobs(userId, jobId);
//       res.status(200).json({ relatedJobs });
//     } catch (error) {
//       res.status(400).json({ message: error.message });
//     }
//   };
module.exports = {
    getUserJobApplication,
    applyForJob,
    getUserData,
    Register_User,
    Login_User,
    Logout_User,
    Get_All_Users,
    Get_User_Profile,
    Update_User,
    // Get_All_Applied_Jobs,
    // Get_Related_Applied_Jobs
};
