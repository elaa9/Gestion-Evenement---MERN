import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import eventService from '../services/eventService';

// ── Initial State ─────────────────────────────────────────────────────────────
const initialState = {
  events: [],
  currentEvent: null,
  myEvents: [],
  loading: false,
  error: null,
  success: false,
};

// ── Thunks ────────────────────────────────────────────────────────────────────
export const fetchEvents = createAsyncThunk(
  'events/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await eventService.getAll(params);
      if (res.success) return res.data;
      return rejectWithValue('Failed to fetch events');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch events');
    }
  }
);

export const fetchEventById = createAsyncThunk(
  'events/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await eventService.getById(id);
      if (res.success) return res.data;
      return rejectWithValue('Event not found');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Event not found');
    }
  }
);

export const fetchMyEvents = createAsyncThunk(
  'events/fetchMine',
  async (_, { rejectWithValue }) => {
    try {
      const res = await eventService.getMyEvents();
      if (res.success) return res.data;
      return rejectWithValue('Failed to fetch your events');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch your events');
    }
  }
);

export const createEvent = createAsyncThunk(
  'events/create',
  async (eventData, { rejectWithValue }) => {
    try {
      const res = await eventService.create(eventData);
      if (res.success) return res.data;
      return rejectWithValue('Failed to create event');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create event');
    }
  }
);

export const updateEvent = createAsyncThunk(
  'events/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await eventService.update(id, data);
      if (res.success) return res.data;
      return rejectWithValue('Failed to update event');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update event');
    }
  }
);

export const deleteEvent = createAsyncThunk(
  'events/delete',
  async (id, { rejectWithValue }) => {
    try {
      await eventService.delete(id);
      return id; // return the deleted id so we can remove from list
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete event');
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────────────────────
const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    clearCurrentEvent: (state) => {
      state.currentEvent = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    clearEventsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchEvents
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // fetchEventById
    builder
      .addCase(fetchEventById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEvent = action.payload;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // fetchMyEvents
    builder
      .addCase(fetchMyEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.myEvents = action.payload;
      })
      .addCase(fetchMyEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // createEvent
    builder
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.currentEvent = action.payload;
        state.events.unshift(action.payload);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });

    // updateEvent
    builder
      .addCase(updateEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.currentEvent = action.payload;
        state.events = state.events.map((ev) =>
          ev._id === action.payload._id ? action.payload : ev
        );
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });

    // deleteEvent
    builder
      .addCase(deleteEvent.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events = state.events.filter((ev) => ev._id !== action.payload);
        state.myEvents = state.myEvents.filter((ev) => ev._id !== action.payload);
        if (state.currentEvent?._id === action.payload) {
          state.currentEvent = null;
        }
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentEvent, clearSuccess, clearEventsError } = eventsSlice.actions;
export default eventsSlice.reducer;
