export interface LoginDto {
    username: string;
    password: string;
}

export interface AuthUser {
    id: number;
    username: string;
    email: string;
    role: string;
    activo: boolean;
    fecha_creacion?: string;
}

export interface LoginResponse {
    access_token: string;
    user: AuthUser;
}

export interface AuthState {
    user: AuthUser | null;
    token: string | null;
    isAuthenticated: boolean;
}