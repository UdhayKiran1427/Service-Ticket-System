import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useAuth } from '../auth/AuthProvider.jsx';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const { login, isAuthed, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthed) {
      if (user?.role === 'admin') {
        navigate('/dashboard', { replace: true });
      } else if (user?.role === 'technician') {
        navigate('/tickets', { replace: true });
      } else {
        navigate('/tickets', { replace: true });
      }
    }
  }, [isAuthed, user, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await login({ email, password });
      setOpen(true);
      setSeverity('success');
      setMessage(response.message || 'Login successful');
      response.role === 'admin' ? navigate('/dashboard') : navigate('/tickets');
    } catch (error) {
      setOpen(true);
      setSeverity('error');
      setMessage(error.response?.data?.message || 'An error occurred during login.');
    }
  }

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Card
        sx={{
          p: 4,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4">
          Login
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 3, width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}
          autoComplete="off"
        >
          <FormControl fullWidth>
            <Typography variant="body1" gutterBottom>
              Email Address
            </Typography>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
              required
            />
          </FormControl>
          <FormControl fullWidth>
            <Typography variant="body1" gutterBottom>
              Password
            </Typography>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
              minLength={6}
              required
            />
          </FormControl>
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: '#1976d2',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Login
          </button>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2">
            Don't have an account? <Link to="/register">Sign up</Link>
          </Typography>
        </Box>
      </Card>
      <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)}>
        <Alert severity={severity} variant="filled" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Login;
