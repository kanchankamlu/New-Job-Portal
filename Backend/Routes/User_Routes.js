const express = require('express');
const router = express.Router();
const User_Controller = require('../Controllers/User_Controller');
const multer = require('multer');
const authMiddleware = require('../Middlewares/Authenticate'); 
const User = require('../Models/User');

// Multer setup for file uploads (photo & resume)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 📋 Register User (with optional photo & resume)
router.post('/register', upload.fields([{ name: 'photo' }],[{name: 'resume'}]), User_Controller.Register_User);

// 🔑 Login User
router.post('/login', User_Controller.Login_User);

// 🚪 Logout User (Protected)
router.post('/logout', authMiddleware, User_Controller.Logout_User);

// ✏️ Update User Profile (Protected, with file upload)
router.put('/update/:id', authMiddleware, upload.fields([
    { name: 'photo', maxCount: 1 }, 
    { name: 'resume', maxCount: 1 }
]), User_Controller.Update_User);


// 🆔 Get User Profile by Token (Protected)
router.get('/profile', authMiddleware, User_Controller.Get_User_Profile);

// Log Out

router.post('/logout', authMiddleware, User_Controller.Logout_User);

// 📋 Get All Users (Protected - Admin Only)
router.get('/all', authMiddleware, User_Controller.Get_All_Users);

// Get user data
router.get('/user',User_Controller.Get_User_Profile)

// Apply for a job
router.post('/apply',authMiddleware, User_Controller.applyForJob)

//Get applied job data
router.get('/applications',authMiddleware, User_Controller.getUserJobApplication)



// // Get related applied jobs
// router.get('/applied/related/:jobId', authMiddleware, User_Controller.Get_Related_Applied_Jobs);

// // Get related applied jobs
// router.get('/applied-jobs', authMiddleware, User_Controller.Get_All_Applied_Jobs);


module.exports = router;
