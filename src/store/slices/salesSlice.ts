import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Sale, CreateSaleDTO } from '../../types';
import { getSales, createSale } from '../../services/dataService';

interface SalesState {
    items: Sale[];
    pagination: {
        page: number;
        pages: number;
        total: number;
    };
    isLoading: boolean;
    error: string | null;
}

const initialState: SalesState = {
    items: [],
    pagination: {
        page: 1,
        pages: 1,
        total: 0
    },
    isLoading: false,
    error: null,
};

export const fetchSales = createAsyncThunk(
    'sales/fetchAll',
    async ({ page = 1, limit = 10, startDate, endDate }: { 
        page?: number; 
        limit?: number;
        startDate?: string;
        endDate?: string;
    } = {}, { rejectWithValue }) => {
        try {
            return await getSales(page, limit, { startDate, endDate });
        } catch (error: unknown) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return rejectWithValue((error as any).response?.data?.message || 'Failed to fetch sales');
        }
    },
    {
        condition: ({ page = 1 }, { getState }) => {
            const { sales } = getState() as { sales: SalesState };
            if (sales.isLoading) return false;
            // Allow fetching if it's a different page or if items are empty
            if (sales.items.length > 0 && sales.pagination.page === page) {
                // Return true if we want to force refresh, but usually false for optimization
                // For simplicity, let's just do isLoading check for now as requested
                // return false; 
            }
        }
    }
);

export const createNewSale = createAsyncThunk(
    'sales/create',
    async (saleData: CreateSaleDTO, { rejectWithValue }) => {
        try {
            return await createSale(saleData);
        } catch (error: unknown) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return rejectWithValue((error as any).response?.data?.message || 'Failed to create sale');
        }
    }
);

const salesSlice = createSlice({
    name: 'sales',
    initialState,
    reducers: {
        clearSalesError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // Fetch Sales
        builder.addCase(fetchSales.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchSales.fulfilled, (state, action) => {
            state.isLoading = false;
            state.items = action.payload.items;
            state.pagination = {
                page: action.payload.page,
                pages: action.payload.pages,
                total: action.payload.total
            };
        });
        builder.addCase(fetchSales.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        // Create Sale
        builder.addCase(createNewSale.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(createNewSale.fulfilled, (state, action: PayloadAction<Sale>) => {
            state.isLoading = false;
            state.items.unshift(action.payload); // Add new sale to the beginning
        });
        builder.addCase(createNewSale.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });
    },
});

export const { clearSalesError } = salesSlice.actions;
export default salesSlice.reducer;
