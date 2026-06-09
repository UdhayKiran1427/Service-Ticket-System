import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider.jsx';

function Navbar() {
  const { user, isAuthed, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const isAdmin = user?.role === 'admin';
  const isTechnician = user?.role === 'technician';
  const isUser = user?.role === 'user';

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleLogout = () => {
    logout();
    handleCloseNavMenu();
    navigate('/login');
  };

  const guestPages = [
    { label: 'Login', to: '/login' },
    { label: 'Register', to: '/register' },
  ];

  const adminPages = [
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'Tickets', to: '/tickets' },
    { label: 'Profile', to: '/profile' },
  ];

  const userPages = [
    { label: 'Tickets', to: '/tickets' },
    { label: 'Profile', to: '/profile' },
  ];

  const technicianPages = [
    { label: 'Tickets', to: '/tickets' },
    { label: 'My Tickets', to: '/technician-tickets' },
    { label: 'Profile', to: '/profile' },

  ];

  const pages = isAuthed
    ? isAdmin
      ? adminPages
      : isTechnician
      ? technicianPages
      : userPages
    : guestPages;

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to={isAuthed ? '/dashboard' : '/'}
            sx={{
              marginLeft: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Ticket System
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="open navigation menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                <MenuItem key={page.label} onClick={handleCloseNavMenu}>
                  <Typography sx={{ textAlign: 'center' }}>
                    <Link to={page.to} style={{ textDecoration: 'none', color: 'inherit' }}>
                      {page.label}
                    </Link>
                  </Typography>
                </MenuItem>
              ))}
              {isAuthed && (
                <MenuItem onClick={handleLogout}>
                  <Typography sx={{ textAlign: 'center' }}>Logout</Typography>
                </MenuItem>
              )}
            </Menu>
          </Box>

          <Typography
            variant="h5"
            noWrap
            component={Link}
            to={isAuthed ? '/dashboard' : '/'}
            sx={{
              marginLeft: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Ticket System
          </Typography>

          <Box sx={{marginRight:3, flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end', alignItems: 'center' }}>
            {pages.map((page) => (
              <Button
                key={page.label}
                onClick={handleCloseNavMenu}
                sx={{  my: 2, color: 'white', display: 'block' }}
                component={Link}
                to={page.to}
              >
                {page.label}
              </Button>
            ))}
            {isAuthed && (
              <Button
                onClick={handleLogout}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Logout
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
