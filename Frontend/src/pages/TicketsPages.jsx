import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthProvider.jsx";
import axiosClient from "../api/axiosClient.js";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";


const TicketCard = memo(({
  ticket,
  userRole,
  isTechnician,
  isUser,
  assignedNames,
  technicians,
  selectedTechnician,
  selectedStatus,
  reportComment,
  onReportCommentChange,
  onReport,
  onTechnicianChange,
  onAssign,
  onDelete,
  onUpdateStatus,
  onEdit,
  onStatusChange,
  currentUserId,
  onToggleStatus,
}) => (
  <Card
    key={ticket._id}
    sx={{
      mb: 3,
      borderRadius: 3,
      boxShadow: 3,
      transition: "all 0.3s ease",
      "&:hover": {
        boxShadow: 8,
        transform: "translateY(-4px)",
      },
    }}
  >
    <CardContent>
      <Typography variant="h6" fontWeight="bold">
        {ticket.title}
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 1, mb: 2 }}
      >
        {ticket.description}
      </Typography>

      <Stack
        direction="row"
        spacing={1}
        flexWrap="wrap"
        useFlexGap
        sx={{ mb: 2 }}
      >
        <Chip
          label={`Priority: ${ticket.priority}`}
          color={
            ticket.priority === "High"
              ? "error"
              : ticket.priority === "Medium"
              ? "warning"
              : "success"
          }
        />

        <Chip label={`Status: ${ticket.status}`} color="primary" />

        <Chip label={`Lab: ${ticket.Lab}`} variant="outlined" />

        {ticket.assignedTo && (
          <Chip
            label={`👨‍🔧 ${assignedNames[ticket.assignedTo] || "Unknown"}`}
            color="secondary"
          />
        )}
        {isUser && ticket.assignedTo && ticket.status !== "Closed" && (
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "flex-end", mt: 1 }}>
            <TextField
              size="small"
              label="Report technician"
              value={reportComment}
              onChange={(e) => onReportCommentChange(ticket._id, e.target.value)}
              helperText="Add a comment for the admin"
              multiline
              sx={{ minWidth: 240 }}
            />
            <Button
              variant="outlined"
              disabled={!reportComment}
              onClick={() => onReport(ticket._id)}
            >
              Report
            </Button>
          </Box>
        )}
        <Box>
          {isTechnician && !ticket.assignedTo && (
            <Box sx={{ display: "flex", gap: 1 }}>
              <FormControl size="small" sx={{ minWidth: 220 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedStatus || ""}
                  label="Status"
                  onChange={(e) => onStatusChange(ticket._id, e.target.value)}
                >
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Resolved">Resolved</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </Box>
      </Stack>

      <Divider sx={{ mb: 2 }} />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {userRole === "admin" && (
          <Box sx={{ display: "flex", gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 220 }}>
              <InputLabel>Technician</InputLabel>
              <Select
                value={selectedTechnician || ticket.assignedTo || ""}
                label="Technician"
                onChange={(e) => onTechnicianChange(ticket._id, e.target.value)}
              >
                <MenuItem value="">Select Technician</MenuItem>
                {technicians.map((tech) => (
                  <MenuItem key={tech._id} value={tech._id}>
                    {tech.username}
                    {tech.assignedTicketCount > 0
                      ? ` — ${tech.assignedTicketCount} ticket${tech.assignedTicketCount === 1 ? '' : 's'} assigned`
                      : ' — available'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              disabled={!selectedTechnician && !ticket.assignedTo}
              onClick={() => onAssign(ticket._id, selectedTechnician || ticket.assignedTo)}
            >
              {ticket.assignedTo ? 'Reassign' : 'Assign'}
            </Button>
          </Box>
        )}

        <Box sx={{ display: "flex", gap: 1 }}>
            {userRole === "admin" && (
              <Button
                color="error"
                variant="contained"
                onClick={() =>
                  onDelete(ticket._id)
                }
              >
                Delete
            </Button>
          )}

          {isTechnician &&  (
            <Button variant="contained" disabled={!selectedStatus} onClick={() => onUpdateStatus(ticket._id)}>
              Update Status
            </Button>
          )}

          {isUser &&  ticket.status !== "Closed" && ticket.status !== "Resolved" && (
            <>
              <Button variant="outlined" onClick={() => onEdit(ticket)}>
                Edit
              </Button>
              {ticket.createdBy && String(ticket.createdBy) === String(currentUserId) && (
                ticket.status == 'Resolved' ? (
                  <>
                  <Button variant="contained" color="error" onClick={() => onToggleStatus(ticket._id, 'Closed')}>
                    Close
                  </Button>
                  <Button variant="contained" color="primary" onClick={() => onToggleStatus(ticket._id, 'Open')}>
                    Reopen
                  </Button>
                  </>
                ) : ""
              )}
            </>
          )}
        </Box>
      </Box>
    </CardContent>
  </Card>
));

const TicketsPages = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [selectedTechnician, setSelectedTechnician] = useState({});
  const [assignedNames, setAssignedNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [reportComment, setReportComment] = useState({});
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const isAdmin = useMemo(() => user?.role === "admin", [user]);
  const isTechnician = useMemo(() => user?.role === "technician", [user]);
  const isUser = useMemo(() => user?.role === "user", [user]);
  const pageTitle = useMemo(
    () => (isAdmin || isTechnician ? "All Tickets" : "My Tickets"),
    [isAdmin, isTechnician],
  );
  const canCreateTicket = useMemo(() => !isTechnician, [isTechnician]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const endpoint = isAdmin
          ? "/tickets/all-tickets"
          : isTechnician
          ? "/tickets/open-unassigned"
          : "/tickets/my-tickets";
        const response = await axiosClient.get(endpoint);
        setTickets(response.data.tickets || []);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Unable to fetch tickets");
      } finally {
        setLoading(false);
      }
    };

    const fetchTechnicians = async () => {
      if (!isAdmin) return;
      try {
        const response = await axiosClient.get("/dashboard/technicians");
        setTechnicians(response.data.totalTechnicians || []);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Unable to fetch technicians");
      }
    };
    fetchTickets();
    fetchTechnicians();
  }, [isAdmin, isTechnician]);

  const refreshTickets = useCallback(async () => {
    try {
      const endpoint = isAdmin ? "/tickets/all-tickets" : "/tickets/my-tickets";
      const response = await axiosClient.get(endpoint);
      setTickets(response.data.tickets || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to fetch tickets");
    }
  }, [isAdmin]);

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm("Delete this ticket?")) return;
    setOpen(true);
    try {
      await axiosClient.delete(`/tickets/delete/${id}`);
      setTickets((t) => t.filter((tk) => tk._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete ticket");
    }
  }, []);

  const handleReport = useCallback(
    async (ticketId) => {
      const comment = reportComment[ticketId];
      if (!comment) return;
      try {
        await axiosClient.post('/dashboard/reports', {
          ticketId,
          comment,
        });
        setSuccess('Report submitted successfully. Admin will review it.');
        setError('');
        setReportComment((prev) => ({ ...prev, [ticketId]: '' }));
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to submit report');
        setSuccess('');
      }
    },
    [reportComment],
  );

  const handleReportCommentChange = useCallback((ticketId, value) => {
    setReportComment((prev) => ({
      ...prev,
      [ticketId]: value,
    }));
  }, []);

  const handleAssign = useCallback(
    async (id, assignedTo) => {
      if (!assignedTo) return;
      try {
        await axiosClient.put(`/tickets/assign/${id}`, { assignedTo });
        await refreshTickets();
      } catch (err) {
        setError(err.response?.data?.message || "Unable to assign ticket");
      }
    },
    [refreshTickets],
  );

  const handleAssignName = useCallback(async (id) => {
    const response = await axiosClient.get(`/dashboard/technicianName/${id}`);
    setAssignedNames((prev) => ({
      ...prev,
      [id]: response?.data?.TechnicianData?.username,
    }));
  }, []);

  useEffect(() => {
    tickets.forEach((ticket) => {
      if (ticket?.assignedTo) {
        handleAssignName(ticket.assignedTo);
      }
    });
  }, [tickets]);

  const handleUpdateStatus = useCallback(
    async (id) => {
      const status = selectedStatus[id];
      if (!status) return;
      try {
        await axiosClient.put(`/tickets/status/${id}`, { status });
        await refreshTickets();
        setSelectedStatus((prev) => ({ ...prev, [id]: "" }));
      } catch (err) {
        setError(err.response?.data?.message || "Unable to update status");
      }
    },
    [refreshTickets, selectedStatus],
  );

  const handleToggleStatus = useCallback(
    async (id, status) => {
      try {
        await axiosClient.put(`/tickets/status/${id}`, { status });
        await refreshTickets();
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to update status');
      }
    },
    [refreshTickets],
  );

  const handleEdit = useCallback(
    (ticket) => {
      navigate("/create-ticket", {
        state: {
          ticket,
          isEdit: true,
        },
      });
    },
    [navigate],
  );

  const handleCreateTicketClick = useCallback(
    () => navigate("/create-ticket"),
    [navigate],
  );

  const handleTechnicianChange = useCallback((ticketId, value) => {
    setSelectedTechnician((prev) => ({
      ...prev,
      [ticketId]: value,
    }));
  }, []);

  const handleStatusChange = useCallback((ticketId, value) => {
    setSelectedStatus((prev) => ({
      ...prev,
      [ticketId]: value,
    }));
  }, []);
  const ticketList = useMemo(
    () =>
      tickets.map((ticket) => (
          <TicketCard
          key={ticket._id}
          ticket={ticket}
          userRole={user?.role}
          isTechnician={isTechnician}
          isUser={isUser}
          assignedNames={assignedNames}
          technicians={technicians}
          reportComment={reportComment[ticket._id] || ""}
          onReportCommentChange={handleReportCommentChange}
          onReport={handleReport}
          selectedTechnician={selectedTechnician[ticket._id] || ""}
          selectedStatus={selectedStatus[ticket._id] || ""}
          onTechnicianChange={handleTechnicianChange}
          onAssign={handleAssign}
          onDelete={handleDelete}
          onUpdateStatus={handleUpdateStatus}
          onEdit={handleEdit}
          currentUserId={user?.id}
          onToggleStatus={handleToggleStatus}
          onStatusChange={handleStatusChange}
        />
      
      )),
    [
      tickets,
      user?.role,
      isTechnician,
      isUser,
      assignedNames,
      technicians,
      selectedTechnician,
      selectedStatus,
      reportComment,
      handleTechnicianChange,
      handleAssign,
      handleDelete,
      handleUpdateStatus,
      handleEdit,
      handleStatusChange,
    ],
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
      {canCreateTicket ? (
        <Button variant="contained" onClick={handleCreateTicketClick} sx={{ mb: 3 }}>
          Create Ticket
        </Button>
      ) : null}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" mb={2}>
          {pageTitle}
        </Typography>
        {loading && <Typography>Loading tickets…</Typography>}
        {success && <Typography color="success.main">{success}</Typography>}
        {error && <Typography color="error">{error}</Typography>}
        {!loading && !tickets.length && (
          <Typography>No tickets found Or Open.</Typography>
        )}
        <List>{ticketList}</List>
      </Paper>
    </Container>
  );
};

export default TicketsPages;
