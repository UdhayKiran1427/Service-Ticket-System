import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient.js';
import { useAuth } from '../auth/AuthProvider.jsx';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import FormControl from '@mui/material/FormControl';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get('/profile/me');
        if (response.data.success) {
          setUsername(response.data.user.username);
          setEmail(response.data.user.email);
        }
      } catch (error) {
        setMessage(error.response?.data?.message || 'Failed to fetch profile');
        setSeverity('error');
        setOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (password && password !== confirmPassword) {
      setMessage('Passwords do not match');
      setSeverity('error');
      setOpen(true);
      return;
    }

    try {
      const updateData = {
        username,
        email,
      };

      if (password) {
        updateData.password = password;
      }

      const response = await axiosClient.put('/profile/update', updateData);

      if (response.data.success) {
        setMessage(response.data.message || 'Profile updated successfully');
        setSeverity('success');
        setPassword('');
        setConfirmPassword('');
        setIsEditing(false);
        setOpen(true);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update profile');
      setSeverity('error');
      setOpen(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPassword('');
    setConfirmPassword('');
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" onClick={() => navigate(-1)}>
          Back
        </Button>
      </Box>
      <Card sx={{ p: 3 }}>
        <CardContent>
          <Typography component="h1" variant="h4" mb={3} fontWeight="bold">
            My Profile
          </Typography>

          <Box component="form" onSubmit={handleUpdateProfile} sx={{ display: 'grid', gap: 2 }}>
            {!isEditing ? (
              <>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Username
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {username}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {email}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Role
                  </Typography>
                  <Typography variant="body1" fontWeight="500" sx={{ textTransform: 'capitalize' }}>
                    {user?.role}
                  </Typography>
                </Box>
                <Button variant="contained" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              </>
            ) : (
              <>
                <FormControl fullWidth>
                  <TextField
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </FormControl>
                <FormControl fullWidth>
                  <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </FormControl>
                <FormControl fullWidth>
                  <TextField
                    label="New Password (optional)"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    helperText="Leave blank to keep current password"
                  />
                </FormControl>
                <FormControl fullWidth>
                  <TextField
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={!password}
                  />
                </FormControl>
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  <Button type="submit" variant="contained">
                    Save Changes
                  </Button>
                  <Button variant="outlined" onClick={handleCancel}>
                    Cancel
                  </Button>
                </Stack>
              </>
            )}
          </Box>
        </CardContent>
      </Card>
      <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)}>
        <Alert severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile;
