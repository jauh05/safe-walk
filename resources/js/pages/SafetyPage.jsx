import { useState, useEffect, useRef, useCallback } from 'react';

/* ─── useInView hook ─── */
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

/* ─── FadeIn component ─── */
const FadeIn = ({ children, delay = 0, className = '', from = 'bottom', style = {} }) => {
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
                ...style,
            }}
        >
            {children}
        </div>
    );
};

/* ─── Animated Counter ─── */
const AnimatedCounter = ({ end, suffix = '', prefix = '', duration = 2000, decimals = 0 }) => {
    const [count, setCount] = useState(0);
    const [ref, inView] = useInView(0.3);
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (!inView || hasAnimated.current) return;
        hasAnimated.current = true;
        const startTime = performance.now();
        const step = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(eased * end);
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [inView, end, duration]);

    const display = decimals > 0 ? count.toFixed(decimals) : Math.floor(count);
    return <span ref={ref}>{prefix}{display}{suffix}</span>;
};

/* ─── Shield SVG ─── */
const ShieldIcon = ({ size = 80, color1 = '#3b82f6', color2 = '#6366f1' }) => (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="shieldGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={color1} />
                <stop offset="100%" stopColor={color2} />
            </linearGradient>
            <filter id="shieldGlow">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
        <path
            d="M40 6L12 18v18c0 16.6 11.9 32.1 28 36 16.1-3.9 28-19.4 28-36V18L40 6z"
            fill="url(#shieldGrad)"
            filter="url(#shieldGlow)"
            opacity="0.9"
        />
        <path
            d="M40 12L18 22v14c0 13.4 9.4 26 22 29.2 12.6-3.2 22-15.8 22-29.2V22L40 12z"
            fill="url(#shieldGrad)"
        />
        <path
            d="M34 40l4 4 10-10"
            stroke="#fff"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
        />
    </svg>
);

/* ─── Safe Zone Map SVG ─── */
const SafeZoneMap = () => {
    const [ref, inView] = useInView(0.15);
    return (
        <div ref={ref}>
            <svg viewBox="0 0 700 400" style={{ width: '100%', height: '100%', borderRadius: 24 }} xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="mapBg" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#dbeafe" />
                        <stop offset="100%" stopColor="#ede9fe" />
                    </linearGradient>
                    <radialGradient id="safeZone1"><stop offset="0%" stopColor="#22c55e" stopOpacity="0.35" /><stop offset="100%" stopColor="#22c55e" stopOpacity="0" /></radialGradient>
                    <radialGradient id="safeZone2"><stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" /><stop offset="100%" stopColor="#3b82f6" stopOpacity="0" /></radialGradient>
                    <radialGradient id="safeZone3"><stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" /><stop offset="100%" stopColor="#22c55e" stopOpacity="0" /></radialGradient>
                </defs>
                <rect width="700" height="400" fill="url(#mapBg)" rx="24" />

                {/* Grid lines */}
                {[...Array(14)].map((_, i) => (
                    <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="400" stroke="#93c5fd" strokeWidth="0.5" opacity="0.4" />
                ))}
                {[...Array(8)].map((_, i) => (
                    <line key={`h${i}`} x1="0" y1={i * 50} x2="700" y2={i * 50} stroke="#93c5fd" strokeWidth="0.5" opacity="0.4" />
                ))}

                {/* Roads */}
                <path d="M0,200 L700,200" stroke="#cbd5e1" strokeWidth="12" opacity="0.5" />
                <path d="M350,0 L350,400" stroke="#cbd5e1" strokeWidth="10" opacity="0.5" />
                <path d="M100,100 L600,350" stroke="#cbd5e1" strokeWidth="8" opacity="0.3" />
                <path d="M50,300 L650,80" stroke="#cbd5e1" strokeWidth="6" opacity="0.3" />

                {/* Safe zones */}
                <circle cx="180" cy="150" r="90" fill="url(#safeZone1)" style={{
                    opacity: inView ? 1 : 0,
                    transition: 'opacity 1s ease 0.3s',
                }} />
                <circle cx="180" cy="150" r="55" fill="none" stroke="#22c55e" strokeWidth="2" strokeDasharray="6,4" opacity="0.6" style={{
                    opacity: inView ? 0.6 : 0,
                    transition: 'opacity 1s ease 0.5s',
                }} />

                <circle cx="480" cy="120" r="80" fill="url(#safeZone2)" style={{
                    opacity: inView ? 1 : 0,
                    transition: 'opacity 1s ease 0.5s',
                }} />
                <circle cx="480" cy="120" r="50" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="6,4" opacity="0.5" style={{
                    opacity: inView ? 0.5 : 0,
                    transition: 'opacity 1s ease 0.7s',
                }} />

                <circle cx="350" cy="300" r="100" fill="url(#safeZone3)" style={{
                    opacity: inView ? 1 : 0,
                    transition: 'opacity 1s ease 0.7s',
                }} />
                <circle cx="350" cy="300" r="65" fill="none" stroke="#22c55e" strokeWidth="2" strokeDasharray="6,4" opacity="0.5" style={{
                    opacity: inView ? 0.5 : 0,
                    transition: 'opacity 1s ease 0.9s',
                }} />

                {/* Safe zone labels */}
                <g style={{ opacity: inView ? 1 : 0, transition: 'opacity 0.8s ease 0.6s' }}>
                    <rect x="140" y="130" width="80" height="26" fill="#fff" rx="8" opacity="0.9" />
                    <text x="180" y="148" textAnchor="middle" fill="#16a34a" fontSize="11" fontWeight="700">✓ Zona Aman</text>
                </g>
                <g style={{ opacity: inView ? 1 : 0, transition: 'opacity 0.8s ease 0.8s' }}>
                    <rect x="435" y="100" width="90" height="26" fill="#fff" rx="8" opacity="0.9" />
                    <text x="480" y="118" textAnchor="middle" fill="#3b82f6" fontSize="11" fontWeight="700">🏫 Kampus</text>
                </g>
                <g style={{ opacity: inView ? 1 : 0, transition: 'opacity 0.8s ease 1s' }}>
                    <rect x="305" y="282" width="90" height="26" fill="#fff" rx="8" opacity="0.9" />
                    <text x="350" y="300" textAnchor="middle" fill="#16a34a" fontSize="11" fontWeight="700">🏥 RS Area</text>
                </g>

                {/* Pins */}
                {[
                    { cx: 120, cy: 250, color: '#ef4444', label: '⚠️' },
                    { cx: 580, cy: 280, color: '#f59e0b', label: '⚡' },
                    { cx: 250, cy: 80, color: '#22c55e', label: '🛡️' },
                    { cx: 600, cy: 180, color: '#22c55e', label: '🛡️' },
                ].map((pin, i) => (
                    <g key={i} style={{ opacity: inView ? 1 : 0, transition: `opacity 0.6s ease ${0.4 + i * 0.15}s` }}>
                        <circle cx={pin.cx} cy={pin.cy} r="14" fill={pin.color} opacity="0.2" />
                        <circle cx={pin.cx} cy={pin.cy} r="8" fill={pin.color} />
                        <text x={pin.cx} y={pin.cy + 4} textAnchor="middle" fontSize="8">{pin.label}</text>
                    </g>
                ))}

                {/* Walking person with pulse */}
                <g style={{ opacity: inView ? 1 : 0, transition: 'opacity 0.8s ease 0.5s' }}>
                    <circle cx="320" cy="180" r="20" fill="#3b82f6" opacity="0.15">
                        <animate attributeName="r" values="20;30;20" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.15;0.05;0.15" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="320" cy="180" r="7" fill="#3b82f6" />
                    <circle cx="320" cy="180" r="3" fill="#fff" />
                </g>

                {/* Route line */}
                <path d="M320,180 Q380,160 420,200 Q460,240 500,220" stroke="#3b82f6" strokeWidth="3" fill="none" strokeDasharray="8,5" opacity="0.7" style={{
                    opacity: inView ? 0.7 : 0,
                    transition: 'opacity 1s ease 0.8s',
                }} />
                <circle cx="500" cy="220" r="6" fill="#f59e0b" style={{
                    opacity: inView ? 1 : 0,
                    transition: 'opacity 0.8s ease 1s',
                }} />
            </svg>
        </div>
    );
};

/* ─── Section Badge ─── */
const SectionBadge = ({ text }) => (
    <span style={{
        display: 'inline-block',
        background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(99,102,241,0.1))',
        border: '1.5px solid rgba(59,130,246,0.2)',
        borderRadius: 30,
        padding: '6px 18px',
        color: '#3b82f6',
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        marginBottom: 16,
    }}>
        {text}
    </span>
);

/* ─── Privacy Card ─── */
const PrivacyCard = ({ icon, title, desc, delay, gradient }) => {
    const [ref, inView] = useInView();
    const [hovered, setHovered] = useState(false);
    return (
        <div
            ref={ref}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: hovered ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: 24,
                padding: '32px 28px',
                border: '1px solid rgba(255,255,255,0.3)',
                boxShadow: hovered
                    ? '0 20px 60px rgba(30,60,120,0.15), 0 4px 16px rgba(30,60,120,0.08)'
                    : '0 4px 24px rgba(30,60,120,0.06)',
                opacity: inView ? 1 : 0,
                transform: inView
                    ? hovered ? 'translateY(-4px)' : 'none'
                    : 'translateY(28px)',
                transition: `all 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
                cursor: 'default',
            }}
        >
            <div style={{
                width: 56,
                height: 56,
                borderRadius: 18,
                background: gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 26,
                marginBottom: 20,
                boxShadow: `0 8px 24px ${gradient.includes('#22c55e') ? 'rgba(34,197,94,0.25)' : gradient.includes('#6366f1') ? 'rgba(99,102,241,0.25)' : 'rgba(59,130,246,0.25)'}`,
            }}>
                {icon}
            </div>
            <h3 style={{ color: '#1a2d5a', fontSize: 18, fontWeight: 800, marginBottom: 10, letterSpacing: '-0.3px' }}>{title}</h3>
            <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.75 }}>{desc}</p>
        </div>
    );
};

/* ─── Safety Tip Card ─── */
const SafetyTipCard = ({ icon, title, desc, delay, color }) => {
    const [ref, inView] = useInView();
    const [hovered, setHovered] = useState(false);
    return (
        <div
            ref={ref}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: '#fff',
                borderRadius: 20,
                padding: '28px 24px',
                border: `1.5px solid ${hovered ? color + '40' : '#e8edf5'}`,
                boxShadow: hovered
                    ? `0 16px 48px ${color}18, 0 4px 16px rgba(30,60,120,0.06)`
                    : '0 2px 16px rgba(30,60,120,0.05)',
                opacity: inView ? 1 : 0,
                transform: inView
                    ? hovered ? 'translateY(-6px)' : 'none'
                    : 'translateY(24px)',
                transition: `all 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
                cursor: 'default',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <div style={{
                position: 'absolute',
                top: -30,
                right: -30,
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: color,
                opacity: 0.06,
            }} />
            <div style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: `${color}14`,
                border: `1.5px solid ${color}25`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                marginBottom: 16,
            }}>
                {icon}
            </div>
            <h4 style={{ color: '#1a2d5a', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{title}</h4>
            <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.7 }}>{desc}</p>
        </div>
    );
};

/* ─── Testimonial Card ─── */
const TestimonialCard = ({ avatar, name, role, text, stars, delay, highlight }) => {
    const [ref, inView] = useInView();
    return (
        <div
            ref={ref}
            style={{
                background: highlight
                    ? 'linear-gradient(135deg, #1a2d5a 0%, #2d4a7c 100%)'
                    : '#fff',
                borderRadius: 24,
                padding: '28px 24px',
                boxShadow: highlight
                    ? '0 16px 48px rgba(26,45,90,0.3)'
                    : '0 4px 24px rgba(30,60,120,0.07)',
                border: highlight ? 'none' : '1px solid #e8edf5',
                opacity: inView ? 1 : 0,
                transform: inView ? 'none' : 'translateY(28px)',
                transition: `all 0.7s ease ${delay}s`,
            }}
        >
            <div style={{ fontSize: 14, color: '#f59e0b', marginBottom: 14 }}>
                {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
            </div>
            <p style={{
                color: highlight ? 'rgba(255,255,255,0.9)' : '#374151',
                fontSize: 14,
                lineHeight: 1.8,
                marginBottom: 20,
                fontStyle: 'italic',
            }}>
                "{text}"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                    width: 42,
                    height: 42,
                    borderRadius: '50%',
                    background: highlight ? 'rgba(255,255,255,0.15)' : '#dbeafe',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                }}>
                    {avatar}
                </div>
                <div>
                    <p style={{ color: highlight ? '#fff' : '#1a2d5a', fontWeight: 700, fontSize: 14, margin: 0 }}>{name}</p>
                    <p style={{ color: highlight ? 'rgba(255,255,255,0.5)' : '#94a3b8', fontSize: 12, margin: '2px 0 0' }}>{role}</p>
                </div>
            </div>
        </div>
    );
};

/* ─── Emergency Step Card ─── */
const EmergencyStep = ({ num, icon, title, desc, delay }) => {
    const [ref, inView] = useInView();
    return (
        <div
            ref={ref}
            style={{
                display: 'flex',
                gap: 20,
                alignItems: 'flex-start',
                opacity: inView ? 1 : 0,
                transform: inView ? 'none' : 'translateX(-20px)',
                transition: `all 0.6s ease ${delay}s`,
            }}
        >
            <div style={{
                minWidth: 52,
                height: 52,
                borderRadius: 16,
                background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(99,102,241,0.3)',
                position: 'relative',
            }}>
                <span style={{ fontSize: 24 }}>{icon}</span>
                <span style={{
                    position: 'absolute',
                    top: -6,
                    right: -6,
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: '#fff',
                    color: '#6366f1',
                    fontSize: 11,
                    fontWeight: 900,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}>
                    {num}
                </span>
            </div>
            <div>
                <h4 style={{ color: '#1a2d5a', fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{title}</h4>
                <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.7 }}>{desc}</p>
            </div>
        </div>
    );
};

/* ════════════════════════════════════════════════════════════
   ██  MAIN SAFETY PAGE COMPONENT
   ════════════════════════════════════════════════════════════ */
export default function SafetyPage() {

    const stats = [
        { value: 10, suffix: 'K+', label: 'Safe Journeys', sublabel: 'Perjalanan aman selesai', icon: '🚶', color: '#3b82f6' },
        { value: 98, suffix: '%', label: 'Alert Success Rate', sublabel: 'Tingkat keberhasilan alert', icon: '🔔', color: '#22c55e' },
        { value: 3, prefix: '<', suffix: 's', label: 'Emergency Response', sublabel: 'Waktu respons darurat', icon: '⚡', color: '#f59e0b' },
        { value: 4.9, suffix: '★', label: 'App Rating', sublabel: 'Rating pengguna aplikasi', icon: '⭐', color: '#6366f1', decimals: 1 },
    ];

    const privacyItems = [
        {
            icon: '🔐',
            title: 'End-to-End Encryption',
            desc: 'Semua data lokasi dan pesan darurat dienkripsi end-to-end. Hanya Anda dan kontak terpercaya yang bisa mengakses informasi perjalanan.',
            gradient: 'linear-gradient(135deg, #3b82f6, #6366f1)',
        },
        {
            icon: '🛡️',
            title: 'Kebijakan Privasi Data',
            desc: 'Data Anda dilindungi oleh kebijakan privasi ketat. Kami mengikuti standar GDPR dan perlindungan data internasional.',
            gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        },
        {
            icon: '📍',
            title: 'Pengelolaan Data Lokasi',
            desc: 'Data lokasi hanya diproses saat perjalanan aktif dan otomatis dihapus setelah tiba. Tidak ada pelacakan di latar belakang.',
            gradient: 'linear-gradient(135deg, #22c55e, #16a34a)',
        },
        {
            icon: '🚫',
            title: 'Kami Tidak Menjual Data',
            desc: 'Zero data selling policy. Kami tidak pernah menjual, membagikan, atau monetisasi data pengguna kepada pihak ketiga manapun.',
            gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
        },
    ];

    const safetyTips = [
        {
            icon: '👀',
            title: 'Tetap Waspada',
            desc: 'Selalu perhatikan sekitar Anda saat berjalan. Hindari menggunakan headphone dengan volume tinggi di area sepi.',
            color: '#3b82f6',
        },
        {
            icon: '🔦',
            title: 'Pilih Jalan Terang',
            desc: 'Utamakan jalan yang terang dan ramai, meskipun sedikit lebih jauh. Well-lit streets are always safer.',
            color: '#f59e0b',
        },
        {
            icon: '📱',
            title: 'Bagikan Lokasi',
            desc: 'Selalu share live location ke keluarga atau teman saat perjalanan malam. Gunakan fitur SafeWalk untuk tracking otomatis.',
            color: '#22c55e',
        },
        {
            icon: '👥',
            title: 'Jalan Berkelompok',
            desc: 'Bila memungkinkan, berjalan bersama teman atau kelompok. There is safety in numbers — terutama di malam hari.',
            color: '#6366f1',
        },
        {
            icon: '🗺️',
            title: 'Kenali Rute Anda',
            desc: 'Pelajari rute sebelum berangkat. Identifikasi safe zones, pos keamanan, dan tempat-tempat yang bisa dimintai bantuan.',
            color: '#ef4444',
        },
        {
            icon: '🔋',
            title: 'Jaga Baterai HP',
            desc: 'Pastikan baterai ponsel cukup sebelum perjalanan. Bawa power bank sebagai cadangan. Your phone is your lifeline.',
            color: '#8b5cf6',
        },
        {
            icon: '🚕',
            title: 'Transportasi Aman',
            desc: 'Gunakan transportasi online terpercaya untuk jarak jauh. Selalu verifikasi plat nomor dan identitas driver.',
            color: '#ec4899',
        },
        {
            icon: '🔑',
            title: 'Siapkan Kunci di Tangan',
            desc: 'Siapkan kunci rumah sebelum sampai tujuan. Kurangi waktu berdiri diam di depan pintu, especially at night.',
            color: '#14b8a6',
        },
    ];

    const testimonials = [
        {
            avatar: '👩‍🎓',
            name: 'Rania Putri',
            role: 'Mahasiswi — Surabaya',
            text: 'Waktu pulang dari kampus malam, ada orang yang mengikuti saya. Langsung tekan SOS dan pacar saya yang jadi emergency contact langsung call. Orang itu pergi. SafeWalk literally saved me.',
            stars: 5,
            highlight: true,
        },
        {
            avatar: '👩‍💼',
            name: 'Dewi Kusuma',
            role: 'Karyawan Swasta — Jakarta',
            text: 'Fitur fake call-nya sangat realistis! Saya gunakan saat ojol yang saya naiki ambil rute aneh. "Mama" langsung telepon dan saya minta turun. Terima kasih SafeWalk!',
            stars: 5,
            highlight: false,
        },
        {
            avatar: '👨‍👧',
            name: 'Budi Santoso',
            role: 'Ayah dari 2 Putri — Bandung',
            text: 'Sebagai ayah, saya sangat tenang karena bisa pantau anak-anak lewat live tracking. Notifikasi "arrived safely" itu bikin hati lega luar biasa.',
            stars: 5,
            highlight: false,
        },
        {
            avatar: '👩‍⚕️',
            name: 'Dr. Maya Sari',
            role: 'Dokter RS — Yogyakarta',
            text: 'Sering pulang shift malam. SafeWalk auto-alert saat saya berhenti terlalu lama di jalan. Sistem monitoring-nya cerdas dan responsif, under 3 detik!',
            stars: 5,
            highlight: false,
        },
        {
            avatar: '👩‍🏫',
            name: 'Ibu Ratna',
            role: 'Guru SMA — Malang',
            text: 'Saya rekomendasikan ke semua murid perempuan saya. SafeWalk adalah aplikasi keamanan paling lengkap yang pernah saya temui. Dan gratis pula!',
            stars: 5,
            highlight: false,
        },
        {
            avatar: '🧕',
            name: 'Aisyah Zahra',
            role: 'Content Creator — Semarang',
            text: 'Sebagai solo traveler, SafeWalk jadi companion wajib. Community safety map-nya sangat membantu identifikasi area aman di kota baru.',
            stars: 5,
            highlight: true,
        },
    ];

    const emergencySteps = [
        { icon: '👤', title: 'Buka Profil Anda', desc: 'Buka aplikasi SafeWalk dan navigasi ke menu Settings > Emergency Contacts.' },
        { icon: '➕', title: 'Tambah Kontak Darurat', desc: 'Tambahkan hingga 5 kontak darurat. Mereka akan menerima notifikasi saat Anda memulai perjalanan.' },
        { icon: '⚙️', title: 'Atur Preferensi', desc: 'Pilih tipe notifikasi: SMS, push notification, atau panggilan otomatis saat SOS diaktifkan.' },
        { icon: '✅', title: 'Verifikasi Kontak', desc: 'Setiap kontak akan menerima link verifikasi. Setelah konfirmasi, mereka resmi jadi emergency contact Anda.' },
    ];

    return (
        <>
            <div style={{ paddingTop: 66 }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
                * { box-sizing:border-box; margin:0; padding:0; }
                @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
                @keyframes pulse-ring { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(2.5);opacity:0} }
                @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
                @keyframes shield-float { 0%,100%{transform:translateY(0) rotate(0deg)} 25%{transform:translateY(-8px) rotate(2deg)} 75%{transform:translateY(-4px) rotate(-2deg)} }
                ::-webkit-scrollbar{width:6px} ::-webkit-scrollbar-track{background:#f0f4ff} ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px}
                a:hover{opacity:0.75} button:hover{opacity:0.9;transform:translateY(-1px)} button{transition:all 0.2s ease;cursor:pointer}
                @media(max-width:900px){
                    .safety-stats-grid{grid-template-columns:1fr 1fr !important}
                    .privacy-grid{grid-template-columns:1fr !important}
                    .tips-grid{grid-template-columns:1fr 1fr !important}
                    .testi-grid{grid-template-columns:1fr !important}
                    .emergency-layout{flex-direction:column !important}
                    .community-layout{grid-template-columns:1fr !important}
                }
                @media(max-width:600px){
                    .safety-stats-grid{grid-template-columns:1fr !important}
                    .tips-grid{grid-template-columns:1fr !important}
                }
            `}</style>

            {/* ════════════════════════════════════════════
                SECTION 1: HERO
            ════════════════════════════════════════════ */}
            <section style={{
                position: 'relative',
                minHeight: '100vh',
                overflow: 'hidden',
                background: 'linear-gradient(160deg, #1a2d5a 0%, #1e3d6b 30%, #2d5da1 60%, #3b82f6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                {/* Decorative orbs */}
                <div style={{ position: 'absolute', top: '10%', left: '5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)', filter: 'blur(40px)' }} />
                <div style={{ position: 'absolute', bottom: '15%', right: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)', filter: 'blur(60px)' }} />
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)', filter: 'blur(80px)' }} />

                {/* Floating particles */}
                {[...Array(6)].map((_, i) => (
                    <div key={i} style={{
                        position: 'absolute',
                        width: 4 + i * 2,
                        height: 4 + i * 2,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.15)',
                        top: `${15 + i * 14}%`,
                        left: `${10 + i * 15}%`,
                        animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
                        animationDelay: `${i * 0.3}s`,
                    }} />
                ))}

                <div style={{ maxWidth: 900, margin: '0 auto', padding: '120px 28px 100px', textAlign: 'center', position: 'relative', zIndex: 10 }}>
                    <FadeIn delay={0.1}>
                        <div style={{ animation: 'shield-float 4s ease-in-out infinite', marginBottom: 32 }}>
                            <ShieldIcon size={90} />
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.25}>
                        <h1 style={{
                            fontSize: 'clamp(36px, 6vw, 68px)',
                            fontWeight: 900,
                            lineHeight: 1.08,
                            letterSpacing: '-2.5px',
                            color: '#fff',
                            marginBottom: 24,
                        }}>
                            Your Safety,
                            <br />
                            <span style={{
                                background: 'linear-gradient(135deg, #93c5fd, #22c55e)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}>
                                Our Priority.
                            </span>
                        </h1>
                    </FadeIn>

                    <FadeIn delay={0.4}>
                        <p style={{
                            fontSize: 'clamp(16px, 2vw, 20px)',
                            color: 'rgba(255,255,255,0.6)',
                            lineHeight: 1.8,
                            maxWidth: 600,
                            margin: '0 auto 44px',
                        }}>
                            Keamanan Anda adalah segalanya. SafeWalk melindungi setiap langkah perjalanan Anda
                            dengan teknologi enkripsi, monitoring cerdas, dan respons darurat real-time.
                        </p>
                    </FadeIn>

                    <FadeIn delay={0.55}>
                        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button style={{
                                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                                border: 'none',
                                borderRadius: 16,
                                padding: '16px 36px',
                                color: '#fff',
                                fontSize: 16,
                                fontWeight: 700,
                                boxShadow: '0 8px 32px rgba(34,197,94,0.35)',
                                letterSpacing: '-0.3px',
                            }}>
                                🛡️ Pelajari Fitur Keamanan
                            </button>
                            <button style={{
                                background: 'rgba(255,255,255,0.1)',
                                backdropFilter: 'blur(12px)',
                                border: '1.5px solid rgba(255,255,255,0.2)',
                                borderRadius: 16,
                                padding: '16px 36px',
                                color: '#fff',
                                fontSize: 16,
                                fontWeight: 600,
                            }}>
                                Lihat Demo →
                            </button>
                        </div>
                    </FadeIn>

                    {/* Scroll indicator */}
                    <FadeIn delay={0.8}>
                        <div style={{ marginTop: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, letterSpacing: 2, textTransform: 'uppercase' }}>Scroll</span>
                            <div style={{ width: 24, height: 40, borderRadius: 12, border: '2px solid rgba(255,255,255,0.2)', display: 'flex', justifyContent: 'center', paddingTop: 8 }}>
                                <div style={{
                                    width: 4,
                                    height: 10,
                                    borderRadius: 2,
                                    background: 'rgba(255,255,255,0.5)',
                                    animation: 'float 2s ease-in-out infinite',
                                }} />
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                SECTION 2: SAFETY STATISTICS
            ════════════════════════════════════════════ */}
            <section style={{ padding: '100px 28px', background: '#fff' }}>
                <div style={{ maxWidth: 1140, margin: '0 auto' }}>
                    <FadeIn>
                        <div style={{ textAlign: 'center', marginBottom: 64 }}>
                            <SectionBadge text="Safety Statistics" />
                            <h2 style={{
                                fontSize: 'clamp(28px, 3.5vw, 44px)',
                                fontWeight: 900,
                                letterSpacing: '-1.5px',
                                color: '#1a2d5a',
                                lineHeight: 1.15,
                            }}>
                                Angka yang <span style={{
                                    background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}>Berbicara</span>
                            </h2>
                            <p style={{ color: '#64748b', fontSize: 16, marginTop: 16, maxWidth: 500, margin: '16px auto 0' }}>
                                Ribuan pengguna telah mempercayakan keamanan perjalanan mereka kepada SafeWalk.
                            </p>
                        </div>
                    </FadeIn>

                    <div className="safety-stats-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: 20,
                    }}>
                        {stats.map((stat, i) => (
                            <FadeIn key={stat.label} delay={i * 0.12}>
                                <div style={{
                                    background: '#fff',
                                    borderRadius: 24,
                                    padding: '36px 28px',
                                    border: '1px solid #e8edf5',
                                    boxShadow: '0 4px 24px rgba(30,60,120,0.06)',
                                    textAlign: 'center',
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}>
                                    <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: 4,
                                        background: `linear-gradient(90deg, ${stat.color}, ${stat.color}88)`,
                                        borderRadius: '24px 24px 0 0',
                                    }} />
                                    <div style={{ fontSize: 36, marginBottom: 16 }}>{stat.icon}</div>
                                    <div style={{
                                        fontSize: 'clamp(32px, 4vw, 48px)',
                                        fontWeight: 900,
                                        color: stat.color,
                                        letterSpacing: '-2px',
                                        lineHeight: 1,
                                        marginBottom: 8,
                                    }}>
                                        <AnimatedCounter
                                            end={stat.value}
                                            suffix={stat.suffix}
                                            prefix={stat.prefix || ''}
                                            decimals={stat.decimals || 0}
                                        />
                                    </div>
                                    <p style={{ color: '#1a2d5a', fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{stat.label}</p>
                                    <p style={{ color: '#94a3b8', fontSize: 12 }}>{stat.sublabel}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                SECTION 3: PRIVACY & SECURITY
            ════════════════════════════════════════════ */}
            <section style={{
                padding: '100px 28px',
                background: 'linear-gradient(180deg, #f8faff 0%, #eef2ff 50%, #f8faff 100%)',
                position: 'relative',
            }}>
                <div style={{
                    position: 'absolute',
                    top: '20%',
                    right: '5%',
                    width: 300,
                    height: 300,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)',
                    filter: 'blur(40px)',
                }} />
                <div style={{ maxWidth: 1140, margin: '0 auto', position: 'relative', zIndex: 2 }}>
                    <FadeIn>
                        <div style={{ textAlign: 'center', marginBottom: 64 }}>
                            <SectionBadge text="Privacy & Security" />
                            <h2 style={{
                                fontSize: 'clamp(28px, 3.5vw, 44px)',
                                fontWeight: 900,
                                letterSpacing: '-1.5px',
                                color: '#1a2d5a',
                                lineHeight: 1.15,
                            }}>
                                Privasi Anda, <span style={{
                                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}>Prioritas Kami</span>
                            </h2>
                            <p style={{ color: '#64748b', fontSize: 16, marginTop: 16, maxWidth: 560, margin: '16px auto 0' }}>
                                Kami percaya keamanan digital sama pentingnya dengan keamanan fisik.
                                Data Anda dilindungi dengan standar enkripsi tertinggi.
                            </p>
                        </div>
                    </FadeIn>

                    <div className="privacy-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                        gap: 20,
                    }}>
                        {privacyItems.map((item, i) => (
                            <PrivacyCard
                                key={item.title}
                                {...item}
                                delay={i * 0.1}
                            />
                        ))}
                    </div>

                    {/* Trust badge bar */}
                    <FadeIn delay={0.3}>
                        <div style={{
                            marginTop: 48,
                            background: 'rgba(255,255,255,0.7)',
                            backdropFilter: 'blur(16px)',
                            borderRadius: 20,
                            padding: '24px 36px',
                            border: '1px solid rgba(255,255,255,0.4)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 40,
                            flexWrap: 'wrap',
                        }}>
                            {[
                                { icon: '🔒', text: 'SSL/TLS Encrypted' },
                                { icon: '✅', text: 'GDPR Compliant' },
                                { icon: '🛡️', text: 'ISO 27001' },
                                { icon: '🏛️', text: 'SOC 2 Type II' },
                            ].map(badge => (
                                <div key={badge.text} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ fontSize: 18 }}>{badge.icon}</span>
                                    <span style={{ color: '#4b6080', fontSize: 13, fontWeight: 600 }}>{badge.text}</span>
                                </div>
                            ))}
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                SECTION 4: SAFETY TIPS
            ════════════════════════════════════════════ */}
            <section style={{ padding: '100px 28px', background: '#fff' }}>
                <div style={{ maxWidth: 1140, margin: '0 auto' }}>
                    <FadeIn>
                        <div style={{ textAlign: 'center', marginBottom: 64 }}>
                            <SectionBadge text="Safety Tips" />
                            <h2 style={{
                                fontSize: 'clamp(28px, 3.5vw, 44px)',
                                fontWeight: 900,
                                letterSpacing: '-1.5px',
                                color: '#1a2d5a',
                                lineHeight: 1.15,
                            }}>
                                Tips <span style={{
                                    background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}>Keamanan</span> Berjalan Kaki
                            </h2>
                            <p style={{ color: '#64748b', fontSize: 16, marginTop: 16, maxWidth: 520, margin: '16px auto 0' }}>
                                Panduan praktis untuk menjaga keselamatan Anda saat berjalan,
                                terutama di malam hari. Stay aware, stay safe.
                            </p>
                        </div>
                    </FadeIn>

                    <div className="tips-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                        gap: 20,
                    }}>
                        {safetyTips.map((tip, i) => (
                            <SafetyTipCard
                                key={tip.title}
                                {...tip}
                                delay={i * 0.08}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                SECTION 5: EMERGENCY CONTACTS SETUP
            ════════════════════════════════════════════ */}
            <section style={{
                padding: '100px 28px',
                background: 'linear-gradient(180deg, #f8faff 0%, #fff 100%)',
            }}>
                <div style={{ maxWidth: 1140, margin: '0 auto' }}>
                    <FadeIn>
                        <div style={{ textAlign: 'center', marginBottom: 64 }}>
                            <SectionBadge text="Emergency Contacts" />
                            <h2 style={{
                                fontSize: 'clamp(28px, 3.5vw, 44px)',
                                fontWeight: 900,
                                letterSpacing: '-1.5px',
                                color: '#1a2d5a',
                                lineHeight: 1.15,
                            }}>
                                Atur <span style={{
                                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}>Kontak Darurat</span> Anda
                            </h2>
                            <p style={{ color: '#64748b', fontSize: 16, marginTop: 16, maxWidth: 520, margin: '16px auto 0' }}>
                                Siapkan orang-orang terpercaya yang akan dihubungi otomatis saat situasi darurat.
                                Setup hanya 2 menit.
                            </p>
                        </div>
                    </FadeIn>

                    <div className="emergency-layout" style={{
                        display: 'flex',
                        gap: 48,
                        alignItems: 'center',
                    }}>
                        {/* Left: Steps */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 28 }}>
                            {emergencySteps.map((step, i) => (
                                <EmergencyStep
                                    key={step.title}
                                    num={i + 1}
                                    {...step}
                                    delay={i * 0.12}
                                />
                            ))}
                        </div>

                        {/* Right: Phone mockup */}
                        <FadeIn delay={0.3} from="right" style={{ flex: '0 0 auto' }}>
                            <div style={{
                                width: 260,
                                background: '#fff',
                                borderRadius: 36,
                                boxShadow: '0 32px 80px rgba(30,60,120,0.18), 0 8px 20px rgba(30,60,120,0.1)',
                                border: '6px solid #e8edf5',
                                overflow: 'hidden',
                            }}>
                                {/* Phone header */}
                                <div style={{
                                    background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                                    padding: '28px 20px 20px',
                                    position: 'relative',
                                }}>
                                    <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 80, height: 20, background: '#1a1a2e', borderRadius: '0 0 12px 12px' }} />
                                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 600, marginTop: 8 }}>Emergency Contacts</p>
                                    <p style={{ color: '#fff', fontSize: 18, fontWeight: 800 }}>Kontak Darurat</p>
                                </div>

                                {/* Contact list */}
                                <div style={{ padding: '16px 16px 20px' }}>
                                    {[
                                        { name: 'Mama', emoji: '👩', status: 'Verified ✓', statusColor: '#22c55e', bg: '#f0fdf4' },
                                        { name: 'Papa', emoji: '👨', status: 'Verified ✓', statusColor: '#22c55e', bg: '#f0fdf4' },
                                        { name: 'Kakak', emoji: '👩‍💼', status: 'Pending...', statusColor: '#f59e0b', bg: '#fffbeb' },
                                    ].map((contact, i) => (
                                        <div key={contact.name} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 12,
                                            padding: '12px',
                                            background: contact.bg,
                                            borderRadius: 14,
                                            marginBottom: i < 2 ? 10 : 0,
                                        }}>
                                            <div style={{
                                                width: 38,
                                                height: 38,
                                                borderRadius: '50%',
                                                background: '#dbeafe',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: 20,
                                            }}>
                                                {contact.emoji}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ color: '#1a2d5a', fontSize: 13, fontWeight: 700, margin: 0 }}>{contact.name}</p>
                                                <p style={{ color: contact.statusColor, fontSize: 11, margin: 0, fontWeight: 600 }}>{contact.status}</p>
                                            </div>
                                        </div>
                                    ))}
                                    <button style={{
                                        width: '100%',
                                        marginTop: 14,
                                        background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                                        border: 'none',
                                        borderRadius: 12,
                                        padding: '12px',
                                        color: '#fff',
                                        fontSize: 13,
                                        fontWeight: 700,
                                    }}>
                                        + Tambah Kontak
                                    </button>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                SECTION 6: COMMUNITY SAFETY / SAFE ZONES
            ════════════════════════════════════════════ */}
            <section style={{ padding: '100px 28px', background: '#fff' }}>
                <div style={{ maxWidth: 1140, margin: '0 auto' }}>
                    <div className="community-layout" style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1.3fr',
                        gap: 48,
                        alignItems: 'center',
                    }}>
                        <div>
                            <FadeIn>
                                <SectionBadge text="Community Safety" />
                                <h2 style={{
                                    fontSize: 'clamp(26px, 3vw, 40px)',
                                    fontWeight: 900,
                                    letterSpacing: '-1.5px',
                                    color: '#1a2d5a',
                                    lineHeight: 1.15,
                                    marginBottom: 20,
                                }}>
                                    Peta <span style={{
                                        background: 'linear-gradient(135deg, #22c55e, #3b82f6)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}>Zona Aman</span> Komunitas
                                </h2>
                            </FadeIn>

                            <FadeIn delay={0.15}>
                                <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.8, marginBottom: 28 }}>
                                    Peta interaktif yang menunjukkan zona aman di sekitar Anda berdasarkan data komunitas.
                                    Lihat area dengan penerangan baik, pos keamanan, dan jalur yang sering dilalui pengguna SafeWalk.
                                </p>
                            </FadeIn>

                            <FadeIn delay={0.25}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    {[
                                        { color: '#22c55e', label: 'Zona Aman', desc: 'Area dengan penerangan & keamanan baik' },
                                        { color: '#3b82f6', label: 'Fasilitas Publik', desc: 'Kampus, rumah sakit, pos polisi' },
                                        { color: '#f59e0b', label: 'Perlu Hati-hati', desc: 'Penerangan kurang, area sepi' },
                                        { color: '#ef4444', label: 'Hindari Malam', desc: 'Laporan insiden dari komunitas' },
                                    ].map(zone => (
                                        <div key={zone.label} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                            <div style={{
                                                width: 14,
                                                height: 14,
                                                borderRadius: '50%',
                                                background: zone.color,
                                                boxShadow: `0 0 12px ${zone.color}40`,
                                                flexShrink: 0,
                                            }} />
                                            <div>
                                                <span style={{ color: '#1a2d5a', fontSize: 14, fontWeight: 700 }}>{zone.label}</span>
                                                <span style={{ color: '#94a3b8', fontSize: 13, marginLeft: 8 }}>— {zone.desc}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </FadeIn>
                        </div>

                        <FadeIn delay={0.2} from="right">
                            <div style={{
                                borderRadius: 24,
                                overflow: 'hidden',
                                boxShadow: '0 16px 60px rgba(30,60,120,0.12)',
                                border: '1px solid #e8edf5',
                            }}>
                                <SafeZoneMap />
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                SECTION 7: TESTIMONIALS
            ════════════════════════════════════════════ */}
            <section style={{
                padding: '100px 28px',
                background: 'linear-gradient(180deg, #f8faff 0%, #eef2ff 50%, #f8faff 100%)',
            }}>
                <div style={{ maxWidth: 1140, margin: '0 auto' }}>
                    <FadeIn>
                        <div style={{ textAlign: 'center', marginBottom: 64 }}>
                            <SectionBadge text="Testimonials" />
                            <h2 style={{
                                fontSize: 'clamp(28px, 3.5vw, 44px)',
                                fontWeight: 900,
                                letterSpacing: '-1.5px',
                                color: '#1a2d5a',
                                lineHeight: 1.15,
                            }}>
                                Cerita <span style={{
                                    background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}>Nyata</span> dari Pengguna
                            </h2>
                            <p style={{ color: '#64748b', fontSize: 16, marginTop: 16, maxWidth: 520, margin: '16px auto 0' }}>
                                Mereka yang sudah merasakan perlindungan SafeWalk berbagi pengalaman.
                                Real stories, real safety.
                            </p>
                        </div>
                    </FadeIn>

                    <div className="testi-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: 20,
                    }}>
                        {testimonials.map((testi, i) => (
                            <TestimonialCard
                                key={testi.name}
                                {...testi}
                                delay={i * 0.1}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                SECTION 8: CTA - DOWNLOAD
            ════════════════════════════════════════════ */}
            <section style={{
                padding: '100px 28px',
                background: '#fff',
            }}>
                <div style={{ maxWidth: 900, margin: '0 auto' }}>
                    <FadeIn>
                        <div style={{
                            background: 'linear-gradient(135deg, #1a2d5a 0%, #2d4a7c 40%, #3b5998 100%)',
                            borderRadius: 36,
                            padding: 'clamp(48px, 6vw, 80px) clamp(32px, 5vw, 64px)',
                            textAlign: 'center',
                            position: 'relative',
                            overflow: 'hidden',
                        }}>
                            {/* Decorative elements */}
                            <div style={{
                                position: 'absolute',
                                top: -60,
                                right: -60,
                                width: 200,
                                height: 200,
                                borderRadius: '50%',
                                background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)',
                            }} />
                            <div style={{
                                position: 'absolute',
                                bottom: -40,
                                left: -40,
                                width: 180,
                                height: 180,
                                borderRadius: '50%',
                                background: 'radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 70%)',
                            }} />

                            {/* Floating shield icons */}
                            <div style={{
                                position: 'absolute',
                                top: 30,
                                left: 40,
                                fontSize: 28,
                                opacity: 0.15,
                                animation: 'float 3s ease-in-out infinite',
                            }}>🛡️</div>
                            <div style={{
                                position: 'absolute',
                                bottom: 40,
                                right: 50,
                                fontSize: 24,
                                opacity: 0.15,
                                animation: 'float 4s ease-in-out infinite',
                                animationDelay: '1s',
                            }}>🔒</div>
                            <div style={{
                                position: 'absolute',
                                top: 50,
                                right: 120,
                                fontSize: 20,
                                opacity: 0.1,
                                animation: 'float 3.5s ease-in-out infinite',
                                animationDelay: '0.5s',
                            }}>⭐</div>

                            <div style={{ position: 'relative', zIndex: 2 }}>
                                <div style={{ marginBottom: 28 }}>
                                    <ShieldIcon size={64} color1="#22c55e" color2="#16a34a" />
                                </div>

                                <h2 style={{
                                    fontSize: 'clamp(28px, 4vw, 48px)',
                                    fontWeight: 900,
                                    color: '#fff',
                                    letterSpacing: '-2px',
                                    lineHeight: 1.15,
                                    marginBottom: 20,
                                }}>
                                    Download SafeWalk Now
                                </h2>

                                <p style={{
                                    color: 'rgba(255,255,255,0.6)',
                                    fontSize: 'clamp(15px, 1.8vw, 18px)',
                                    lineHeight: 1.8,
                                    maxWidth: 500,
                                    margin: '0 auto 40px',
                                }}>
                                    Jangan tunggu sampai terlambat. Lindungi diri Anda dan orang tercinta sekarang.
                                    Gratis, aman, dan mudah digunakan.
                                </p>

                                <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 36 }}>
                                    {/* App Store button */}
                                    <button style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 12,
                                        background: '#fff',
                                        border: 'none',
                                        borderRadius: 16,
                                        padding: '14px 28px',
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                                    }}>
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="#1a2d5a">
                                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                                        </svg>
                                        <div style={{ textAlign: 'left' }}>
                                            <p style={{ color: '#94a3b8', fontSize: 10, margin: 0, fontWeight: 500 }}>Download on the</p>
                                            <p style={{ color: '#1a2d5a', fontSize: 16, margin: 0, fontWeight: 800, letterSpacing: '-0.3px' }}>App Store</p>
                                        </div>
                                    </button>

                                    {/* Play Store button */}
                                    <button style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 12,
                                        background: '#fff',
                                        border: 'none',
                                        borderRadius: 16,
                                        padding: '14px 28px',
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                                    }}>
                                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                                            <path d="M3.61 1.814L13.793 12 3.61 22.186a1.12 1.12 0 01-.61-.992V2.806c0-.413.227-.772.61-.992z" fill="#4285F4" />
                                            <path d="M17.108 8.68L13.793 12l3.315 3.32 3.753-2.135c.67-.382.67-1.006 0-1.388L17.108 8.68z" fill="#FBBC04" />
                                            <path d="M3.61 1.814l10.183 10.185 3.315-3.32L5.88.587C5.07.12 4.2.15 3.61 1.814z" fill="#34A853" />
                                            <path d="M3.61 22.186c.59 1.664 1.46 1.694 2.27 1.227l11.228-6.092-3.315-3.32L3.61 22.185z" fill="#EA4335" />
                                        </svg>
                                        <div style={{ textAlign: 'left' }}>
                                            <p style={{ color: '#94a3b8', fontSize: 10, margin: 0, fontWeight: 500 }}>GET IT ON</p>
                                            <p style={{ color: '#1a2d5a', fontSize: 16, margin: 0, fontWeight: 800, letterSpacing: '-0.3px' }}>Google Play</p>
                                        </div>
                                    </button>
                                </div>

                                {/* Social proof */}
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                                    {[
                                        { val: '10K+', label: 'Downloads' },
                                        { val: '4.9★', label: 'Rating' },
                                        { val: '98%', label: 'Satisfaction' },
                                    ].map(item => (
                                        <div key={item.label} style={{ textAlign: 'center' }}>
                                            <p style={{ color: '#fff', fontSize: 20, fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }}>{item.val}</p>
                                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: 0, fontWeight: 500 }}>{item.label}</p>
                                        </div>
                                    ))}
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
