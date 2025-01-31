import './config/instrument.js';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import * as Sentry from '@sentry/node';
import { clerkWebhooks } from './controllers/webhooks.js';

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
// Set CSP Header Middleware
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' https://clerk.accounts.dev https://js.sentry-cdn.com; connect-src 'self' https://clerk-telemetry.com https://*.sentry.io;"
  );
  next();
});


// Example route for testing
// app.get('/', (req, res) => {
//   res.send('CSP Header Set!');
// });


// Routes
app.get('/', (req, res) => res.send('API Working Successfully'));

 app.get('/debug-sentry', (req, res) => {
   throw new Error('My first Sentry error!');
 });

app.post('/webhooks', clerkWebhooks);

Sentry.setupExpressErrorHandler(app);

// For local testing only
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
