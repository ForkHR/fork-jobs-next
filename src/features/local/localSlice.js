import { createSlice } from "@reduxjs/toolkit";


const initialState = {
};


export const localSlice = createSlice({
    name: "local",
    initialState,
    reducers: {
    }, extraReducers: (builder) => {
    }
});

export const {
} = localSlice.actions;
export default localSlice.reducer;