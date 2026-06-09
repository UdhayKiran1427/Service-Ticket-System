import Ticket from "../models/Tickets.js";
import { validationResult } from "express-validator";

export const createTicket = async (req, res) => {
    const errors = validationResult(req.body);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    try {
        const { title, description,priority,lab } = req.body;
        const newTicket = await Ticket.create({
            title,
            description,
            priority,
            Lab: lab,
            createdBy: req.user._id
        });
        res.status(201).json({
            sucess: true,
            message: 'Ticket created successfully',
            ticket: newTicket
        });
        
    } catch (error) {
        res.status(500).json({
            sucess: false,
            message: 'Error creating ticket',
            error: error.message
        });
    }
};

export const getTicketsByCreator = async (req, res) => {
    try {
        const tickets = await Ticket.find({
            createdBy: req.user._id
        });
        res.status(200).json({
            success: true,
            tickets
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching tickets',
            error: error.message
        });
    }
};
export const getTicketsByAssignedTo = async (req, res) => {
    try {
        const tickets = await Ticket.find({
            assignedTo: req.user._id
        });
        res.status(200).json({
            success: true,
            tickets
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching tickets',
            error: error.message
        });
    }
};

export const getTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find();
        res.status(200).json({
            success: true,
            message: 'Tickets fetched successfully',
            tickets
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching tickets',
            error: error.message
        });
    }
};

export const getOpenUnassignedTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({
            status: 'Open',
            $or: [{ assignedTo: null }, { assignedTo: { $exists: false } }]
        });
        res.status(200).json({
            success: true,
            message: 'Open unassigned tickets fetched successfully',
            tickets
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching tickets',
            error: error.message
        });
    }
};

export const updateTicket = async (req, res) => {
    const errors = validationResult(req.body);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    try {
        const { id } = req.params;
        const { title, description,priority,lab,status } = req.body;
        const existTicket = await Ticket.findById(id);
        if(!existTicket){
            return res.status(404).json({
                sucess: false,
                message: 'Ticket not found'
            });
        }
        const newTicket = await Ticket.findByIdAndUpdate(id, {
            title,
            description,
            priority,
            Lab: lab,
            status,
            createdBy: req.user._id
        });
        res.status(201).json({
            sucess: true,
            message: 'Ticket updated successfully',
            ticket: newTicket
        });
        
    } catch (error) {
        res.status(500).json({
            sucess: false,
            message: 'Error updating ticket',
            error: error.message
        });
    }
};

export const assignTicket = async (req, res) => {
    const errors = validationResult(req.body);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    try {
        const { id } = req.params;
        const { assignedTo } = req.body;
        const existTicket = await Ticket.findById(id);
        if(!existTicket){
            return res.status(404).json({
                sucess: false,
                message: 'Ticket not found'
            });
        }
        const assignedTicket = await Ticket.findByIdAndUpdate(id, {
            assignedTo: assignedTo
        });
        res.status(201).json({
            sucess: true,
            message: 'Ticket assigned successfully',
            ticket: assignedTicket
        });
        
    } catch (error) {
        res.status(500).json({
            sucess: false,
            message: 'Error updating ticket',
            error: error.message
        });
    }
};
export const updateStatus = async (req, res) => {
    const errors = validationResult(req.body);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    try {
        const { id } = req.params;
        const { status } = req.body;
        const existTicket = await Ticket.findById(id);
        if(!existTicket){
            return res.status(404).json({
                sucess: false,
                message: 'Ticket not found'
            });
        }
        const updatedTicket = await Ticket.findByIdAndUpdate(id, {
            status: status,
            assignedTo: req.user._id
        });
        res.status(201).json({
            sucess: true,
            message: 'Ticket status updated successfully',
            ticket: updatedTicket
        });
        
    } catch (error) {
        res.status(500).json({
            sucess: false,
            message: 'Error updating ticket',
            error: error.message
        });
    }
};

export const deleteTicket = async (req,res) => {
    try {
        const { id } = req.params;
        const existTicket = await Ticket.findById(id);
        if(!existTicket){
            return res.status(404).json({ sucess: false, message: 'Ticket not found' });
        }
        await Ticket.findByIdAndDelete(id);
        res.status(200).json({ sucess: true, message: 'Ticket deleted successfully' });
    } catch (error) {
        res.status(500).json({
            sucess: false,
            message: 'Error deleting ticket',
            error: error.message
        });
    }
};
