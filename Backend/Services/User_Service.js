const User = require('../Models/User');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');
const JWT_PROVIDER = require('../Config/JWT');
const TokenBlacklist = require('../Models/Token_Blacklist');
const Job = require('../Models/Jobs');
const JobApplication = require('../Models/Applied_Jobs'); // Import JobApplication model

// 📤 Upload Helper
const uploadFile = (file, folder) => {
    if (!file || !file.buffer) {
        throw new Error(`No file buffer found for ${file?.originalname || 'unknown file'}`);
    }
    const filePath = path.join(__dirname, `../uploads/${folder}/${file.originalname}`);
    fs.writeFileSync(filePath, file.buffer);
    return `/uploads/${folder}/${file.originalname}`;
};

// ✅ Create User
const Create_User = async (userData, photoFile, resumeFile) => {
    try {
        const { name, email, password ,phone} = userData;
        const existingUser = await User.findOne({ email });
        if (existingUser) throw new Error('User already exists with this email');

        const hashedPassword = await bcrypt.hash(password, 10);
        const photoPath = photoFile ? uploadFile(photoFile, 'photos') : '';
        const resumePath = resumeFile ? uploadFile(resumeFile, 'resume') : '';

        const newUser = new User({
            name,
            email,
            phone,
            password: hashedPassword,
            photo: photoPath,
            resume: resumePath
        });

        await newUser.save();
        return newUser;
    } catch (error) {
        throw new Error(error.message);
    }
};

// ✏️ Update User
const Update_User = async (userId, updatedData, photoFile, resumeFile) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');

        Object.assign(user, updatedData);

        if (updatedData.password) {
            user.password = await bcrypt.hash(updatedData.password, 10);
        }

        if (photoFile) user.photo = uploadFile(photoFile, 'photos');
        if (resumeFile) user.resume = uploadFile(resumeFile, 'resume');

        user.updatedAt = Date.now();
        await user.save();
        return user;
    } catch (error) {
        throw new Error(error.message);
    }
};

// 🆔 Find User By ID (Populating Jobs)
const Find_User_By_Id = async (userId) => {
    try {
        const user = await User.findById(userId)
            .populate('appliedJobs')
            .populate('history.viewedJobs')
            .populate('history.applications');
        if (!user) throw new Error('User not found');
        return user;
    } catch (error) {
        throw new Error(error.message);
    }
};

// 🔍 Find User By Email
const Find_User_By_Email = async (email) => {
    try {
        const user = await User.findOne({ email });
        if (!user) throw new Error('User not found');
        return user;
    } catch (error) {
        throw new Error(error.message);
    }
};

// 📋 Get All Users
const Get_All_Users = async () => {
    try {
        return await User.find();
    } catch (error) {
        throw new Error(error.message);
    }
};

// 🆔 Get User Profile By Token
const Get_User_Profile_By_Token = async (token) => {
    try {
        const userId = JWT_PROVIDER.getUserIdFromToken(token);
        return await Find_User_By_Id(userId);
    } catch (error) {
        throw new Error('Invalid token');
    }
};

// 🚪 Logout User
const Logout_User = async (token) => {
    try {
        if (!token) throw new Error("No token provided");

        // ✅ Blacklist the token no matter its expiration status
        await TokenBlacklist.create({ token });

        return { message: "Logout successful" };
    } catch (error) {
        throw new Error(error.message);
    }
};


/////////////////////// 🟢 FIXED FUNCTIONS ///////////////////////

// 📂 Get All Applied Jobs for a User
const Get_All_Applied_Jobs = async (userId) => {
    try {
        const appliedJobs = await JobApplication.find({ user: userId })
            .populate({
                path: 'job',
                select: 'title company category location description', // Job details
            })
            .populate('user', 'name email'); // User details if needed

        return appliedJobs;
    } catch (error) {
        throw new Error(error.message);
    }
};

// 📂 Get Related Applied Jobs by Category (Excluding Current Job)
const Get_Related_Applied_Jobs = async (userId, jobId) => {
    try {
        // Get the current job to fetch its category
        const job = await Job.findById(jobId);
        if (!job) throw new Error('Job not found');

        // Find related jobs in the same category but exclude the current job
        const relatedApplications = await JobApplication.find({
            user: userId,
            job: { $ne: jobId } // Exclude the current job
        })
            .populate({
                path: 'job',
                match: { category: job.category }, // Same category
                select: 'title company category location',
            })
            .populate('user', 'name email');

        // Filter out null jobs (in case no matching jobs found)
        return relatedApplications.filter(app => app.job !== null);
    } catch (error) {
        throw new Error(error.message);
    }
};

//////////////////////////////////////////////////////////////

module.exports = {
    Get_All_Applied_Jobs,
    Create_User,
    Update_User,
    Find_User_By_Id,
    Find_User_By_Email,
    Get_All_Users,
    Get_User_Profile_By_Token,
    Logout_User,
    Get_Related_Applied_Jobs
};
