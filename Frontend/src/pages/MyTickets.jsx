import { useCallback, useEffect, useMemo, useState } from "react";
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
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";

const MyTickets = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("");
  const[assignedNames, setAssignedNames] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const endpoint = "/tickets/technician-tickets";
        const response = await axiosClient.get(endpoint);
        setTickets(response.data.tickets || []);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Unable to fetch tickets");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const refreshTickets = useCallback(async () => {
    try {
      const endpoint = "/tickets/technician-tickets";
      const response = await axiosClient.get(endpoint);
      setTickets(response.data.tickets || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to fetch tickets");
    }
  }, []);


  const handleAssignName = useCallback(async (id) => {
    const response = await axiosClient.get(`/dashboard/technicianName/${id}`);
    setAssignedNames((prev) => ({
      ...prev,
      [id]: response.data.TechnicianData.username,
    }));
  }, []);

  useEffect(() => {
    tickets.forEach((ticket) => {
      if (ticket.assignedTo) {
        handleAssignName(ticket.assignedTo);
      }
    });
  }, [tickets]);

  const handleUpdateStatus = useCallback(
    async (id) => {
      if (!selectedStatus) return;
      try {
        await axiosClient.put(`/tickets/status/${id}`, { status: selectedStatus });
        await refreshTickets();
        setSelectedStatus("");
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Unable to update status");
      }
    },
    [refreshTickets, selectedStatus],
  );

  const ticketList = useMemo(
    () =>
      tickets.map((ticket) => (
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

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
              {ticket.description}
            </Typography>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
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
              <Box>
                {ticket.assignedTo && (
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <FormControl size="small" sx={{ minWidth: 220 }}>
                      <InputLabel>{ticket.status ? ticket.status : "Status"}</InputLabel>
                      <Select
                        value={selectedStatus || ""}
                        label={ticket.status ? ticket.status : "Status"}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                      >
                        <MenuItem value="Open">Open</MenuItem>
                        <MenuItem value="In Progress">In Progress</MenuItem>
                        <MenuItem value="Resolved">Resolved</MenuItem>
                        <MenuItem value="Closed">Closed</MenuItem>
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
              <Box>
                {user?.role === "technician" && (
                  <Button variant="contained" onClick={() => handleUpdateStatus(ticket._id)}>
                    Update Status
                  </Button>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      )),
    [tickets, assignedNames, selectedStatus, user?.role, handleUpdateStatus],
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" mb={2}>
          My Tickets
        </Typography>
        {loading && <Typography>Loading tickets…</Typography>}
        {error && <Typography color="error">{error}</Typography>}
        {!loading && !tickets.length && (
          <Typography>No tickets found.</Typography>
        )}
        <List>{ticketList}</List>
      </Paper>
    </Container>
  );
};

export default MyTickets;
