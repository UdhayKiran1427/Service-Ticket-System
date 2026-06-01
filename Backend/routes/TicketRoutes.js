import { createTicket, getTickets, 
        getTicketsByCreator,
         updateTicket, assignTicket,
         updateStatus,deleteTicket } from "../controllers/ticketController.js";
import { body } from "express-validator";
import express from "express";
import { authMiddleware, requireAdmin,requireTechnician  } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/create',authMiddleware, [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('priority').isIn(['Low', 'Medium', 'High']).withMessage('Invalid priority'),
    body('lab').notEmpty().withMessage('Lab is required')
], createTicket);

router.put('/update/:id',authMiddleware, [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('priority').isIn(['Low', 'Medium', 'High']).withMessage('Invalid priority'),
    body('lab').notEmpty().withMessage('Lab is required'),
    body('status').isIn(['Open', 'In Progress', 'Closed']).withMessage('Invalid status')
], updateTicket);

router.put('/assign/:id', requireAdmin, [
    body('assignedTo').notEmpty().withMessage('Assigned To is required')
], assignTicket);

router.put('/status/:id', requireTechnician, [
    body('status').isIn(['Resolved', 'In Progress', 'Closed']).withMessage('Invalid status')
], updateStatus);

router.get('/my-tickets', authMiddleware, getTicketsByCreator);

router.get('/all-tickets', requireAdmin, getTickets);

router.delete('/delete/:id', requireAdmin, deleteTicket);
export default router;