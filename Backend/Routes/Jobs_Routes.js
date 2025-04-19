const express = require('express');
const { getJobs, getJobById } = require('../Controllers/Jobs_Controllers');

const router = express.Router()

//Route to get all jobs data
router.get('/',getJobs)


// Route to get a single job by id
router.get('/:id',getJobById)

module.exports = router;