const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    fullName: {
        type: String,
        required: true,
    },
    dob: {
        type: Date,
    },
    profileSummary: {
        type: String,
    },
    contact: {
        phoneNumber: {
            type: String,
        },
        email: {
            type: String,
        },
        website: {
            type: String,
        },
        address: {
            city: String,
            state: String,
            district: String,
        },
    },
    socialProfiles: [
        {
            platform: String, 
            url: String,
        },
    ],
    education: [
        {
            institution: String,
            degree: String,
            fieldOfStudy: String,
            startDate: Date,
            endDate: Date,
            grade: String,
        },
    ],
    certifications: [
        {
            title: String,
            issuingOrganization: String,
            issueDate: Date,
            expirationDate: Date,
            credentialID: String,
            credentialURL: String,
        },
    ],
    projects: [
        {
            title: String,
            description: String,
            technologiesUsed: [String],
            projectLink: String,
        },
    ],
    skills: [String],
    technologies: [String],
    hobbies: [String],
    languages: [String],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Resume = mongoose.model('Resume', ResumeSchema);
module.exports = Resume;
