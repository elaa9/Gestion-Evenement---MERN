import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adminService from '../services/adminService';

// ── Initial State ─────────────────────────────────────────────────────────────
const initialState = {
  stats: null,
  loading: false,
  error: null,
};

// ── Thunks ────────────────────────────────────────────────────────────────────
export const fetchAdminStats = createAsyncThunk(
  'admin/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const res = await adminService.getStats();
      if (res.success) return res.data;
      return rejectWithValue('Failed to load admin stats');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load admin stats');
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────────────────────
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
