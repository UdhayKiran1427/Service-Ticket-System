import User from "../models/User.js";
import Ticket from "../models/Tickets.js";
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