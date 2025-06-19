import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Idea {
  id: number;
  title: string;
  description: string;
  category: string;
  tags: string[];
  user: {
    id: number;
    username: string;
  };
  public_likes_count: number;
  investor_likes_count: number;
  comments_count: number;
  created_at: string;
  funding_status: 'idea' | 'prototype' | 'mvp' | 'revenue' | 'scaling';
  funding_required?: number;
  funding_raised?: number;
  market_size?: number;
  team_size: number;
  team_roles?: string[];
  milestones?: string[];
  attachments?: string[];
  progress_updates?: string[];
  collaboration_requests?: string[];
  views_count: number;
  bookmarks_count: number;
  shares_count: number;
  status: 'draft' | 'published' | 'archived';
  visibility: 'public' | 'private' | 'connections';
}

interface IdeaState {
  ideas: Idea[];
  currentIdea: Idea | null;
  loading: boolean;
  error: string | null;
  filters: {
    category: string | null;
    status: string | null;
    funding_status: string | null;
    sort_by: string;
  };
}

const initialState: IdeaState = {
  ideas: [],
  currentIdea: null,
  loading: false,
  error: null,
  filters: {
    category: null,
    status: null,
    funding_status: null,
    sort_by: 'created_at',
  },
};

const ideaSlice = createSlice({
  name: 'ideas',
  initialState,
  reducers: {
    fetchIdeasStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchIdeasSuccess: (state, action: PayloadAction<Idea[]>) => {
      state.loading = false;
      state.ideas = action.payload;
    },
    fetchIdeasFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentIdea: (state, action: PayloadAction<Idea>) => {
      state.currentIdea = action.payload;
    },
    updateIdea: (state, action: PayloadAction<Idea>) => {
      const index = state.ideas.findIndex((idea) => idea.id === action.payload.id);
      if (index !== -1) {
        state.ideas[index] = action.payload;
      }
      if (state.currentIdea?.id === action.payload.id) {
        state.currentIdea = action.payload;
      }
    },
    setFilters: (state, action: PayloadAction<Partial<IdeaState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    likeIdea: (state, action: PayloadAction<{ ideaId: number; likeType: 'public' | 'investor' }>) => {
      const idea = state.ideas.find((i) => i.id === action.payload.ideaId);
      if (idea) {
        if (action.payload.likeType === 'public') {
          idea.public_likes_count += 1;
        } else {
          idea.investor_likes_count += 1;
        }
      }
    },
    addComment: (state, action: PayloadAction<{ ideaId: number }>) => {
      const idea = state.ideas.find((i) => i.id === action.payload.ideaId);
      if (idea) {
        idea.comments_count += 1;
      }
    },
  },
});

export const {
  fetchIdeasStart,
  fetchIdeasSuccess,
  fetchIdeasFailure,
  setCurrentIdea,
  updateIdea,
  setFilters,
  likeIdea,
  addComment,
} = ideaSlice.actions;

export default ideaSlice.reducer; 