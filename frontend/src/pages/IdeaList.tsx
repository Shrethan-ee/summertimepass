import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import Loading from '../components/Loading';

const IdeaList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { ideas, loading } = useSelector((state: RootState) => state.ideas);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  useEffect(() => {
    // TODO: Fetch ideas from API
  }, [dispatch]);

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleSortClick = (event: React.MouseEvent<HTMLElement>) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    handleFilterClose();
  };

  const handleSortSelect = (sort: string) => {
    setSortBy(sort);
    handleSortClose();
  };

  if (loading) {
    return <Loading message="Loading ideas..." />;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h4" component="h1">
            Ideas
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/ideas/new')}
          >
            Submit Idea
          </Button>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search ideas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<FilterIcon />}
                  onClick={handleFilterClick}
                >
                  Filter
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<SortIcon />}
                  onClick={handleSortClick}
                >
                  Sort
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Grid container spacing={3}>
          {ideas.map((idea) => (
            <Grid item xs={12} md={6} lg={4} key={idea.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {idea.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {idea.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {idea.categories.map((category) => (
                      <Chip
                        key={category}
                        label={category}
                        size="small"
                        onClick={() => handleCategorySelect(category)}
                      />
                    ))}
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => navigate(`/ideas/${idea.id}`)}
                  >
                    Learn More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Filter Menu */}
        <Menu
          anchorEl={filterAnchorEl}
          open={Boolean(filterAnchorEl)}
          onClose={handleFilterClose}
        >
          <MenuItem onClick={() => handleCategorySelect('all')}>
            All Categories
          </MenuItem>
          <MenuItem onClick={() => handleCategorySelect('technology')}>
            Technology
          </MenuItem>
          <MenuItem onClick={() => handleCategorySelect('healthcare')}>
            Healthcare
          </MenuItem>
          <MenuItem onClick={() => handleCategorySelect('education')}>
            Education
          </MenuItem>
        </Menu>

        {/* Sort Menu */}
        <Menu
          anchorEl={sortAnchorEl}
          open={Boolean(sortAnchorEl)}
          onClose={handleSortClose}
        >
          <MenuItem onClick={() => handleSortSelect('newest')}>
            Newest First
          </MenuItem>
          <MenuItem onClick={() => handleSortSelect('oldest')}>
            Oldest First
          </MenuItem>
          <MenuItem onClick={() => handleSortSelect('popular')}>
            Most Popular
          </MenuItem>
        </Menu>
      </Box>
    </Container>
  );
};

export default IdeaList; 