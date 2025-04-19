const express = require('express');
const router = express.Router();
const JobApplicationController = require('../Controllers/Apply_Job_Controller');
const authMiddleware = require('../Middlewares/Authenticate');

// Apply for a job
router.post('/:jobId', authMiddleware, JobApplicationController.applyJobController);


module.exports = router;
