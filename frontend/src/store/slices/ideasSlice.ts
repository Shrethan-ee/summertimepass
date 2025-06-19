import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    profile_picture?: string;
  };
}

interface Idea {
  id: string;
  title: string;
  description: string;
  categories: string[];
  creator: {
    id: string;
    first_name: string;
    last_name: string;
    profile_picture?: string;
    role: string;
  };
  likes: number;
  comments: Comment[];
  created_at: string;
  updated_at: string;
  similar_ideas: Idea[];
}

interface IdeasState {
  ideas: Idea[];
  currentIdea: Idea | null;
  loading: boolean;
  error: string | null;
}

const initialState: IdeasState = {
  ideas: [],
  currentIdea: null,
  loading: false,
  error: null,
};

export const fetchIdeas = createAsyncThunk(
  'ideas/fetchIdeas',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/ideas`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch ideas');
    }
  }
);

export const fetchIdeaById = createAsyncThunk(
  'ideas/fetchIdeaById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/ideas/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch idea');
    }
  }
);

export const createIdea = createAsyncThunk(
  'ideas/createIdea',
  async (ideaData: {
    title: string;
    description: string;
    categories: string[];
  }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/ideas`,
        ideaData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to create idea');
    }
  }
);

export const likeIdea = createAsyncThunk(
  'ideas/likeIdea',
  async (ideaId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/ideas/${ideaId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to like idea');
    }
  }
);

export const addComment = createAsyncThunk(
  'ideas/addComment',
  async (
    { ideaId, content }: { ideaId: string; content: string },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/ideas/${ideaId}/comments`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to add comment');
    }
  }
);

const ideasSlice = createSlice({
  name: 'ideas',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Ideas
      .addCase(fetchIdeas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIdeas.fulfilled, (state, action) => {
        state.loading = false;
        state.ideas = action.payload;
      })
      .addCase(fetchIdeas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Idea by ID
      .addCase(fetchIdeaById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIdeaById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentIdea = action.payload;
      })
      .addCase(fetchIdeaById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Idea
      .addCase(createIdea.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createIdea.fulfilled, (state, action) => {
        state.loading = false;
        state.ideas.unshift(action.payload);
      })
      .addCase(createIdea.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Like Idea
      .addCase(likeIdea.fulfilled, (state, action) => {
        if (state.currentIdea && state.currentIdea.id === action.payload.id) {
          state.currentIdea.likes = action.payload.likes;
        }
        const idea = state.ideas.find((i) => i.id === action.payload.id);
        if (idea) {
          idea.likes = action.payload.likes;
        }
      })
      // Add Comment
      .addCase(addComment.fulfilled, (state, action) => {
        if (state.currentIdea && state.currentIdea.id === action.payload.idea_id) {
          state.currentIdea.comments.push(action.payload);
        }
      });
  },
});

export const { clearError } = ideasSlice.actions;
export default ideasSlice.reducer; 