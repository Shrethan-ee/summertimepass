
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Group {
  id: number;
  name: string;
  description: string;
  category: string;
  privacy: string;
  image_url?: string;
  member_count: number;
  creator_id: number;
  rules?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  is_creator: boolean;
  is_member: boolean;
  user_role?: string;
}

interface GroupMember {
  id: number;
  user_id: number;
  group_id: number;
  role: string;
  status: string;
  joined_at: string;
  user: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    role: string;
    profile_picture?: string;
  };
}

interface GroupsState {
  groups: Group[];
  userGroups: Group[];
  currentGroup: Group | null;
  currentGroupMembers: GroupMember[];
  loading: boolean;
  error: string | null;
}

const initialState: GroupsState = {
  groups: [],
  userGroups: [],
  currentGroup: null,
  currentGroupMembers: [],
  loading: false,
  error: null,
};

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// Fetch all groups
export const fetchGroups = createAsyncThunk(
  'groups/fetchGroups',
  async (params: { category?: string; privacy?: string } = {}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      
      const queryParams = new URLSearchParams();
      if (params.category) queryParams.append('category', params.category);
      if (params.privacy) queryParams.append('privacy', params.privacy);
      
      const url = `${API_URL}/api/groups${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await axios.get(url, config);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch groups');
    }
  }
);

// Fetch user's groups
export const fetchUserGroups = createAsyncThunk(
  'groups/fetchUserGroups',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await axios.get(`${API_URL}/api/user/groups`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch user groups');
    }
  }
);

// Fetch specific group
export const fetchGroup = createAsyncThunk(
  'groups/fetchGroup',
  async (groupId: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      
      const response = await axios.get(`${API_URL}/api/groups/${groupId}`, config);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch group');
    }
  }
);

// Create group
export const createGroup = createAsyncThunk(
  'groups/createGroup',
  async (groupData: {
    name: string;
    description: string;
    category: string;
    privacy?: string;
    image_url?: string;
    rules?: string;
  }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await axios.post(`${API_URL}/api/groups`, groupData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to create group');
    }
  }
);

// Join group
export const joinGroup = createAsyncThunk(
  'groups/joinGroup',
  async (groupId: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await axios.post(`${API_URL}/api/groups/${groupId}/join`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { groupId, ...response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to join group');
    }
  }
);

// Leave group
export const leaveGroup = createAsyncThunk(
  'groups/leaveGroup',
  async (groupId: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await axios.delete(`${API_URL}/api/groups/${groupId}/leave`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { groupId, ...response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to leave group');
    }
  }
);

// Fetch group members
export const fetchGroupMembers = createAsyncThunk(
  'groups/fetchGroupMembers',
  async (groupId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/groups/${groupId}/members`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch group members');
    }
  }
);

const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentGroup: (state) => {
      state.currentGroup = null;
      state.currentGroupMembers = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Groups
      .addCase(fetchGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = action.payload;
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch User Groups
      .addCase(fetchUserGroups.fulfilled, (state, action) => {
        state.userGroups = action.payload;
      })
      // Fetch Group
      .addCase(fetchGroup.fulfilled, (state, action) => {
        state.currentGroup = action.payload;
      })
      // Create Group
      .addCase(createGroup.fulfilled, (state, action) => {
        state.groups.unshift(action.payload);
        state.userGroups.unshift(action.payload);
      })
      // Join Group
      .addCase(joinGroup.fulfilled, (state, action) => {
        const group = state.groups.find(g => g.id === action.payload.groupId);
        if (group) {
          group.is_member = true;
          group.member_count += 1;
        }
        if (state.currentGroup && state.currentGroup.id === action.payload.groupId) {
          state.currentGroup.is_member = true;
          state.currentGroup.member_count += 1;
        }
      })
      // Leave Group
      .addCase(leaveGroup.fulfilled, (state, action) => {
        const group = state.groups.find(g => g.id === action.payload.groupId);
        if (group) {
          group.is_member = false;
          group.member_count -= 1;
        }
        if (state.currentGroup && state.currentGroup.id === action.payload.groupId) {
          state.currentGroup.is_member = false;
          state.currentGroup.member_count -= 1;
        }
        state.userGroups = state.userGroups.filter(g => g.id !== action.payload.groupId);
      })
      // Fetch Group Members
      .addCase(fetchGroupMembers.fulfilled, (state, action) => {
        state.currentGroupMembers = action.payload;
      });
  },
});

export const { clearError, clearCurrentGroup } = groupsSlice.actions;
export default groupsSlice.reducer;
