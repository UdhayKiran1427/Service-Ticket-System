import mongoose from "mongoose";

const TicketSchemea = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Low'
    },
    status:{
        type: String,
        enum: ['Open','Assigned', 'In Progress','Resolved', 'Closed'],
        default: 'Open'
    },
    Lab:{
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
}, { timestamps: true });

const Ticket = mongoose.model('Ticket', TicketSchemea);

export default Ticket;