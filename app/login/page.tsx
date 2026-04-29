'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
    const { login, isLoading, error, clearError, isAuthenticated } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();
        await login({ username, password });
    };

    if (!mounted) return null;

    return (
        <div className="login-root">
            <div className="login-bg">
                <div className="orb orb-1" />
                <div className="orb orb-2" />
                <div className="orb orb-3" />
                <div className="grid-overlay" />
            </div>

            <div className="login-card">
                <div className="card-header">
                    <div className="logo-mark">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                            <rect width="32" height="32" rx="8" fill="url(#grad)" />
                            <path d="M8 16L14 10L20 16L14 22L8 16Z" fill="white" fillOpacity="0.9" />
                            <path d="M14 16L20 10L26 16L20 22L14 16Z" fill="white" fillOpacity="0.5" />
                            <defs>
                                <linearGradient id="grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#6366f1" />
                                    <stop offset="1" stopColor="#8b5cf6" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <h1 className="card-title">Gestión de<span> Empleados</span></h1>
                    <p className="card-subtitle">Inicia sesión para continuar</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {error && (
                        <div className="error-banner" role="alert">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <circle cx="8" cy="8" r="7" stroke="#f87171" strokeWidth="1.5" />
                                <path d="M8 5v3.5M8 11h.01" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <div className="field-group">
                        <label className="field-label" htmlFor="username">
                            Usuario
                        </label>
                        <div className="field-wrapper">
                            <svg className="field-icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <circle cx="9" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M2 15.5c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Tu nombre de usuario"
                                className="field-input"
                                required
                                autoComplete="username"
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="field-group">
                        <label className="field-label" htmlFor="password">
                            Contraseña
                        </label>
                        <div className="field-wrapper">
                            <svg className="field-icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <rect x="3" y="8" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M6 8V5.5a3 3 0 016 0V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                <circle cx="9" cy="12" r="1.5" fill="currentColor" />
                            </svg>
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Tu contraseña"
                                className="field-input"
                                required
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                            >
                                {showPassword ? (
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                        <path d="M2 9s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.5" />
                                        <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                                        <path d="M3 3l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                ) : (
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                        <path d="M2 9s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.5" />
                                        <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`submit-btn ${isLoading ? 'loading' : ''}`}
                        disabled={isLoading || !username || !password}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner" />
                                Verificando...
                            </>
                        ) : (
                            <>
                                Iniciar sesión
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <path d="M4 9h10M10 5l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </>
                        )}
                    </button>
                </form>

                <div className="card-footer">
                    <span className="footer-badge">Sistema de Gestión de Empleados</span>
                </div>
            </div>

            <style jsx>{`
    .login-root {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #eef4f1 0%, #f7faf8 45%, #edf5f2 100%);
        background-attachment: fixed;
        font-family: 'DM Sans', 'Segoe UI', sans-serif;
        position: relative;
        overflow: hidden;
    }

    .login-bg {
        position: fixed;
        inset: 0;
        pointer-events: none;
    }

    .orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(80px);
        opacity: 0.18;
    }

    .orb-1 {
        width: 500px;
        height: 500px;
        background: radial-gradient(circle, #0b6b57, transparent 70%);
        top: -150px;
        left: -100px;
        animation: drift1 12s ease-in-out infinite;
    }

    .orb-2 {
        width: 400px;
        height: 400px;
        background: radial-gradient(circle, #0f8a6b, transparent 70%);
        bottom: -100px;
        right: -80px;
        animation: drift2 15s ease-in-out infinite;
    }

    .orb-3 {
        width: 300px;
        height: 300px;
        background: radial-gradient(circle, #18a17d, transparent 70%);
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        animation: drift3 10s ease-in-out infinite;
    }

    .grid-overlay {
        position: absolute;
        inset: 0;
        background-image:
            linear-gradient(rgba(11,107,87,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(11,107,87,0.05) 1px, transparent 1px);
        background-size: 48px 48px;
    }

    @keyframes drift1 {
        0%,100% { transform: translate(0,0); }
        50% { transform: translate(40px, 30px); }
    }

    @keyframes drift2 {
        0%,100% { transform: translate(0,0); }
        50% { transform: translate(-30px, -40px); }
    }

    @keyframes drift3 {
        0%,100% { transform: translate(-50%,-50%) scale(1); }
        50% { transform: translate(-50%,-50%) scale(1.2); }
    }

    .login-card {
        position: relative;
        width: 100%;
        max-width: 420px;
        margin: 1.5rem;
        background: rgba(255, 255, 255, 0.92);
        border: 1px solid rgba(11,107,87,0.12);
        border-radius: 20px;
        padding: 2.5rem;
        backdrop-filter: blur(20px);
        box-shadow:
            0 0 0 1px rgba(255,255,255,0.5),
            0 24px 48px rgba(0,0,0,0.08),
            0 0 60px rgba(11,107,87,0.08);
        animation: cardIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    }

    @keyframes cardIn {
        from {
            opacity: 0;
            transform: translateY(24px) scale(0.97);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    .card-header {
        text-align: center;
        margin-bottom: 2rem;
    }

    .logo-mark {
        display: inline-flex;
        margin-bottom: 1rem;
        filter: drop-shadow(0 0 14px rgba(11,107,87,0.25));
    }

    .card-title {
        font-size: 1.75rem;
        font-weight: 700;
        color: #063b30;
        letter-spacing: -0.03em;
        margin: 0 0 0.375rem;
    }

    .card-title span {
        color: #0f8a6b;
    }

    .card-subtitle {
        font-size: 0.875rem;
        color: #5f7a73;
        margin: 0;
    }

    .login-form {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
    }

    .error-banner {
        display: flex;
        align-items: center;
        gap: 0.625rem;
        background: rgba(239, 68, 68, 0.08);
        border: 1px solid rgba(239,68,68,0.18);
        color: #dc2626;
        font-size: 0.8125rem;
        padding: 0.75rem 1rem;
        border-radius: 10px;
        animation: slideDown 0.25s ease;
    }

    @keyframes slideDown {
        from {
            opacity:0;
            transform:translateY(-6px);
        }
        to {
            opacity:1;
            transform:translateY(0);
        }
    }

    .field-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .field-label {
        font-size: 0.8125rem;
        font-weight: 500;
        color: #245548;
        letter-spacing: 0.01em;
    }

    .field-wrapper {
        position: relative;
        display: flex;
        align-items: center;
    }

    .field-icon {
        position: absolute;
        left: 0.875rem;
        color: #5b7b72;
        pointer-events: none;
        transition: color 0.2s;
    }

    .field-input {
        width: 100%;
        background: #ffffff;
        border: 1px solid rgba(11,107,87,0.18);
        border-radius: 10px;
        padding: 0.75rem 1rem 0.75rem 2.75rem;
        font-size: 0.9375rem;
        color: #12362d;
        outline: none;
        transition:
            border-color 0.2s,
            box-shadow 0.2s,
            background 0.2s;
        font-family: inherit;
    }

    .field-input::placeholder {
        color: #8ca39d;
    }

    .field-input:focus {
        border-color: rgba(11,107,87,0.55);
        background: #ffffff;
        box-shadow:
            0 0 0 3px rgba(11,107,87,0.10),
            0 0 20px rgba(11,107,87,0.05);
    }

    .field-input:focus ~ .field-icon,
    .field-wrapper:focus-within .field-icon {
        color: #0b6b57;
    }

    .toggle-password {
        position: absolute;
        right: 0.875rem;
        background: none;
        border: none;
        color: #5b7b72;
        cursor: pointer;
        padding: 0;
        display: flex;
        align-items: center;
        transition: color 0.2s;
    }

    .toggle-password:hover {
        color: #0b6b57;
    }

    .submit-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        width: 100%;
        padding: 0.875rem;
        background: linear-gradient(135deg, #0b6b57, #0f8a6b);
        border: none;
        border-radius: 10px;
        color: white;
        font-size: 0.9375rem;
        font-weight: 600;
        cursor: pointer;
        transition:
            opacity 0.2s,
            transform 0.15s,
            box-shadow 0.2s;
        font-family: inherit;
        margin-top: 0.25rem;
        box-shadow: 0 4px 20px rgba(11,107,87,0.22);
        letter-spacing: 0.01em;
    }

    .submit-btn:hover:not(:disabled) {
        opacity: 0.95;
        transform: translateY(-1px);
        box-shadow: 0 8px 28px rgba(11,107,87,0.28);
    }

    .submit-btn:active:not(:disabled) {
        transform: translateY(0);
    }

    .submit-btn:disabled {
        opacity: 0.78;
    cursor: not-allowed;
    filter: grayscale(0.08);
    }

    .submit-btn.loading {
        cursor: wait;
    }

    .spinner {
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255,255,255,0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.7s linear infinite;
        flex-shrink: 0;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    .card-footer {
        margin-top: 1.75rem;
        text-align: center;
    }

    .footer-badge {
        display: inline-block;
        font-size: 0.75rem;
        color: #245548;
        background: rgba(11,107,87,0.08);
        border: 1px solid rgba(11,107,87,0.12);
        padding: 0.3125rem 0.75rem;
        border-radius: 999px;
        letter-spacing: 0.02em;
    }
`}</style>

        </div>
    );
}