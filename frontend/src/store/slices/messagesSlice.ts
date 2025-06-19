import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
}

interface Participant {
  id: string;
  first_name: string;
  last_name: string;
  profile_picture?: string;
}

interface Conversation {
  id: string;
  participant: Participant;
  last_message?: Message;
  unread_count: number;
}

interface MessagesState {
  conversations: Conversation[];
  currentConversation: {
    id: string;
    participant: Participant;
    messages: Message[];
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: MessagesState = {
  conversations: [],
  currentConversation: null,
  loading: false,
  error: null,
};

export const fetchConversations = createAsyncThunk(
  'messages/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/conversations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch conversations');
    }
  }
);

export const fetchConversationMessages = createAsyncThunk(
  'messages/fetchConversationMessages',
  async (conversationId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/conversations/${conversationId}/messages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch messages');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async (
    { conversationId, content }: { conversationId: string; content: string },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/conversations/${conversationId}/messages`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to send message');
    }
  }
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Conversations
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Conversation Messages
      .addCase(fetchConversationMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversationMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.currentConversation = action.payload;
      })
      .addCase(fetchConversationMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Send Message
      .addCase(sendMessage.fulfilled, (state, action) => {
        if (state.currentConversation) {
          state.currentConversation.messages.push(action.payload);
        }
        const conversation = state.conversations.find(
          (c) => c.id === action.payload.conversation_id
        );
        if (conversation) {
          conversation.last_message = action.payload;
        }
      });
  },
});

export const { clearError } = messagesSlice.actions;
export default messagesSlice.reducer; 