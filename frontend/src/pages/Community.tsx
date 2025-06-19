
import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  People as PeopleIcon,
  Public as PublicIcon,
  Lock as LockIcon,
  VpnKey as VpnKeyIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../store';
import {
  fetchGroups,
  fetchUserGroups,
  createGroup,
  joinGroup,
  leaveGroup,
} from '../store/slices/groupsSlice';
import Loading from '../components/Loading';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`community-tabpanel-${index}`}
      aria-labelledby={`community-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Community: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { groups, userGroups, loading, error } = useSelector((state: RootState) => state.groups);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [tabValue, setTabValue] = useState(0);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    category: '',
    privacy: 'public',
    rules: '',
  });

  useEffect(() => {
    dispatch(fetchGroups({ category: categoryFilter }));
    if (isAuthenticated) {
      dispatch(fetchUserGroups());
    }
  }, [dispatch, isAuthenticated, categoryFilter]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCreateGroup = async () => {
    if (!newGroup.name.trim() || !newGroup.description.trim() || !newGroup.category) {
      return;
    }

    try {
      await dispatch(createGroup(newGroup)).unwrap();
      setOpenCreateDialog(false);
      setNewGroup({
        name: '',
        description: '',
        category: '',
        privacy: 'public',
        rules: '',
      });
    } catch (error) {
      console.error('Failed to create group:', error);
    }
  };

  const handleJoinGroup = async (groupId: number) => {
    try {
      await dispatch(joinGroup(groupId)).unwrap();
    } catch (error) {
      console.error('Failed to join group:', error);
    }
  };

  const handleLeaveGroup = async (groupId: number) => {
    try {
      await dispatch(leaveGroup(groupId)).unwrap();
    } catch (error) {
      console.error('Failed to leave group:', error);
    }
  };

  const getPrivacyIcon = (privacy: string) => {
    switch (privacy) {
      case 'public':
        return <PublicIcon fontSize="small" />;
      case 'private':
        return <LockIcon fontSize="small" />;
      case 'invite_only':
        return <VpnKeyIcon fontSize="small" />;
      default:
        return <PublicIcon fontSize="small" />;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      startup: '#6366f1',
      investor: '#10b981',
      networking: '#f59e0b',
      technology: '#8b5cf6',
      industry: '#ef4444',
      general: '#6b7280',
    };
    return colors[category] || colors.general;
  };

  const categories = ['startup', 'investor', 'networking', 'technology', 'industry', 'general'];

  if (loading) {
    return <Loading message="Loading community..." />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" className="gradient-text">
          Community Groups
        </Typography>
        {isAuthenticated && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenCreateDialog(true)}
            sx={{
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5b21b6, #9333ea)',
              },
            }}
          >
            Create Group
          </Button>
        )}
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="community tabs"
          sx={{
            '& .MuiTab-root': {
              color: '#cbd5e1',
              '&.Mui-selected': {
                color: '#6366f1',
              },
            },
          }}
        >
          <Tab label="All Groups" />
          {isAuthenticated && <Tab label="My Groups" />}
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Box sx={{ mb: 3 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryFilter}
              label="Category"
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Grid container spacing={3}>
          {groups.map((group) => (
            <Grid item xs={12} md={6} lg={4} key={group.id}>
              <Card className="idea-card">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: getCategoryColor(group.category),
                        mr: 2,
                      }}
                    >
                      <GroupIcon />
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="h3" noWrap>
                        {group.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getPrivacyIcon(group.privacy)}
                        <Typography variant="body2" color="text.secondary">
                          {group.privacy}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {group.description}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Chip
                      label={group.category}
                      size="small"
                      sx={{
                        bgcolor: getCategoryColor(group.category),
                        color: 'white',
                      }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PeopleIcon fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography variant="body2">
                        {group.member_count} members
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>

                <CardActions sx={{ justifyContent: 'space-between' }}>
                  <Button
                    size="small"
                    onClick={() => navigate(`/groups/${group.id}`)}
                  >
                    View Details
                  </Button>
                  {isAuthenticated && (
                    <Button
                      size="small"
                      variant={group.is_member ? 'outlined' : 'contained'}
                      onClick={() =>
                        group.is_member
                          ? handleLeaveGroup(group.id)
                          : handleJoinGroup(group.id)
                      }
                      sx={{
                        ...(group.is_member
                          ? { color: '#ef4444', borderColor: '#ef4444' }
                          : {
                              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #5b21b6, #9333ea)',
                              },
                            }),
                      }}
                    >
                      {group.is_member ? 'Leave' : 'Join'}
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {isAuthenticated && (
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            {userGroups.map((group) => (
              <Grid item xs={12} md={6} lg={4} key={group.id}>
                <Card className="idea-card">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: getCategoryColor(group.category),
                          mr: 2,
                        }}
                      >
                        <GroupIcon />
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" component="h3" noWrap>
                          {group.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Role: {group.user_role}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {group.description}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip
                        label={group.category}
                        size="small"
                        sx={{
                          bgcolor: getCategoryColor(group.category),
                          color: 'white',
                        }}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PeopleIcon fontSize="small" sx={{ mr: 0.5 }} />
                        <Typography variant="body2">
                          {group.member_count} members
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>

                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => navigate(`/groups/${group.id}`)}
                    >
                      Manage Group
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>
      )}

      {/* Create Group Dialog */}
      <Dialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Group</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Group Name"
            value={newGroup.name}
            onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            value={newGroup.description}
            onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
            margin="normal"
            multiline
            rows={3}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              value={newGroup.category}
              label="Category"
              onChange={(e) => setNewGroup({ ...newGroup, category: e.target.value })}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Privacy</InputLabel>
            <Select
              value={newGroup.privacy}
              label="Privacy"
              onChange={(e) => setNewGroup({ ...newGroup, privacy: e.target.value })}
            >
              <MenuItem value="public">Public</MenuItem>
              <MenuItem value="private">Private</MenuItem>
              <MenuItem value="invite_only">Invite Only</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Group Rules (Optional)"
            value={newGroup.rules}
            onChange={(e) => setNewGroup({ ...newGroup, rules: e.target.value })}
            margin="normal"
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
          <Button
            onClick={handleCreateGroup}
            variant="contained"
            disabled={!newGroup.name.trim() || !newGroup.description.trim() || !newGroup.category}
          >
            Create Group
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Community;
