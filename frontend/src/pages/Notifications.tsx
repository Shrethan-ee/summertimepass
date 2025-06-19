import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Button,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import Loading from '../components/Loading';

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { notifications, loading } = useSelector((state: RootState) => state.notifications);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedNotification, setSelectedNotification] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Fetch notifications from API
  }, [dispatch]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, notificationId: string) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedNotification(notificationId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedNotification(null);
  };

  const handleMarkAsRead = () => {
    if (selectedNotification) {
      // TODO: Implement mark as read functionality
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedNotification) {
      // TODO: Implement delete functionality
    }
    handleMenuClose();
  };

  const handleNotificationClick = (notification: any) => {
    // TODO: Mark as read
    switch (notification.type) {
      case 'idea_comment':
        navigate(`/ideas/${notification.idea_id}`);
        break;
      case 'message':
        navigate('/messages');
        break;
      case 'idea_like':
        navigate(`/ideas/${notification.idea_id}`);
        break;
      default:
        break;
    }
  };

  if (loading) {
    return <Loading message="Loading notifications..." />;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Notifications
          </Typography>
          <Button
            variant="outlined"
            startIcon={<NotificationsIcon />}
            onClick={() => {
              // TODO: Implement mark all as read
            }}
          >
            Mark All as Read
          </Button>
        </Box>

        <List>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    backgroundColor: notification.read ? 'transparent' : 'action.hover',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleNotificationClick(notification)}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      onClick={(e) => handleMenuClick(e, notification.id)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar src={notification.sender.profile_picture} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={notification.title}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {' — ' + new Date(notification.created_at).toLocaleString()}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))
          ) : (
            <ListItem>
              <ListItemText
                primary="No notifications"
                secondary="You're all caught up!"
              />
            </ListItem>
          )}
        </List>

        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMarkAsRead}>Mark as Read</MenuItem>
          <MenuItem onClick={handleDelete}>Delete</MenuItem>
        </Menu>
      </Box>
    </Container>
  );
};

export default Notifications; 