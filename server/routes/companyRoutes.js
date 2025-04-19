import express from 'express'
import { ChangeJobApplicationStatus, changeVisibility, getCompanyData, getCompanyJobApplicants, getCompanyPostedJobs, loginCompany, postJob, registerCompany } from '../controllers/companyController.js'

const router = express.Router()

// Register a company
router.post('/register', upload.single('image'), registerCompany)

// company login
router.post('/login',loginCompany)

// get company data
router.get('/company',getCompanyData)

// Post a job
router.post('/post-job',postJob)

// get Applicant data of company
router.get('/applicants',getCompanyJobApplicants)

// Get company job list
router.get('/list-jobs',getCompanyPostedJobs)

// change Application status
router.post('/change-status',ChangeJobApplicationStatus)

// change Applications visibility
router.post('/change-visibility',changeVisibility)


export default router



