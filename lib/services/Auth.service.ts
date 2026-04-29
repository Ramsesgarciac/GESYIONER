import { LoginDto, LoginResponse } from '@/types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const AuthService = {
    async login(credentials: LoginDto): Promise<LoginResponse> {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || 'Credenciales inválidas');
        }

        return response.json();
    },

    saveSession(token: string, user: LoginResponse['user']): void {
        if (typeof window === 'undefined') return;
        // localStorage para uso en cliente
        localStorage.setItem('access_token', token);
        localStorage.setItem('user', JSON.stringify(user));
        // Cookie para que el middleware (servidor) pueda leerla
        document.cookie = `access_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    },

    clearSession(): void {
        if (typeof window === 'undefined') return;
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        // Borrar cookie
        document.cookie = 'access_token=; path=/; max-age=0; SameSite=Lax';
    },

    getToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('access_token');
    },

    getUser(): LoginResponse['user'] | null {
        if (typeof window === 'undefined') return null;
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated(): boolean {
        return !!this.getToken();
    },
};