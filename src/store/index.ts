import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import salesReducer from './slices/salesSlice';
import branchReducer from './slices/branchSlice';
import investorReducer from './slices/investorSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        sales: salesReducer,
        branches: branchReducer,
        investors: investorReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
