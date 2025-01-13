import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import { initializeDatabase } from './confi/g/database';/
import dotenv from 'dotenv';
import adminRoutes from './route/s/admin.routes';/
import './confi/g/firebase';/ // Import Firebase configuration/

// Load environment variables/
dotenv.config();

const app = express();

// Middleware/
app.use(cors());
app.use(helmet());
app.use(hpp());
app.use(express.json());

// Routes/
app.use('/ap/i/admin', adminRoutes);/

// Initialize database/
initializeDatabase()
  .then(() => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });

