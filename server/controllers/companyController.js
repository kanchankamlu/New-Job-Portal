import Company from "../models/Company.js";
import bcrypt from 'bcrypt'

// Register a new company
export const registerCompany = async (req, res) => {

    const { name, email, password } = req.body

    const imageFile = req.file;

    if (!name || !email || !password || !imageFile) {
        return res.json({success:false, message: "Missing Details"})
    }

    try {
        const companyExits = await Company.findOne({email})

        if (companyExits) {
            return res.json({success:false, message: 'Company already registered'})
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        

    } catch (error) {
        
    }


}

//company login
export const loginCompany = async (req, res) => {

}

// get company data
export const getCompanyData = async (res, req) => {


}

//Post a new job
export const postJob = async (req, res) => {

}

//get Company job applicants
export const getCompanyJobApplicants = async (req, res) => {

}

//get company posted jobs
export const getCompanyPostedJobs = async (req, res) => {

}

// Change job Application status
export const ChangeJobApplicationStatus = async (req, res) => {

}

// change job visibility
export const changeVisibility = async (req, res) => {

}