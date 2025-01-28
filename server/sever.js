import './config/instrument.js'
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js'
import * as Sentry from "@sentry/node";
import { clerkWebhooks } from './controllers/webhooks.js'

const app = express();

Sentry.setupExpressErrorHandler(app); // Ensure Sentry setup early

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => res.send("API Working Successfully"));
app.get('/debug-sentry', (req, res) => {
  throw new Error("My first Sentry error!");
});
app.post('/webhooks', clerkWebhooks);

const PORT = process.env.PORT || 5000;

// Start server after DB connection
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to the database', error);
  }
};

startServer();
