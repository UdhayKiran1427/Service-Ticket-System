import { getProfile, updateProfile } from "../controllers/profileController.js";
import { body } from "express-validator";
import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get('/me', authMiddleware, getProfile);

router.put('/update', authMiddleware, [
    body('username').optional().notEmpty().withMessage('Username cannot be empty'),
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], updateProfile);

export default router;
