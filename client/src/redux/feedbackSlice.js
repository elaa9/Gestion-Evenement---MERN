import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import feedbackService from '../services/feedbackService';
import { fetchEventById } from './eventsSlice';

// ── Initial State ─────────────────────────────────────────────────────────────
const initialState = {
  loading: false,
  error: null,
  success: false,
  isUpdate: false,
};

// ── Thunks ────────────────────────────────────────────────────────────────────
export const submitFeedback = createAsyncThunk(
  'feedback/submit',
  async ({ eventId, data }, { dispatch, rejectWithValue }) => {
    try {
      const res = await feedbackService.create(eventId, data);
      if (res.success) {
        // Refresh event data to get updated feedbacks + averageRating
        dispatch(fetchEventById(eventId));
        return { data: res.data, isUpdate: res.isUpdate || false };
      }
      return rejectWithValue('Failed to submit feedback');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to submit feedback');
    }
  }
);

export const removeFeedback = createAsyncThunk(
  'feedback/remove',
  async (feedbackId, { rejectWithValue }) => {
    try {
      await feedbackService.delete(feedbackId);
      return feedbackId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to remove feedback');
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────────────────────
const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {
    clearFeedbackSuccess: (state) => {
      state.success = false;
      state.isUpdate = false;
    },
    clearFeedbackError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // submitFeedback
    builder
      .addCase(submitFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(submitFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.isUpdate = action.payload.isUpdate;
      })
      .addCase(submitFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // removeFeedback
    builder
      .addCase(removeFeedback.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFeedback.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(removeFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearFeedbackSuccess, clearFeedbackError } = feedbackSlice.actions;
export default feedbackSlice.reducer;
