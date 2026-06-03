import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Container sx={{ mt: 10, textAlign: 'center' }}>
      <Typography variant="h3" gutterBottom>
        404 - Page not found
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        The page you are looking for does not exist.
      </Typography>
      <Button variant="contained" onClick={() => navigate('/login')}>
        Go to Login
      </Button>
    </Container>
  );
};

export default NotFound;
