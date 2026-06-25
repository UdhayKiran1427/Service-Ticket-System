import express from "express";
import { authMiddleware, requireAdmin, requireAdminTechnician } from "../middlewares/authMiddleware.js";
import {deleteTechnician, getDashboardData, getTechnicianData, getTechnicianName, createReport, getReports, createTechnician, getTechniciansData } from "../controllers/dashboardController.js";

const router = express.Router();

router.get('/stats',  requireAdmin, getDashboardData);
router.get('/technicians',  requireAdmin, getTechnicianData);
router.get('/techniciansData',  requireAdmin, getTechniciansData);
router.post('/technicians', requireAdmin, createTechnician);
router.get('/technicianName/:id',  requireAdminTechnician, getTechnicianName);
router.post('/reports', authMiddleware, createReport);
router.get('/reports', requireAdmin, getReports);
router.delete('/technicians/:id', requireAdmin, deleteTechnician);
export default router;