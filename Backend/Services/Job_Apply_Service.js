const User = require('../Models/User'); // Assuming you have a User model
const JobApplication = require('../Models/Applied_Jobs');
const Job = require('../Models/Jobs');

const applyJob = async (userId, jobId) => {
  try {
    // ✅ Check if the job exists
    const jobExists = await Job.findById(jobId);
    if (!jobExists) throw new Error('Job not found');

    // ✅ Check for duplicate application
    const existingApplication = await JobApplication.findOne({ user: userId, job: jobId });
    if (existingApplication) throw new Error('Already applied for this job');

    // ✅ Create a new application
    const application = new JobApplication({ user: userId, job: jobId });
    await application.save();

    // ✅ Update User's appliedJobs and history
    await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          appliedJobs: jobId,
          'history.applications': {
            job: jobId,
            appliedDate: new Date(),
            status: 'APPLIED',
          },
        },
      },
      { new: true }
    );

    return application;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  applyJob,
};
