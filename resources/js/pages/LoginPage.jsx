import React, { useState } from 'react';

export default function LoginPage({ onLogin, onNavigate }) {
    const [mode, setMode] = useState('login'); // 'login' | 'register'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setName('');
        setConfirmPassword('');
        setError('');
        setSuccess('');
    };

    const switchMode = (newMode) => {
        resetForm();
        setMode(newMode);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        if (!email) { setError('Email tidak boleh kosong.'); return; }
        if (!password) { setError('Password tidak boleh kosong.'); return; }

        setLoading(true);
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || 'Email atau password salah.');
                setLoading(false);
                return;
            }
            localStorage.setItem('safewalk_token', data.token);
            onLogin(data.user);
        } catch (err) {
            // Fallback: demo login if API is not yet running
            setTimeout(() => {
                setLoading(false);
                onLogin({
                    name: 'Jauhar Fauzi Ulul Albab',
                    email: email,
                    avatar: '👨‍💻'
                });
            }, 800);
            return;
        }
        setLoading(false);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        if (!name) { setError('Nama lengkap wajib diisi.'); return; }
        if (!email) { setError('Email tidak boleh kosong.'); return; }
        if (!password) { setError('Password tidak boleh kosong.'); return; }
        if (password.length < 6) { setError('Password minimal 6 karakter.'); return; }
        if (password !== confirmPassword) { setError('Konfirmasi password tidak cocok.'); return; }

        setLoading(true);
        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ name, email, password, password_confirmation: confirmPassword }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || Object.values(data.errors || {}).flat().join(' '));
                setLoading(false);
                return;
            }
            setSuccess('Akun berhasil dibuat! Silakan login.');
            setTimeout(() => switchMode('login'), 1500);
        } catch (err) {
            // Fallback demo
            setSuccess('Akun berhasil dibuat! Silakan login.');
            setTimeout(() => switchMode('login'), 1500);
        }
        setLoading(false);
    };

    const inputStyle = {
        width: '100%',
        background: 'rgba(255, 255, 255, 0.06)',
        border: '1.5px solid rgba(255, 255, 255, 0.12)',
        borderRadius: 14,
        padding: '13px 16px',
        fontSize: 14,
        color: '#fff',
        outline: 'none',
        transition: 'all 0.25s ease',
        boxSizing: 'border-box',
    };

    const focusInput = (e) => {
        e.target.style.borderColor = '#3b82f6';
        e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.15)';
    };

    const blurInput = (e) => {
        e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)';
        e.target.style.boxShadow = 'none';
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(160deg, #090d1a 0%, #0f1d3d 40%, #1e3d6b 100%)',
            fontFamily: "'DM Sans', sans-serif",
            padding: '24px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes fadeSlide { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
            `}</style>

            {/* Background orbs */}
            <div style={{
                position: 'absolute', top: '-15%', right: '-12%', width: 600, height: 600,
                background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)',
                borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute', bottom: '-12%', left: '-12%', width: 550, height: 550,
                background: 'radial-gradient(circle, rgba(59,130,246,0.14) 0%, transparent 70%)',
                borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none'
            }} />

            {/* Back Button */}
            <button
                onClick={() => onNavigate('home')}
                style={{
                    position: 'absolute', top: 24, left: 24,
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 14, padding: '10px 18px',
                    color: '#fff', fontSize: 14, fontWeight: 600,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                    backdropFilter: 'blur(10px)', zIndex: 100,
                }}
            >
                ← Kembali
            </button>

            {/* Card */}
            <div style={{
                width: '100%', maxWidth: 440,
                background: 'rgba(255, 255, 255, 0.04)',
                backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
                borderRadius: 32,
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '44px 36px',
                boxShadow: '0 24px 60px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.1)',
                position: 'relative', zIndex: 2,
                animation: 'fadeSlide 0.5s ease',
            }}>
                {/* Logo */}
                <div style={{
                    width: 56, height: 56, borderRadius: 18,
                    background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 26, margin: '0 auto 20px',
                    boxShadow: '0 8px 24px rgba(99,102,241,0.4)'
                }}>🛡️</div>

                {/* Tab Switcher */}
                <div style={{
                    display: 'flex', gap: 4,
                    background: 'rgba(255,255,255,0.06)',
                    borderRadius: 16, padding: 4,
                    marginBottom: 28,
                }}>
                    {[
                        { id: 'login', label: 'Masuk' },
                        { id: 'register', label: 'Daftar' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => switchMode(tab.id)}
                            style={{
                                flex: 1, padding: '11px 0',
                                borderRadius: 13, border: 'none',
                                background: mode === tab.id
                                    ? 'linear-gradient(135deg, #3b82f6, #6366f1)'
                                    : 'transparent',
                                color: mode === tab.id ? '#fff' : 'rgba(255,255,255,0.5)',
                                fontSize: 14, fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: mode === tab.id ? '0 4px 14px rgba(99,102,241,0.3)' : 'none',
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <h2 style={{
                    color: '#fff', fontSize: 26, fontWeight: 800,
                    letterSpacing: '-0.8px', margin: '0 0 6px', textAlign: 'center'
                }}>
                    {mode === 'login' ? 'Masuk ke SafeWalk' : 'Buat Akun Baru'}
                </h2>
                <p style={{
                    color: '#94a3b8', fontSize: 14, lineHeight: 1.5,
                    margin: '0 0 24px', textAlign: 'center'
                }}>
                    {mode === 'login'
                        ? 'Akses dashboard keamanan personal Anda'
                        : 'Daftar gratis untuk mulai perjalanan yang aman'}
                </p>

                {/* Error / Success */}
                {error && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                        borderRadius: 12, padding: '12px 16px',
                        color: '#fca5a5', fontSize: 13, textAlign: 'left',
                        marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8,
                        animation: 'fadeSlide 0.3s ease',
                    }}>
                        <span>⚠️</span><span>{error}</span>
                    </div>
                )}
                {success && (
                    <div style={{
                        background: 'rgba(34, 197, 94, 0.1)',
                        border: '1px solid rgba(34, 197, 94, 0.25)',
                        borderRadius: 12, padding: '12px 16px',
                        color: '#86efac', fontSize: 13, textAlign: 'left',
                        marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8,
                        animation: 'fadeSlide 0.3s ease',
                    }}>
                        <span>✅</span><span>{success}</span>
                    </div>
                )}

                {/* ─── LOGIN FORM ─── */}
                {mode === 'login' && (
                    <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
                        <div style={{ marginBottom: 18 }}>
                            <label style={{ display: 'block', color: '#e2e8f0', fontSize: 13, fontWeight: 600, marginBottom: 7 }}>
                                📧 Alamat Email
                            </label>
                            <input
                                type="email" placeholder="contoh@safewalk.id"
                                value={email} onChange={(e) => setEmail(e.target.value)}
                                disabled={loading} style={inputStyle}
                                onFocus={focusInput} onBlur={blurInput}
                            />
                        </div>
                        <div style={{ marginBottom: 26 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                                <label style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600 }}>🔒 Password</label>
                                <a href="#" style={{ color: '#60a5fa', fontSize: 12, textDecoration: 'none', fontWeight: 500 }}>Lupa sandi?</a>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                                    value={password} onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                    style={{ ...inputStyle, paddingRight: 48 }}
                                    onFocus={focusInput} onBlur={blurInput}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                                    background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)',
                                    cursor: 'pointer', fontSize: 16
                                }}>
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                        </div>
                        <button type="submit" disabled={loading} style={{
                            width: '100%', background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                            border: 'none', borderRadius: 14, padding: '14px',
                            color: '#fff', fontSize: 15, fontWeight: 700,
                            cursor: loading ? 'wait' : 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                            boxShadow: '0 8px 24px rgba(99,102,241,0.3)',
                            marginBottom: 18, transition: 'all 0.2s',
                            opacity: loading ? 0.8 : 1,
                        }}>
                            {loading ? (
                                <>
                                    <div style={{
                                        width: 18, height: 18, borderRadius: '50%',
                                        border: '2px solid rgba(255,255,255,0.2)',
                                        borderTopColor: '#fff', animation: 'spin 0.8s linear infinite'
                                    }} />
                                    <span>Menghubungkan...</span>
                                </>
                            ) : (
                                <span>Masuk Sekarang →</span>
                            )}
                        </button>
                    </form>
                )}

                {/* ─── REGISTER FORM ─── */}
                {mode === 'register' && (
                    <form onSubmit={handleRegister} style={{ textAlign: 'left' }}>
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: 'block', color: '#e2e8f0', fontSize: 13, fontWeight: 600, marginBottom: 7 }}>
                                👤 Nama Lengkap
                            </label>
                            <input
                                type="text" placeholder="Jauhar Fauzi Ulul Albab"
                                value={name} onChange={(e) => setName(e.target.value)}
                                disabled={loading} style={inputStyle}
                                onFocus={focusInput} onBlur={blurInput}
                            />
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: 'block', color: '#e2e8f0', fontSize: 13, fontWeight: 600, marginBottom: 7 }}>
                                📧 Alamat Email
                            </label>
                            <input
                                type="email" placeholder="contoh@safewalk.id"
                                value={email} onChange={(e) => setEmail(e.target.value)}
                                disabled={loading} style={inputStyle}
                                onFocus={focusInput} onBlur={blurInput}
                            />
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: 'block', color: '#e2e8f0', fontSize: 13, fontWeight: 600, marginBottom: 7 }}>
                                🔒 Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? 'text' : 'password'} placeholder="Minimal 6 karakter"
                                    value={password} onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                    style={{ ...inputStyle, paddingRight: 48 }}
                                    onFocus={focusInput} onBlur={blurInput}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                                    background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)',
                                    cursor: 'pointer', fontSize: 16
                                }}>
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                            {password && (
                                <div style={{ marginTop: 8, display: 'flex', gap: 4 }}>
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} style={{
                                            flex: 1, height: 3, borderRadius: 2,
                                            background: password.length >= i * 3
                                                ? (password.length >= 10 ? '#22c55e' : password.length >= 6 ? '#f59e0b' : '#ef4444')
                                                : 'rgba(255,255,255,0.1)',
                                            transition: 'all 0.3s',
                                        }} />
                                    ))}
                                </div>
                            )}
                        </div>
                        <div style={{ marginBottom: 24 }}>
                            <label style={{ display: 'block', color: '#e2e8f0', fontSize: 13, fontWeight: 600, marginBottom: 7 }}>
                                🔒 Konfirmasi Password
                            </label>
                            <input
                                type="password" placeholder="Ulangi password"
                                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={loading} style={inputStyle}
                                onFocus={focusInput} onBlur={blurInput}
                            />
                            {confirmPassword && password !== confirmPassword && (
                                <p style={{ color: '#fca5a5', fontSize: 12, marginTop: 6 }}>Password tidak cocok</p>
                            )}
                            {confirmPassword && password === confirmPassword && confirmPassword.length > 0 && (
                                <p style={{ color: '#86efac', fontSize: 12, marginTop: 6 }}>✓ Password cocok</p>
                            )}
                        </div>
                        <button type="submit" disabled={loading} style={{
                            width: '100%', background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                            border: 'none', borderRadius: 14, padding: '14px',
                            color: '#fff', fontSize: 15, fontWeight: 700,
                            cursor: loading ? 'wait' : 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                            boxShadow: '0 8px 24px rgba(34,197,94,0.3)',
                            marginBottom: 18, transition: 'all 0.2s',
                            opacity: loading ? 0.8 : 1,
                        }}>
                            {loading ? (
                                <>
                                    <div style={{
                                        width: 18, height: 18, borderRadius: '50%',
                                        border: '2px solid rgba(255,255,255,0.2)',
                                        borderTopColor: '#fff', animation: 'spin 0.8s linear infinite'
                                    }} />
                                    <span>Membuat akun...</span>
                                </>
                            ) : (
                                <span>Daftar Sekarang →</span>
                            )}
                        </button>
                    </form>
                )}



                {/* Divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0 16px' }}>
                    <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>atau</span>
                    <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
                </div>

                {/* Social Login */}
                <div style={{ display: 'flex', gap: 10 }}>
                    {[
                        { icon: '🔵', label: 'Google' },
                        { icon: '⚫', label: 'GitHub' },
                    ].map(provider => (
                        <button key={provider.label} style={{
                            flex: 1, background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 14, padding: '12px',
                            color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600,
                            cursor: 'pointer', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', gap: 8,
                            transition: 'all 0.2s',
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                            }}
                        >
                            <span>{provider.icon}</span>
                            <span>{provider.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
