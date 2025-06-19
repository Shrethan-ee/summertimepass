import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'entrepreneur' | 'investor' | 'public';
  bio?: string;
  profile_picture?: string;
  company_name?: string;
  investment_focus?: string;
  is_verified: boolean;
  verification_badge?: string;
  linkedin_url?: string;
  twitter_url?: string;
  website_url?: string;
  skills?: string[];
  expertise_areas?: string[];
  investment_history?: string[];
  startup_history?: string[];
  location?: string;
  industry_focus?: string[];
  investment_range?: {
    min: number;
    max: number;
  };
  portfolio_companies?: string[];
}

interface UserState {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    fetchUsersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchUsersSuccess: (state, action: PayloadAction<User[]>) => {
      state.loading = false;
      state.users = action.payload;
    },
    fetchUsersFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex((user) => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
      if (state.currentUser?.id === action.payload.id) {
        state.currentUser = action.payload;
      }
    },
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    },
    removeUser: (state, action: PayloadAction<number>) => {
      state.users = state.users.filter((user) => user.id !== action.payload);
      if (state.currentUser?.id === action.payload) {
        state.currentUser = null;
      }
    },
  },
});

export const {
  fetchUsersStart,
  fetchUsersSuccess,
  fetchUsersFailure,
  setCurrentUser,
  updateUser,
  addUser,
  removeUser,
} = userSlice.actions;

export default userSlice.reducer; 