import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Chip,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import DiamondIcon from '@mui/icons-material/Diamond';

const Home = () => {
  const navigate = useNavigate();
  const [animatedStats, setAnimatedStats] = useState({
    ideas: 0,
    entrepreneurs: 0,
    investors: 0,
    funding: 0
  });

  useEffect(() => {
    const targetStats = {
      ideas: 1247,
      entrepreneurs: 3856,
      investors: 429,
      funding: 12.4
    };

    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setAnimatedStats({
        ideas: Math.floor(targetStats.ideas * easeOut),
        entrepreneurs: Math.floor(targetStats.entrepreneurs * easeOut),
        investors: Math.floor(targetStats.investors * easeOut),
        funding: (targetStats.funding * easeOut).toFixed(1)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  const featuredIdeas = [
    {
      id: 1,
      title: 'AI-Powered Healthcare Platform',
      description: 'Revolutionizing patient care with artificial intelligence and machine learning.',
      category: 'Healthcare',
      likes: 245,
      comments: 56,
    },
    {
      id: 2,
      title: 'Sustainable Energy Solution',
      description: 'Innovative approach to renewable energy storage and distribution.',
      category: 'Clean Energy',
      likes: 189,
      comments: 42,
    },
    {
      id: 3,
      title: 'Smart City Infrastructure',
      description: 'Next-generation urban planning and management system.',
      category: 'Smart Cities',
      likes: 167,
      comments: 38,
    },
  ];

  const platformStats = [
    { label: 'Ideas Shared', value: animatedStats.ideas, suffix: '+' },
    { label: 'Entrepreneurs', value: animatedStats.entrepreneurs, suffix: '+' },
    { label: 'Active Investors', value: animatedStats.investors, suffix: '+' },
    { label: 'Funding Raised', value: animatedStats.funding, suffix: 'M+', prefix: '$' }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box className="hero-section">
        {/* Floating geometric elements */}
        <Box className="floating-element">
          <AutoAwesomeIcon sx={{ fontSize: 80, color: 'white' }} />
        </Box>
        <Box className="floating-element">
          <RocketLaunchIcon sx={{ fontSize: 60, color: 'white' }} />
        </Box>
        <Box className="floating-element">
          <DiamondIcon sx={{ fontSize: 70, color: 'white' }} />
        </Box>
        
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box className="hero-content">
                <Typography className="hero-title" component="h1">
                  Connect. Innovate. Grow.
                </Typography>
                <Typography className="hero-subtitle">
                  Join our community of entrepreneurs, investors, and innovators to build the future together.
                </Typography>
                <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  <Button
                    className="action-button"
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/register')}
                    sx={{
                      fontSize: '1.1rem',
                      px: 4,
                      py: 1.5,
                      background: 'rgba(255, 255, 255, 0.2) !important',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3) !important',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.3) !important',
                        transform: 'translateY(-3px) !important',
                        boxShadow: '0 15px 35px rgba(255, 255, 255, 0.2) !important',
                      }
                    }}
                  >
                    Get Started
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/ideas')}
                    sx={{
                      fontSize: '1.1rem',
                      px: 4,
                      py: 1.5,
                      color: 'white',
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: 'white',
                        background: 'rgba(255, 255, 255, 0.2)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 10px 25px rgba(255, 255, 255, 0.2)',
                      }
                    }}
                  >
                    Explore Ideas
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 400,
                  position: 'relative',
                }}
              >
                <Box
                  sx={{
                    width: 300,
                    height: 300,
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '50%',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'float 6s ease-in-out infinite',
                  }}
                >
                  <RocketLaunchIcon sx={{ fontSize: 120, color: 'white', opacity: 0.8 }} />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8, mt: 8 }}>
        <Typography className="section-title" component="h2">
          Why Choose Us?
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Box 
              className="card-hover"
              sx={{ 
                textAlign: 'center', 
                p: 4, 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                }}
              >
                <TrendingUpIcon sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Typography variant="h5" component="h3" gutterBottom className="gradient-text">
                Growth Opportunities
              </Typography>
              <Typography sx={{ color: '#cbd5e1', lineHeight: 1.6 }}>
                Connect with investors and mentors who can help your startup grow.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box 
              className="card-hover"
              sx={{ 
                textAlign: 'center', 
                p: 4, 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                }}
              >
                <PeopleIcon sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Typography variant="h5" component="h3" gutterBottom className="gradient-text">
                Strong Community
              </Typography>
              <Typography sx={{ color: '#cbd5e1', lineHeight: 1.6 }}>
                Join a vibrant community of entrepreneurs and innovators.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box 
              className="card-hover"
              sx={{ 
                textAlign: 'center', 
                p: 4, 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ec4899, #6366f1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                }}
              >
                <LightbulbIcon sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Typography variant="h5" component="h3" gutterBottom className="gradient-text">
                Innovation Hub
              </Typography>
              <Typography sx={{ color: '#cbd5e1', lineHeight: 1.6 }}>
                Share your ideas and get valuable feedback from experts.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Featured Ideas Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography className="section-title" component="h2">
          Featured Ideas
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {featuredIdeas.map((idea) => (
            <Grid item key={idea.id} xs={12} md={4}>
              <Card 
                className="idea-card"
                sx={{
                  background: 'rgba(30, 41, 59, 0.7)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(99, 102, 241, 0.3)',
                    borderColor: 'rgba(99, 102, 241, 0.5)',
                  }
                }}
              >
                <Box
                  sx={{
                    height: 200,
                    background: 'linear-gradient(135deg, #6366f1, #a855f7, #ec4899)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      color: 'white',
                      fontWeight: 700,
                      textAlign: 'center',
                      textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                      zIndex: 1,
                    }}
                  >
                    {idea.category}
                  </Typography>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -50,
                      right: -50,
                      width: 150,
                      height: 150,
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.1)',
                      opacity: 0.5,
                    }}
                  />
                </Box>
                <CardContent className="idea-card-content">
                  <Chip
                    label={idea.category}
                    className="tag"
                    size="small"
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="h5" component="h3" gutterBottom sx={{ color: '#f8fafc', fontWeight: 600 }}>
                    {idea.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#cbd5e1', lineHeight: 1.6 }}>
                    {idea.description}
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                    <Typography variant="body2" sx={{ color: '#a855f7' }}>
                      ❤️ {idea.likes}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6366f1' }}>
                      💬 {idea.comments}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions className="idea-card-actions">
                  <Button 
                    size="small" 
                    onClick={() => navigate(`/ideas/${idea.id}`)}
                    className="action-button"
                    sx={{ fontSize: '0.9rem' }}
                  >
                    Learn More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;

