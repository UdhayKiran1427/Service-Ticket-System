import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [lab, setLab] = useState('');
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosClient.post('/tickets/create', {
        title,
        description,
        priority,
        lab,
      });
      setMessage(response.data.message || 'Ticket created successfully');
      setSeverity('success');
      setOpen(true);
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setLab('');
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to create ticket');
      setSeverity('error');
      setOpen(true);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
      <Button
           
            onClick={() => navigate("/tickets")}
          >
            
          </Button>
      <Button
            variant="contained"
            onClick={() => navigate("/tickets")}
          >
            Back
          </Button>
          </Box>
      <Card sx={{ p: 3 }}>
        <Typography component="h1" variant="h4" mb={3}>
          Create Ticket
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
            Submit Ticket
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
