import { registerUser, loginUser } from "../controllers/authController.js";
import { body } from "express-validator";
import express from "express";

const router = express.Router();

router.post('/register',[
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role').optional()
], registerUser);

router.post('/login',[
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
], loginUser);

export default router;