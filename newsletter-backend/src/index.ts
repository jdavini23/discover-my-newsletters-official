import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import { initializeDatabase } from './config/database';
import dotenv from 'dotenv';
import adminRoutes from './routes/admin.routes';
import './config/firebase'; // Import Firebase configuration

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(hpp());
app.use(express.json());

// Routes
app.use('/api/admin', adminRoutes);

// Initialize database
initializeDatabase()
  .then(() => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(error => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });
