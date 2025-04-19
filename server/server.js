
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';

import companyRoutes from './routes/companyRoutes.js'

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect to database (async function wrapped inside a handler)
async function initializeDB() {
  try {
    await connectDB();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed', error);
  }
}

initializeDB();

// Routes
app.get('/', (req, res) => res.send('API Working Successfully'));



app.use('/api/company',companyRoutes)


// For local testing only
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
