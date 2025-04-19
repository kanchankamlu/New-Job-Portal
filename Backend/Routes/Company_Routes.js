const express = require('express')
const multer = require('multer');
const path = require("path");

const {
  ChangeJobApplicationStatus,
  changeVisibility,
  getCompanyData,
  getCompanyJobApplicants,
  getCompanyPostedJobs,
  loginCompany,
  postJob,
  registerCompany
} = require("../Controllers/Company_Controller");
const { protectCompany } = require('../Middlewares/authMiddleware');
const router = express.Router()

// Multer Configuration
const uploadDir = path.join(__dirname, "../uploads/logos");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname.replace(/\s+/g, "-"));
  },
});
const upload = multer({ storage });


// Use `upload.single("image")` in the route
router.post("/register", upload.single("image"), registerCompany);


// company login
router.post('/login', loginCompany)

// get company data
router.get('/company', protectCompany, getCompanyData)

// Post a job
router.post('/post-job',protectCompany, postJob)

// get Applicant data of company
router.get('/applicants', protectCompany, getCompanyJobApplicants)

// Get company job list
router.get('/list-jobs',protectCompany,  getCompanyPostedJobs)

// change Application status
router.post('/change-status', protectCompany,  ChangeJobApplicationStatus)

// change Applications visibility
router.post('/change-visibility', protectCompany, changeVisibility)

module.exports = router;



