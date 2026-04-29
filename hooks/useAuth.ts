'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/services/Auth.service';
import { AuthUser, LoginDto } from '@/types/auth';

export function useAuth() {
    const router = useRouter();
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const savedUser = AuthService.getUser();
        if (savedUser) {
            setUser(savedUser);
        }
    }, []);

    const login = useCallback(async (credentials: LoginDto) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await AuthService.login(credentials);
            AuthService.saveSession(data.access_token, data.user);
            setUser(data.user);
            // Redirigir a la página principal de empleados
            router.push('/');
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Error al iniciar sesión';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    const logout = useCallback(() => {
        AuthService.clearSession();
        setUser(null);
        router.push('/login');
    }, [router]);

    return {
        user,
        isLoading,
        error,
        isAuthenticated: !!user,
        login,
        logout,
        clearError: () => setError(null),
    };
}