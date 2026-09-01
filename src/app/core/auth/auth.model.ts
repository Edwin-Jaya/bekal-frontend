export interface LoginRequest{
    email:string;
    password:string;
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