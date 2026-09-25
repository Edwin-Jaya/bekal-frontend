export interface LoginRequest{
    email:string;
    password:string;
}

export interface RegisterRequest {
    email: string;
    password?: string;
    fullName?: string;
    role?: string;
    branchId?: string;
    [key: string]: any;
}

export interface AuthData{
    token:string;
    type:string;
}

export interface ApiResponse<T>{
    timestamp: string;
    status: number;
    success: boolean;
    message: string;
    data: T;
}