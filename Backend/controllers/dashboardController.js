import bcrypt from 'bcryptjs';import User from "../models/User.js";
import Ticket from "../models/Tickets.js";
import Report from "../models/Report.js";
import mongoose from "mongoose";
export const getDashboardData = async (req,res)=>{

    try {
        const totalTickets = await Ticket.countDocuments();
        const openTickets = await Ticket.countDocuments({ status: 'Open' });
        const inProgressTickets = await Ticket.countDocuments({ status: 'In Progress' });
        const assignedTickets = await Ticket.countDocuments({ assignedTo: req.user._id });
        const resolvedTickets = await Ticket.countDocuments({ status: 'Resolved' });
        const closedTickets = await Ticket.countDocuments({ status: 'Closed' });
        const totalTechnicians = await User.countDocuments({ role: 'technician' });
        res.status(200).json({
            success: true,
            message: 'Dashboard data fetched successfully',
            totalTickets,
            openTickets,
            inProgressTickets,
            assignedTickets,
            resolvedTickets,
            closedTickets,
            totalTechnicians
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard data',
            error: error.message
        });
    }
}
export const getTechnicianData = async (req,res)=>{

    try {
        const technicians = await User.aggregate([
            { $match: { role: 'technician' } },
            {
                $lookup: {
                    from: 'tickets',
                    localField: '_id',
                    foreignField: 'assignedTo',
                    as: 'assignedTickets',
                },
            },
            {
                $addFields: {
                    assignedTicketCount: { $size: '$assignedTickets' },
                },
            },
            {
                $project: {
                    username: 1,
                    assignedTicketCount: 1,
                },
            },
        ]);

        res.status(200).json({
            success: true,
            message: 'Technician data fetched successfully',
            totalTechnicians: technicians,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching technician data',
            error: error.message,
        });
    }
}
export const getTechniciansData = async (req,res)=>{

    try {
        const technicians = await User.find({ role: 'technician' });

        res.status(200).json({
            success: true,
            message: 'Technician data fetched successfully',
            totalTechnicians: technicians,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching technician data',
            error: error.message,
        });
    }
}
export const getTechnicianName = async (req,res)=>{

    try {
        const { id } = req.params;
        const TechnicianData = await User.findById(id);

        res.status(200).json({
            success: true,
            message: 'Technician data fetched successfully',
            TechnicianData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching technician data',
            error: error.message
        });
    }
}

export const createTechnician = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required',
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with that email already exists',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const technician = await User.create({
      username,
      email,
      password: hashPassword,
      role: 'technician',
    });

    res.status(201).json({
      success: true,
      message: 'Technician user created successfully',
      technician: {
        id: technician._id,
        username: technician.username,
        email: technician.email,
        role: technician.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating technician user',
      error: error.message,
    });
  }
};

export const createReport = async (req, res) => {
    try {
        const { ticketId, comment } = req.body;

        if (!ticketId || !comment) {
            return res.status(400).json({
                success: false,
                message: 'Ticket ID and comment are required',
            });
        }

        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: 'Ticket not found',
            });
        }

        if (ticket.createdBy.toString() !== req.user._id) {
            return res.status(403).json({
                success: false,
                message: 'You can only report technician for your own tickets',
            });
        }

        if (!ticket.assignedTo) {
            return res.status(400).json({
                success: false,
                message: 'This ticket is not assigned to a technician',
            });
        }

        const report = await Report.create({
            ticket: ticket._id,
            reportedBy: req.user._id,
            technician: ticket.assignedTo,
            comment,
        });

        res.status(201).json({
            success: true,
            message: 'Technician report submitted successfully',
            report,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error submitting report',
            error: error.message,
        });
    }
};

export const getReports = async (req, res) => {
    try {
        const reports = await Report.find()
            .populate('ticket', 'title status Lab')
            .populate('reportedBy', 'username email')
            .populate('technician', 'username email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            reports,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching reports',
            error: error.message,
        });
    }
};

export const deleteTechnician = async (req,res) => {
    try {
        const { id } = req.params;
        const existTechnician = await User.findById(id);
        if(!existTechnician){
            return res.status(404).json({ sucess: false, message: 'Technician not found' });
        }
        await User.findByIdAndDelete(id);
        res.status(200).json({ sucess: true, message: 'Technician deleted successfully' });
    } catch (error) {
        res.status(500).json({
            sucess: false,
            message: 'Error deleting technician',
            error: error.message
        });
    }
};