import { useState, useEffect, useRef } from 'react';

// ─── useInView Hook ────────────────────────────────────────────
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

// ─── FadeIn Component ──────────────────────────────────────────
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

// ─── SVG Illustrations ─────────────────────────────────────────

const TrackingIllustration = () => (
    <svg viewBox="0 0 480 320" style={{ width: '100%', height: '100%' }}>
        <defs>
            <linearGradient id="trackBg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#dbeafe" />
                <stop offset="100%" stopColor="#bfdbfe" />
            </linearGradient>
            <linearGradient id="trackPath" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
            <filter id="trackGlow">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
        </defs>
        <rect width="480" height="320" fill="url(#trackBg)" rx="20" />
        {/* Grid lines */}
        {[0,1,2,3,4,5,6].map(i => (
            <line key={`v${i}`} x1={i*80} y1="0" x2={i*80} y2="320" stroke="#93c5fd" strokeWidth="0.5" opacity="0.4" />
        ))}
        {[0,1,2,3,4].map(i => (
            <line key={`h${i}`} x1="0" y1={i*80} x2="480" y2={i*80} stroke="#93c5fd" strokeWidth="0.5" opacity="0.4" />
        ))}
        {/* Route path */}
        <path d="M60,260 Q100,220 160,200 Q220,180 280,160 Q340,140 380,100 Q420,60 430,80" stroke="url(#trackPath)" strokeWidth="3.5" fill="none" strokeDasharray="10,5" opacity="0.8" />
        {/* Start point */}
        <circle cx="60" cy="260" r="14" fill="#3b82f6" opacity="0.15" />
        <circle cx="60" cy="260" r="8" fill="#3b82f6" />
        <circle cx="60" cy="260" r="4" fill="#fff" />
        {/* End point */}
        <circle cx="430" cy="80" r="14" fill="#f59e0b" opacity="0.15" />
        <circle cx="430" cy="80" r="8" fill="#f59e0b" />
        <circle cx="430" cy="80" r="4" fill="#fff" />
        {/* User avatar */}
        <g transform="translate(260,150)">
            <circle cx="0" cy="0" r="20" fill="#3b82f6" opacity="0.12" />
            <circle cx="0" cy="0" r="12" fill="#3b82f6" />
            <text x="0" y="5" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="700">👤</text>
        </g>
        {/* Pulse rings around user */}
        <circle cx="260" cy="150" r="28" fill="none" stroke="#3b82f6" strokeWidth="1.5" opacity="0.3">
            <animate attributeName="r" from="20" to="40" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.4" to="0" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="260" cy="150" r="28" fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.2">
            <animate attributeName="r" from="20" to="55" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.3" to="0" dur="2s" repeatCount="indefinite" />
        </circle>
        {/* Info card */}
        <rect x="300" y="50" width="130" height="54" fill="#fff" rx="14" opacity="0.95" />
        <text x="320" y="70" fill="#1a2d5a" fontSize="11" fontWeight="700">📍 Live Location</text>
        <text x="320" y="88" fill="#64748b" fontSize="9">Sharing with 3 contacts</text>
        {/* Distance marker */}
        <rect x="140" y="230" width="80" height="28" fill="#6366f1" rx="10" />
        <text x="180" y="248" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700">1.2 km left</text>
        {/* Contact avatars */}
        <circle cx="395" cy="240" r="16" fill="#e0e7ff" />
        <text x="395" y="245" textAnchor="middle" fontSize="14">👩</text>
        <circle cx="425" cy="248" r="14" fill="#fef3c7" />
        <text x="425" y="253" textAnchor="middle" fontSize="12">👫</text>
        <rect x="375" y="268" width="68" height="18" fill="#dcfce7" rx="6" />
        <text x="409" y="280" textAnchor="middle" fill="#16a34a" fontSize="8" fontWeight="600">Watching you</text>
    </svg>
);

const SOSIllustration = () => (
    <svg viewBox="0 0 480 320" style={{ width: '100%', height: '100%' }}>
        <defs>
            <linearGradient id="sosBg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fff1f2" />
                <stop offset="100%" stopColor="#ffe4e6" />
            </linearGradient>
            <radialGradient id="sosGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </radialGradient>
        </defs>
        <rect width="480" height="320" fill="url(#sosBg)" rx="20" />
        {/* Radiating rings */}
        <circle cx="240" cy="150" r="120" fill="none" stroke="#fecaca" strokeWidth="1.5" opacity="0.4">
            <animate attributeName="r" from="80" to="140" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="240" cy="150" r="100" fill="none" stroke="#fca5a5" strokeWidth="1.5" opacity="0.3">
            <animate attributeName="r" from="70" to="120" dur="2.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.4" to="0" dur="2.5s" repeatCount="indefinite" />
        </circle>
        {/* Outer glow */}
        <circle cx="240" cy="150" r="90" fill="url(#sosGlow)" />
        {/* Main SOS button layers */}
        <circle cx="240" cy="150" r="65" fill="#fecaca" opacity="0.5" />
        <circle cx="240" cy="150" r="50" fill="#fca5a5" opacity="0.6" />
        <circle cx="240" cy="150" r="38" fill="#ef4444" />
        <text x="240" y="145" textAnchor="middle" fill="#fff" fontSize="22" fontWeight="900">SOS</text>
        <text x="240" y="165" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9" fontWeight="600">Hold 3 seconds</text>
        {/* Progress arc */}
        <circle cx="240" cy="150" r="45" fill="none" stroke="#fff" strokeWidth="3" strokeDasharray="70 283" strokeLinecap="round" opacity="0.5" transform="rotate(-90 240 150)">
            <animate attributeName="stroke-dasharray" values="0 283;283 283;0 283" dur="4s" repeatCount="indefinite" />
        </circle>
        {/* Alert notifications going out */}
        <g opacity="0.9">
            <rect x="50" y="60" width="100" height="44" fill="#fff" rx="12" opacity="0.9" />
            <text x="66" y="78" fill="#ef4444" fontSize="9" fontWeight="700">🚨 Alert Sent!</text>
            <text x="66" y="94" fill="#94a3b8" fontSize="8">To: Mom</text>
            <line x1="150" y1="82" x2="200" y2="130" stroke="#fca5a5" strokeWidth="1.5" strokeDasharray="4,3" />
        </g>
        <g opacity="0.9">
            <rect x="340" y="50" width="110" height="44" fill="#fff" rx="12" opacity="0.9" />
            <text x="356" y="68" fill="#ef4444" fontSize="9" fontWeight="700">🚨 Alert Sent!</text>
            <text x="356" y="84" fill="#94a3b8" fontSize="8">To: Bestie</text>
            <line x1="340" y1="72" x2="290" y2="125" stroke="#fca5a5" strokeWidth="1.5" strokeDasharray="4,3" />
        </g>
        <g opacity="0.9">
            <rect x="330" y="230" width="120" height="44" fill="#fff" rx="12" opacity="0.9" />
            <text x="346" y="248" fill="#ef4444" fontSize="9" fontWeight="700">📍 Location shared</text>
            <text x="346" y="264" fill="#94a3b8" fontSize="8">Jl. Airlangga No.4</text>
            <line x1="330" y1="252" x2="288" y2="185" stroke="#fca5a5" strokeWidth="1.5" strokeDasharray="4,3" />
        </g>
        {/* Timer */}
        <rect x="60" y="250" width="90" height="32" fill="#fee2e2" rx="10" />
        <text x="105" y="271" textAnchor="middle" fill="#dc2626" fontSize="11" fontWeight="700">⏱ 3 detik</text>
    </svg>
);

const FakeCallIllustration = () => (
    <svg viewBox="0 0 480 320" style={{ width: '100%', height: '100%' }}>
        <defs>
            <linearGradient id="fcBg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#faf5ff" />
                <stop offset="100%" stopColor="#f3e8ff" />
            </linearGradient>
        </defs>
        <rect width="480" height="320" fill="url(#fcBg)" rx="20" />
        {/* Phone frame */}
        <rect x="170" y="20" width="140" height="280" fill="#1a1a2e" rx="24" />
        <rect x="178" y="32" width="124" height="256" fill="#f8f0ff" rx="18" />
        {/* Notch */}
        <rect x="210" y="20" width="60" height="16" fill="#1a1a2e" rx="8" />
        {/* Call screen content */}
        <circle cx="240" cy="115" r="36" fill="#e9d5ff" />
        <text x="240" y="124" textAnchor="middle" fontSize="34">👩</text>
        <text x="240" y="170" textAnchor="middle" fill="#7c3aed" fontSize="14" fontWeight="800">Mom</text>
        <text x="240" y="188" textAnchor="middle" fill="#a78bfa" fontSize="10">Incoming call...</text>
        {/* Call wave animation */}
        <circle cx="240" cy="115" r="44" fill="none" stroke="#c4b5fd" strokeWidth="1.5" opacity="0.5">
            <animate attributeName="r" from="40" to="60" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite" />
        </circle>
        {/* Accept / Decline buttons */}
        <circle cx="215" cy="240" r="18" fill="#ef4444" />
        <text x="215" y="245" textAnchor="middle" fill="#fff" fontSize="14">✕</text>
        <circle cx="265" cy="240" r="18" fill="#22c55e" />
        <text x="265" y="245" textAnchor="middle" fill="#fff" fontSize="14">📞</text>
        {/* Decorative elements */}
        <g opacity="0.8">
            <rect x="30" y="80" width="110" height="48" fill="#fff" rx="14" />
            <text x="48" y="100" fill="#7c3aed" fontSize="9" fontWeight="700">🎭 Fake Call Active</text>
            <text x="48" y="116" fill="#94a3b8" fontSize="8">Escape mode enabled</text>
        </g>
        <g opacity="0.8">
            <rect x="340" y="100" width="110" height="48" fill="#fff" rx="14" />
            <text x="358" y="120" fill="#16a34a" fontSize="9" fontWeight="700">✅ Looks real!</text>
            <text x="358" y="136" fill="#94a3b8" fontSize="8">Full screen caller</text>
        </g>
        {/* Contact presets floating */}
        <rect x="50" y="200" width="84" height="30" fill="#e9d5ff" rx="10" />
        <text x="92" y="219" textAnchor="middle" fill="#7c3aed" fontSize="10" fontWeight="600">👫 Friend</text>
        <rect x="350" y="220" width="92" height="30" fill="#e9d5ff" rx="10" />
        <text x="396" y="239" textAnchor="middle" fill="#7c3aed" fontSize="10" fontWeight="600">👮 Security</text>
        {/* Timer preset */}
        <rect x="355" y="180" width="80" height="26" fill="#fef3c7" rx="8" />
        <text x="395" y="197" textAnchor="middle" fill="#d97706" fontSize="9" fontWeight="600">⏱ 10s delay</text>
    </svg>
);

const AutoAlertIllustration = () => (
    <svg viewBox="0 0 480 320" style={{ width: '100%', height: '100%' }}>
        <defs>
            <linearGradient id="aaBg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fffbeb" />
                <stop offset="100%" stopColor="#fef3c7" />
            </linearGradient>
            <linearGradient id="aiBrain" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
        </defs>
        <rect width="480" height="320" fill="url(#aaBg)" rx="20" />
        {/* AI Brain center */}
        <circle cx="240" cy="140" r="50" fill="#fde68a" opacity="0.5" />
        <circle cx="240" cy="140" r="35" fill="url(#aiBrain)" />
        <text x="240" y="147" textAnchor="middle" fill="#fff" fontSize="24" fontWeight="900">🧠</text>
        {/* Neural network lines */}
        {[
            [240, 140, 110, 70], [240, 140, 370, 70],
            [240, 140, 100, 220], [240, 140, 380, 220],
            [240, 140, 160, 50], [240, 140, 320, 50],
        ].map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#f59e0b" strokeWidth="1.5" opacity="0.3" strokeDasharray="4,4">
                <animate attributeName="stroke-dashoffset" from="0" to="16" dur="2s" repeatCount="indefinite" />
            </line>
        ))}
        {/* Monitoring nodes */}
        <g>
            <circle cx="110" cy="70" r="18" fill="#fff" opacity="0.9" />
            <text x="110" y="76" textAnchor="middle" fontSize="16">📍</text>
            <text x="110" y="100" textAnchor="middle" fill="#64748b" fontSize="8" fontWeight="600">Location</text>
        </g>
        <g>
            <circle cx="370" cy="70" r="18" fill="#fff" opacity="0.9" />
            <text x="370" y="76" textAnchor="middle" fontSize="16">⏱</text>
            <text x="370" y="100" textAnchor="middle" fill="#64748b" fontSize="8" fontWeight="600">Time Check</text>
        </g>
        <g>
            <circle cx="160" cy="50" r="14" fill="#fff" opacity="0.9" />
            <text x="160" y="55" textAnchor="middle" fontSize="12">🚶</text>
        </g>
        <g>
            <circle cx="320" cy="50" r="14" fill="#fff" opacity="0.9" />
            <text x="320" y="55" textAnchor="middle" fontSize="12">📊</text>
        </g>
        <g>
            <circle cx="100" cy="220" r="18" fill="#fff" opacity="0.9" />
            <text x="100" y="226" textAnchor="middle" fontSize="16">🛑</text>
            <text x="100" y="250" textAnchor="middle" fill="#64748b" fontSize="8" fontWeight="600">Stop Detect</text>
        </g>
        <g>
            <circle cx="380" cy="220" r="18" fill="#fff" opacity="0.9" />
            <text x="380" y="226" textAnchor="middle" fontSize="16">🔔</text>
            <text x="380" y="250" textAnchor="middle" fill="#64748b" fontSize="8" fontWeight="600">Auto Alert</text>
        </g>
        {/* Safety check dialog */}
        <rect x="160" y="230" width="160" height="60" fill="#fff" rx="16" />
        <text x="185" y="252" fill="#1a2d5a" fontSize="11" fontWeight="700">Apakah kamu aman?</text>
        <rect x="175" y="262" width="52" height="20" fill="#22c55e" rx="6" />
        <text x="201" y="276" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="700">Ya ✓</text>
        <rect x="235" y="262" width="70" height="20" fill="#fee2e2" rx="6" />
        <text x="270" y="276" textAnchor="middle" fill="#dc2626" fontSize="9" fontWeight="700">Butuh Bantu</text>
        {/* Scanning pulse */}
        <circle cx="240" cy="140" r="55" fill="none" stroke="#f59e0b" strokeWidth="1">
            <animate attributeName="r" from="50" to="75" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.4" to="0" dur="3s" repeatCount="indefinite" />
        </circle>
    </svg>
);

// ─── Interactive SOS Demo ──────────────────────────────────────
const SOSDemo = () => {
    const [held, setHeld] = useState(false);
    const [progress, setProgress] = useState(0);
    const [done, setDone] = useState(false);
    const timer = useRef(null);

    const start = () => {
        setHeld(true);
        let p = 0;
        timer.current = setInterval(() => {
            p += 3.33;
            setProgress(Math.min(p, 100));
            if (p >= 100) {
                clearInterval(timer.current);
                setDone(true);
                setTimeout(() => { setDone(false); setProgress(0); setHeld(false); }, 2800);
            }
        }, 100);
    };
    const stop = () => {
        clearInterval(timer.current);
        if (!done) { setHeld(false); setProgress(0); }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div
                onMouseDown={start} onMouseUp={stop} onMouseLeave={stop}
                onTouchStart={start} onTouchEnd={stop}
                style={{
                    width: 120, height: 120, borderRadius: '50%', cursor: 'pointer',
                    position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    userSelect: 'none',
                    background: done ? '#fef2f2' : held ? '#fff5f5' : '#fff',
                    boxShadow: done ? '0 0 50px rgba(239,68,68,0.4)' : held ? '0 0 30px rgba(239,68,68,0.2)' : '0 8px 32px rgba(239,68,68,0.12)',
                    border: `3px solid ${done ? '#ef4444' : held ? 'rgba(239,68,68,0.5)' : 'rgba(239,68,68,0.15)'}`,
                    transition: 'all 0.25s ease',
                }}
            >
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(239,68,68,0.1)" strokeWidth="5" />
                    <circle cx="60" cy="60" r="54" fill="none" stroke="#ef4444" strokeWidth="5" strokeDasharray={`${progress * 3.39} 339`} strokeLinecap="round" />
                </svg>
                <div style={{ textAlign: 'center', zIndex: 1 }}>
                    {done ? (
                        <p style={{ color: '#22c55e', fontWeight: 900, fontSize: 13, margin: 0 }}>✅ SENT!</p>
                    ) : (
                        <>
                            <p style={{ color: '#ef4444', fontWeight: 900, fontSize: 22, margin: 0 }}>SOS</p>
                            <p style={{ color: 'rgba(239,68,68,0.45)', fontSize: 10, margin: '3px 0 0' }}>Hold 3s</p>
                        </>
                    )}
                </div>
            </div>
            <p style={{ color: '#94a3b8', fontSize: 13, textAlign: 'center', maxWidth: 240 }}>
                {done ? '✅ Emergency alert terkirim ke semua kontak!' : 'Tekan dan tahan 3 detik untuk mengirim sinyal darurat'}
            </p>
        </div>
    );
};

// ─── Interactive Fake Call Demo ─────────────────────────────────
const FakeCallDemo = () => {
    const [state, setState] = useState('idle');

    useEffect(() => {
        let t;
        if (state === 'calling') t = setTimeout(() => setState('idle'), 3500);
        return () => clearTimeout(t);
    }, [state]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {state === 'ringing' ? (
                <div style={{
                    background: 'linear-gradient(135deg, #f8f0ff, #ede9fe)',
                    borderRadius: 24, padding: 28,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
                    border: '1px solid #e9d5ff',
                }}>
                    <div style={{ position: 'relative' }}>
                        <div style={{
                            width: 68, height: 68, borderRadius: '50%', background: '#e9d5ff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, zIndex: 1,
                        }}>👩</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ color: '#7c3aed', fontWeight: 800, fontSize: 18, margin: 0 }}>Mom</p>
                        <p style={{ color: '#a78bfa', fontSize: 13, margin: '4px 0 0' }}>📞 Incoming call...</p>
                    </div>
                    <div style={{ display: 'flex', gap: 28, marginTop: 8 }}>
                        <button onClick={() => setState('idle')} style={{
                            width: 54, height: 54, borderRadius: '50%', background: '#ef4444',
                            border: 'none', fontSize: 22, cursor: 'pointer', color: '#fff',
                            boxShadow: '0 4px 16px rgba(239,68,68,0.3)',
                        }}>✕</button>
                        <button onClick={() => setState('calling')} style={{
                            width: 54, height: 54, borderRadius: '50%', background: '#22c55e',
                            border: 'none', fontSize: 22, cursor: 'pointer',
                            boxShadow: '0 4px 16px rgba(34,197,94,0.3)',
                        }}>📞</button>
                    </div>
                </div>
            ) : state === 'calling' ? (
                <div style={{
                    background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', borderRadius: 24,
                    padding: 28, textAlign: 'center', border: '1px solid #bbf7d0',
                }}>
                    <p style={{ fontSize: 36, margin: 0 }}>👩</p>
                    <p style={{ color: '#16a34a', fontWeight: 800, fontSize: 17, margin: '10px 0 4px' }}>Mom • In Call</p>
                    <p style={{ color: '#86efac', fontSize: 13, margin: 0 }}>00:05 — Ending soon…</p>
                </div>
            ) : (
                <div>
                    <p style={{ color: '#64748b', fontSize: 14, marginBottom: 14, fontWeight: 500 }}>Pilih siapa yang menelepon:</p>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        {['👩 Mom', '👫 Friend', '👮 Security'].map(n => (
                            <button key={n} onClick={() => setState('ringing')} style={{
                                background: '#f8f0ff', border: '2px solid #e9d5ff', borderRadius: 14,
                                padding: '10px 18px', color: '#7c3aed', fontSize: 14, fontWeight: 700,
                                cursor: 'pointer', transition: 'all 0.2s ease',
                            }}>{n}</button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── Interactive Live Tracking Demo ────────────────────────────
const LiveTrackingDemo = () => {
    const [sharing, setSharing] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let interval;
        if (sharing) {
            interval = setInterval(() => {
                setProgress(p => {
                    if (p >= 100) { setSharing(false); return 0; }
                    return p + 2;
                });
            }, 150);
        }
        return () => clearInterval(interval);
    }, [sharing]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{
                background: '#dbeafe', borderRadius: 20, height: 140, position: 'relative', overflow: 'hidden',
            }}>
                {/* Mini map grid */}
                <svg viewBox="0 0 300 140" style={{ width: '100%', height: '100%' }}>
                    {[0,1,2,3,4,5].map(i => (
                        <line key={`v${i}`} x1={i*60} y1="0" x2={i*60} y2="140" stroke="#93c5fd" strokeWidth="0.5" opacity="0.5" />
                    ))}
                    {[0,1,2].map(i => (
                        <line key={`h${i}`} x1="0" y1={i*70} x2="300" y2={i*70} stroke="#93c5fd" strokeWidth="0.5" opacity="0.5" />
                    ))}
                    <path d="M30,110 Q80,80 140,60 Q200,40 260,50" stroke="#3b82f6" strokeWidth="2.5" fill="none" strokeDasharray="6,3" />
                    <circle cx="30" cy="110" r="6" fill="#3b82f6" />
                    {sharing && (
                        <circle cx={30 + (progress / 100) * 230} cy={110 - Math.sin(progress / 100 * Math.PI) * 60} r="8" fill="#6366f1">
                            <animate attributeName="r" values="6;10;6" dur="1s" repeatCount="indefinite" />
                        </circle>
                    )}
                    <circle cx="260" cy="50" r="6" fill="#f59e0b" />
                    <rect x="195" y="20" width="60" height="18" fill="#f59e0b" rx="6" />
                    <text x="225" y="32" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="700">
                        {sharing ? `${Math.round(100 - progress)}%` : 'Tujuan'}
                    </text>
                </svg>
            </div>
            <button
                onClick={() => { if (!sharing) { setProgress(0); setSharing(true); } }}
                style={{
                    background: sharing ? 'linear-gradient(135deg,#22c55e,#16a34a)' : 'linear-gradient(135deg,#3b82f6,#6366f1)',
                    border: 'none', borderRadius: 14, padding: '12px 20px', color: '#fff',
                    fontSize: 14, fontWeight: 700, cursor: 'pointer',
                    boxShadow: sharing ? '0 4px 16px rgba(34,197,94,0.3)' : '0 4px 16px rgba(99,102,241,0.3)',
                    transition: 'all 0.3s ease',
                }}
            >
                {sharing ? '📍 Sharing Live Location...' : '▶ Start Sharing Location'}
            </button>
            {sharing && (
                <div style={{
                    display: 'flex', gap: 8, justifyContent: 'center',
                }}>
                    {['👩 Mom', '👫 Bestie'].map(c => (
                        <span key={c} style={{
                            background: '#dcfce7', color: '#16a34a', fontSize: 12,
                            fontWeight: 600, padding: '5px 12px', borderRadius: 8,
                        }}>✅ {c} watching</span>
                    ))}
                </div>
            )}
        </div>
    );
};

// ─── Auto Safety Alert Demo ────────────────────────────────────
const AutoAlertDemo = () => {
    const [step, setStep] = useState(0);
    // steps: 0 = monitoring, 1 = detected stop, 2 = asking, 3 = alert sent / safe

    useEffect(() => {
        if (step === 0) {
            const t = setTimeout(() => setStep(1), 2000);
            return () => clearTimeout(t);
        }
        if (step === 1) {
            const t = setTimeout(() => setStep(2), 1500);
            return () => clearTimeout(t);
        }
    }, [step]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{
                background: step === 1 ? '#fef3c7' : step === 2 ? '#fff7ed' : step === 3 ? '#f0fdf4' : '#fffbeb',
                borderRadius: 20, padding: 24, textAlign: 'center',
                transition: 'background 0.5s ease',
                border: `1.5px solid ${step === 3 ? '#bbf7d0' : step === 2 ? '#fed7aa' : '#fde68a'}`,
            }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>
                    {step === 0 && '🧠'}
                    {step === 1 && '⚠️'}
                    {step === 2 && '❓'}
                    {step === 3 && '✅'}
                </div>
                <p style={{
                    color: step === 3 ? '#16a34a' : '#1a2d5a',
                    fontWeight: 800, fontSize: 16, margin: '0 0 6px',
                }}>
                    {step === 0 && 'AI Monitoring Active...'}
                    {step === 1 && 'Stop Detected!'}
                    {step === 2 && 'Apakah kamu aman?'}
                    {step === 3 && 'Status: Aman ✓'}
                </p>
                <p style={{ color: '#94a3b8', fontSize: 13, margin: 0 }}>
                    {step === 0 && 'Memantau pergerakan dan rute...'}
                    {step === 1 && 'Kamu berhenti selama 2 menit'}
                    {step === 2 && 'Tidak ada respon → auto alert'}
                    {step === 3 && 'Semua kontak diberitahu kamu aman'}
                </p>
                {step === 2 && (
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 16 }}>
                        <button onClick={() => setStep(3)} style={{
                            background: '#22c55e', border: 'none', borderRadius: 12,
                            padding: '10px 24px', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                        }}>Ya, Aman ✓</button>
                        <button onClick={() => { setStep(3); }} style={{
                            background: '#ef4444', border: 'none', borderRadius: 12,
                            padding: '10px 24px', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                        }}>Butuh Bantuan</button>
                    </div>
                )}
            </div>
            {step === 3 && (
                <button onClick={() => setStep(0)} style={{
                    background: 'none', border: '2px solid #e5e7eb', borderRadius: 12,
                    padding: '10px 20px', color: '#64748b', fontSize: 13, fontWeight: 600,
                    cursor: 'pointer', alignSelf: 'center',
                }}>🔄 Replay Demo</button>
            )}
        </div>
    );
};

// ─── Comparison Table ──────────────────────────────────────────
const ComparisonTable = () => {
    const [ref, inView] = useInView();
    const features = [
        { name: 'Live Tracking', desc: 'Berbagi lokasi realtime', free: true, premium: true },
        { name: 'Emergency SOS', desc: 'Sinyal darurat 1-tap', free: true, premium: true },
        { name: 'Fake Call', desc: 'Simulasi panggilan masuk', free: '1 kontak', premium: 'Unlimited' },
        { name: 'Auto Safety Alert', desc: 'AI monitoring otomatis', free: false, premium: true },
        { name: 'Route History', desc: 'Riwayat rute 30 hari', free: '7 hari', premium: '30 hari' },
        { name: 'Trusted Contacts', desc: 'Kontak terpercaya', free: '3 kontak', premium: '10 kontak' },
        { name: 'Custom SOS Message', desc: 'Pesan darurat kustom', free: false, premium: true },
        { name: 'Voice Activation', desc: 'Aktivasi suara "Help!"', free: false, premium: true },
        { name: 'Offline Mode', desc: 'Bekerja tanpa internet', free: false, premium: true },
        { name: 'Priority Support', desc: 'Dukungan prioritas 24/7', free: false, premium: true },
    ];

    const renderCheck = (val) => {
        if (val === true) return <span style={{ color: '#22c55e', fontSize: 18, fontWeight: 700 }}>✓</span>;
        if (val === false) return <span style={{ color: '#cbd5e1', fontSize: 18 }}>—</span>;
        return <span style={{ color: '#6366f1', fontSize: 12, fontWeight: 600 }}>{val}</span>;
    };

    return (
        <div
            ref={ref}
            style={{
                opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(32px)',
                transition: 'all 0.8s cubic-bezier(0.22,1,0.36,1)',
            }}
        >
            <div style={{
                background: '#fff', borderRadius: 28, overflow: 'hidden',
                boxShadow: '0 8px 40px rgba(30,60,120,0.08)',
                border: '1px solid #e8edf5',
            }}>
                {/* Header */}
                <div style={{
                    display: 'grid', gridTemplateColumns: '1fr 140px 140px',
                    background: 'linear-gradient(135deg, #1a2d5a, #2d4a7c)', padding: '20px 32px',
                    gap: 0,
                }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 600 }}>Fitur</span>
                    <span style={{ color: '#fff', fontSize: 14, fontWeight: 700, textAlign: 'center' }}>Free</span>
                    <span style={{
                        color: '#fff', fontSize: 14, fontWeight: 700, textAlign: 'center',
                        background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                        borderRadius: 10, padding: '6px 0',
                    }}>✨ Premium</span>
                </div>
                {/* Rows */}
                {features.map((f, i) => (
                    <div key={f.name} style={{
                        display: 'grid', gridTemplateColumns: '1fr 140px 140px',
                        padding: '16px 32px', alignItems: 'center',
                        background: i % 2 === 0 ? '#fff' : '#f8faff',
                        borderBottom: i < features.length - 1 ? '1px solid #f1f5f9' : 'none',
                    }}>
                        <div>
                            <p style={{ color: '#1a2d5a', fontSize: 14, fontWeight: 700, margin: 0 }}>{f.name}</p>
                            <p style={{ color: '#94a3b8', fontSize: 12, margin: '2px 0 0' }}>{f.desc}</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>{renderCheck(f.free)}</div>
                        <div style={{ textAlign: 'center' }}>{renderCheck(f.premium)}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ─── Feature Detail Section ────────────────────────────────────
const FeatureSection = ({ id, index, badge, badgeColor, title, titleHighlight, description, bullets, illustration, demo, reversed }) => {
    const [ref, inView] = useInView(0.1);
    const isEven = index % 2 === 0;

    return (
        <section
            id={id}
            ref={ref}
            style={{
                padding: '100px 28px',
                background: isEven ? '#fff' : '#f8faff',
                opacity: inView ? 1 : 0,
                transition: 'opacity 0.6s ease',
            }}
        >
            <div style={{
                maxWidth: 1140, margin: '0 auto',
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60,
                alignItems: 'center',
            }} className="feature-section-grid">
                {/* Content side */}
                <div style={{ order: reversed ? 2 : 1 }}>
                    <FadeIn delay={0.1} from={reversed ? 'right' : 'left'}>
                        <div style={{
                            display: 'inline-block', background: `${badgeColor}12`,
                            border: `2px solid ${badgeColor}25`, borderRadius: 10,
                            padding: '5px 14px', marginBottom: 18,
                        }}>
                            <span style={{ color: badgeColor, fontSize: 12, fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase' }}>
                                {badge}
                            </span>
                        </div>
                    </FadeIn>
                    <FadeIn delay={0.15} from={reversed ? 'right' : 'left'}>
                        <h2 style={{
                            fontSize: 'clamp(28px, 3.2vw, 42px)', fontWeight: 900,
                            letterSpacing: '-1.5px', color: '#1a2d5a', lineHeight: 1.15,
                            marginBottom: 20,
                        }}>
                            {title}{' '}
                            <span style={{
                                background: `linear-gradient(135deg, ${badgeColor}, #6366f1)`,
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                            }}>{titleHighlight}</span>
                        </h2>
                    </FadeIn>
                    <FadeIn delay={0.2} from={reversed ? 'right' : 'left'}>
                        <p style={{
                            color: '#64748b', fontSize: 16, lineHeight: 1.75,
                            marginBottom: 24, maxWidth: 480,
                        }}>{description}</p>
                    </FadeIn>
                    <FadeIn delay={0.25} from={reversed ? 'right' : 'left'}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {bullets.map((b, i) => (
                                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                    <div style={{
                                        width: 28, height: 28, borderRadius: 9, flexShrink: 0,
                                        background: `${badgeColor}12`, display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', fontSize: 14, marginTop: 2,
                                    }}>{b.icon}</div>
                                    <div>
                                        <p style={{ color: '#1a2d5a', fontSize: 14, fontWeight: 700, margin: '0 0 2px' }}>{b.title}</p>
                                        <p style={{ color: '#94a3b8', fontSize: 13, margin: 0, lineHeight: 1.6 }}>{b.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </FadeIn>
                </div>
                {/* Visual side */}
                <div style={{ order: reversed ? 1 : 2 }}>
                    <FadeIn delay={0.2} from={reversed ? 'left' : 'right'}>
                        <div style={{
                            borderRadius: 24, overflow: 'hidden',
                            boxShadow: '0 12px 48px rgba(30,60,120,0.1)',
                            marginBottom: 20,
                        }}>
                            {illustration}
                        </div>
                    </FadeIn>
                    {demo && (
                        <FadeIn delay={0.3} from={reversed ? 'left' : 'right'}>
                            <div style={{
                                background: '#fff', borderRadius: 24, padding: 28,
                                boxShadow: '0 4px 24px rgba(30,60,120,0.06)',
                                border: '1px solid #e8edf5',
                            }}>
                                <p style={{
                                    color: '#94a3b8', fontSize: 11, fontWeight: 700,
                                    textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 16,
                                }}>✨ Interactive Demo</p>
                                {demo}
                            </div>
                        </FadeIn>
                    )}
                </div>
            </div>
        </section>
    );
};

// ─── Main FeaturesPage Component ───────────────────────────────
export default function FeaturesPage() {
    const featureSections = [
        {
            id: 'live-tracking',
            badge: 'Real-Time GPS',
            badgeColor: '#3b82f6',
            title: 'Live Tracking',
            titleHighlight: 'Everywhere You Go',
            description: 'Bagikan lokasi secara realtime dengan kontak terpercaya. Mereka bisa melihat posisi dan rute perjalananmu secara langsung, kapan saja.',
            bullets: [
                { icon: '📍', title: 'Lokasi Realtime', desc: 'GPS presisi tinggi yang update setiap detik' },
                { icon: '🗺️', title: 'Route Sharing', desc: 'Kontak bisa melihat rute dan estimasi waktu tiba' },
                { icon: '🔔', title: 'Arrival Notification', desc: 'Notifikasi otomatis saat kamu sampai tujuan' },
                { icon: '👥', title: 'Multi-Contact', desc: 'Bagikan ke beberapa kontak sekaligus' },
            ],
            illustration: <TrackingIllustration />,
            demo: <LiveTrackingDemo />,
            reversed: false,
        },
        {
            id: 'emergency-sos',
            badge: '1-Touch Alert',
            badgeColor: '#ef4444',
            title: 'Emergency SOS',
            titleHighlight: 'When Seconds Matter',
            description: 'Tekan dan tahan 3 detik untuk mengirim sinyal darurat ke semua kontak terpercaya. Lokasi, waktu, dan pesan darurat terkirim otomatis.',
            bullets: [
                { icon: '🚨', title: 'Tahan 3 Detik', desc: 'Cukup tekan dan tahan — tidak perlu unlock atau buka app' },
                { icon: '📡', title: 'Broadcast Alert', desc: 'Semua kontak terpercaya menerima notifikasi darurat' },
                { icon: '📍', title: 'Auto Location', desc: 'Lokasi GPS otomatis terlampir dalam pesan darurat' },
                { icon: '🔊', title: 'Silent & Loud Mode', desc: 'Pilih mode diam atau sirene berdasarkan situasi' },
            ],
            illustration: <SOSIllustration />,
            demo: <SOSDemo />,
            reversed: true,
        },
        {
            id: 'fake-call',
            badge: 'Smart Escape',
            badgeColor: '#7c3aed',
            title: 'Fake Call',
            titleHighlight: 'Your Safe Exit',
            description: 'Simulasikan panggilan masuk dari orang terpercaya untuk keluar dari situasi tidak nyaman. Terlihat seperti telepon sungguhan!',
            bullets: [
                { icon: '📞', title: 'Realistic Call Screen', desc: 'Tampilan panggilan yang identik dengan telepon asli' },
                { icon: '⏱', title: 'Delay Timer', desc: 'Set delay 10 detik hingga 5 menit sebelum berdering' },
                { icon: '🎭', title: 'Custom Caller', desc: 'Pilih dari Mom, Friend, atau kontak custom' },
                { icon: '🔊', title: 'Real Ringtone', desc: 'Menggunakan ringtone asli perangkat kamu' },
            ],
            illustration: <FakeCallIllustration />,
            demo: <FakeCallDemo />,
            reversed: false,
        },
        {
            id: 'auto-alert',
            badge: 'AI Monitoring',
            badgeColor: '#f59e0b',
            title: 'Auto Safety Alert',
            titleHighlight: 'AI That Watches Over You',
            description: 'AI canggih memantau perjalananmu — jika berhenti terlalu lama atau keluar rute, SafeWalk akan mengecek keselamatanmu secara otomatis.',
            bullets: [
                { icon: '🧠', title: 'Smart Detection', desc: 'AI mengenali pola berhenti, perubahan rute, dan anomali' },
                { icon: '❓', title: 'Safety Check', desc: 'Popup otomatis bertanya "Apakah kamu aman?"' },
                { icon: '⚡', title: 'Auto Escalation', desc: 'Jika tidak ada respon, alert otomatis ke kontak' },
                { icon: '📊', title: 'Behavior Analysis', desc: 'Belajar dari pola perjalananmu untuk akurasi lebih baik' },
            ],
            illustration: <AutoAlertIllustration />,
            demo: <AutoAlertDemo />,
            reversed: true,
        },
    ];

    return (
        <>
            <style>{`
                @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.4} }
                @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
                @keyframes slide-up { 0%{opacity:0;transform:translateY(20px)} 100%{opacity:1;transform:translateY(0)} }
                @media (max-width: 900px) {
                    .feature-section-grid { grid-template-columns: 1fr !important; }
                    .feature-section-grid > div { order: unset !important; }
                    .comparison-scroll { overflow-x: auto; }
                    .hero-stats { flex-direction: column !important; align-items: center !important; }
                }
            `}</style>
            {/* ─── HERO BANNER ─────────────────────────────────── */}
            <section style={{
                position: 'relative', minHeight: '80vh',
                background: 'linear-gradient(135deg, #1a2d5a 0%, #3b82f6 50%, #6366f1 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                paddingTop: 100, paddingBottom: 80, overflow: 'hidden',
            }}>
                {/* Decorative shapes */}
                <div style={{
                    position: 'absolute', top: -100, right: -100,
                    width: 400, height: 400, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(99,102,241,0.3), transparent)',
                    filter: 'blur(60px)',
                }} />
                <div style={{
                    position: 'absolute', bottom: -80, left: -80,
                    width: 300, height: 300, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(59,130,246,0.25), transparent)',
                    filter: 'blur(50px)',
                }} />
                {/* Floating dots */}
                {[
                    { top: '15%', left: '10%', size: 6, opacity: 0.3, dur: '4s' },
                    { top: '25%', right: '15%', size: 8, opacity: 0.2, dur: '5s' },
                    { bottom: '30%', left: '20%', size: 5, opacity: 0.25, dur: '3.5s' },
                    { top: '40%', right: '25%', size: 4, opacity: 0.35, dur: '4.5s' },
                    { bottom: '20%', right: '10%', size: 7, opacity: 0.2, dur: '3s' },
                ].map((dot, i) => (
                    <div key={i} style={{
                        position: 'absolute', ...dot,
                        width: dot.size, height: dot.size, borderRadius: '50%',
                        background: '#fff', opacity: dot.opacity,
                        animation: `float ${dot.dur} ease-in-out infinite`,
                    }} />
                ))}

                <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 28px', textAlign: 'center', position: 'relative', zIndex: 10 }}>
                    <FadeIn delay={0.1}>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)',
                            borderRadius: 50, padding: '8px 20px', marginBottom: 28,
                            border: '1px solid rgba(255,255,255,0.15)',
                        }}>
                            <span style={{
                                width: 8, height: 8, borderRadius: '50%', background: '#22c55e',
                                animation: 'pulse-dot 2s ease-in-out infinite',
                            }} />
                            <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: 600 }}>
                                Explore semua fitur SafeWalk
                            </span>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.2}>
                        <h1 style={{
                            fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 900,
                            lineHeight: 1.05, letterSpacing: '-2.5px',
                            color: '#fff', marginBottom: 24,
                        }}>
                            Our{' '}
                            <span style={{
                                background: 'linear-gradient(135deg, #93c5fd, #c4b5fd, #fbcfe8)',
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                            }}>Features</span>
                        </h1>
                    </FadeIn>

                    <FadeIn delay={0.3}>
                        <p style={{
                            fontSize: 'clamp(16px, 2vw, 20px)',
                            color: 'rgba(255,255,255,0.65)', lineHeight: 1.7,
                            maxWidth: 620, margin: '0 auto 44px',
                        }}>
                            Teknologi keamanan terdepan yang menjaga setiap langkahmu.
                            Dari live tracking hingga AI monitoring — semuanya dirancang untuk keselamatanmu.
                        </p>
                    </FadeIn>

                    <FadeIn delay={0.4}>
                        <div className="hero-stats" style={{
                            display: 'flex', gap: 48, justifyContent: 'center',
                            flexWrap: 'wrap',
                        }}>
                            {[
                                { num: '4', label: 'Core Features', icon: '🛡️' },
                                { num: '< 3s', label: 'Response Time', icon: '⚡' },
                                { num: '24/7', label: 'AI Monitoring', icon: '🧠' },
                                { num: '99.9%', label: 'Uptime', icon: '📡' },
                            ].map(s => (
                                <div key={s.label} style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
                                    <p style={{ color: '#fff', fontSize: 28, fontWeight: 900, letterSpacing: '-1px', margin: 0 }}>{s.num}</p>
                                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, margin: '4px 0 0' }}>{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </FadeIn>

                    {/* Scroll indicator */}
                    <FadeIn delay={0.6}>
                        <div style={{
                            marginTop: 60, display: 'flex', flexDirection: 'column',
                            alignItems: 'center', gap: 8,
                        }}>
                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 500 }}>Scroll to explore</p>
                            <div style={{
                                width: 24, height: 40, borderRadius: 12,
                                border: '2px solid rgba(255,255,255,0.25)',
                                display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
                                paddingTop: 8,
                            }}>
                                <div style={{
                                    width: 4, height: 10, borderRadius: 2, background: 'rgba(255,255,255,0.5)',
                                    animation: 'float 2s ease-in-out infinite',
                                }} />
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* ─── Quick Feature Cards ─────────────────────────── */}
            <section style={{ padding: '80px 28px', background: '#fff' }}>
                <div style={{ maxWidth: 1140, margin: '0 auto' }}>
                    <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: 20,
                    }}>
                        {[
                            { icon: '📍', title: 'Live Tracking', desc: 'Lokasi realtime dengan GPS presisi tinggi', color: '#3b82f6', bg: '#dbeafe' },
                            { icon: '🚨', title: 'Emergency SOS', desc: 'Sinyal darurat hanya dalam 3 detik', color: '#ef4444', bg: '#fee2e2' },
                            { icon: '📞', title: 'Fake Call', desc: 'Panggilan palsu yang terlihat nyata', color: '#7c3aed', bg: '#f3e8ff' },
                            { icon: '🧠', title: 'Auto Safety Alert', desc: 'AI yang memantau perjalananmu', color: '#f59e0b', bg: '#fef3c7' },
                        ].map((f, i) => (
                            <FadeIn key={f.title} delay={i * 0.1}>
                                <a href={`#${f.title.toLowerCase().replace(/\s/g, '-')}`} style={{ textDecoration: 'none' }}>
                                    <div style={{
                                        background: '#fff', borderRadius: 24, padding: '28px 24px',
                                        boxShadow: '0 4px 24px rgba(30,60,120,0.06)',
                                        border: '1.5px solid #e8edf5',
                                        cursor: 'pointer', transition: 'all 0.3s ease',
                                        display: 'flex', gap: 18, alignItems: 'center',
                                    }}>
                                        <div style={{
                                            width: 56, height: 56, borderRadius: 18,
                                            background: f.bg, display: 'flex', alignItems: 'center',
                                            justifyContent: 'center', fontSize: 28, flexShrink: 0,
                                        }}>{f.icon}</div>
                                        <div>
                                            <p style={{ color: '#1a2d5a', fontSize: 16, fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.3px' }}>{f.title}</p>
                                            <p style={{ color: '#94a3b8', fontSize: 13, margin: 0, lineHeight: 1.5 }}>{f.desc}</p>
                                        </div>
                                        <div style={{
                                            marginLeft: 'auto', color: f.color, fontSize: 18, fontWeight: 700,
                                            opacity: 0.5,
                                        }}>→</div>
                                    </div>
                                </a>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Feature Detail Sections ─────────────────────── */}
            {featureSections.map((section, i) => (
                <FeatureSection key={section.id} index={i} {...section} />
            ))}

            {/* ─── Comparison Table Section ─────────────────────── */}
            <section id="pricing" style={{ padding: '100px 28px', background: '#f8faff' }}>
                <div style={{ maxWidth: 900, margin: '0 auto' }}>
                    <FadeIn>
                        <div style={{ textAlign: 'center', marginBottom: 56 }}>
                            <p style={{
                                color: '#6366f1', fontSize: 13, fontWeight: 700,
                                letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12,
                            }}>Plans & Pricing</p>
                            <h2 style={{
                                fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 900,
                                letterSpacing: '-1.5px', color: '#1a2d5a', lineHeight: 1.15,
                                marginBottom: 16,
                            }}>
                                Free vs{' '}
                                <span style={{
                                    background: 'linear-gradient(135deg,#3b82f6,#6366f1)',
                                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                }}>Premium</span>
                            </h2>
                            <p style={{ color: '#64748b', fontSize: 16, maxWidth: 500, margin: '0 auto' }}>
                                Semua fitur dasar gratis selamanya. Upgrade ke Premium untuk perlindungan maksimal.
                            </p>
                        </div>
                    </FadeIn>

                    {/* Price cards above table */}
                    <FadeIn delay={0.1}>
                        <div style={{
                            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20,
                            marginBottom: 32,
                        }}>
                            {/* Free Plan */}
                            <div style={{
                                background: '#fff', borderRadius: 24, padding: '32px 28px',
                                border: '1.5px solid #e8edf5', textAlign: 'center',
                            }}>
                                <p style={{ color: '#94a3b8', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>Free Plan</p>
                                <p style={{ color: '#1a2d5a', fontSize: 40, fontWeight: 900, letterSpacing: '-2px', margin: '0 0 4px' }}>Rp 0</p>
                                <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 20 }}>Gratis selamanya</p>
                                <button style={{
                                    background: '#f1f5f9', border: 'none', borderRadius: 14,
                                    padding: '12px 32px', color: '#64748b', fontSize: 14,
                                    fontWeight: 700, cursor: 'pointer', width: '100%',
                                }}>Current Plan</button>
                            </div>
                            {/* Premium Plan */}
                            <div style={{
                                background: 'linear-gradient(135deg, #1a2d5a, #2d4a7c)',
                                borderRadius: 24, padding: '32px 28px', textAlign: 'center',
                                position: 'relative', overflow: 'hidden',
                            }}>
                                <div style={{
                                    position: 'absolute', top: 14, right: 14,
                                    background: 'rgba(255,255,255,0.15)', borderRadius: 8,
                                    padding: '4px 12px',
                                }}>
                                    <span style={{ color: '#fbbf24', fontSize: 11, fontWeight: 700 }}>🔥 Popular</span>
                                </div>
                                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>Premium</p>
                                <p style={{ color: '#fff', fontSize: 40, fontWeight: 900, letterSpacing: '-2px', margin: '0 0 4px' }}>
                                    Rp 29<span style={{ fontSize: 18, fontWeight: 600 }}>k</span>
                                </p>
                                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 20 }}>per bulan</p>
                                <button style={{
                                    background: 'linear-gradient(135deg,#3b82f6,#6366f1)',
                                    border: 'none', borderRadius: 14, padding: '12px 32px',
                                    color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                                    width: '100%', boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
                                }}>Upgrade Now ✨</button>
                            </div>
                        </div>
                    </FadeIn>

                    <div className="comparison-scroll">
                        <ComparisonTable />
                    </div>
                </div>
            </section>

            {/* ─── CTA Section ─────────────────────────────────── */}
            <section style={{
                padding: '100px 28px', overflow: 'hidden',
                background: 'linear-gradient(135deg, #1a2d5a 0%, #3b82f6 50%, #6366f1 100%)',
                position: 'relative',
            }}>
                {/* Background decorations */}
                <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 600, height: 600, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.05), transparent)',
                }} />
                <div style={{
                    position: 'absolute', top: -100, left: -100,
                    width: 300, height: 300, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(99,102,241,0.2), transparent)',
                    filter: 'blur(40px)',
                }} />
                <div style={{
                    position: 'absolute', bottom: -80, right: -80,
                    width: 250, height: 250, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(59,130,246,0.2), transparent)',
                    filter: 'blur(40px)',
                }} />

                <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
                    <FadeIn>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)',
                            borderRadius: 50, padding: '8px 20px', marginBottom: 28,
                            border: '1px solid rgba(255,255,255,0.12)',
                        }}>
                            <span style={{ fontSize: 16 }}>🛡️</span>
                            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 600 }}>
                                Bergabung bersama 50,000+ pengguna
                            </span>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.1}>
                        <h2 style={{
                            fontSize: 'clamp(30px, 4.5vw, 52px)', fontWeight: 900,
                            lineHeight: 1.1, letterSpacing: '-2px', color: '#fff',
                            marginBottom: 20,
                        }}>
                            Mulai Perjalanan Aman<br />
                            <span style={{ color: '#93c5fd' }}>Sekarang Juga</span>
                        </h2>
                    </FadeIn>

                    <FadeIn delay={0.2}>
                        <p style={{
                            color: 'rgba(255,255,255,0.6)', fontSize: 18,
                            lineHeight: 1.7, maxWidth: 520, margin: '0 auto 40px',
                        }}>
                            Download SafeWalk sekarang dan rasakan ketenangan dalam setiap langkahmu.
                            Karena keselamatanmu adalah prioritas kami.
                        </p>
                    </FadeIn>

                    <FadeIn delay={0.3}>
                        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button style={{
                                background: '#fff', border: 'none', borderRadius: 16,
                                padding: '16px 36px', color: '#1a2d5a', fontSize: 16,
                                fontWeight: 800, cursor: 'pointer',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                                display: 'flex', alignItems: 'center', gap: 10,
                            }}>
                                <span style={{ fontSize: 22 }}>📱</span>
                                Download Free
                            </button>
                            <button style={{
                                background: 'rgba(255,255,255,0.12)', border: '2px solid rgba(255,255,255,0.2)',
                                borderRadius: 16, padding: '16px 36px', color: '#fff',
                                fontSize: 16, fontWeight: 700, cursor: 'pointer',
                                backdropFilter: 'blur(8px)',
                                display: 'flex', alignItems: 'center', gap: 10,
                            }}>
                                <span style={{ fontSize: 22 }}>✨</span>
                                Try Premium
                            </button>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.4}>
                        <div style={{
                            display: 'flex', gap: 32, justifyContent: 'center',
                            marginTop: 48, flexWrap: 'wrap',
                        }}>
                            {[
                                '✓ Setup dalam 2 menit',
                                '✓ Gratis selamanya',
                                '✓ Tanpa iklan',
                                '✓ Data terenkripsi',
                            ].map(t => (
                                <span key={t} style={{
                                    color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 500,
                                }}>{t}</span>
                            ))}
                        </div>
                    </FadeIn>
                </div>
            </section>

        </>
    );
}

