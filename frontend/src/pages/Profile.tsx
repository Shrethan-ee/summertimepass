import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  TextField,
  Button,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const Profile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    bio: user?.bio || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement profile update
    setIsEditing(false);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Profile Information */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar
                  sx={{ width: 120, height: 120, mb: 2 }}
                  src={user?.profile_picture}
                />
                <Typography variant="h5" gutterBottom>
                  {user?.first_name} {user?.last_name}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {user?.role}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => setIsEditing(!isEditing)}
                  sx={{ mt: 2 }}
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Profile Details */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              {isEditing ? (
                <Box component="form" onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Bio"
                        name="bio"
                        multiline
                        rows={4}
                        value={formData.bio}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button type="submit" variant="contained" color="primary">
                        Save Changes
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              ) : (
                <>
                  <Typography variant="h6" gutterBottom>
                    About
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {user?.bio || 'No bio available'}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Contact Information
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Email"
                        secondary={user?.email}
                      />
                    </ListItem>
                  </List>
                </>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Profile; 