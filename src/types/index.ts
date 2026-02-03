export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'super_admin' | 'branch_manager' | 'sales_rep' | 'investor' | 'referrer';
    phone?: string;
    address?: string;
    upline?: string | User;
    productStatus?: 'with_product' | 'without_product';
    branchId?: string | Branch;
    token?: string;
    profitRate?: number;
    commissionRate?: number;
}

export interface Branch {
    _id: string;
    name: string;
    city: string;
    state: string;
    address: string;
    manager?: string | User;
}

export interface Investor {
    _id: string;
    fullName: string; // Map from user.name in controller
    name?: string;
    email: string;
    phone: string;
    address: string;
    role: 'investor' | 'referrer';
    upline?: string | User;
    status?: 'active' | 'banned';
    productStatus?: 'with_product' | 'without_product';
    profitRate?: number;
    commissionRate?: number;
    createdAt?: string;
}

export interface Sale {
    _id: string;
    user: string | User;
    branchId: string | Branch;
    investorId?: string | Investor | User;
    referrerId?: string | Investor | User;
    customerName: string;
    description: string;
    amount: number;
    commission: number;
    date: string;
    createdAt: string;
    status: 'pending' | 'completed' | 'rejected';
    paymentMethod?: 'Cash in hand' | 'Bank account';
}

export interface AuthResponse {
    _id: string;
    name: string;
    email: string;
    role: string;
    token: string;
    branchId?: string | Branch;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    role?: string;
    branch?: string;
}

export interface CreateSaleDTO {
    branch: string;
    investor: string;
    referrer?: string;
    customerName: string;
    description: string;
    amount: number;
    commission: number;
    investorProfit: number;
    paymentMethod: 'Cash in hand' | 'Bank account';
}

export interface PaginatedResponse<T> {
    items: T[];
    page: number;
    pages: number;
    total: number;
}
