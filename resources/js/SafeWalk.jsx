import { useState, useEffect, useRef } from 'react';

const useInView = (threshold = 0.12) => {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setInView(true);
            },
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

const CityIllustration = () => (
    <svg viewBox="0 0 1200 420" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', position: 'absolute', bottom: 0, left: 0 }}>
        <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1a3a6b" />
                <stop offset="100%" stopColor="#2d5da1" />
            </linearGradient>
            <linearGradient id="road" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2a2a3a" />
                <stop offset="100%" stopColor="#1a1a28" />
            </linearGradient>
        </defs>

        {[
            [0, 160, 60, 260],
            [70, 140, 50, 280],
            [130, 180, 55, 240],
            [190, 120, 45, 300],
            [240, 160, 60, 260],
            [310, 100, 50, 320],
            [370, 150, 45, 270],
            [430, 130, 55, 290],
            [600, 160, 60, 260],
            [670, 140, 50, 280],
            [730, 180, 55, 240],
            [790, 120, 45, 300],
            [840, 160, 60, 260],
            [910, 100, 50, 320],
            [970, 150, 45, 270],
            [1030, 130, 55, 290],
            [1100, 160, 60, 260],
            [1150, 140, 50, 280],
        ].map(([x, y, w, h], i) => (
            <rect key={i} x={x} y={y} width={w} height={h} fill="#162d52" rx="2" />
        ))}

        {[
            [20, 200, 70, 220],
            [100, 170, 80, 250],
            [200, 220, 65, 200],
            [290, 180, 90, 240],
            [400, 200, 70, 220],
            [490, 160, 85, 260],
            [590, 210, 70, 210],
            [680, 185, 80, 235],
            [780, 200, 75, 220],
            [870, 170, 85, 250],
            [980, 200, 70, 220],
            [1060, 185, 80, 235],
            [1140, 200, 70, 220],
        ].map(([x, y, w, h], i) => (
            <rect key={i} x={x} y={y} width={w} height={h} fill="#1e3d6b" rx="2" />
        ))}

        {[
            [35, 210, 8, 8],
            [55, 210, 8, 8],
            [35, 230, 8, 8],
            [55, 230, 8, 8],
            [115, 180, 8, 8],
            [145, 180, 8, 8],
            [115, 200, 8, 8],
            [145, 200, 8, 8],
            [310, 190, 8, 8],
            [340, 190, 8, 8],
            [310, 210, 8, 8],
            [700, 195, 8, 8],
            [730, 195, 8, 8],
            [700, 215, 8, 8],
            [730, 215, 8, 8],
            [895, 180, 8, 8],
            [925, 180, 8, 8],
            [895, 200, 8, 8],
        ].map(([x, y, w, h], i) => (
            <rect key={i} x={x} y={y} width={w} height={h} fill="#f5c842" opacity="0.7" rx="1" />
        ))}

        <rect x="0" y="350" width="1200" height="70" fill="url(#road)" />
        {[...Array(12).keys()].map((i) => (
            <rect key={i} x={i * 110} y="382" width="60" height="6" fill="#444" rx="2" />
        ))}
        <rect x="0" y="340" width="1200" height="12" fill="#c8c8d0" />

        {[80, 280, 480, 680, 880, 1080].map((x, i) => (
            <g key={i}>
                <rect x={x} y="270" width="5" height="75" fill="#999" />
                <rect x={x - 18} y="268" width="26" height="6" fill="#999" rx="3" />
                <ellipse cx={x - 5} cy="268" rx="10" ry="5" fill="#ffe580" opacity="0.9" />
                <ellipse cx={x - 5} cy="268" rx="20" ry="12" fill="#ffe580" opacity="0.15" />
            </g>
        ))}

        <g transform="translate(530, 270)">
            <ellipse cx="20" cy="55" rx="25" ry="8" fill="#4f8ef7" opacity="0.25" />
            <rect x="12" y="25" width="16" height="24" fill="#e8a87c" rx="3" />
            <rect x="13" y="47" width="7" height="16" fill="#3a5fa8" rx="2" />
            <rect x="22" y="47" width="7" height="16" fill="#3a5fa8" rx="2" />
            <circle cx="20" cy="18" r="10" fill="#f0c080" />
            <ellipse cx="20" cy="11" rx="10" ry="5" fill="#5a3a1a" />
            <rect x="27" y="30" width="12" height="5" fill="#e8a87c" rx="2" />
            <rect x="36" y="25" width="10" height="16" fill="#1a1a2e" rx="2" />
            <rect x="37" y="27" width="8" height="12" fill="#4f8ef7" rx="1" opacity="0.9" />
            <ellipse cx="20" cy="56" rx="7" ry="7" fill="#4f8ef7" opacity="0.3" />
        </g>

        <g transform="translate(550,230)">
            <circle cx="0" cy="0" r="12" fill="#4f8ef7" opacity="0.2" />
            <circle cx="0" cy="0" r="6" fill="#4f8ef7" />
            <line x1="0" y1="6" x2="0" y2="20" stroke="#4f8ef7" strokeWidth="2.5" />
        </g>

        <path d="M560,250 Q620,220 700,210 Q780,200 840,230" stroke="#4f8ef7" strokeWidth="3" fill="none" strokeDasharray="8,5" opacity="0.7" />
        <circle cx="840" cy="230" r="8" fill="#f59e0b" opacity="0.9" />

        {[
            [100, 30],
            [200, 50],
            [350, 20],
            [500, 40],
            [750, 25],
            [900, 45],
            [1050, 30],
            [1150, 55],
        ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="2" fill="#fff" opacity="0.6" />
        ))}
        <circle cx="150" cy="60" r="3" fill="#fff" opacity="0.4" />
        <circle cx="450" cy="35" r="3" fill="#fff" opacity="0.5" />
        <circle cx="1100" cy="55" r="22" fill="#fff9e6" opacity="0.9" />
        <circle cx="1112" cy="48" r="18" fill="#2d5da1" opacity="0.85" />
    </svg>
);

const HeroPhone = () => {
    const [ping, setPing] = useState(false);
    useEffect(() => {
        const t = setInterval(() => setPing((p) => !p), 2200);
        return () => clearInterval(t);
    }, []);

    return (
        <div style={{ width: 230, height: 460, background: '#fff', borderRadius: 40, boxShadow: '0 40px 80px rgba(30,60,120,0.22), 0 8px 24px rgba(30,60,120,0.12)', border: '8px solid #e8edf5', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 90, height: 22, background: '#1a1a2e', borderRadius: '0 0 14px 14px', zIndex: 10 }} />
            <div style={{ background: '#f0f4ff', padding: '28px 14px 8px', display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#6b7db3', fontWeight: 600 }}>
                <span>9:41</span>
                <span>●●● 5G</span>
            </div>
            <div style={{ padding: '10px 14px 0' }}>
                <p style={{ color: '#9ab', fontSize: 11, margin: 0 }}>Good evening,</p>
                <p style={{ color: '#1a2d5a', fontSize: 16, fontWeight: 700, margin: '2px 0 0' }}>Jauki 👋</p>
            </div>
            <div style={{ margin: '10px 12px 0', background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: 14, padding: '9px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: ping ? '0 0 10px #22c55e' : '0 0 3px #22c55e', transition: 'box-shadow 0.5s' }} />
                <div>
                    <p style={{ color: '#16a34a', fontSize: 11, fontWeight: 700, margin: 0 }}>You're Safe</p>
                    <p style={{ color: '#86efac', fontSize: 9, margin: 0 }}>Live monitoring active</p>
                </div>
            </div>
            <div style={{ margin: '10px 12px 0', background: '#dbeafe', borderRadius: 16, overflow: 'hidden', flex: 1, minHeight: 120, position: 'relative' }}>
                <svg viewBox="0 0 210 130" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
                    {[0, 1, 2, 3].map((i) => (
                        <line key={i} x1={i * 70} y1="0" x2={i * 70} y2="130" stroke="#93c5fd" strokeWidth="0.5" opacity="0.5" />
                    ))}
                    {[0, 1, 2].map((i) => (
                        <line key={i} x1="0" y1={i * 65} x2="210" y2={i * 65} stroke="#93c5fd" strokeWidth="0.5" opacity="0.5" />
                    ))}
                    <path d="M30,110 Q80,70 130,50 Q160,38 185,50" stroke="#3b82f6" strokeWidth="2.5" fill="none" strokeDasharray="6,3" />
                    <circle cx="30" cy="110" r="6" fill="#3b82f6" />
                    <circle cx="30" cy="110" r="10" fill="#3b82f6" opacity="0.2" />
                    <circle cx="185" cy="50" r="6" fill="#f59e0b" />
                    <rect x="138" y="20" width="56" height="18" fill="#f59e0b" rx="6" />
                    <text x="166" y="32" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="700">
                        ETA 8 min
                    </text>
                </svg>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, padding: '10px 12px 14px' }}>
                {[{ l: '🚨 SOS', bg: '#fef2f2', txt: '#dc2626', border: '#fecaca' }, { l: '📞 Fake Call', bg: '#faf5ff', txt: '#7c3aed', border: '#e9d5ff' }].map((b) => (
                    <div key={b.l} style={{ background: b.bg, border: `1.5px solid ${b.border}`, borderRadius: 12, padding: '8px 0', textAlign: 'center', color: b.txt, fontSize: 11, fontWeight: 700 }}>
                        {b.l}
                    </div>
                ))}
            </div>
        </div>
    );
};

const FeatureIllustration = ({ type }) => {
    if (type === 'tracking')
        return (
            <svg viewBox="0 0 260 160" style={{ width: '100%', height: '100%' }}>
                <rect width="260" height="160" fill="#dbeafe" rx="12" />
                {[0, 1, 2, 3].map((i) => (
                    <line key={i} x1={i * 87} y1="0" x2={i * 87} y2="160" stroke="#93c5fd" strokeWidth="0.8" opacity="0.6" />
                ))}
                {[0, 1, 2].map((i) => (
                    <line key={i} x1="0" y1={i * 80} x2="260" y2={i * 80} stroke="#93c5fd" strokeWidth="0.8" opacity="0.6" />
                ))}
                <path d="M30,130 Q80,90 130,60 Q180,35 230,50" stroke="#3b82f6" strokeWidth="3" fill="none" strokeDasharray="8,4" />
                <circle cx="30" cy="130" r="9" fill="#3b82f6" />
                <circle cx="30" cy="130" r="16" fill="#3b82f6" opacity="0.15" />
                <circle cx="230" cy="50" r="9" fill="#f59e0b" />
                <circle cx="230" cy="50" r="16" fill="#f59e0b" opacity="0.15" />
                <rect x="60" y="30" width="70" height="22" fill="#fff" rx="8" opacity="0.9" />
                <text x="95" y="44" textAnchor="middle" fill="#3b82f6" fontSize="10" fontWeight="700">
                    Live Location
                </text>
            </svg>
        );

    if (type === 'sos')
        return (
            <svg viewBox="0 0 260 160" style={{ width: '100%', height: '100%' }}>
                <rect width="260" height="160" fill="#fff1f2" rx="12" />
                <circle cx="130" cy="85" r="55" fill="#fecaca" opacity="0.5" />
                <circle cx="130" cy="85" r="38" fill="#fca5a5" opacity="0.5" />
                <circle cx="130" cy="85" r="24" fill="#ef4444" />
                <text x="130" y="91" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="900">
                    SOS
                </text>
            </svg>
        );

    if (type === 'fakecall')
        return (
            <svg viewBox="0 0 260 160" style={{ width: '100%', height: '100%' }}>
                <rect width="260" height="160" fill="#faf5ff" rx="12" />
                <rect x="90" y="15" width="80" height="130" fill="#1a1a2e" rx="16" />
                <rect x="95" y="22" width="70" height="116" fill="#f8f0ff" rx="12" />
                <circle cx="130" cy="60" r="22" fill="#e9d5ff" />
                <text x="130" y="67" textAnchor="middle" fontSize="22">
                    👩
                </text>
                <text x="130" y="97" textAnchor="middle" fill="#7c3aed" fontSize="11" fontWeight="700">
                    Mom
                </text>
                <text x="130" y="111" textAnchor="middle" fill="#a78bfa" fontSize="9">
                    Incoming call…
                </text>
            </svg>
        );

    return (
        <svg viewBox="0 0 260 160" style={{ width: '100%', height: '100%' }}>
            <rect width="260" height="160" fill="#fffbeb" rx="12" />
            <ellipse cx="130" cy="65" rx="30" ry="32" fill="#fde68a" />
            <circle cx="158" cy="42" r="12" fill="#ef4444" />
            <text x="158" y="47" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="900">
                !
            </text>
            <rect x="30" y="115" width="200" height="34" fill="#fff" rx="10" />
            <text x="47" y="129" fill="#1a2d5a" fontSize="9" fontWeight="700">
                Are you safe?
            </text>
            <text x="47" y="141" fill="#6b7db3" fontSize="8">
                No response → alert sent
            </text>
        </svg>
    );
};

const BrandLogos = () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
        {['🛡️ Apple Academy', '🌐 Google For Startups', '⚡ Y Combinator', '🔒 SecureNet', '🏆 SafetyFirst'].map((b) => (
            <span key={b} style={{ color: '#94a3b8', fontSize: 14, fontWeight: 600, letterSpacing: '-0.3px', opacity: 0.7 }}>
                {b}
            </span>
        ))}
    </div>
);

const TestiCard = ({ avatar, name, role, text, stars, delay }) => {
    const [ref, inView] = useInView();
    return (
        <div
            ref={ref}
            style={{
                background: '#fff',
                borderRadius: 20,
                padding: '24px',
                boxShadow: '0 4px 24px rgba(30,60,120,0.08)',
                border: '1px solid #e8edf5',
                opacity: inView ? 1 : 0,
                transform: inView ? 'none' : 'translateY(24px)',
                transition: `all 0.7s ease ${delay}s`,
            }}
        >
            <div style={{ fontSize: 14, color: '#f59e0b', marginBottom: 12 }}>{'★'.repeat(stars)}</div>
            <p style={{ color: '#374151', fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>"{text}"</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{avatar}</div>
                <div>
                    <p style={{ color: '#1a2d5a', fontWeight: 700, fontSize: 13, margin: 0 }}>{name}</p>
                    <p style={{ color: '#94a3b8', fontSize: 12, margin: 0 }}>{role}</p>
                </div>
            </div>
        </div>
    );
};

const StepCard = ({ num, title, desc, color, delay }) => {
    const [ref, inView] = useInView();
    return (
        <div
            ref={ref}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 14,
                opacity: inView ? 1 : 0,
                transform: inView ? 'none' : 'translateY(28px)',
                transition: `all 0.7s ease ${delay}s`,
            }}
        >
            <div style={{ width: 56, height: 56, borderRadius: 18, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 8px 20px ${color}55` }}>
                <span style={{ color: '#fff', fontSize: 22, fontWeight: 900 }}>{num}</span>
            </div>
            <h3 style={{ color: '#1a2d5a', fontSize: 18, fontWeight: 700, margin: 0 }}>{title}</h3>
            <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.65, margin: 0 }}>{desc}</p>
        </div>
    );
};

const FeatureCard = ({ feature, delay }) => {
    const [ref, inView] = useInView();
    return (
        <div
            ref={ref}
            style={{
                background: '#fff',
                borderRadius: 24,
                overflow: 'hidden',
                boxShadow: '0 4px 24px rgba(30,60,120,0.07)',
                border: '1px solid #e8edf5',
                opacity: inView ? 1 : 0,
                transform: inView ? 'none' : 'translateY(28px)',
                transition: `all 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
            }}
        >
            <div style={{ height: 170, position: 'relative' }}>
                <FeatureIllustration type={feature.type} />
            </div>
            <div style={{ padding: '20px 24px 24px' }}>
                <div style={{ display: 'inline-block', background: `${feature.tagColor}12`, border: `1.5px solid ${feature.tagColor}25`, borderRadius: 8, padding: '3px 10px', marginBottom: 10 }}>
                    <span style={{ color: feature.tagColor, fontSize: 11, fontWeight: 700 }}>{feature.tag}</span>
                </div>
                <h3 style={{ color: '#1a2d5a', fontSize: 18, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.4px' }}>{feature.title}</h3>
                <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.65 }}>{feature.desc}</p>
            </div>
        </div>
    );
};

const TiltFeatureCard = ({ card, index }) => {
    const [ref, inView] = useInView();
    return (
        <div
            ref={ref}
            style={{
                minWidth: 190,
                background: '#fff',
                borderRadius: 24,
                padding: '22px 18px 18px',
                boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
                transform: inView ? `rotate(${card.rotate})` : `rotate(${card.rotate}) translateY(40px)`,
                opacity: inView ? 1 : 0,
                transition: `all 0.7s cubic-bezier(0.22,1,0.36,1) ${index * 0.1}s`,
                marginTop: card.mt,
                position: 'relative',
                flexShrink: 0,
            }}
        >
            <div style={{ position: 'absolute', top: -10, right: 18, fontSize: 20 }}>📎</div>
            <div style={{ fontSize: 52, marginBottom: 14, filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.15))' }}>{card.emoji}</div>
            <h3 style={{ color: '#1a2d5a', fontSize: 16, fontWeight: 800, letterSpacing: '-0.4px', marginBottom: 4 }}>{card.title}</h3>
            <p style={{ color: '#94a3b8', fontSize: 12, marginBottom: 14 }}>{card.sub}</p>
            <div style={{ display: 'inline-block', background: card.tagBg, borderRadius: 8, padding: '4px 10px' }}>
                <span style={{ color: card.tagColor, fontSize: 11, fontWeight: 700 }}>{card.count}</span>
            </div>
        </div>
    );
};

const ExploreCard = ({ card, delay }) => {
    const [ref, inView] = useInView();
    return (
        <div
            ref={ref}
            style={{
                background: '#fff',
                borderRadius: 24,
                overflow: 'hidden',
                boxShadow: '0 4px 28px rgba(30,60,120,0.07)',
                border: '1px solid #e8edf5',
                opacity: inView ? 1 : 0,
                transform: inView ? 'none' : 'translateY(28px)',
                transition: `all 0.7s ease ${delay}s`,
            }}
        >
            <div style={{ height: 160, background: card.bgImg, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 64, filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.12))' }}>{card.emoji}</span>
                <div style={{ position: 'absolute', top: 14, left: 14, display: 'flex', gap: 6 }}>
                    {card.tags.map((tg) => (
                        <span key={tg.t} style={{ background: tg.bg, color: tg.tc, fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 8 }}>
                            {tg.t}
                        </span>
                    ))}
                </div>
                {card.hot && (
                    <div style={{ position: 'absolute', top: 14, right: 14, background: '#f59e0b', borderRadius: 8, padding: '4px 10px', fontSize: 11, fontWeight: 700, color: '#fff' }}>
                        🔥 Terpopuler
                    </div>
                )}
            </div>
            <div style={{ padding: '20px 22px 22px' }}>
                <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                    {card.tagPills.map((tp) => (
                        <span key={tp} style={{ background: '#f1f5f9', color: '#64748b', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 6 }}>
                            {tp}
                        </span>
                    ))}
                </div>
                <h3 style={{ color: '#1a2d5a', fontSize: 17, fontWeight: 800, letterSpacing: '-0.4px', marginBottom: 8 }}>{card.title}</h3>
                <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.65, marginBottom: 16 }}>{card.sub}</p>
                <div style={{ display: 'flex', gap: 20, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #f1f5f9' }}>
                    {[
                        ['Mode', card.theory],
                        ['Aksi', card.practice],
                    ].map(([label, val]) => (
                        <div key={label}>
                            <p style={{ color: '#94a3b8', fontSize: 11, fontWeight: 600, margin: '0 0 2px' }}>{label}</p>
                            <p style={{ color: '#1a2d5a', fontSize: 13, fontWeight: 700, margin: 0 }}>{val}</p>
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#94a3b8', fontSize: 12 }}>⏱ {card.hours}</span>
                    <button style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)', border: 'none', borderRadius: 10, padding: '8px 16px', color: '#fff', fontSize: 12, fontWeight: 700, boxShadow: '0 4px 12px rgba(99,102,241,0.25)' }}>
                        Detail →
                    </button>
                </div>
            </div>
        </div>
    );
};

const Nav = () => {
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const h = () => setScrolled(window.scrollY > 30);
        window.addEventListener('scroll', h);
        return () => window.removeEventListener('scroll', h);
    }, []);

    return (
        <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, background: scrolled ? 'rgba(255,255,255,0.92)' : 'transparent', backdropFilter: scrolled ? 'blur(20px)' : 'none', boxShadow: scrolled ? '0 1px 0 rgba(0,0,0,0.06)' : 'none', transition: 'all 0.35s ease' }}>
            <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 28px', height: 66, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 11, background: 'linear-gradient(135deg,#3b82f6,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>
                        🛡️
                    </div>
                    <span style={{ color: '#1a2d5a', fontWeight: 800, fontSize: 18, letterSpacing: '-0.5px' }}>SafeWalk</span>
                </div>
                <div style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
                    {['Features', 'How It Works', 'Safety', 'About'].map((l) => (
                        <a key={l} href="#" style={{ color: '#4b6080', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>
                            {l}
                        </a>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <button style={{ background: 'none', border: 'none', color: '#4b6080', fontSize: 14, fontWeight: 600 }}>Sign In</button>
                    <button style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)', border: 'none', borderRadius: 12, padding: '10px 22px', color: '#fff', fontSize: 14, fontWeight: 700, boxShadow: '0 4px 16px rgba(99,102,241,0.3)' }}>
                        Get the App
                    </button>
                </div>
            </div>
        </nav>
    );
};

const SOSButton = () => {
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
                setTimeout(() => {
                    setDone(false);
                    setProgress(0);
                    setHeld(false);
                }, 2500);
            }
        }, 100);
    };

    const stop = () => {
        clearInterval(timer.current);
        if (!done) {
            setHeld(false);
            setProgress(0);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <div onMouseDown={start} onMouseUp={stop} onMouseLeave={stop} onTouchStart={start} onTouchEnd={stop} style={{ width: 110, height: 110, borderRadius: '50%', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', userSelect: 'none', background: done ? '#fef2f2' : held ? '#fef2f2' : '#fff5f5', boxShadow: done ? '0 0 40px rgba(239,68,68,0.35)' : '0 4px 20px rgba(239,68,68,0.15)', border: `2.5px solid ${done ? '#ef4444' : held ? 'rgba(239,68,68,0.5)' : 'rgba(239,68,68,0.2)'}`, transition: 'all 0.2s ease' }}>
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 110 110">
                    <circle cx="55" cy="55" r="50" fill="none" stroke="rgba(239,68,68,0.15)" strokeWidth="5" />
                    <circle cx="55" cy="55" r="50" fill="none" stroke="#ef4444" strokeWidth="5" strokeDasharray={`${progress * 3.14} 314`} strokeLinecap="round" />
                </svg>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ color: '#ef4444', fontWeight: 900, fontSize: done ? 11 : 16, margin: 0 }}>{done ? 'SENT!' : 'SOS'}</p>
                    {!done && <p style={{ color: 'rgba(239,68,68,0.5)', fontSize: 10, margin: '2px 0 0' }}>Hold 3s</p>}
                </div>
            </div>
            <p style={{ color: '#94a3b8', fontSize: 12, textAlign: 'center' }}>{done ? '✅ Emergency alert sent to your contacts!' : 'Hold to trigger emergency alert'}</p>
        </div>
    );
};

const FakeCall = () => {
    const [state, setState] = useState('idle');
    useEffect(() => {
        let t;
        if (state === 'calling') t = setTimeout(() => setState('idle'), 3000);
        return () => clearTimeout(t);
    }, [state]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {state === 'ringing' ? (
                <div style={{ background: '#f8f0ff', borderRadius: 20, padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#e9d5ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, zIndex: 1 }}>👩</div>
                        {[0, 1].map((i) => (
                            <div key={i} style={{ position: 'absolute', width: 60, height: 60, borderRadius: '50%', border: '2px solid rgba(168,85,247,0.4)', animation: `ping-ring ${1.5 + i * 0.5}s ease-out infinite`, animationDelay: `${i * 0.3}s` }} />
                        ))}
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ color: '#7c3aed', fontWeight: 700, fontSize: 16, margin: 0 }}>Mom</p>
                        <p style={{ color: '#a78bfa', fontSize: 12, margin: '4px 0 0' }}>Incoming call…</p>
                    </div>
                    <div style={{ display: 'flex', gap: 24 }}>
                        <button onClick={() => setState('idle')} style={{ width: 52, height: 52, borderRadius: '50%', background: '#ef4444', border: 'none', fontSize: 20 }}>
                            📵
                        </button>
                        <button onClick={() => setState('calling')} style={{ width: 52, height: 52, borderRadius: '50%', background: '#22c55e', border: 'none', fontSize: 20 }}>
                            📞
                        </button>
                    </div>
                </div>
            ) : state === 'calling' ? (
                <div style={{ background: '#f0fdf4', borderRadius: 20, padding: 20, textAlign: 'center' }}>
                    <p style={{ fontSize: 28 }}>👩</p>
                    <p style={{ color: '#16a34a', fontWeight: 700, margin: '8px 0 4px' }}>Mom • In call</p>
                    <p style={{ color: '#94a3b8', fontSize: 13 }}>Ending soon…</p>
                </div>
            ) : (
                <div>
                    <p style={{ color: '#64748b', fontSize: 13, marginBottom: 12 }}>Pick who to call:</p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {['👩 Mom', '👫 Friend', '👮 Security'].map((n) => (
                            <button key={n} onClick={() => setState('ringing')} style={{ background: '#f8f0ff', border: '1.5px solid #e9d5ff', borderRadius: 12, padding: '8px 14px', color: '#7c3aed', fontSize: 13, fontWeight: 600 }}>
                                {n}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default function SafeWalk() {
    const features = [
        { type: 'tracking', title: 'Live Tracking', desc: 'Real-time GPS shared with trusted contacts. They see exactly where you are and follow your route live.', tag: 'Real-Time GPS', tagColor: '#3b82f6' },
        { type: 'sos', title: 'Emergency SOS', desc: 'Hold 3 seconds to instantly alert all trusted contacts with your location. Every second counts.', tag: '1-Touch Alert', tagColor: '#ef4444' },
        { type: 'fakecall', title: 'Fake Call', desc: 'Simulate an incoming call from Mom, a friend, or security to safely exit any uncomfortable situation.', tag: 'Smart Escape', tagColor: '#7c3aed' },
        { type: 'alert', title: 'Auto Safety Alert', desc: "Stops too long? Off-route? SafeWalk auto-checks if you're safe and alerts contacts if you don't respond.", tag: 'AI Monitoring', tagColor: '#f59e0b' },
    ];

    const tiltedFeatures = [
        { emoji: '📍', title: 'Live Tracking', sub: 'Lokasi realtime', count: '5 fitur', rotate: '-4deg', mt: 40, tagBg: '#dbeafe', tagColor: '#1d4ed8' },
        { emoji: '🚨', title: 'Emergency SOS', sub: 'Tekan & kirim', count: '3 mode', rotate: '2deg', mt: 0, tagBg: '#fee2e2', tagColor: '#dc2626' },
        { emoji: '📞', title: 'Fake Call', sub: 'Simulasi panggilan', count: '3 kontak', rotate: '-2deg', mt: 24, tagBg: '#f3e8ff', tagColor: '#7c3aed' },
        { emoji: '🔔', title: 'Auto Alert', sub: 'Monitor otomatis', count: 'AI powered', rotate: '4deg', mt: 10, tagBg: '#fef3c7', tagColor: '#d97706' },
        { emoji: '👥', title: 'Trusted Circle', sub: 'Kontak terpercaya', count: 'Hingga 10', rotate: '-3deg', mt: 32, tagBg: '#dcfce7', tagColor: '#16a34a' },
    ];

    const exploreCards = [
        { bgImg: 'linear-gradient(135deg,#bbf7d0,#86efac)', emoji: '📍🗺️', tags: [{ t: 'Gratis', bg: '#4ade80', tc: '#fff' }, { t: 'Realtime', bg: '#fff', tc: '#16a34a' }], hot: true, title: 'Live Location Tracking', sub: 'Pantau posisi realtime, bagikan rute ke keluarga, dan terima notifikasi tiba.', tagPills: ['#lokasi', '#keamanan'], theory: 'Tracking', practice: 'Auto-share', hours: 'Aktif 24 jam' },
        { bgImg: 'linear-gradient(135deg,#fecdd3,#fda4af)', emoji: '🚨📳', tags: [{ t: 'Gratis', bg: '#f87171', tc: '#fff' }, { t: 'Priority', bg: '#fff', tc: '#dc2626' }], hot: false, title: 'Emergency SOS Alert', sub: 'Kirim sinyal darurat dalam 3 detik ke semua kontak terpercaya dengan lokasi.', tagPills: ['#sos', '#darurat'], theory: '1-tap SOS', practice: 'Broadcast', hours: 'Respon < 3 detik' },
        { bgImg: 'linear-gradient(135deg,#e9d5ff,#c4b5fd)', emoji: '📞🎭', tags: [{ t: 'Gratis', bg: '#a78bfa', tc: '#fff' }, { t: 'Smart', bg: '#fff', tc: '#7c3aed' }], hot: false, title: 'Fake Call Simulator', sub: 'Simulasikan panggilan masuk dari orang terpercaya untuk keluar dari situasi berbahaya.', tagPills: ['#fakecall', '#escape'], theory: 'Simulasi', practice: 'Realtime', hours: 'Delay 10s–1 menit' },
    ];

    return (
        <div style={{ background: '#f8faff', fontFamily: "'DM Sans','SF Pro Display',-apple-system,BlinkMacSystemFont,sans-serif", color: '#1a2d5a', overflowX: 'hidden' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
                * { box-sizing:border-box; margin:0; padding:0; }
                @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
                @keyframes ping-ring { 0%{transform:scale(1);opacity:0.7} 100%{transform:scale(2.2);opacity:0} }
                ::-webkit-scrollbar{width:6px} ::-webkit-scrollbar-track{background:#f0f4ff} ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px}
                a:hover{opacity:0.75} button:hover{opacity:0.9; transform:translateY(-1px)} button{transition:all 0.2s ease}
                @media (max-width: 1000px) {
                    .hero-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
                    .demo-grid { grid-template-columns: 1fr !important; }
                    .impact-row { flex-direction: column; align-items: flex-start !important; }
                }
            `}</style>

            <Nav />
            <section style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', background: 'linear-gradient(160deg, #1a3a6b 0%, #2d5da1 45%, #1e4d8c 100%)', display: 'flex', alignItems: 'center', paddingTop: 66 }}>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 420, pointerEvents: 'none' }}>
                    <CityIllustration />
                </div>
                <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 28px', width: '100%', position: 'relative', zIndex: 10 }}>
                    <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 60, alignItems: 'center' }}>
                        <div>
                            <FadeIn delay={0.2}>
                                <h1 style={{ fontSize: 'clamp(38px,5.5vw,64px)', fontWeight: 900, lineHeight: 1.06, letterSpacing: '-2px', color: '#fff', marginBottom: 20 }}>
                                    Your smart companion
                                    <br />
                                    <span style={{ color: '#93c5fd' }}>for safer journeys.</span>
                                </h1>
                            </FadeIn>
                            <FadeIn delay={0.35}>
                                <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, maxWidth: 480, marginBottom: 36 }}>
                                    Walk home without fear. SafeWalk keeps you connected to trusted people with live tracking, emergency SOS, and smart safety monitoring.
                                </p>
                            </FadeIn>
                        </div>
                        <FadeIn delay={0.3} from="right">
                            <HeroPhone />
                        </FadeIn>
                    </div>
                </div>
            </section>

            <section style={{ background: '#fff', padding: '32px 28px', borderBottom: '1px solid #e8edf5' }}>
                <FadeIn>
                    <div style={{ maxWidth: 1140, margin: '0 auto' }}>
                        <BrandLogos />
                    </div>
                </FadeIn>
            </section>

            <section style={{ padding: '100px 28px', background: '#f8faff' }}>
                <div style={{ maxWidth: 1140, margin: '0 auto' }}>
                    <FadeIn>
                        <div style={{ textAlign: 'center', marginBottom: 64 }}>
                            <p style={{ color: '#3b82f6', fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Core Features</p>
                            <h2 style={{ fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 900, letterSpacing: '-1.5px', color: '#1a2d5a', lineHeight: 1.15 }}>
                                Smart Features That
                                <br />
                                <span style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Keep You Protected</span>
                            </h2>
                        </div>
                    </FadeIn>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20 }}>
                        {features.map((feature, i) => (
                            <FeatureCard key={feature.title} feature={feature} delay={i * 0.1} />
                        ))}
                    </div>
                </div>
            </section>

            <section style={{ padding: '80px 28px', background: '#fff' }}>
                <div style={{ maxWidth: 960, margin: '0 auto' }}>
                    <div className="demo-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                        <FadeIn delay={0.1}>
                            <div style={{ background: '#fff5f5', border: '1.5px solid #fecaca', borderRadius: 28, padding: '36px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
                                <SOSButton />
                            </div>
                        </FadeIn>
                        <FadeIn delay={0.2}>
                            <div style={{ background: '#faf5ff', border: '1.5px solid #e9d5ff', borderRadius: 28, padding: '36px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <FakeCall />
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            <section style={{ padding: '100px 28px', background: '#f8faff' }}>
                <div style={{ maxWidth: 1140, margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 40 }}>
                        {[
                            { num: '01', title: 'Add Contacts', desc: "Add trusted people who'll receive your live location and emergency alerts.", color: '#3b82f6', delay: 0 },
                            { num: '02', title: 'Start Journey', desc: 'Set your destination and begin. Contacts are notified immediately.', color: '#6366f1', delay: 0.12 },
                            { num: '03', title: 'Stay Monitored', desc: 'SafeWalk watches your route, timing, and movement automatically.', color: '#a855f7', delay: 0.24 },
                            { num: '04', title: 'Arrive Safe', desc: 'Tap Arrived to let everyone know you made it safely.', color: '#22c55e', delay: 0.36 },
                        ].map((s) => (
                            <StepCard key={s.num} {...s} />
                        ))}
                    </div>
                </div>
            </section>

            <section style={{ padding: '80px 28px', background: '#fff' }}>
                <div style={{ maxWidth: 1140, margin: '0 auto' }}>
                    <div className="impact-row" style={{ background: 'linear-gradient(135deg,#1a3a6b 0%,#2d5da1 100%)', borderRadius: 32, padding: '64px 56px', display: 'flex', alignItems: 'center', gap: 60, flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: 280 }}>
                            <h2 style={{ color: '#fff', fontSize: 'clamp(26px,3vw,38px)', fontWeight: 900, lineHeight: 1.2, marginBottom: 20 }}>Because no one should feel unsafe walking home at night.</h2>
                        </div>
                    </div>
                </div>
            </section>

            <section style={{ padding: '80px 28px', background: '#f8faff' }}>
                <div style={{ maxWidth: 1140, margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
                        {[
                            { avatar: '👩‍🎓', name: 'Rania Putri', role: 'Mahasiswi UNAIR', text: 'Pulang malam jadi jauh lebih tenang. Mama langsung bisa lihat posisiku realtime.', stars: 5, delay: 0 },
                            { avatar: '👩', name: 'Dewi Kusuma', role: 'Karyawan Surabaya', text: 'Fitur fake call-nya keren banget. Dipakai saat situasi tidak nyaman.', stars: 5, delay: 0.1 },
                            { avatar: '👩‍💼', name: 'Sarah Ahmad', role: 'Dosen UM Surabaya', text: 'Saya rekomendasikan ke mahasiswi saya. Simpel dan sangat berguna.', stars: 5, delay: 0.2 },
                        ].map((t) => (
                            <TestiCard key={t.name} {...t} />
                        ))}
                    </div>
                </div>
            </section>

            <section style={{ padding: '90px 28px', background: '#1d8cf8', overflow: 'hidden' }}>
                <div style={{ maxWidth: 1140, margin: '0 auto' }}>
                    <div style={{ display: 'flex', gap: 20, alignItems: 'flex-end', overflowX: 'auto', paddingBottom: 16 }}>
                        {tiltedFeatures.map((card, i) => (
                            <TiltFeatureCard key={card.title} card={card} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            <section style={{ padding: '90px 28px', background: '#f8faff' }}>
                <div style={{ maxWidth: 1140, margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20 }}>
                        {exploreCards.map((card, i) => (
                            <ExploreCard key={card.title} card={card} delay={i * 0.1} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
