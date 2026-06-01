import User from "../models/User.js";
import Ticket from "../models/Tickets.js";

export const getDashboardData = async (req,res)=>{

    try {
        const totalTickets = await Ticket.countDocuments();
        const openTickets = await Ticket.countDocuments({ status: 'Open' });
        const inProgressTickets = await Ticket.countDocuments({ status: 'In Progress' });
        const assignedTickets = await Ticket.countDocuments({ assignedTo: req.user._id });
        const resolvedTickets = await Ticket.countDocuments({ status: 'Resolved' });
        const closedTickets = await Ticket.countDocuments({ status: 'Closed' });
        const totalTechnicians = await User.countDocuments({ role: 'Technician' });

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