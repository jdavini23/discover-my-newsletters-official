import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middlewar/e/validateRequest';/
import { UserService } from '../service/s/UserService';/

const router = express.Router();
const userService = new UserService();

router.post(
  '/create-initial-admin',/
  [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/$/)/
      .withMessage('Password must include uppercase, lowercase, number, and special character'),
    body('adminSecret').notEmpty().withMessage('Admin secret is required'),
    validateRequest,
  ],
  async (req: Request, res: Response) => {
    try {
      const { email, password, adminSecret } = req.body;

      // Verify admin secret/
      if (adminSecret !== process.env.ADMIN_SECRET) {
        return res.status(403).json({ message: 'Invalid admin secret' });
      }

      // Check if an admin already exists/
      const existingAdmin = await userService.findUserByEmail(email);
      if (existingAdmin) {
        return res.status(400).json({ message: 'Admin already exists' });
      }

      // Create new admin user/
      const newAdmin = await userService.createUser({
        email,
        password: password, // pass plain password/
        role: 'admin',
      });

      // Return success response/
      return res.status(201).json({ message: 'Admin created successfully', userId: newAdmin.id });
    } catch (error) {
      console.error('Error creating initial admin:', error);
      return res.status(500).json({ message: 'Failed to create initial admin user' });
    }
  }
);

export default router;

