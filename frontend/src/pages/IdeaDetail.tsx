import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Button,
  Chip,
  Divider,
  TextField,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
} from '@mui/material';
import {
  ThumbUp as ThumbUpIcon,
  Comment as CommentIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import Loading from '../components/Loading';

const IdeaDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentIdea, loading } = useSelector((state: RootState) => state.ideas);
  const { user } = useSelector((state: RootState) => state.auth);
  const [comment, setComment] = useState('');

  useEffect(() => {
    // TODO: Fetch idea details from API
  }, [dispatch, id]);

  const handleLike = () => {
    // TODO: Implement like functionality
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement comment functionality
    setComment('');
  };

  const handleShare = () => {
    // TODO: Implement share functionality
  };

  const handleBookmark = () => {
    // TODO: Implement bookmark functionality
  };

  if (loading || !currentIdea) {
    return <Loading message="Loading idea details..." />;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                {currentIdea.title}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                {currentIdea.categories.map((category) => (
                  <Chip key={category} label={category} size="small" />
                ))}
              </Box>

              <Typography variant="body1" paragraph>
                {currentIdea.description}
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Button
                  variant="outlined"
                  startIcon={<ThumbUpIcon />}
                  onClick={handleLike}
                >
                  Like ({currentIdea.likes})
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CommentIcon />}
                >
                  Comment ({currentIdea.comments.length})
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ShareIcon />}
                  onClick={handleShare}
                >
                  Share
                </Button>
                <IconButton onClick={handleBookmark}>
                  <BookmarkIcon />
                </IconButton>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Comments Section */}
              <Typography variant="h6" gutterBottom>
                Comments
              </Typography>

              <Box component="form" onSubmit={handleComment} sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Write a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button type="submit" variant="contained">
                  Post Comment
                </Button>
              </Box>

              <List>
                {currentIdea.comments.map((comment) => (
                  <ListItem key={comment.id} alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar src={comment.user.profile_picture} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={comment.user.first_name + ' ' + comment.user.last_name}
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {comment.content}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {' — ' + new Date(comment.created_at).toLocaleDateString()}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                About the Creator
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  src={currentIdea.creator.profile_picture}
                  sx={{ width: 64, height: 64, mr: 2 }}
                />
                <Box>
                  <Typography variant="subtitle1">
                    {currentIdea.creator.first_name} {currentIdea.creator.last_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {currentIdea.creator.role}
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate(`/profile/${currentIdea.creator.id}`)}
              >
                View Profile
              </Button>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Similar Ideas
              </Typography>
              <List>
                {currentIdea.similar_ideas.map((idea) => (
                  <ListItem
                    key={idea.id}
                    button
                    onClick={() => navigate(`/ideas/${idea.id}`)}
                  >
                    <ListItemText
                      primary={idea.title}
                      secondary={idea.description.substring(0, 100) + '...'}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default IdeaDetail; 