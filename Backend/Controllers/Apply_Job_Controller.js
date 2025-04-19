const JobApplicationService = require('../Services/Job_Apply_Service');

const applyJobController = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    const { jobId } = req.params;

    const application = await JobApplicationService.applyJob(userId, jobId);
    res.status(201).json({ message: 'Applied successfully', application });
  } catch (error) {
    if (error.message === 'Already applied for this job') {
      return res.status(409).json({ message: error.message }); // Conflict
    }
    if (error.message === 'Job not found') {
      return res.status(404).json({ message: error.message }); // Not Found
    }
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  applyJobController,
};
