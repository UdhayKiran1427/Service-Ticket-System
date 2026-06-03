import express from "express";
import {  requireAdmin } from "../middlewares/authMiddleware.js";
import { getDashboardData, getTechnicianData, getTechnicianName } from "../controllers/dashboardController.js";

const router = express.Router();

router.get('/stats',  requireAdmin, getDashboardData);
router.get('/technicians',  requireAdmin, getTechnicianData);
router.get('/technicianName/:id',  requireAdmin, getTechnicianName);

export default router;