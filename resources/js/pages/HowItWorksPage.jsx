import { useState, useEffect, useRef } from 'react';

// ─── Scroll Animation Utilities ──────────────────────────────────────────────
const useInView = (threshold = 0.12) => {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setInView(true); },
            { threshold }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [threshold]);
    return [ref, inView];
};

const FadeIn = ({ children, delay = 0, className = '', from = 'bottom' }) => {
    const [ref, inView] = useInView();
    const transforms = {
        bottom: 'translateY(28px)',
        left: 'translateX(-28px)',
        right: 'translateX(28px)',
        scale: 'scale(0.94)',
        top: 'translateY(-28px)',
    };
    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'none' : transforms[from] || transforms.bottom,
                transition: `opacity 0.75s ease ${delay}s, transform 0.75s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
            }}
        >
            {children}
        </div>
    );
};

// ─── SVG Illustrations for Each Step ─────────────────────────────────────────
const DownloadIllustration = () => (
    <svg viewBox="0 0 320 220" style={{ width: '100%', height: '100%' }}>
        <defs>
            <linearGradient id="dlGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#dbeafe" />
                <stop offset="100%" stopColor="#ede9fe" />
            </linearGradient>
            <linearGradient id="phoneGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
        </defs>
        <rect width="320" height="220" fill="url(#dlGrad)" rx="16" />
        {/* Phone body */}
        <rect x="115" y="20" width="90" height="160" rx="18" fill="url(#phoneGrad)" />
        <rect x="121" y="30" width="78" height="140" rx="12" fill="#f0f4ff" />
        {/* Notch */}
        <rect x="145" y="22" width="30" height="8" rx="4" fill="#0f172a" />
        {/* App icon on screen */}
        <rect x="140" y="60" width="40" height="40" rx="10" fill="url(#shieldGrad)" />
        <defs>
            <linearGradient id="shieldGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
        </defs>
        <text x="160" y="86" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="900">🛡️</text>
        {/* App name */}
        <text x="160" y="118" textAnchor="middle" fill="#1a2d5a" fontSize="9" fontWeight="700">SafeWalk</text>
        {/* Download progress bar */}
        <rect x="132" y="130" width="56" height="6" rx="3" fill="#e2e8f0" />
        <rect x="132" y="130" width="40" height="6" rx="3" fill="#3b82f6">
            <animate attributeName="width" from="0" to="56" dur="2s" repeatCount="indefinite" />
        </rect>
        {/* Download arrow */}
        <g transform="translate(160, 150)">
            <circle cx="0" cy="8" r="12" fill="#3b82f6" opacity="0.15" />
            <path d="M0,0 L0,10 M-5,6 L0,12 L5,6" stroke="#3b82f6" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
        {/* Floating stars */}
        <text x="80" y="50" fontSize="16" opacity="0.7">✨</text>
        <text x="240" y="70" fontSize="14" opacity="0.5">⭐</text>
        <text x="70" y="150" fontSize="12" opacity="0.4">💎</text>
        <text x="250" y="140" fontSize="16" opacity="0.6">✨</text>
    </svg>
);

const ContactsIllustration = () => (
    <svg viewBox="0 0 320 220" style={{ width: '100%', height: '100%' }}>
        <defs>
            <linearGradient id="ctGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#dcfce7" />
                <stop offset="100%" stopColor="#dbeafe" />
            </linearGradient>
        </defs>
        <rect width="320" height="220" fill="url(#ctGrad)" rx="16" />
        {/* Central shield */}
        <circle cx="160" cy="100" r="50" fill="#fff" opacity="0.8" />
        <circle cx="160" cy="100" r="38" fill="#3b82f6" opacity="0.1" />
        <text x="160" y="108" textAnchor="middle" fontSize="28">🛡️</text>
        {/* Contact avatars orbiting */}
        {[
            { x: 80, y: 60, emoji: '👩', bg: '#fce7f3' },
            { x: 240, y: 60, emoji: '👨', bg: '#dbeafe' },
            { x: 60, y: 140, emoji: '👧', bg: '#fef3c7' },
            { x: 260, y: 140, emoji: '👴', bg: '#dcfce7' },
        ].map((c, i) => (
            <g key={i}>
                <circle cx={c.x} cy={c.y} r="22" fill={c.bg} />
                <circle cx={c.x} cy={c.y} r="22" fill="none" stroke="#fff" strokeWidth="2.5" />
                <text x={c.x} y={c.y + 6} textAnchor="middle" fontSize="18">{c.emoji}</text>
                {/* Connecting line */}
                <line x1={c.x} y1={c.y} x2="160" y2="100" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.35" />
            </g>
        ))}
        {/* Plus button */}
        <circle cx="160" cy="185" r="14" fill="#22c55e" />
        <text x="160" y="190" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="900">+</text>
        {/* Trust badge */}
        <rect x="120" y="38" width="80" height="18" rx="9" fill="#fff" opacity="0.9" />
        <text x="160" y="50" textAnchor="middle" fill="#16a34a" fontSize="8" fontWeight="700">Trusted Circle ✓</text>
    </svg>
);

const JourneyIllustration = () => (
    <svg viewBox="0 0 320 220" style={{ width: '100%', height: '100%' }}>
        <defs>
            <linearGradient id="jnGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#dbeafe" />
                <stop offset="100%" stopColor="#e0e7ff" />
            </linearGradient>
        </defs>
        <rect width="320" height="220" fill="url(#jnGrad)" rx="16" />
        {/* Map grid lines */}
        {[0, 1, 2, 3, 4, 5].map(i => (
            <line key={`v${i}`} x1={i * 64} y1="0" x2={i * 64} y2="220" stroke="#93c5fd" strokeWidth="0.5" opacity="0.4" />
        ))}
        {[0, 1, 2, 3].map(i => (
            <line key={`h${i}`} x1="0" y1={i * 73} x2="320" y2={i * 73} stroke="#93c5fd" strokeWidth="0.5" opacity="0.4" />
        ))}
        {/* Route path */}
        <path d="M60,170 Q100,130 140,110 Q180,90 220,80 Q250,70 280,60" stroke="#3b82f6" strokeWidth="3" fill="none" strokeDasharray="8,4" opacity="0.8">
            <animate attributeName="stroke-dashoffset" from="24" to="0" dur="1.5s" repeatCount="indefinite" />
        </path>
        {/* Start point */}
        <circle cx="60" cy="170" r="10" fill="#3b82f6" />
        <circle cx="60" cy="170" r="16" fill="#3b82f6" opacity="0.2">
            <animate attributeName="r" values="16;22;16" dur="2s" repeatCount="indefinite" />
        </circle>
        <text x="60" y="174" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="900">A</text>
        {/* Walking person */}
        <g transform="translate(180, 80)">
            <circle cx="0" cy="-10" r="6" fill="#f0c080" />
            <rect x="-4" y="-3" width="8" height="14" rx="2" fill="#3b82f6" />
            <rect x="-5" y="10" width="4" height="10" rx="1" fill="#1e3a5f" />
            <rect x="1" y="10" width="4" height="10" rx="1" fill="#1e3a5f" />
        </g>
        {/* End point */}
        <circle cx="280" cy="60" r="10" fill="#f59e0b" />
        <text x="280" y="64" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="900">B</text>
        {/* ETA badge */}
        <rect x="215" y="30" width="60" height="20" rx="10" fill="#fff" opacity="0.95" />
        <text x="245" y="43" textAnchor="middle" fill="#1a2d5a" fontSize="8" fontWeight="700">⏱ ETA 12 min</text>
        {/* Live indicator */}
        <rect x="35" y="138" width="50" height="18" rx="9" fill="#ef4444" />
        <circle cx="48" cy="147" r="3" fill="#fff">
            <animate attributeName="opacity" values="1;0.3;1" dur="1.2s" repeatCount="indefinite" />
        </circle>
        <text x="65" y="151" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="700">LIVE</text>
    </svg>
);

const ArriveIllustration = () => (
    <svg viewBox="0 0 320 220" style={{ width: '100%', height: '100%' }}>
        <defs>
            <linearGradient id="arGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#dcfce7" />
                <stop offset="100%" stopColor="#d1fae5" />
            </linearGradient>
        </defs>
        <rect width="320" height="220" fill="url(#arGrad)" rx="16" />
        {/* Success circle */}
        <circle cx="160" cy="95" r="55" fill="#22c55e" opacity="0.1">
            <animate attributeName="r" values="55;62;55" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="160" cy="95" r="42" fill="#22c55e" opacity="0.2" />
        <circle cx="160" cy="95" r="30" fill="#22c55e" />
        {/* Checkmark */}
        <path d="M147,95 L156,104 L173,87" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {/* Text */}
        <text x="160" y="155" textAnchor="middle" fill="#16a34a" fontSize="12" fontWeight="800">Kamu Sudah Sampai!</text>
        <text x="160" y="172" textAnchor="middle" fill="#4ade80" fontSize="9" fontWeight="600">Safe arrival confirmed ✓</text>
        {/* Notification badges */}
        <g transform="translate(65, 55)">
            <rect width="70" height="30" rx="10" fill="#fff" opacity="0.9" />
            <text x="10" y="17" fill="#16a34a" fontSize="8" fontWeight="600">👩 Mom</text>
            <text x="10" y="26" fill="#94a3b8" fontSize="6">Notified ✓</text>
        </g>
        <g transform="translate(205, 55)">
            <rect width="70" height="30" rx="10" fill="#fff" opacity="0.9" />
            <text x="10" y="17" fill="#16a34a" fontSize="8" fontWeight="600">👨 Dad</text>
            <text x="10" y="26" fill="#94a3b8" fontSize="6">Notified ✓</text>
        </g>
        {/* Confetti */}
        {[
            { x: 80, y: 30, c: '#f59e0b' }, { x: 240, y: 40, c: '#3b82f6' },
            { x: 100, y: 180, c: '#ef4444' }, { x: 220, y: 190, c: '#6366f1' },
            { x: 60, y: 120, c: '#22c55e' }, { x: 270, y: 100, c: '#f59e0b' },
        ].map((p, i) => (
            <rect key={i} x={p.x} y={p.y} width="6" height="6" rx="1" fill={p.c} opacity="0.6" transform={`rotate(${i * 30} ${p.x} ${p.y})`} />
        ))}
    </svg>
);

// ─── Interactive Journey Demo ─────────────────────────────────────────────────
const JourneyDemo = () => {
    const [step, setStep] = useState(0);
    const [auto, setAuto] = useState(true);
    const timerRef = useRef(null);

    const demoSteps = [
        {
            title: 'Buka SafeWalk',
            sub: 'App siap digunakan',
            icon: '📱',
            screen: 'home',
            color: '#3b82f6',
        },
        {
            title: 'Pilih Kontak',
            sub: 'Bagikan lokasi ke orang terpercaya',
            icon: '👥',
            screen: 'contacts',
            color: '#6366f1',
        },
        {
            title: 'Mulai Perjalanan',
            sub: 'GPS tracking aktif',
            icon: '🗺️',
            screen: 'journey',
            color: '#f59e0b',
        },
        {
            title: 'Monitoring Aktif',
            sub: 'SOS & Fake Call siap',
            icon: '🛡️',
            screen: 'monitoring',
            color: '#ef4444',
        },
        {
            title: 'Sampai Tujuan!',
            sub: 'Semua kontak diberi tahu',
            icon: '✅',
            screen: 'arrived',
            color: '#22c55e',
        },
    ];

    useEffect(() => {
        if (auto) {
            timerRef.current = setInterval(() => {
                setStep(prev => (prev + 1) % demoSteps.length);
            }, 3000);
        }
        return () => clearInterval(timerRef.current);
    }, [auto]);

    const handleStepClick = (i) => {
        setAuto(false);
        clearInterval(timerRef.current);
        setStep(i);
    };

    const renderScreen = () => {
        const s = demoSteps[step];
        const screens = {
            home: (
                <div style={{ textAlign: 'center', padding: '20px 16px' }}>
                    <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg,#3b82f6,#6366f1)', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, boxShadow: '0 8px 24px rgba(59,130,246,0.3)' }}>🛡️</div>
                    <p style={{ color: '#1a2d5a', fontWeight: 800, fontSize: 16, margin: '0 0 4px' }}>SafeWalk</p>
                    <p style={{ color: '#94a3b8', fontSize: 11 }}>Selamat malam, Rania 👋</p>
                    <div style={{ marginTop: 16, background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: 12, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
                        <span style={{ color: '#16a34a', fontSize: 11, fontWeight: 600 }}>Status: Aman</span>
                    </div>
                </div>
            ),
            contacts: (
                <div style={{ padding: '16px' }}>
                    <p style={{ color: '#1a2d5a', fontWeight: 700, fontSize: 13, marginBottom: 12 }}>Pilih Kontak Terpercaya</p>
                    {['👩 Mom', '👨 Dad', '👧 Bestie'].map((c, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: i < 2 ? '#f0f4ff' : '#fff', borderRadius: 10, marginBottom: 6, border: '1px solid #e8edf5' }}>
                            <span style={{ fontSize: 12, color: '#1a2d5a', fontWeight: 600 }}>{c}</span>
                            <div style={{ width: 18, height: 18, borderRadius: 5, background: i < 2 ? '#3b82f6' : '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {i < 2 && <span style={{ color: '#fff', fontSize: 10, fontWeight: 900 }}>✓</span>}
                            </div>
                        </div>
                    ))}
                </div>
            ),
            journey: (
                <div style={{ padding: '12px 16px' }}>
                    <div style={{ background: '#dbeafe', borderRadius: 12, height: 80, position: 'relative', overflow: 'hidden', marginBottom: 10 }}>
                        <svg viewBox="0 0 200 80" style={{ width: '100%', height: '100%' }}>
                            {[0, 1, 2, 3].map(i => <line key={i} x1={i * 67} y1="0" x2={i * 67} y2="80" stroke="#93c5fd" strokeWidth="0.5" />)}
                            <path d="M20,60 Q60,30 100,25 Q140,20 180,30" stroke="#3b82f6" strokeWidth="2" fill="none" strokeDasharray="5,3">
                                <animate attributeName="stroke-dashoffset" from="16" to="0" dur="1.5s" repeatCount="indefinite" />
                            </path>
                            <circle cx="20" cy="60" r="5" fill="#3b82f6" />
                            <circle cx="180" cy="30" r="5" fill="#f59e0b" />
                        </svg>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p style={{ color: '#1a2d5a', fontWeight: 700, fontSize: 12, margin: 0 }}>Kampus → Kos</p>
                            <p style={{ color: '#94a3b8', fontSize: 10, margin: '2px 0 0' }}>ETA: 12 menit</p>
                        </div>
                        <div style={{ background: '#ef4444', borderRadius: 8, padding: '4px 8px' }}>
                            <span style={{ color: '#fff', fontSize: 9, fontWeight: 700 }}>● LIVE</span>
                        </div>
                    </div>
                </div>
            ),
            monitoring: (
                <div style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 10 }}>
                        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', flex: 1 }}>
                            <p style={{ fontSize: 16, margin: '0 0 2px' }}>🚨</p>
                            <p style={{ color: '#ef4444', fontSize: 9, fontWeight: 700, margin: 0 }}>SOS</p>
                        </div>
                        <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: 10, padding: '10px 14px', flex: 1 }}>
                            <p style={{ fontSize: 16, margin: '0 0 2px' }}>📞</p>
                            <p style={{ color: '#7c3aed', fontSize: 9, fontWeight: 700, margin: 0 }}>Fake Call</p>
                        </div>
                    </div>
                    <div style={{ background: '#f0fdf4', borderRadius: 10, padding: '8px', border: '1px solid #bbf7d0' }}>
                        <p style={{ color: '#16a34a', fontSize: 10, fontWeight: 600, margin: 0 }}>🛡️ Monitoring aktif</p>
                        <p style={{ color: '#86efac', fontSize: 8, margin: '2px 0 0' }}>Route tracking • Speed check</p>
                    </div>
                </div>
            ),
            arrived: (
                <div style={{ padding: '20px 16px', textAlign: 'center' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#22c55e', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, boxShadow: '0 8px 24px rgba(34,197,94,0.3)' }}>✓</div>
                    <p style={{ color: '#16a34a', fontWeight: 800, fontSize: 14, margin: '0 0 4px' }}>Sampai dengan Selamat!</p>
                    <p style={{ color: '#86efac', fontSize: 10 }}>Semua kontak telah diberi tahu</p>
                    <div style={{ marginTop: 12, display: 'flex', gap: 6, justifyContent: 'center' }}>
                        {['👩✓', '👨✓'].map((c, i) => (
                            <div key={i} style={{ background: '#dcfce7', borderRadius: 8, padding: '4px 10px', fontSize: 10, color: '#16a34a', fontWeight: 600 }}>{c}</div>
                        ))}
                    </div>
                </div>
            ),
        };
        return screens[s.screen];
    };

    return (
        <>
            <div style={{ paddingTop: 66 }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
                * { box-sizing:border-box; margin:0; padding:0; }
                @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
                @keyframes ping-ring { 0%{transform:scale(1);opacity:0.7} 100%{transform:scale(2.2);opacity:0} }
                @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
                @keyframes pulse-glow { 0%,100%{box-shadow:0 0 20px rgba(59,130,246,0.2)} 50%{box-shadow:0 0 40px rgba(59,130,246,0.4)} }
                @keyframes dash-flow { 0%{stroke-dashoffset:24} 100%{stroke-dashoffset:0} }
                @keyframes typing { 0%{width:0} 60%{width:100%} 100%{width:100%} }
                ::-webkit-scrollbar{width:6px} ::-webkit-scrollbar-track{background:#f0f4ff} ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px}
                a:hover{opacity:0.75} button:hover{opacity:0.9;transform:translateY(-1px)} button{transition:all 0.2s ease;font-family:inherit}
                @media (max-width: 900px) {
                    .hiw-hero-content { text-align: center !important; }
                    .hiw-hero-stats { justify-content: center !important; }
                    .hiw-desktop-timeline { display: none !important; }
                    .hiw-mobile-timeline { display: block !important; }
                    .hiw-demo-section { flex-direction: column !important; }
                    .hiw-faq-grid { grid-template-columns: 1fr !important; }
                    .hiw-cta-flex { flex-direction: column !important; text-align: center !important; }
                    .hiw-nav-links { display: none !important; }
                }
            `}</style>



            {/* ═══════════════════════════════════════════════════════════════
                HERO SECTION
            ═══════════════════════════════════════════════════════════════ */}
            <section style={{
                position: 'relative',
                minHeight: '100vh',
                overflow: 'hidden',
                background: 'linear-gradient(160deg, #0f1b35 0%, #1a2d5a 30%, #1e3f7a 60%, #2563eb 100%)',
                display: 'flex',
                alignItems: 'center',
                paddingTop: 66,
            }}>
                {/* Background decorative elements */}
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                    {/* Gradient orbs */}
                    <div style={{ position: 'absolute', top: '10%', left: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)' }} />
                    <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)' }} />
                    {/* Grid pattern */}
                    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04 }}>
                        {[...Array(20)].map((_, i) => (
                            <line key={`v${i}`} x1={`${i * 5}%`} y1="0" x2={`${i * 5}%`} y2="100%" stroke="#fff" strokeWidth="1" />
                        ))}
                        {[...Array(20)].map((_, i) => (
                            <line key={`h${i}`} x1="0" y1={`${i * 5}%`} x2="100%" y2={`${i * 5}%`} stroke="#fff" strokeWidth="1" />
                        ))}
                    </svg>
                    {/* Floating particles */}
                    {[
                        { top: '15%', left: '20%', size: 4, delay: '0s' },
                        { top: '30%', left: '80%', size: 3, delay: '1s' },
                        { top: '60%', left: '15%', size: 5, delay: '0.5s' },
                        { top: '70%', left: '70%', size: 3, delay: '1.5s' },
                        { top: '45%', left: '50%', size: 4, delay: '0.8s' },
                    ].map((p, i) => (
                        <div key={i} style={{
                            position: 'absolute',
                            top: p.top,
                            left: p.left,
                            width: p.size,
                            height: p.size,
                            borderRadius: '50%',
                            background: '#fff',
                            opacity: 0.3,
                            animation: `float 4s ease-in-out infinite`,
                            animationDelay: p.delay,
                        }} />
                    ))}
                </div>

                <div style={{ maxWidth: 1140, margin: '0 auto', padding: '60px 28px', width: '100%', position: 'relative', zIndex: 10 }}>
                    <div className="hiw-hero-content" style={{ textAlign: 'left' }}>
                        <FadeIn delay={0.1}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', borderRadius: 40, padding: '8px 20px 8px 10px', border: '1px solid rgba(255,255,255,0.12)', marginBottom: 28 }}>
                                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>📖</div>
                                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: 600 }}>Panduan Lengkap</span>
                            </div>
                        </FadeIn>

                        <FadeIn delay={0.2}>
                            <h1 style={{
                                fontSize: 'clamp(36px, 5.5vw, 68px)',
                                fontWeight: 900,
                                lineHeight: 1.06,
                                letterSpacing: '-2.5px',
                                color: '#fff',
                                marginBottom: 24,
                                maxWidth: 750,
                            }}>
                                How <span style={{ background: 'linear-gradient(135deg, #60a5fa, #a78bfa, #60a5fa)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'shimmer 3s linear infinite' }}>SafeWalk</span> Works
                            </h1>
                        </FadeIn>

                        <FadeIn delay={0.35}>
                            <p style={{
                                fontSize: 'clamp(16px, 1.8vw, 20px)',
                                color: 'rgba(255,255,255,0.55)',
                                lineHeight: 1.7,
                                maxWidth: 560,
                                marginBottom: 44,
                            }}>
                                Dari download sampai tiba di tujuan dengan selamat — pelajari bagaimana SafeWalk menjaga setiap langkahmu. Keamanan yang simpel, powerful, dan selalu ada untukmu.
                            </p>
                        </FadeIn>

                        <FadeIn delay={0.5}>
                            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 56 }}>
                                <a href="#steps" style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                                    borderRadius: 16,
                                    padding: '16px 32px',
                                    color: '#fff',
                                    fontSize: 16,
                                    fontWeight: 700,
                                    textDecoration: 'none',
                                    boxShadow: '0 8px 32px rgba(99,102,241,0.35)',
                                    transition: 'all 0.3s ease',
                                }}>
                                    Lihat Langkah-langkah
                                    <span style={{ fontSize: 18 }}>↓</span>
                                </a>
                                <a href="#demo" style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    background: 'rgba(255,255,255,0.08)',
                                    backdropFilter: 'blur(12px)',
                                    borderRadius: 16,
                                    padding: '16px 32px',
                                    color: '#fff',
                                    fontSize: 16,
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                    border: '1px solid rgba(255,255,255,0.15)',
                                    transition: 'all 0.3s ease',
                                }}>
                                    ▶ Lihat Demo Interaktif
                                </a>
                            </div>
                        </FadeIn>

                        <FadeIn delay={0.65}>
                            <div className="hiw-hero-stats" style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
                                {[
                                    { number: 4, suffix: ' Langkah', label: 'Simpel & Cepat' },
                                    { number: 30, suffix: ' Detik', label: 'Setup Pertama' },
                                    { number: 100, suffix: '%', label: 'Gratis' },
                                ].map((s, i) => (
                                    <div key={i}>
                                        <p style={{ color: '#fff', fontSize: 28, fontWeight: 900, margin: '0 0 2px', letterSpacing: '-1px' }}>
                                            <AnimatedNumber target={s.number} suffix={s.suffix} duration={1500} />
                                        </p>
                                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: 500, margin: 0 }}>{s.label}</p>
                                    </div>
                                ))}
                            </div>
                        </FadeIn>
                    </div>
                </div>

                {/* Bottom wave */}
                <svg style={{ position: 'absolute', bottom: -2, left: 0, right: 0, width: '100%' }} viewBox="0 0 1440 120" preserveAspectRatio="none">
                    <path d="M0,80 C360,120 1080,20 1440,80 L1440,120 L0,120 Z" fill="#f8faff" />
                </svg>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                QUICK OVERVIEW STRIP
            ═══════════════════════════════════════════════════════════════ */}
            <section style={{ padding: '60px 28px', background: '#f8faff' }}>
                <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                    <FadeIn>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: 16,
                        }}>
                            {[
                                { icon: '📥', title: 'Download', desc: 'Unduh & buat akun', color: '#3b82f6' },
                                { icon: '👥', title: 'Kontak', desc: 'Tambah orang terpercaya', color: '#6366f1' },
                                { icon: '🗺️', title: 'Mulai', desc: 'Aktifkan perjalanan', color: '#f59e0b' },
                                { icon: '✅', title: 'Selamat', desc: 'Sampai dengan aman', color: '#22c55e' },
                            ].map((item, i) => (
                                <FadeIn key={i} delay={i * 0.1}>
                                    <div style={{
                                        background: '#fff',
                                        borderRadius: 20,
                                        padding: '24px 20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 14,
                                        boxShadow: '0 2px 12px rgba(30,60,120,0.05)',
                                        border: '1px solid #e8edf5',
                                        position: 'relative',
                                        overflow: 'hidden',
                                    }}>
                                        {/* Step connector arrow */}
                                        {i < 3 && (
                                            <div style={{
                                                position: 'absolute',
                                                right: -8,
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                color: '#cbd5e1',
                                                fontSize: 16,
                                                fontWeight: 900,
                                                zIndex: 2,
                                            }}>→</div>
                                        )}
                                        <div style={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: 14,
                                            background: `${item.color}12`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: 22,
                                            flexShrink: 0,
                                        }}>{item.icon}</div>
                                        <div>
                                            <p style={{ color: item.color, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 2px' }}>Step {i + 1}</p>
                                            <p style={{ color: '#1a2d5a', fontSize: 15, fontWeight: 800, margin: '0 0 2px', letterSpacing: '-0.3px' }}>{item.title}</p>
                                            <p style={{ color: '#94a3b8', fontSize: 12, margin: 0 }}>{item.desc}</p>
                                        </div>
                                    </div>
                                </FadeIn>
                            ))}
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                STEP-BY-STEP TIMELINE
            ═══════════════════════════════════════════════════════════════ */}
            <section id="steps" style={{ padding: '80px 28px 100px', background: '#fff' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <FadeIn>
                        <div style={{ textAlign: 'center', marginBottom: 70 }}>
                            <p style={{ color: '#3b82f6', fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Step-by-Step Guide</p>
                            <h2 style={{
                                fontSize: 'clamp(28px, 3.5vw, 46px)',
                                fontWeight: 900,
                                letterSpacing: '-1.5px',
                                color: '#1a2d5a',
                                lineHeight: 1.15,
                                marginBottom: 16,
                            }}>
                                Panduan Lengkap
                                <br />
                                <span style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Menggunakan SafeWalk</span>
                            </h2>
                            <p style={{ color: '#64748b', fontSize: 16, lineHeight: 1.7, maxWidth: 560, margin: '0 auto' }}>
                                Hanya butuh 4 langkah sederhana untuk membuat perjalananmu lebih aman. Ikuti panduan berikut dan mulai sekarang.
                            </p>
                        </div>
                    </FadeIn>

                    {/* Desktop timeline */}
                    <div className="hiw-desktop-timeline" style={{ display: 'block' }}>
                        {steps.map((step, i) => (
                            <TimelineStep key={i} step={step} index={i} total={steps.length} />
                        ))}
                    </div>

                    {/* Mobile timeline */}
                    <div className="hiw-mobile-timeline" style={{ display: 'none' }}>
                        {steps.map((step, i) => (
                            <MobileTimelineStep key={i} step={step} index={i} total={steps.length} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                INTERACTIVE DEMO SECTION
            ═══════════════════════════════════════════════════════════════ */}
            <section id="demo" style={{ padding: '100px 28px', background: '#f8faff' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <FadeIn>
                        <div style={{ textAlign: 'center', marginBottom: 60 }}>
                            <p style={{ color: '#6366f1', fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Interactive Demo</p>
                            <h2 style={{
                                fontSize: 'clamp(28px, 3.5vw, 44px)',
                                fontWeight: 900,
                                letterSpacing: '-1.5px',
                                color: '#1a2d5a',
                                lineHeight: 1.15,
                                marginBottom: 16,
                            }}>
                                Simulasi
                                <br />
                                <span style={{ background: 'linear-gradient(135deg,#6366f1,#3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Alur Perjalanan</span>
                            </h2>
                            <p style={{ color: '#64748b', fontSize: 16, lineHeight: 1.7, maxWidth: 500, margin: '0 auto' }}>
                                Klik setiap langkah untuk melihat bagaimana tampilan SafeWalk di HP kamu. Atau biarkan demo berjalan otomatis.
                            </p>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.15}>
                        <div style={{
                            background: '#fff',
                            borderRadius: 32,
                            padding: '48px 40px',
                            boxShadow: '0 8px 48px rgba(30,60,120,0.07)',
                            border: '1px solid #e8edf5',
                        }}>
                            <JourneyDemo />
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                SAFETY FEATURES HIGHLIGHT
            ═══════════════════════════════════════════════════════════════ */}
            <section style={{ padding: '100px 28px', background: '#fff' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <FadeIn>
                        <div style={{ textAlign: 'center', marginBottom: 56 }}>
                            <p style={{ color: '#f59e0b', fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Safety Features</p>
                            <h2 style={{
                                fontSize: 'clamp(26px, 3vw, 40px)',
                                fontWeight: 900,
                                letterSpacing: '-1.5px',
                                color: '#1a2d5a',
                                lineHeight: 1.15,
                            }}>
                                Fitur Keamanan di <span style={{ color: '#3b82f6' }}>Setiap Langkah</span>
                            </h2>
                        </div>
                    </FadeIn>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                        {[
                            {
                                icon: '📍',
                                title: 'Live GPS Tracking',
                                desc: 'Lokasi realtime dibagikan ke kontak terpercaya selama perjalanan. Mereka bisa melihat posisimu di peta kapan saja.',
                                color: '#3b82f6',
                                bg: '#eff6ff',
                                border: '#bfdbfe',
                            },
                            {
                                icon: '🚨',
                                title: 'Emergency SOS',
                                desc: 'Satu tombol untuk kirim sinyal darurat ke semua kontak. Tahan 3 detik dan bantuan akan segera datang.',
                                color: '#ef4444',
                                bg: '#fef2f2',
                                border: '#fecaca',
                            },
                            {
                                icon: '📞',
                                title: 'Fake Call',
                                desc: 'Simulasi panggilan masuk yang realistis. Pilih kontak mana yang ingin terlihat menelepon — cara cerdas keluar dari situasi tidak nyaman.',
                                color: '#7c3aed',
                                bg: '#faf5ff',
                                border: '#e9d5ff',
                            },
                            {
                                icon: '🔔',
                                title: 'Auto Safety Check',
                                desc: 'SafeWalk mendeteksi jika kamu berhenti terlalu lama atau keluar rute. Jika tak merespons, alert otomatis dikirim.',
                                color: '#f59e0b',
                                bg: '#fffbeb',
                                border: '#fde68a',
                            },
                            {
                                icon: '⏱️',
                                title: 'Journey Timer',
                                desc: 'Estimasi waktu tiba otomatis. Jika perjalanan melebihi waktu normal, kontak terpercaya akan diberi tahu.',
                                color: '#06b6d4',
                                bg: '#ecfeff',
                                border: '#a5f3fc',
                            },
                            {
                                icon: '🔒',
                                title: 'End-to-End Encrypted',
                                desc: 'Semua data lokasi dienkripsi. Hanya kamu dan kontak terpercayamu yang bisa mengakses informasi perjalanan.',
                                color: '#16a34a',
                                bg: '#f0fdf4',
                                border: '#bbf7d0',
                            },
                        ].map((f, i) => (
                            <FadeIn key={i} delay={i * 0.08}>
                                <div style={{
                                    background: f.bg,
                                    borderRadius: 22,
                                    padding: '28px 24px',
                                    border: `1.5px solid ${f.border}`,
                                    height: '100%',
                                    transition: 'all 0.3s ease',
                                }}>
                                    <div style={{
                                        width: 52,
                                        height: 52,
                                        borderRadius: 16,
                                        background: '#fff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 24,
                                        marginBottom: 16,
                                        boxShadow: `0 4px 16px ${f.color}15`,
                                    }}>{f.icon}</div>
                                    <h3 style={{ color: '#1a2d5a', fontSize: 17, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.3px' }}>{f.title}</h3>
                                    <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                FAQ SECTION
            ═══════════════════════════════════════════════════════════════ */}
            <section style={{ padding: '100px 28px', background: '#f8faff' }}>
                <div style={{ maxWidth: 800, margin: '0 auto' }}>
                    <FadeIn>
                        <div style={{ textAlign: 'center', marginBottom: 56 }}>
                            <p style={{ color: '#3b82f6', fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>FAQ</p>
                            <h2 style={{
                                fontSize: 'clamp(28px, 3.5vw, 44px)',
                                fontWeight: 900,
                                letterSpacing: '-1.5px',
                                color: '#1a2d5a',
                                lineHeight: 1.15,
                                marginBottom: 16,
                            }}>
                                Pertanyaan yang <span style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Sering Ditanyakan</span>
                            </h2>
                            <p style={{ color: '#64748b', fontSize: 16, lineHeight: 1.7, maxWidth: 480, margin: '0 auto' }}>
                                Belum yakin? Baca jawaban untuk pertanyaan paling umum tentang SafeWalk di bawah ini.
                            </p>
                        </div>
                    </FadeIn>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {faqItems.map((item, i) => (
                            <FAQItem
                                key={i}
                                question={item.q}
                                answer={item.a}
                                isOpen={openFAQ === i}
                                onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                                delay={i * 0.05}
                            />
                        ))}
                    </div>

                    <FadeIn delay={0.2}>
                        <div style={{ textAlign: 'center', marginTop: 40 }}>
                            <p style={{ color: '#94a3b8', fontSize: 14 }}>
                                Masih ada pertanyaan? <a href="#" style={{ color: '#3b82f6', fontWeight: 700, textDecoration: 'none' }}>Hubungi Tim Support →</a>
                            </p>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                CTA SECTION
            ═══════════════════════════════════════════════════════════════ */}
            <section style={{ padding: '100px 28px', background: '#fff' }}>
                <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                    <FadeIn>
                        <div style={{
                            background: 'linear-gradient(160deg, #0f1b35 0%, #1a2d5a 40%, #2563eb 100%)',
                            borderRadius: 36,
                            padding: 'clamp(40px, 6vw, 80px) clamp(28px, 4vw, 64px)',
                            position: 'relative',
                            overflow: 'hidden',
                        }}>
                            {/* Background decorations */}
                            <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(99,102,241,0.15)' }} />
                            <div style={{ position: 'absolute', bottom: -40, left: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(59,130,246,0.1)' }} />
                            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.03 }}>
                                {[...Array(10)].map((_, i) => (
                                    <line key={i} x1={`${i * 10}%`} y1="0" x2={`${i * 10}%`} y2="100%" stroke="#fff" strokeWidth="1" />
                                ))}
                            </svg>

                            <div className="hiw-cta-flex" style={{ display: 'flex', alignItems: 'center', gap: 48, position: 'relative', zIndex: 2 }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 30, padding: '6px 16px 6px 8px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: 20 }}>
                                        <span style={{ fontSize: 14 }}>🛡️</span>
                                        <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: 600 }}>SafeWalk — Gratis Selamanya</span>
                                    </div>
                                    <h2 style={{
                                        color: '#fff',
                                        fontSize: 'clamp(26px, 3.5vw, 42px)',
                                        fontWeight: 900,
                                        lineHeight: 1.15,
                                        letterSpacing: '-1.5px',
                                        marginBottom: 16,
                                    }}>
                                        Start Your Safe
                                        <br />
                                        Journey Today
                                    </h2>
                                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, lineHeight: 1.7, maxWidth: 420, marginBottom: 32 }}>
                                        Download sekarang dan rasakan ketenangan setiap kali kamu berjalan. Karena keamanan bukan hanya keinginan — itu hak kamu.
                                    </p>
                                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                                        <button style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 10,
                                            background: '#fff',
                                            border: 'none',
                                            borderRadius: 16,
                                            padding: '16px 32px',
                                            color: '#1a2d5a',
                                            fontSize: 16,
                                            fontWeight: 800,
                                            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                                            cursor: 'pointer',
                                            letterSpacing: '-0.3px',
                                        }}>
                                            <span style={{ fontSize: 20 }}>📥</span> Download Gratis
                                        </button>
                                        <button style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 10,
                                            background: 'rgba(255,255,255,0.1)',
                                            border: '1.5px solid rgba(255,255,255,0.2)',
                                            borderRadius: 16,
                                            padding: '16px 28px',
                                            color: '#fff',
                                            fontSize: 15,
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            backdropFilter: 'blur(8px)',
                                        }}>
                                            Pelajari Lagi →
                                        </button>
                                    </div>
                                </div>

                                {/* Decorative phone silhouette */}
                                <div style={{ flexShrink: 0 }}>
                                    <div style={{
                                        width: 180,
                                        height: 340,
                                        borderRadius: 36,
                                        background: 'rgba(255,255,255,0.06)',
                                        border: '1.5px solid rgba(255,255,255,0.1)',
                                        backdropFilter: 'blur(8px)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 16,
                                        padding: 24,
                                    }}>
                                        <div style={{
                                            width: 64,
                                            height: 64,
                                            borderRadius: 18,
                                            background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: 30,
                                            boxShadow: '0 12px 40px rgba(99,102,241,0.4)',
                                            animation: 'pulse-glow 3s ease-in-out infinite',
                                        }}>🛡️</div>
                                        <p style={{ color: '#fff', fontWeight: 800, fontSize: 16, letterSpacing: '-0.5px' }}>SafeWalk</p>
                                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, textAlign: 'center' }}>Your smart safety companion</p>
                                        <div style={{
                                            width: '100%',
                                            background: 'rgba(34,197,94,0.2)',
                                            border: '1px solid rgba(34,197,94,0.3)',
                                            borderRadius: 12,
                                            padding: '8px 12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 6,
                                        }}>
                                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
                                            <span style={{ color: '#4ade80', fontSize: 10, fontWeight: 600 }}>Siap Digunakan</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>

            </div>
        </>
    );
}
