const ResumeService = require('../Services/Resume_Service');

// 🟢 Create Resume
const Create_Resume = async (req, res) => {

  const { userId } = req.params;
  const resumeData = req.body;

  try {
    const newResume = await ResumeService.Create_Resume(userId, resumeData);
    
    res.status(201).json({ message: 'Resume created successfully', data: newResume });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 🟡 Update Resume
const Update_Resume = async (req, res) => {
  const { userId } = req.params;
  const resumeData = req.body;

  try {
    const updatedResume = await ResumeService.Update_Resume(userId, resumeData);
    res.status(200).json({ message: 'Resume updated successfully', data: updatedResume });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};




module.exports = {Create_Resume,Update_Resume}