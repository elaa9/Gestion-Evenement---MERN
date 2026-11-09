import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import eventsReducer from './eventsSlice';
import feedbackReducer from './feedbackSlice';
import adminReducer from './adminSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
    feedback: feedbackReducer,
    admin: adminReducer,
  },
});

export default store;
