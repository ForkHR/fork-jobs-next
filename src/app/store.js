import { configureStore } from '@reduxjs/toolkit';
import localReducer from '../features/local/localSlice';
import jobBoardReducer from '../features/jobBoard/jobBoardSlice';



export const store = configureStore({
    reducer: {
        local: localReducer,
        jobBoard: jobBoardReducer,
    },
    devTools: process.env.NEXT_PUBLIC_REDUX_DEV_TOOLS === 'true' ? true : process.env.NODE_ENV !== 'production',
});