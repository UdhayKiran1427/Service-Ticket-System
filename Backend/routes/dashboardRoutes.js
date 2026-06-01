import express from "express";
import {  requireAdmin } from "../middlewares/authMiddleware.js";
import { getDashboardData } from "../controllers/dashboardController.js";

const router = express.Router();

router.get('/stats',  requireAdmin, getDashboardData);

export default router;