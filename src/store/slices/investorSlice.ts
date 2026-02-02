import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Investor } from '../../types';
import { getInvestors, createInvestor } from '../../services/dataService';

interface InvestorState {
    items: Investor[];
    isLoading: boolean;
    error: string | null;
    pagination: {
        page: number;
        pages: number;
        total: number;
    }
}

const initialState: InvestorState = {
    items: [],
    isLoading: false,
    error: null,
    pagination: {
        page: 1,
        pages: 1,
        total: 0
    }
};

export const fetchInvestors = createAsyncThunk(
    'investors/fetchAll',
    async (params: { page?: number; limit?: number; isReferrer?: boolean } = {}, { rejectWithValue }) => {
        try {
            return await getInvestors(params.page, params.limit, params.isReferrer);
        } catch (error: unknown) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return rejectWithValue((error as any).response?.data?.message || 'Failed to fetch investors');
        }
    },
    {
        condition: (params, { getState }) => {
            const { investors } = getState() as { investors: InvestorState };
            console.log('Fetching investors with params:', params);
            if (investors.isLoading) return false;
        }
    }
);

// Assuming createInvestor signature
export const createNewInvestor = createAsyncThunk(
    'investors/create',
    async (investorData: Omit<Investor, '_id'>, { rejectWithValue }) => {
        try {
            return await createInvestor(investorData);
        } catch (error: unknown) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return rejectWithValue((error as any).response?.data?.message || 'Failed to create investor');
        }
    }
);

const investorSlice = createSlice({
    name: 'investors',
    initialState,
    reducers: {
        clearInvestorError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // Fetch Investors
        builder.addCase(fetchInvestors.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchInvestors.fulfilled, (state, action) => {
            state.isLoading = false;
            state.items = action.payload.items;
            state.pagination = {
                page: action.payload.page,
                pages: action.payload.pages,
                total: action.payload.total
            };
        });
        builder.addCase(fetchInvestors.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        // Create Investor
        builder.addCase(createNewInvestor.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(createNewInvestor.fulfilled, (state, action: PayloadAction<Investor>) => {
            state.isLoading = false;
            state.items.push(action.payload);
        });
        builder.addCase(createNewInvestor.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });
    },
});

export const { clearInvestorError } = investorSlice.actions;
export default investorSlice.reducer;
