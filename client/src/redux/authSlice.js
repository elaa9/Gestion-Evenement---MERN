import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../services/authService';

// ── Helpers ───────────────────────────────────────────────────────────────────
const saveToStorage = (userData) => {
  localStorage.setItem('eventhub_token', userData.token);
  localStorage.setItem('eventhub_user', JSON.stringify(userData));
};

const clearStorage = () => {
  localStorage.removeItem('eventhub_token');
  localStorage.removeItem('eventhub_user');
};

const loadUserFromStorage = () => {
  try {
    const saved = localStorage.getItem('eventhub_user');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

// ── Initial State ─────────────────────────────────────────────────────────────
const initialState = {
  user: loadUserFromStorage(),
  token: localStorage.getItem('eventhub_token') || null,
  loading: false,
  error: null,
};

// ── Thunks ────────────────────────────────────────────────────────────────────
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await authService.login({ email, password });
      if (res.success && res.data) {
        saveToStorage(res.data);
        return res.data;
      }
      return rejectWithValue('Login failed');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const res = await authService.register(userData);
      if (res.success && res.data) {
        saveToStorage(res.data);
        return res.data;
      }
      return rejectWithValue('Registration failed');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

export const fetchMe = createAsyncThunk(
  'auth/fetchMe',
  async (_, { rejectWithValue }) => {
    try {
      const res = await authService.getMe();
      if (res.success && res.data) {
        // Update stored user (token stays the same)
        const token = localStorage.getItem('eventhub_token');
        saveToStorage({ ...res.data, token });
        return { ...res.data, token };
      }
      return rejectWithValue('Session expired');
    } catch (err) {
      clearStorage();
      return rejectWithValue(err.response?.data?.message || 'Session expired');
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      clearStorage();
    },
    updateLocalUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      saveToStorage(state.user);
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Me (session verify)
    builder
      .addCase(fetchMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { logoutUser, updateLocalUser, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
