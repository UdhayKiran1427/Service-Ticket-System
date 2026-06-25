import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
    required: true,
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  technician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Open', 'In Review', 'Resolved'],
    default: 'Open',
  },
}, { timestamps: true });

const Report = mongoose.model('Report', ReportSchema);

export default Report;
