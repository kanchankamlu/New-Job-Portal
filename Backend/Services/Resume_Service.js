const Resume = require('../Models/Resume');
const User = require('../Models/User');

// ✅ Create Resume
const Create_Resume = async (userId, resumeData) => {
  try {
    const newResume = new Resume({ ...resumeData, user: userId });
    const savedResume = await newResume.save();

    // Link resume to user
    await User.findByIdAndUpdate(userId, { resume: savedResume._id }, { new: true });

    return savedResume;
  } catch (error) {
    throw new Error(error.message);
  }
};

// ♻️ Update Resume
const Update_Resume = async (userId, resumeData) => {
  try {
    const user = await User.findById(userId).populate('resume');
    if (!user.resume) throw new Error('Resume not found');

    const updatedResume = await Resume.findByIdAndUpdate(
      user.resume._id,
      { ...resumeData, updatedAt: Date.now() },
      { new: true }
    );

    return updatedResume;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  Create_Resume,
  Update_Resume,
};
