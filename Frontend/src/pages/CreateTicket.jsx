import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosClient from '../api/axiosClient.js';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const CreateTicket = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const ticket = location.state?.ticket;
  const isEdit = Boolean(location.state?.isEdit && ticket);

  const [title, setTitle] = useState(ticket?.title || '');
  const [description, setDescription] = useState(ticket?.description || '');
  const [priority, setPriority] = useState(ticket?.priority || 'Medium');
  const [lab, setLab] = useState(ticket?.Lab || '');
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');

  const formTitle = isEdit ? 'Edit Ticket' : 'Create Ticket';
  const actionText = isEdit ? 'Update Ticket' : 'Submit Ticket';

  useEffect(() => {
    if (isEdit) {
      setTitle(ticket.title || '');
      setDescription(ticket.description || '');
      setPriority(ticket.priority || 'Medium');
      setLab(ticket.Lab || '');
    }
  }, [isEdit, ticket]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = isEdit
        ? await axiosClient.put(`/tickets/update/${ticket._id}`, {
            title,
            description,
            priority,
            lab,
            status: ticket.status || 'Open',
          })
        : await axiosClient.post('/tickets/create', {
            title,
            description,
            priority,
            lab,
          });

      setMessage(
        response.data.message ||
          (isEdit ? 'Ticket updated successfully' : 'Ticket created successfully'),
      );
      setSeverity('success');
      setOpen(true);

      if (!isEdit) {
        setTitle('');
        setDescription('');
        setPriority('Medium');
        setLab('');
      }

      setTimeout(() => navigate('/tickets'), 1200);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          (isEdit ? 'Unable to update ticket' : 'Unable to create ticket'),
      );
      setSeverity('error');
      setOpen(true);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" onClick={() => navigate('/tickets')}>
          Back
        </Button>
      </Box>
      <Card sx={{ p: 3 }}>
        <Typography component="h1" variant="h4" mb={3}>
          {formTitle}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 1 }}>
          <FormControl fullWidth>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </FormControl>
          <FormControl fullWidth>
            <TextField
              multiline
              minRows={3}
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </FormControl>
          <FormControl fullWidth>
            <Select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <TextField
              label="Lab"
              value={lab}
              onChange={(e) => setLab(e.target.value)}
              required
            />
          </FormControl>
          <Button type="submit" variant="contained">
            {actionText}
          </Button>
        </Box>
      </Card>
      <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)}>
        <Alert severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreateTicket;
