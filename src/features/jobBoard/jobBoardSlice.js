import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import jobBoardService from "./jobBoardService";
import { toast } from 'react-toastify';


const initialState = {
    company: null,
    listings: [],
    loadingId: '',
    msg: "",
    isLoading: false,
    loadingId: '',
};


export const getCompanyJobs = createAsyncThunk(
    "jobBoard/getCompanyJobs",
    async (id, thunkAPI) => {
        try {
            return await jobBoardService.getCompanyJobs(id);
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.msg) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);


export const applyToListing = createAsyncThunk(
    "jobBoard/applyToListing",
    async (payload, thunkAPI) => {
        try {
            return await jobBoardService.applyToListing(payload);
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.msg) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);


export const respondToInterview = createAsyncThunk(
    "jobBoard/respondToInterview",
    async (payload, thunkAPI) => {
        try {
            return await jobBoardService.respondToInterview(payload);
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.msg) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);



export const jobBoardSlice = createSlice({
    name: "jobBoard",
    initialState,
    reducers: {
        resetJobBoard: (state) => {
            state = initialState;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getCompanyJobs.pending, (state) => {
            state.isLoading = true;
            state.msg = '';
            state.company = null;
            state.listings = [];
            state.listingById = null;
        });
        builder.addCase(getCompanyJobs.fulfilled, (state, action) => {
            state.isLoading = false;
            state.company = action.payload.data.company;
            state.listings = action.payload.data.listings;
        });
        builder.addCase(getCompanyJobs.rejected, (state, action) => {
            state.isLoading = false;
            state.msg = action.payload;
        });

        builder.addCase(applyToListing.pending, (state, action) => {
            state.loadingId = "apply";
            state.msg = '';
        })
        builder.addCase(applyToListing.fulfilled, (state, action) => {
            state.loadingId = '';
            state.msg = 'ok';
            // toast.success(`Application submitted`, { toastId: 'toastSuccess', closeButton: true});
        })
        builder.addCase(applyToListing.rejected, (state, action) => {
            state.loadingId = '';
            state.msg = action.payload;
            toast.error(state.msg, { toastId: 'toastDanger', closeButton: true});
        });

        builder.addCase(respondToInterview.pending, (state, action) => {
            state.loadingId = "respond-interview";
            state.msg = '';
        })
        builder.addCase(respondToInterview.fulfilled, (state, action) => {
            state.loadingId = '';
            state.msg = 'interview-responded';
        })
        builder.addCase(respondToInterview.rejected, (state, action) => {
            state.loadingId = '';
            state.msg = action.payload;
            toast.error(state.msg, { toastId: 'toastDanger', closeButton: true});
        });
    },
});


export const { resetJobBoard } = jobBoardSlice.actions;

export default jobBoardSlice.reducer;