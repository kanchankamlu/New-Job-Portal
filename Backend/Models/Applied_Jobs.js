// const mongoose = require('mongoose');

// const JobApplicationSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   job: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Job',
//     required: true,
//   },
//   appliedDate: {
//     type: Date,
//     default: Date.now,
//   },
//   status: {
//     type: String,
//     enum: ['APPLIED', 'REVIEWED', 'INTERVIEW_SCHEDULED', 'OFFERED', 'REJECTED', 'CANCELLED'],
//     default: 'APPLIED',
//   },
// }, { timestamps: true });

// module.exports = mongoose.model('JobApplication', JobApplicationSchema);
