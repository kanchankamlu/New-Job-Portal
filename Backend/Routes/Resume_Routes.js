const express = require('express');
const  Resume_Controllers = require('../Controllers/Resume_Controller');
const auth = require('../Middlewares/Authenticate'); 

const router = express.Router();

// ✅ Create Resume
router.post('/create', auth, Resume_Controllers.Create_Resume);

// ♻️ Update Resume
router.put('/update/:userId', auth, Resume_Controllers.Update_Resume);

module.exports = router;