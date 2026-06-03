import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider.jsx";
import axiosClient from "../api/axiosClient.js";
import { useNavigate , Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Navbar from "./Navbar.jsx";

const TicketsPages = () => {
  const { user, logout } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [selectedTechnician, setSelectedTechnician] = useState({});
  const [assignedNames, setAssignedNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const endpoint = isAdmin
          ? "/tickets/all-tickets"
          : "/tickets/my-tickets";
        const response = await axiosClient.get(endpoint);
        setTickets(response.data.tickets || []);
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
      } catch (err) {
        setError(err.response?.data?.message || "Unable to fetch technicians");
      }
    };

    fetchTickets();
    fetchTechnicians();
  }, [isAdmin]);

  const refreshTickets = async () => {
    try {
      const endpoint = isAdmin ? "/tickets/all-tickets" : "/tickets/my-tickets";
      const response = await axiosClient.get(endpoint);
      setTickets(response.data.tickets || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to fetch tickets");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this ticket?")) return;
    try {
      await axiosClient.delete(`/tickets/delete/${id}`);
      setTickets((t) => t.filter((tk) => tk._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete ticket");
    }
  };

  const handleAssign = async (id, assignedTo) => {
    if (!assignedTo) return;
    try {
      await axiosClient.put(`/tickets/assign/${id}`, { assignedTo });
      await refreshTickets();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to assign ticket");
    }
  };

  const handleAssignName = async (id) => {
    const response = await axiosClient.get(`/dashboard/technicianName/${id}`);
    setAssignedNames((prev) => ({
      ...prev,
      [id]: response.data.TechnicianData.username,
    }));
  };

  useEffect(() => {
    tickets.forEach((ticket) => {
      if (ticket.assignedTo) {
        handleAssignName(ticket.assignedTo);
      }
    });
  }, [tickets]);

  const handleUpdateStatus = async (id) => {
    const status = window.prompt(
      "Enter new status (Resolved, In Progress, Closed):",
    );
    if (!status) return;
    try {
      await axiosClient.put(`/tickets/status/${id}`, { status });
      await refreshTickets();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update status");
    }
  };

  const handleEdit = async (ticket) => {
    const title = window.prompt("Title", ticket.title);
    const description = window.prompt("Description", ticket.description);
    const priority = window.prompt(
      "Priority (Low, Medium, High)",
      ticket.priority,
    );
    const lab = window.prompt("Lab", ticket.Lab);
    if (!title || !description || !priority || !lab) return;
    try {
      await axiosClient.put(`/tickets/update/${ticket._id}`, {
        title,
        description,
        priority,
        lab,
        status: ticket.status,
      });
      await refreshTickets();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update ticket");
    }
  };
  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      <Button
            variant="contained"
            onClick={() => navigate("/create-ticket")}
            sx={{mb:3}}
          >
            Create Ticket
          </Button>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" mb={2}>
          {isAdmin ? "All Tickets" : "My Tickets"}
        </Typography>
        {loading && <Typography>Loading tickets…</Typography>}
        {error && <Typography color="error">{error}</Typography>}
        {!loading && !tickets.length && (
          <Typography>No tickets found.</Typography>
        )}
        <List>
  {tickets.map((ticket) => (
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

          <Chip
            label={`Status: ${ticket.status}`}
            color="primary"
          />

          <Chip
            label={`Lab: ${ticket.Lab}`}
            variant="outlined"
          />

          {ticket.assignedTo && (
            <Chip
              label={`👨‍🔧 ${
                assignedNames[ticket.assignedTo] || "Unknown"
              }`}
              color="secondary"
            />
          )}
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
          {user?.role === "admin" && !ticket.assignedTo && (
            <Box sx={{ display: "flex", gap: 1 }}>
              <FormControl size="small" sx={{ minWidth: 220 }}>
                <InputLabel>
                  Technician
                </InputLabel>

                <Select
                  value={selectedTechnician[ticket._id] || ""}
                  label="Technician"
                  onChange={(e) =>
                    setSelectedTechnician((prev) => ({
                      ...prev,
                      [ticket._id]: e.target.value,
                    }))
                  }
                >
                  <MenuItem value="">
                    Select Technician
                  </MenuItem>

                  {technicians.map((tech) => (
                    <MenuItem
                      key={tech._id}
                      value={tech._id}
                    >
                      {tech.username}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="contained"
                disabled={!selectedTechnician[ticket._id]}
                onClick={() =>
                  handleAssign(
                    ticket._id,
                    selectedTechnician[ticket._id]
                  )
                }
              >
                Assign
              </Button>
            </Box>
          )}

          <Box sx={{ display: "flex", gap: 1 }}>
            {user?.role === "admin" && (
              <Button
                color="error"
                variant="contained"
                onClick={() =>
                  handleDelete(ticket._id)
                }
              >
                Delete
              </Button>
            )}

            {user?.role === "technician" && (
              <Button
                variant="contained"
                onClick={() =>
                  handleUpdateStatus(ticket._id)
                }
              >
                Update Status
              </Button>
            )}

            {user?.role === "user" &&
              ticket.createdBy === user?.id && (
                <Button
                  variant="outlined"
                  onClick={() => handleEdit(ticket)}
                >
                  Edit
                </Button>
              )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  ))}
</List>
      </Paper>
    </Container>
  );
};

export default TicketsPages;
