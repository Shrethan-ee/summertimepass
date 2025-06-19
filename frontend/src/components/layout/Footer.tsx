import React from 'react';
import { Box, Container, Grid, Typography, Link } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[900],
        color: 'white',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Startup Platform
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Connecting entrepreneurs, investors, and innovators to build the future together.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Link href="/about" color="inherit" display="block" sx={{ mb: 1 }}>
              About Us
            </Link>
            <Link href="/contact" color="inherit" display="block" sx={{ mb: 1 }}>
              Contact
            </Link>
            <Link href="/privacy" color="inherit" display="block" sx={{ mb: 1 }}>
              Privacy Policy
            </Link>
            <Link href="/terms" color="inherit" display="block" sx={{ mb: 1 }}>
              Terms of Service
            </Link>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Connect With Us
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Link href="https://facebook.com" color="inherit">
                <FacebookIcon />
              </Link>
              <Link href="https://twitter.com" color="inherit">
                <TwitterIcon />
              </Link>
              <Link href="https://linkedin.com" color="inherit">
                <LinkedInIcon />
              </Link>
              <Link href="https://instagram.com" color="inherit">
                <InstagramIcon />
              </Link>
            </Box>
          </Grid>
        </Grid>
        <Box mt={5}>
          <Typography variant="body2" color="text.secondary" align="center">
            {'© '}
            {new Date().getFullYear()}
            {' Startup Platform. All rights reserved.'}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 