const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());


const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:5173',  // Allow frontend
    credentials: true,  // Allow cookies/tokens
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization','token'],  // Allowed headers
}));



// Serve uploaded files (photos & resumes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

console.log("Serving static files from:", path.join(__dirname, 'uploads'));


// Company Routes
const Company_Routes = require('./Routes/Company_Routes')
app.use('/api/company',Company_Routes)

//  User Routes
const User_Route = require('./Routes/User_Routes');
app.use('/api/user', User_Route);

// Jobs Routes
const Jobs_Route = require('./Routes/Jobs_Routes');
app.use('/api/jobs', Jobs_Route);

// // Import Apply Routes
// const Apply_Route = require('./Routes/Apply_Job_Routes');
// app.use('/api/apply', Apply_Route);

// // Import Apply Routes
// const Resume_Route = require('./Routes/Resume_Routes');
// app.use('/api', Resume_Route);


// Global Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Something went wrong!' });
});

module.exports = app;
