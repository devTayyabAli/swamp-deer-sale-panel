import api from '../lib/axios';
import type { Branch, Investor, Sale, CreateSaleDTO, User, PaginatedResponse } from '../types';

export const getBranches = async (limit?: number): Promise<Branch[]> => {
    let url = '/branches';
    if (limit !== undefined) url += `?limit=${limit}`;
    const response = await api.get<Branch[]>(url);
    return response.data;
};

export const createBranch = async (branchData: Omit<Branch, '_id'>): Promise<Branch> => {
    const response = await api.post<Branch>('/branches', branchData);
    return response.data;
};

export const getInvestors = async (page?: number, limit?: number, isReferrer?: boolean): Promise<PaginatedResponse<Investor>> => {
    let url = `/investors?page=${page || 1}&limit=${limit || 10}`;
    if (isReferrer !== undefined) url += `&isReferrer=${isReferrer}`;
    
    if (limit === -1) {
        // Special case for fetching all for dropdowns
        const response = await api.get<{ items: Investor[] }>(`/investors?limit=-1${isReferrer !== undefined ? `&isReferrer=${isReferrer}` : ''}`);
        return {
            items: response.data.items,
            page: 1,
            pages: 1,
            total: response.data.items.length
        };
    }
    
    const response = await api.get<PaginatedResponse<Investor>>(url);
    return response.data;
};

export const createInvestor = async (investorData: Omit<Investor, '_id'>): Promise<Investor> => {
    const response = await api.post<Investor>('/investors', investorData);
    return response.data;
};

export const getSales = async (page = 1, limit = 10, filters: { startDate?: string, endDate?: string } = {}): Promise<PaginatedResponse<Sale>> => {
    let url = `/sales?page=${page}&limit=${limit}`;
    if (filters.startDate) url += `&startDate=${filters.startDate}`;
    if (filters.endDate) url += `&endDate=${filters.endDate}`;
    
    const response = await api.get<PaginatedResponse<Sale>>(url);
    return response.data;
};

export const createSale = async (saleData: CreateSaleDTO): Promise<Sale> => {
    const response = await api.post<Sale>('/sales', saleData);
    return response.data;
};

// Services for Users
export const getUsers = async (): Promise<User[]> => {
    // Determine the endpoint base. Assuming authRoutes is mounted at /api/auth
    // The previous edit added generic getUsers to authController.
    // The previous edit mounted it at router.get('/users', ...) in authRoutes.
    // So the full path is /api/auth/users
    const response = await api.get<User[]>('/auth/users');
    return response.data;
};
