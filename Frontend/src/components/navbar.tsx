import React from 'react';
import { AppBar, Box, Toolbar, Typography, Button } from '@mui/material';

const navLinks = [
  { label: 'Elections', path: '/votingPage' },
  { label: 'Vote Now', path: '/vote' },
  { label: 'How It Works', path: '/how-it-works' },
];

const Navbar = () => {
  const handleNavigation = (route: string) => {
    window.location.href = route;
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: 'rgba(29, 29, 29, 0.6)',
        backdropFilter: 'blur(10px)',
        borderRadius: 3,
        px: { xs: 2, md: 4 },
        py: 1,
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      }}
    >
      <Toolbar
        disableGutters
        sx={{ display: 'flex', justifyContent: 'space-between' }}
      >
        {/* Logo / Title */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            color: '#ffffff',
            letterSpacing: 1.5,
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
          }}
        >
          <Button
            onClick={() => {
              handleNavigation('/');
            }}
            key={'home'}
            sx={{
              color: '#fff',
              textTransform: 'none',
              fontWeight: 500,
              px: 2,
              borderRadius: '20px',
              transition: 'all 0.3s ease',
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                boxShadow: '0 2px 10px rgba(255,255,255,0.1)',
              },
            }}
          >
            THE LINE
          </Button>
        </Typography>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          {navLinks.map((link) => (
            <Button
              onClick={() => {
                handleNavigation(link.path);
              }}
              key={link.label}
              sx={{
                color: '#fff',
                textTransform: 'none',
                fontWeight: 500,
                px: 2,
                borderRadius: '20px',
                transition: 'all 0.3s ease',
                backgroundColor: 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 2px 10px rgba(255,255,255,0.1)',
                },
              }}
            >
              {link.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
