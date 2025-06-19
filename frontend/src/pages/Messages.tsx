import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  IconButton,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import Loading from '../components/Loading';

const Messages: React.FC = () => {
  const dispatch = useDispatch();
  const { conversations, currentConversation, loading } = useSelector(
    (state: RootState) => state.messages
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const [message, setMessage] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Fetch conversations from API
  }, [dispatch]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedConversation) return;

    // TODO: Implement send message functionality
    setMessage('');
  };

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
    // TODO: Fetch conversation messages
  };

  if (loading) {
    return <Loading message="Loading messages..." />;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Messages
        </Typography>

        <Grid container spacing={3}>
          {/* Conversations List */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ height: 'calc(100vh - 200px)', overflow: 'auto' }}>
              <List>
                {conversations.map((conversation) => (
                  <React.Fragment key={conversation.id}>
                    <ListItem
                      button
                      selected={selectedConversation === conversation.id}
                      onClick={() => handleSelectConversation(conversation.id)}
                    >
                      <ListItemAvatar>
                        <Avatar src={conversation.participant.profile_picture} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${conversation.participant.first_name} ${conversation.participant.last_name}`}
                        secondary={conversation.last_message?.content || 'No messages yet'}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Messages Area */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
              {selectedConversation ? (
                <>
                  {/* Messages List */}
                  <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                    {currentConversation?.messages.map((msg) => (
                      <Box
                        key={msg.id}
                        sx={{
                          display: 'flex',
                          justifyContent: msg.sender_id === user?.id ? 'flex-end' : 'flex-start',
                          mb: 2,
                        }}
                      >
                        <Paper
                          sx={{
                            p: 2,
                            maxWidth: '70%',
                            backgroundColor: msg.sender_id === user?.id ? 'primary.light' : 'grey.100',
                            color: msg.sender_id === user?.id ? 'white' : 'text.primary',
                          }}
                        >
                          <Typography variant="body1">{msg.content}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(msg.created_at).toLocaleTimeString()}
                          </Typography>
                        </Paper>
                      </Box>
                    ))}
                  </Box>

                  {/* Message Input */}
                  <Box
                    component="form"
                    onSubmit={handleSendMessage}
                    sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs>
                        <TextField
                          fullWidth
                          placeholder="Type a message..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                        />
                      </Grid>
                      <Grid item>
                        <IconButton
                          color="primary"
                          type="submit"
                          disabled={!message.trim()}
                        >
                          <SendIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Box>
                </>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    Select a conversation to start messaging
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Messages; 