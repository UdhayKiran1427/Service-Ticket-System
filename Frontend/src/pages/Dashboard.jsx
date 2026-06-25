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
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';
  const handleDeleteTechnician = async (id) => {
    if (!window.confirm("Delete this technician?")) return;
    try {
      await axiosClient.delete(`/dashboard/technicians/${id}`);
      setTechnicians((prev) => prev.filter((tech) => tech._id !== id));
      setSeverity('success');
      setMessage('Technician deleted successfully');
      setOpen(true);
    } catch (err) {
      setSeverity('error');
      setMessage(err.response?.data?.message || 'Unable to delete technician');
      setOpen(true);
    }
  };
  const fetchData = async () => {
    try {
      setLoading(true);
      if (isAdmin) {
        const response = await axiosClient.get('/dashboard/stats');
        const res = await axiosClient.get('/dashboard/techniciansData');
        setTechnicians(res.data.totalTechnicians);
        setStats(response.data);
        setError('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAdmin,technicians.length]);

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
        <Grid container spacing={4} sx={{display: 'flex', alignItems: 'center'}}>
          <Grid xs={12} md={8}>
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
          <Grid xs={12} sm={6} md={4} key={card.label}>
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
              Manage Technicians
            </Typography>
            {/* <Typography variant="body2" color="text.secondary">
              Snapshot of the all technicians.
            </Typography> */}
          </Box>
          <Button variant="contained" onClick={() => navigate('/create-technician')}>
            Add Technician
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
                  <TableCell>Technician Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {technicians?.slice(0, 6).map((technician) => (
                  <TableRow key={technician._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ fontWeight: 600 }}>{technician.username}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{technician.email}</TableCell>
                    <TableCell>
                      <Button variant="contained" onClick={() => handleDeleteTechnician(technician._id)} >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
              
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
      <Snackbar open={open} autoHideDuration={4000} onClose={() => setOpen(false)}>
              <Alert severity={severity} variant="filled" sx={{ width: '100%' }}>
                {message}
              </Alert>
            </Snackbar>
    </Container>
  );
};

export default Dashboard;
 