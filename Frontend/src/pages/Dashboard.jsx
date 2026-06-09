import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider.jsx';
import axiosClient from '../api/axiosClient.js';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (isAdmin) {
          const response = await axiosClient.get('/dashboard/stats');
          const res = await axiosClient.get('/tickets/all-tickets');
          console.log(res.data);
          setTickets(res.data.tickets);
          setStats(response.data);
          setError('');
        } 
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAdmin]);
  console.log(stats);
  const statCards = [
    { label: 'Total Tickets', value: stats?.totalTickets ?? 0, color: 'primary' },
    { label: 'Open Tickets', value: stats?.openTickets ?? 0, color: 'warning' },
    { label: 'In Progress', value: stats?.inProgressTickets ?? 0, color: 'info' },
    { label: 'Resolved', value: stats?.resolvedTickets ?? 0, color: 'success' },
    { label: 'Closed', value: stats?.closedTickets ?? 0, color: 'default' },
    { label: 'Technicians', value: stats?.totalTechnicians ?? 0, color: 'secondary' },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={4} sx={{ p: 4, mb: 4, borderRadius: 4, backgroundColor: '#f7f9fc' }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              {isAdmin ? 'Admin Dashboard' : `Welcome back, ${user?.username}`}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {isAdmin
                ? 'Manage ticket operations, assignments, and overall system health at a glance.'
                : 'Track your open requests, priorities, and ticket progress from one place.'}
            </Typography>
          </Grid>
         
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {statCards.map((card) => (
          <Grid item xs={12} sm={6} md={4} key={card.label}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 3,
                minHeight: 140,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background:
                  card.color === 'warning'
                    ? 'linear-gradient(135deg, #fff7e1, #ffe8b5)'
                    : card.color === 'success'
                    ? 'linear-gradient(135deg, #e8f7ed, #c8ebd6)'
                    : card.color === 'info'
                    ? 'linear-gradient(135deg, #e9f4ff, #c9dcff)'
                    : '#ffffff',
              }}
            >
              <Typography variant="subtitle2" color="text.secondary">
                {card.label}
              </Typography>
              <Typography variant="h4" fontWeight={700}>
                {card.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper elevation={4} sx={{ p: 3, mt: 4, borderRadius: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Recent Tickets
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Snapshot of the latest ticket activity in your workspace.
            </Typography>
          </Box>
          <Button variant="contained" onClick={() => navigate('/tickets')}>
            Manage Tickets
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Lab</TableCell>
                  <TableCell>Created At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tickets?.slice(0, 6).map((ticket) => (
                  <TableRow key={ticket._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ fontWeight: 600 }}>{ticket.title}</TableCell>
                    <TableCell>
                      <Chip
                        label={ticket.priority}
                        color={
                          ticket.priority === 'High'
                            ? 'error'
                            : ticket.priority === 'Medium'
                            ? 'warning'
                            : 'success'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={ticket.status}
                        color={
                          ticket.status === 'Closed' || ticket.status === 'Resolved' ? 'success' : 'info'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{ticket.Lab}</TableCell>
                    <TableCell>
                      {new Date(ticket.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
};

export default Dashboard;
 