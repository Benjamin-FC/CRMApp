import axios from 'axios';

const API_BASE_URL = 'http://localhost/CRMUi/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    token: string;
    message: string;
}

export interface CustomerInfo {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    createdDate: string;
    status: string;
}

export const authService = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>('/auth/login', credentials);
        return response.data;
    },
};

export const customerService = {
    getCustomer: async (customerId: string): Promise<CustomerInfo> => {
        const response = await api.get<CustomerInfo>(`/customer/${customerId}`);
        return response.data;
    },
};

export default api;
