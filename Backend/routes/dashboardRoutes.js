import express from "express";
import {  requireAdmin, requireAdminTechnician } from "../middlewares/authMiddleware.js";
import { getDashboardData, getTechnicianData, getTechnicianName } from "../controllers/dashboardController.js";

const router = express.Router();

router.get('/stats',  requireAdmin, getDashboardData);
router.get('/technicians',  requireAdmin, getTechnicianData);
router.get('/technicianName/:id',  requireAdminTechnician, getTechnicianName);

export default router;