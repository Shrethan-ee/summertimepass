import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Badge,
  InputBase,
  Fade,
  Paper,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MessageIcon from '@mui/icons-material/Message';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const pages = [
  { title: 'Ideas', path: '/ideas' },
  { title: 'Investors', path: '/investors' },
  { title: 'Events', path: '/events' },
];

const Navbar = () => {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar 
      position="static" 
      sx={{
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(99, 102, 241, 0.2)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo for desktop */}
          <Box
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              }
            }}
          >
            <RocketLaunchIcon 
              sx={{ 
                fontSize: 32, 
                mr: 1,
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                borderRadius: '50%',
                p: 0.5,
                color: 'white'
              }} 
            />
            <Typography
              variant="h6"
              noWrap
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #6366f1, #a855f7, #ec4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontSize: '1.3rem',
                letterSpacing: '0.5px',
              }}
            >
              STARTUP PLATFORM
            </Typography>
          </Box>

          {/* Mobile menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{
                color: 'white',
                background: 'rgba(99, 102, 241, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                '&:hover': {
                  background: 'rgba(99, 102, 241, 0.3)',
                  transform: 'scale(1.05)',
                }
              }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
                '& .MuiPaper-root': {
                  background: 'rgba(30, 41, 59, 0.9)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  borderRadius: '12px',
                  mt: 1,
                }
              }}
            >
              {pages.map((page) => (
                <MenuItem 
                  key={page.title} 
                  onClick={() => {
                    handleCloseNavMenu();
                    navigate(page.path);
                  }}
                  sx={{
                    color: '#f8fafc',
                    '&:hover': {
                      background: 'rgba(99, 102, 241, 0.2)',
                    }
                  }}
                >
                  <Typography textAlign="center">{page.title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Logo for mobile */}
          <Box
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              alignItems: 'center',
              textDecoration: 'none',
            }}
          >
            <RocketLaunchIcon 
              sx={{ 
                fontSize: 28, 
                mr: 1,
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                borderRadius: '50%',
                p: 0.5,
                color: 'white'
              }} 
            />
            <Typography
              variant="h5"
              noWrap
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #6366f1, #a855f7, #ec4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontSize: '1.1rem',
              }}
            >
              STARTUP PLATFORM
            </Typography>
          </Box>

          {/* Desktop menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 4 }}>
            {pages.map((page) => (
              <Button
                key={page.title}
                component={RouterLink}
                to={page.path}
                onClick={handleCloseNavMenu}
                sx={{ 
                  my: 2, 
                  mx: 1,
                  color: '#f8fafc', 
                  display: 'block',
                  fontWeight: 500,
                  fontSize: '1rem',
                  textTransform: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    background: 'rgba(99, 102, 241, 0.2)',
                    transform: 'translateY(-2px)',
                    color: 'white',
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '0%',
                    height: '2px',
                    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                    transition: 'width 0.3s ease',
                  },
                  '&:hover::before': {
                    width: '100%',
                  }
                }}
              >
                {page.title}
              </Button>
            ))}
          </Box>

          {/* User menu */}
          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Notifications">
              <IconButton
                size="large"
                aria-label="show notifications"
                component={RouterLink}
                to="/notifications"
                sx={{
                  color: '#f8fafc',
                  background: 'rgba(99, 102, 241, 0.1)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(99, 102, 241, 0.2)',
                    transform: 'scale(1.1)',
                    boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
                  }
                }}
              >
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Messages">
              <IconButton
                size="large"
                aria-label="show messages"
                component={RouterLink}
                to="/messages"
                sx={{
                  color: '#f8fafc',
                  background: 'rgba(168, 85, 247, 0.1)',
                  border: '1px solid rgba(168, 85, 247, 0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(168, 85, 247, 0.2)',
                    transform: 'scale(1.1)',
                    boxShadow: '0 4px 15px rgba(168, 85, 247, 0.3)',
                  }
                }}
              >
                <Badge badgeContent={5} color="error">
                  <MessageIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Profile">
              <IconButton 
                onClick={handleOpenUserMenu} 
                sx={{ 
                  p: 0.5,
                  ml: 1,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  }
                }}
              >
                <Avatar 
                  alt="User Avatar" 
                  sx={{
                    width: 40,
                    height: 40,
                    border: '2px solid rgba(99, 102, 241, 0.5)',
                    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                  }}
                >
                  U
                </Avatar>
              </IconButton>
            </Tooltip>
            
            <Menu
              sx={{ 
                mt: '45px',
                '& .MuiPaper-root': {
                  background: 'rgba(30, 41, 59, 0.9)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  borderRadius: '12px',
                  minWidth: '180px',
                }
              }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem 
                onClick={() => {
                  handleCloseUserMenu();
                  navigate('/profile/me');
                }}
                sx={{
                  color: '#f8fafc',
                  '&:hover': {
                    background: 'rgba(99, 102, 241, 0.2)',
                  }
                }}
              >
                <Typography textAlign="center">Profile</Typography>
              </MenuItem>
              <MenuItem 
                onClick={() => {
                  handleCloseUserMenu();
                  navigate('/dashboard');
                }}
                sx={{
                  color: '#f8fafc',
                  '&:hover': {
                    background: 'rgba(99, 102, 241, 0.2)',
                  }
                }}
              >
                <Typography textAlign="center">Dashboard</Typography>
              </MenuItem>
              <MenuItem 
                onClick={handleCloseUserMenu}
                sx={{
                  color: '#f8fafc',
                  '&:hover': {
                    background: 'rgba(239, 68, 68, 0.2)',
                  }
                }}
              >
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;

