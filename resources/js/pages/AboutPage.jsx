import { useState, useEffect, useRef } from 'react';

/* ─── Scroll-reveal hook ─── */
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

/* ─── FadeIn wrapper ─── */
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

/* ─── Section label + heading helper ─── */
const SectionHeader = ({ label, heading, highlight, sub, light = false }) => (
    <FadeIn>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{
                color: light ? 'rgba(147,197,253,0.9)' : '#3b82f6',
                fontSize: 13, fontWeight: 700, letterSpacing: 2,
                textTransform: 'uppercase', marginBottom: 12,
            }}>{label}</p>
            <h2 style={{
                fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 900,
                letterSpacing: '-1.5px', lineHeight: 1.15, margin: '0 0 16px',
                color: light ? '#fff' : '#1a2d5a',
            }}>
                {heading}{' '}
                <span style={{
                    background: light
                        ? 'linear-gradient(135deg,#93c5fd,#a5b4fc)'
                        : 'linear-gradient(135deg,#3b82f6,#6366f1)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>{highlight}</span>
            </h2>
            {sub && (
                <p style={{
                    color: light ? 'rgba(255,255,255,0.55)' : '#64748b',
                    fontSize: 16, lineHeight: 1.7, maxWidth: 560, margin: '0 auto',
                }}>{sub}</p>
            )}
        </div>
    </FadeIn>
);

/* ─── Nav (matching SafeWalk.jsx) ─── */
const Nav = () => {
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const h = () => setScrolled(window.scrollY > 30);
        window.addEventListener('scroll', h);
        return () => window.removeEventListener('scroll', h);
    }, []);

    return (
        <nav style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
            background: scrolled ? 'rgba(255,255,255,0.92)' : 'transparent',
            backdropFilter: scrolled ? 'blur(20px)' : 'none',
            boxShadow: scrolled ? '0 1px 0 rgba(0,0,0,0.06)' : 'none',
            transition: 'all 0.35s ease',
        }}>
            <div style={{
                maxWidth: 1140, margin: '0 auto', padding: '0 28px',
                height: 66, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: 11,
                        background: 'linear-gradient(135deg,#3b82f6,#6366f1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 18, boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
                    }}>🛡️</div>
                    <span style={{ color: scrolled ? '#1a2d5a' : '#fff', fontWeight: 800, fontSize: 18, letterSpacing: '-0.5px', transition: 'color 0.35s ease' }}>SafeWalk</span>
                </div>
                <div style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
                    {['Features', 'How It Works', 'Safety', 'About'].map((l) => (
                        <a key={l} href="#" style={{
                            color: scrolled ? '#4b6080' : 'rgba(255,255,255,0.75)',
                            fontSize: 14, textDecoration: 'none', fontWeight: 500,
                            transition: 'color 0.35s ease',
                        }}>{l}</a>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <button style={{ background: 'none', border: 'none', color: scrolled ? '#4b6080' : 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Sign In</button>
                    <button style={{
                        background: 'linear-gradient(135deg,#3b82f6,#6366f1)', border: 'none',
                        borderRadius: 12, padding: '10px 22px', color: '#fff', fontSize: 14,
                        fontWeight: 700, boxShadow: '0 4px 16px rgba(99,102,241,0.3)', cursor: 'pointer',
                    }}>Get the App</button>
                </div>
            </div>
        </nav>
    );
};

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */

const teamMembers = [
    { avatar: '👨‍💻', name: 'Jauhar Fauzi Ulul Albab', role: 'Founder & Lead Creator', bio: 'Visioner keamanan kampus. Memulai dan membangun SafeWalk sebagai solusi cerdas keselamatan perjalanan malam mahasiswa.' },
];

const values = [
    { icon: '🛡️', title: 'Safety First', desc: 'Keselamatan adalah prioritas utama dalam setiap keputusan produk. Setiap fitur diuji untuk situasi darurat nyata.', color: '#3b82f6' },
    { icon: '🤝', title: 'Community Driven', desc: 'Dibangun bersama komunitas mahasiswa, untuk mahasiswa. Setiap feedback membentuk masa depan SafeWalk.', color: '#22c55e' },
    { icon: '🔒', title: 'Privacy Focused', desc: 'Lokasi hanya dibagikan ke orang yang kamu percaya. Data terenkripsi end-to-end, tidak pernah dijual.', color: '#6366f1' },
    { icon: '🚀', title: 'Always Innovating', desc: 'Terus berinnovasi dengan AI monitoring, smart alerts, dan fitur baru yang menjawab kebutuhan keamanan terkini.', color: '#f59e0b' },
];

const milestones = [
    { year: '2024', quarter: 'Q1', title: 'Ide Lahir dari Kepedulian', desc: 'Jauhar Fauzi Ulul Albab mengidentifikasi masalah keamanan perjalanan malam mahasiswa di sekitar kampus.', icon: '💡', color: '#3b82f6' },
    { year: '2024', quarter: 'Q3', title: 'Prototype Pertama', desc: 'MVP dengan fitur live tracking dan SOS berhasil dibangun dalam 3 bulan. Diujicobakan ke 50 mahasiswa.', icon: '🔧', color: '#6366f1' },
    { year: '2025', quarter: 'Q1', title: 'Beta Launch', desc: 'Peluncuran beta di 3 kampus Surabaya. Fitur fake call dan auto-alert ditambahkan berdasarkan feedback.', icon: '🚀', color: '#a855f7' },
    { year: '2025', quarter: 'Q3', title: '10.000 Pengguna', desc: 'Menembus 10.000 pengguna aktif. Kolaborasi dengan kampus dan organisasi keamanan perempuan dimulai.', icon: '🎉', color: '#22c55e' },
    { year: '2026', quarter: 'Q1', title: 'Ekspansi Nasional', desc: 'SafeWalk tersedia di seluruh Indonesia. Partnership dengan pemerintah kota dan kepolisian untuk respons lebih cepat.', icon: '🇮🇩', color: '#ef4444' },
];

const partners = [
    { name: 'Universitas Airlangga', icon: '🏛️' },
    { name: 'Kementerian PPPA', icon: '🏢' },
    { name: 'Grab Indonesia', icon: '🚗' },
    { name: 'Kominfo', icon: '📡' },
    { name: 'Google for Startups', icon: '🌐' },
];

/* ═══════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════ */

export default function AboutPage() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [formSent, setFormSent] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormSent(true);
        setTimeout(() => setFormSent(false), 3000);
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <>
            <div style={{ paddingTop: 66 }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
                * { box-sizing:border-box; margin:0; padding:0; }
                @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
                @keyframes pulse-ring { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(2.5);opacity:0} }
                @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
                @keyframes gradient-shift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
                ::-webkit-scrollbar{width:6px}
                ::-webkit-scrollbar-track{background:#f0f4ff}
                ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px}
                a:hover{opacity:0.75}
                button{transition:all 0.2s ease;cursor:pointer}
                button:hover{opacity:0.9;transform:translateY(-1px)}
                input:focus, textarea:focus { outline:none; border-color:#3b82f6 !important; box-shadow:0 0 0 4px rgba(59,130,246,0.12) !important; }
                @media (max-width:900px) {
                    .about-grid-2 { grid-template-columns:1fr !important; }
                    .about-grid-3 { grid-template-columns:1fr !important; }
                    .about-grid-4 { grid-template-columns:1fr 1fr !important; }
                    .about-grid-5 { grid-template-columns:1fr 1fr !important; }
                    .about-timeline { padding-left:24px !important; }
                    .about-hero-sub { font-size:16px !important; }
                    .about-contact-grid { grid-template-columns:1fr !important; }
                    .about-partners { gap:20px !important; }
                }
                @media (max-width:600px) {
                    .about-grid-4 { grid-template-columns:1fr !important; }
                    .about-grid-5 { grid-template-columns:1fr !important; }
                }
            `}</style>



            {/* ═══ 1. HERO ═══ */}
            <section style={{
                position: 'relative', minHeight: '90vh', overflow: 'hidden',
                background: 'linear-gradient(160deg, #0f1d3d 0%, #1a2d5a 30%, #1e3d6b 60%, #2d5da1 100%)',
                display: 'flex', alignItems: 'center', paddingTop: 66,
            }}>
                {/* Decorative orbs */}
                <div style={{
                    position: 'absolute', top: '10%', right: '10%', width: 400, height: 400,
                    background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
                    borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute', bottom: '15%', left: '5%', width: 300, height: 300,
                    background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
                    borderRadius: '50%', filter: 'blur(50px)', pointerEvents: 'none',
                }} />
                {/* Subtle grid overlay */}
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.04,
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                }} />

                <div style={{ maxWidth: 1140, margin: '0 auto', padding: '80px 28px', width: '100%', position: 'relative', zIndex: 10, textAlign: 'center' }}>
                    <FadeIn delay={0.1}>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)',
                            border: '1px solid rgba(255,255,255,0.12)', borderRadius: 40,
                            padding: '8px 20px', marginBottom: 32,
                        }}>
                            <span style={{ fontSize: 16 }}>🛡️</span>
                            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 600, letterSpacing: 1 }}>TENTANG SAFEWALK</span>
                        </div>
                    </FadeIn>
                    <FadeIn delay={0.2}>
                        <h1 style={{
                            fontSize: 'clamp(36px,6vw,72px)', fontWeight: 900,
                            lineHeight: 1.06, letterSpacing: '-2.5px', color: '#fff',
                            marginBottom: 24,
                        }}>
                            About{' '}
                            <span style={{
                                background: 'linear-gradient(135deg,#60a5fa,#818cf8,#a78bfa)',
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                            }}>SafeWalk</span>
                        </h1>
                    </FadeIn>
                    <FadeIn delay={0.35}>
                        <p className="about-hero-sub" style={{
                            fontSize: 20, color: 'rgba(255,255,255,0.55)',
                            lineHeight: 1.75, maxWidth: 640, margin: '0 auto 44px',
                        }}>
                            Kami percaya setiap orang berhak merasa aman saat berjalan — kapan pun, di mana pun.
                            SafeWalk hadir sebagai teman perjalanan cerdas yang menjaga keselamatanmu dan orang-orang tercinta.
                        </p>
                    </FadeIn>
                    <FadeIn delay={0.5}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
                            <button style={{
                                background: 'linear-gradient(135deg,#3b82f6,#6366f1)', border: 'none',
                                borderRadius: 14, padding: '14px 32px', color: '#fff', fontSize: 15,
                                fontWeight: 700, boxShadow: '0 8px 30px rgba(99,102,241,0.35)',
                            }}>Join Our Mission →</button>
                            <button style={{
                                background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)',
                                border: '1.5px solid rgba(255,255,255,0.18)',
                                borderRadius: 14, padding: '14px 32px', color: '#fff', fontSize: 15,
                                fontWeight: 600,
                            }}>Hubungi Kami</button>
                        </div>
                    </FadeIn>

                    {/* Stats row */}
                    <FadeIn delay={0.65}>
                        <div style={{
                            display: 'flex', justifyContent: 'center', gap: 48, marginTop: 72, flexWrap: 'wrap',
                        }}>
                            {[
                                { num: '10K+', label: 'Pengguna Aktif' },
                                { num: '50+', label: 'Kampus Partner' },
                                { num: '99.9%', label: 'Uptime' },
                                { num: '<3s', label: 'Respons Darurat' },
                            ].map((s) => (
                                <div key={s.label} style={{ textAlign: 'center' }}>
                                    <p style={{
                                        fontSize: 32, fontWeight: 900, letterSpacing: '-1px',
                                        background: 'linear-gradient(135deg,#60a5fa,#a78bfa)',
                                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                        margin: '0 0 4px',
                                    }}>{s.num}</p>
                                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: 500, margin: 0 }}>{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* ═══ 2. MISSION & VISION ═══ */}
            <section style={{ padding: '100px 28px', background: '#fff' }}>
                <div style={{ maxWidth: 1140, margin: '0 auto' }}>
                    <SectionHeader
                        label="Our Purpose"
                        heading="Misi &"
                        highlight="Visi Kami"
                        sub="Dua pilar yang menggerakkan setiap inovasi dan keputusan di SafeWalk."
                    />
                    <div className="about-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                        {/* Mission Card */}
                        <FadeIn delay={0.1}>
                            <div style={{
                                background: 'linear-gradient(145deg,#eff6ff,#dbeafe)',
                                borderRadius: 28, padding: '48px 40px', position: 'relative', overflow: 'hidden',
                                border: '1px solid #bfdbfe', minHeight: 320,
                            }}>
                                <div style={{
                                    position: 'absolute', top: -30, right: -30, width: 140, height: 140,
                                    background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
                                    borderRadius: '50%',
                                }} />
                                <div style={{
                                    width: 64, height: 64, borderRadius: 20,
                                    background: 'linear-gradient(135deg,#3b82f6,#2563eb)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 28, marginBottom: 24,
                                    boxShadow: '0 8px 24px rgba(59,130,246,0.3)',
                                }}>🎯</div>
                                <h3 style={{ fontSize: 26, fontWeight: 800, color: '#1a2d5a', marginBottom: 16, letterSpacing: '-0.8px' }}>Misi Kami</h3>
                                <p style={{ color: '#3b6ba5', fontSize: 16, lineHeight: 1.75, margin: 0 }}>
                                    <strong>Menjadikan setiap perjalanan aman bagi mahasiswa dan perempuan.</strong>
                                    {' '}Kami membangun teknologi yang memberdayakan individu untuk berjalan dengan percaya diri,
                                    terhubung dengan orang-orang terpercaya, dan mendapatkan bantuan dalam hitungan detik.
                                </p>
                            </div>
                        </FadeIn>

                        {/* Vision Card */}
                        <FadeIn delay={0.2}>
                            <div style={{
                                background: 'linear-gradient(145deg,#eef2ff,#e0e7ff)',
                                borderRadius: 28, padding: '48px 40px', position: 'relative', overflow: 'hidden',
                                border: '1px solid #c7d2fe', minHeight: 320,
                            }}>
                                <div style={{
                                    position: 'absolute', top: -30, right: -30, width: 140, height: 140,
                                    background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
                                    borderRadius: '50%',
                                }} />
                                <div style={{
                                    width: 64, height: 64, borderRadius: 20,
                                    background: 'linear-gradient(135deg,#6366f1,#4f46e5)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 28, marginBottom: 24,
                                    boxShadow: '0 8px 24px rgba(99,102,241,0.3)',
                                }}>🌟</div>
                                <h3 style={{ fontSize: 26, fontWeight: 800, color: '#1a2d5a', marginBottom: 16, letterSpacing: '-0.8px' }}>Visi Kami</h3>
                                <p style={{ color: '#4b5ea6', fontSize: 16, lineHeight: 1.75, margin: 0 }}>
                                    <strong>Dunia di mana tidak ada seorang pun yang takut berjalan sendirian.</strong>
                                    {' '}Kami membayangkan masa depan di mana keamanan bukan lagi privilege, melainkan hak setiap orang —
                                    didukung oleh teknologi, komunitas, dan kepedulian bersama.
                                </p>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* ═══ 3. THE STORY ═══ */}
            <section style={{ padding: '100px 28px', background: '#f8faff' }}>
                <div style={{ maxWidth: 1140, margin: '0 auto' }}>
                    <div className="about-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
                        {/* Story illustration */}
                        <FadeIn delay={0.1} from="left">
                            <div style={{
                                background: 'linear-gradient(160deg,#1a3a6b,#2d5da1)',
                                borderRadius: 32, padding: '56px 40px', position: 'relative', overflow: 'hidden',
                            }}>
                                {/* Stars */}
                                {[
                                    { x: '15%', y: '12%', s: 3, o: 0.6 }, { x: '80%', y: '8%', s: 2, o: 0.4 },
                                    { x: '60%', y: '20%', s: 2.5, o: 0.5 }, { x: '25%', y: '85%', s: 2, o: 0.3 },
                                    { x: '90%', y: '75%', s: 3, o: 0.5 }, { x: '45%', y: '5%', s: 2, o: 0.7 },
                                ].map((star, i) => (
                                    <div key={i} style={{
                                        position: 'absolute', left: star.x, top: star.y,
                                        width: star.s, height: star.s, borderRadius: '50%',
                                        background: '#fff', opacity: star.o,
                                    }} />
                                ))}
                                {/* Moon */}
                                <div style={{
                                    position: 'absolute', top: 20, right: 30,
                                    width: 40, height: 40, borderRadius: '50%',
                                    background: '#fff9e6', opacity: 0.9,
                                    boxShadow: '0 0 20px rgba(255,249,230,0.4)',
                                }} />
                                <div style={{
                                    position: 'absolute', top: 14, right: 24,
                                    width: 34, height: 34, borderRadius: '50%',
                                    background: '#2d5da1',
                                }} />

                                {/* Scene */}
                                <div style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
                                    <div style={{ fontSize: 72, marginBottom: 20, filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))' }}>🚶‍♀️</div>
                                    <div style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 8,
                                        background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
                                        borderRadius: 16, padding: '12px 20px',
                                        border: '1px solid rgba(255,255,255,0.15)',
                                    }}>
                                        <div style={{
                                            width: 10, height: 10, borderRadius: '50%',
                                            background: '#22c55e', boxShadow: '0 0 10px #22c55e',
                                        }} />
                                        <span style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>SafeWalk Active</span>
                                    </div>
                                    <p style={{
                                        color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 20,
                                        fontStyle: 'italic',
                                    }}>
                                        "Malam itu, kami sadar harus ada solusi."
                                    </p>
                                </div>
                            </div>
                        </FadeIn>

                        {/* Story text */}
                        <FadeIn delay={0.2} from="right">
                            <div>
                                <p style={{
                                    color: '#3b82f6', fontSize: 13, fontWeight: 700,
                                    letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12,
                                }}>Our Story</p>
                                <h2 style={{
                                    fontSize: 'clamp(26px,3vw,38px)', fontWeight: 900,
                                    letterSpacing: '-1.2px', color: '#1a2d5a', lineHeight: 1.2, marginBottom: 24,
                                }}>
                                    Bagaimana SafeWalk{' '}
                                    <span style={{
                                        background: 'linear-gradient(135deg,#3b82f6,#6366f1)',
                                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                    }}>Dilahirkan</span>
                                </h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                                    <p style={{ color: '#475569', fontSize: 15, lineHeight: 1.8 }}>
                                        Cerita SafeWalk dimulai dari inisiatif <strong>Jauhar Fauzi Ulul Albab</strong> pada awal 2024.
                                        Beliau menyadari masalah yang sama setiap malam — teman-teman mahasiswa
                                        merasa tidak aman saat berjalan pulang dari kampus.
                                    </p>
                                    <p style={{ color: '#475569', fontSize: 15, lineHeight: 1.8 }}>
                                        Satu malam, salah satu teman kami harus berjalan sendirian melewati jalan gelap selama 15 menit.
                                        Dia terus menelepon ibunya agar merasa aman. Saat itu, beliau bertanya:
                                        <em> "Bagaimana jika ada aplikasi yang bisa menjadi teman perjalanan digital?"</em>
                                    </p>
                                    <p style={{ color: '#475569', fontSize: 15, lineHeight: 1.8 }}>
                                        Dari pertanyaan sederhana itu, lahirlah SafeWalk — aplikasi yang menggabungkan
                                        <strong> live tracking, emergency SOS, fake call, dan AI monitoring </strong>
                                        dalam satu platform yang mudah digunakan bahkan dalam situasi panik.
                                    </p>
                                </div>
                                <div style={{
                                    marginTop: 28, padding: '16px 20px',
                                    background: '#eff6ff', borderRadius: 16,
                                    borderLeft: '4px solid #3b82f6',
                                }}>
                                    <p style={{ color: '#1e40af', fontSize: 14, fontWeight: 600, fontStyle: 'italic', lineHeight: 1.7, margin: 0 }}>
                                        "Kami tidak hanya membangun aplikasi — kami membangun rasa aman yang seharusnya
                                        menjadi hak setiap orang."
                                    </p>
                                    <p style={{ color: '#3b82f6', fontSize: 13, fontWeight: 600, marginTop: 8 }}>— Jauhar Fauzi Ulul Albab, Founder</p>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* ═══ 4. TEAM ═══ */}
            <section style={{ padding: '100px 28px', background: '#fff' }}>
                <div style={{ maxWidth: 1140, margin: '0 auto' }}>
                    <SectionHeader
                        label="Our Team"
                        heading="Tim di Balik"
                        highlight="SafeWalk"
                        sub="Orang-orang passionate yang bekerja setiap hari untuk membuat perjalananmu lebih aman."
                    />
                    <div className="about-grid-5" style={{
                        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20,
                    }}>
                        {teamMembers.map((member, i) => (
                            <FadeIn key={member.name} delay={i * 0.1}>
                                <div style={{
                                    background: '#fff', borderRadius: 24, padding: '32px 24px',
                                    textAlign: 'center', position: 'relative', overflow: 'hidden',
                                    border: '1px solid #e8edf5',
                                    boxShadow: '0 4px 24px rgba(30,60,120,0.06)',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                }}>
                                    {/* Gradient accent top */}
                                    <div style={{
                                        position: 'absolute', top: 0, left: 0, right: 0, height: 4,
                                        background: 'linear-gradient(90deg,#3b82f6,#6366f1,#a855f7)',
                                        borderRadius: '24px 24px 0 0',
                                    }} />
                                    <div style={{
                                        width: 72, height: 72, borderRadius: '50%',
                                        background: 'linear-gradient(135deg,#eff6ff,#e0e7ff)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 36, margin: '0 auto 16px',
                                        boxShadow: '0 4px 16px rgba(99,102,241,0.12)',
                                    }}>{member.avatar}</div>
                                    <h4 style={{ fontSize: 16, fontWeight: 800, color: '#1a2d5a', marginBottom: 4, letterSpacing: '-0.3px' }}>{member.name}</h4>
                                    <p style={{
                                        display: 'inline-block', background: 'linear-gradient(135deg,#eff6ff,#eef2ff)',
                                        color: '#3b6ba5', fontSize: 12, fontWeight: 600,
                                        padding: '4px 12px', borderRadius: 8, marginBottom: 14,
                                    }}>{member.role}</p>
                                    <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.65, margin: 0 }}>{member.bio}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ 5. VALUES ═══ */}
            <section style={{ padding: '100px 28px', background: '#f8faff' }}>
                <div style={{ maxWidth: 1140, margin: '0 auto' }}>
                    <SectionHeader
                        label="Our Values"
                        heading="Nilai yang"
                        highlight="Kami Pegang"
                        sub="Prinsip-prinsip fundamental yang membentuk budaya dan produk kami."
                    />
                    <div className="about-grid-4" style={{
                        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20,
                    }}>
                        {values.map((v, i) => (
                            <FadeIn key={v.title} delay={i * 0.1}>
                                <div style={{
                                    background: '#fff', borderRadius: 24, padding: '36px 28px',
                                    textAlign: 'center', position: 'relative',
                                    border: '1px solid #e8edf5',
                                    boxShadow: '0 4px 24px rgba(30,60,120,0.06)',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                }}>
                                    <div style={{
                                        width: 64, height: 64, borderRadius: 20,
                                        background: `${v.color}12`,
                                        border: `2px solid ${v.color}22`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 28, margin: '0 auto 20px',
                                    }}>{v.icon}</div>
                                    <h4 style={{ fontSize: 18, fontWeight: 800, color: '#1a2d5a', marginBottom: 10, letterSpacing: '-0.4px' }}>{v.title}</h4>
                                    <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{v.desc}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ 6. TIMELINE / MILESTONES ═══ */}
            <section style={{
                padding: '100px 28px',
                background: 'linear-gradient(160deg, #0f1d3d 0%, #1a2d5a 40%, #1e3d6b 100%)',
                position: 'relative', overflow: 'hidden',
            }}>
                {/* Decorative dots */}
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.04,
                    backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                }} />

                <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 2 }}>
                    <SectionHeader
                        label="Milestones"
                        heading="Perjalanan"
                        highlight="SafeWalk"
                        sub="Dari ide sederhana di ruang kelas hingga melindungi ribuan pengguna di seluruh Indonesia."
                        light
                    />

                    <div className="about-timeline" style={{ position: 'relative', paddingLeft: 48 }}>
                        {/* Vertical line */}
                        <div style={{
                            position: 'absolute', left: 19, top: 0, bottom: 0, width: 2,
                            background: 'linear-gradient(to bottom, rgba(99,102,241,0.4), rgba(59,130,246,0.1))',
                        }} />

                        {milestones.map((m, i) => (
                            <FadeIn key={m.title} delay={i * 0.12}>
                                <div style={{
                                    position: 'relative', marginBottom: i === milestones.length - 1 ? 0 : 40,
                                    paddingLeft: 20,
                                }}>
                                    {/* Circle on line */}
                                    <div style={{
                                        position: 'absolute', left: -40, top: 6,
                                        width: 40, height: 40, borderRadius: '50%',
                                        background: m.color, display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', fontSize: 18,
                                        boxShadow: `0 0 20px ${m.color}44`,
                                        border: '3px solid rgba(255,255,255,0.1)',
                                    }}>{m.icon}</div>

                                    <div style={{
                                        background: 'rgba(255,255,255,0.04)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        borderRadius: 20, padding: '24px 28px',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                                            <span style={{
                                                background: `${m.color}22`, color: m.color,
                                                fontSize: 12, fontWeight: 700, padding: '4px 12px',
                                                borderRadius: 8, border: `1px solid ${m.color}33`,
                                            }}>{m.year}</span>
                                            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>{m.quarter}</span>
                                        </div>
                                        <h4 style={{ color: '#fff', fontSize: 18, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.4px' }}>{m.title}</h4>
                                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{m.desc}</p>
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ 7. PARTNERS ═══ */}
            <section style={{ padding: '80px 28px', background: '#fff' }}>
                <div style={{ maxWidth: 1140, margin: '0 auto' }}>
                    <SectionHeader
                        label="Trusted Partners"
                        heading="Dipercaya oleh"
                        highlight="Institusi Terbaik"
                        sub="Kolaborasi dengan universitas, pemerintah, dan perusahaan teknologi untuk keamanan yang lebih baik."
                    />
                    <div className="about-partners" style={{
                        display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
                        gap: 28, maxWidth: 800, margin: '0 auto',
                    }}>
                        {partners.map((p, i) => (
                            <FadeIn key={p.name} delay={i * 0.08}>
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: 10,
                                    background: '#f8faff', borderRadius: 16, padding: '14px 24px',
                                    border: '1px solid #e8edf5',
                                    boxShadow: '0 2px 12px rgba(30,60,120,0.04)',
                                    transition: 'transform 0.3s ease',
                                }}>
                                    <span style={{ fontSize: 22 }}>{p.icon}</span>
                                    <span style={{ color: '#4b6080', fontSize: 14, fontWeight: 600 }}>{p.name}</span>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ 8. CONTACT ═══ */}
            <section style={{ padding: '100px 28px', background: '#f8faff' }}>
                <div style={{ maxWidth: 1140, margin: '0 auto' }}>
                    <SectionHeader
                        label="Get In Touch"
                        heading="Hubungi"
                        highlight="Kami"
                        sub="Ada pertanyaan, masukan, atau ingin berkolaborasi? Kami senang mendengar dari kamu."
                    />
                    <div className="about-contact-grid" style={{
                        display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 40, alignItems: 'start',
                    }}>
                        {/* Contact info */}
                        <FadeIn delay={0.1} from="left">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                {/* Email */}
                                <div style={{
                                    background: '#fff', borderRadius: 20, padding: '24px 28px',
                                    border: '1px solid #e8edf5', boxShadow: '0 4px 20px rgba(30,60,120,0.05)',
                                    display: 'flex', alignItems: 'center', gap: 16,
                                }}>
                                    <div style={{
                                        width: 48, height: 48, borderRadius: 14,
                                        background: 'linear-gradient(135deg,#eff6ff,#dbeafe)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                                    }}>📧</div>
                                    <div>
                                        <p style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600, margin: '0 0 4px' }}>Email</p>
                                        <p style={{ color: '#1a2d5a', fontSize: 15, fontWeight: 700, margin: 0 }}>hello@safewalk.id</p>
                                    </div>
                                </div>

                                {/* Social Links */}
                                <div style={{
                                    background: '#fff', borderRadius: 20, padding: '24px 28px',
                                    border: '1px solid #e8edf5', boxShadow: '0 4px 20px rgba(30,60,120,0.05)',
                                }}>
                                    <p style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600, margin: '0 0 16px' }}>Social Media</p>
                                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                                        {[
                                            { icon: '📸', label: 'Instagram', handle: '@safewalk.id', bg: 'linear-gradient(135deg,#f472b6,#e879f9)' },
                                            { icon: '🐦', label: 'Twitter', handle: '@safewalkapp', bg: 'linear-gradient(135deg,#38bdf8,#60a5fa)' },
                                            { icon: '💼', label: 'LinkedIn', handle: 'SafeWalk', bg: 'linear-gradient(135deg,#3b82f6,#2563eb)' },
                                            { icon: '📱', label: 'TikTok', handle: '@safewalk', bg: 'linear-gradient(135deg,#1a1a2e,#374151)' },
                                        ].map((s) => (
                                            <a key={s.label} href="#" style={{
                                                display: 'flex', alignItems: 'center', gap: 8,
                                                background: '#f8faff', borderRadius: 12, padding: '10px 14px',
                                                border: '1px solid #e8edf5', textDecoration: 'none',
                                                transition: 'transform 0.2s ease',
                                            }}>
                                                <span style={{ fontSize: 16 }}>{s.icon}</span>
                                                <div>
                                                    <p style={{ color: '#1a2d5a', fontSize: 12, fontWeight: 700, margin: 0 }}>{s.label}</p>
                                                    <p style={{ color: '#94a3b8', fontSize: 11, margin: 0 }}>{s.handle}</p>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>

                                {/* Location */}
                                <div style={{
                                    background: '#fff', borderRadius: 20, padding: '24px 28px',
                                    border: '1px solid #e8edf5', boxShadow: '0 4px 20px rgba(30,60,120,0.05)',
                                    display: 'flex', alignItems: 'center', gap: 16,
                                }}>
                                    <div style={{
                                        width: 48, height: 48, borderRadius: 14,
                                        background: 'linear-gradient(135deg,#fef3c7,#fde68a)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                                    }}>📍</div>
                                    <div>
                                        <p style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600, margin: '0 0 4px' }}>Lokasi</p>
                                        <p style={{ color: '#1a2d5a', fontSize: 15, fontWeight: 700, margin: 0 }}>Surabaya, Indonesia 🇮🇩</p>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>

                        {/* Contact form */}
                        <FadeIn delay={0.2} from="right">
                            <form onSubmit={handleSubmit} style={{
                                background: '#fff', borderRadius: 28, padding: '40px 36px',
                                border: '1px solid #e8edf5', boxShadow: '0 8px 40px rgba(30,60,120,0.06)',
                            }}>
                                <h3 style={{ fontSize: 22, fontWeight: 800, color: '#1a2d5a', marginBottom: 6, letterSpacing: '-0.5px' }}>Kirim Pesan</h3>
                                <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 28 }}>Kami akan merespons dalam 24 jam ✨</p>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                                    <div>
                                        <label style={{ color: '#475569', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Nama</label>
                                        <input
                                            type="text" placeholder="Nama lengkap kamu"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            style={{
                                                width: '100%', padding: '13px 18px', borderRadius: 14,
                                                border: '1.5px solid #e2e8f0', background: '#f8faff',
                                                fontSize: 14, color: '#1a2d5a', fontFamily: 'inherit',
                                                transition: 'all 0.2s ease',
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ color: '#475569', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Email</label>
                                        <input
                                            type="email" placeholder="email@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            style={{
                                                width: '100%', padding: '13px 18px', borderRadius: 14,
                                                border: '1.5px solid #e2e8f0', background: '#f8faff',
                                                fontSize: 14, color: '#1a2d5a', fontFamily: 'inherit',
                                                transition: 'all 0.2s ease',
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ color: '#475569', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Pesan</label>
                                        <textarea
                                            placeholder="Tulis pesan kamu di sini..."
                                            rows={4}
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            style={{
                                                width: '100%', padding: '13px 18px', borderRadius: 14,
                                                border: '1.5px solid #e2e8f0', background: '#f8faff',
                                                fontSize: 14, color: '#1a2d5a', fontFamily: 'inherit',
                                                resize: 'vertical', minHeight: 100,
                                                transition: 'all 0.2s ease',
                                            }}
                                        />
                                    </div>
                                    <button type="submit" style={{
                                        background: formSent
                                            ? 'linear-gradient(135deg,#22c55e,#16a34a)'
                                            : 'linear-gradient(135deg,#3b82f6,#6366f1)',
                                        border: 'none', borderRadius: 14, padding: '14px 32px',
                                        color: '#fff', fontSize: 15, fontWeight: 700, width: '100%',
                                        boxShadow: formSent
                                            ? '0 8px 24px rgba(34,197,94,0.3)'
                                            : '0 8px 24px rgba(99,102,241,0.3)',
                                        transition: 'all 0.3s ease',
                                    }}>
                                        {formSent ? '✅ Pesan Terkirim!' : 'Kirim Pesan →'}
                                    </button>
                                </div>
                            </form>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* ═══ 9. CTA — Join Our Mission ═══ */}
            <section style={{
                padding: '100px 28px',
                background: 'linear-gradient(160deg, #1a2d5a 0%, #2d5da1 100%)',
                position: 'relative', overflow: 'hidden',
            }}>
                {/* Floating orbs */}
                <div style={{
                    position: 'absolute', top: '20%', left: '10%', width: 200, height: 200,
                    background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
                    borderRadius: '50%', filter: 'blur(40px)', animation: 'float 6s ease-in-out infinite',
                    pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute', bottom: '10%', right: '15%', width: 250, height: 250,
                    background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
                    borderRadius: '50%', filter: 'blur(50px)', animation: 'float 8s ease-in-out infinite 1s',
                    pointerEvents: 'none',
                }} />

                <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
                    <FadeIn delay={0.1}>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)',
                            border: '1px solid rgba(255,255,255,0.12)', borderRadius: 40,
                            padding: '8px 20px', marginBottom: 28,
                        }}>
                            <span style={{ fontSize: 16 }}>✨</span>
                            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 600, letterSpacing: 1 }}>BERGABUNG BERSAMA KAMI</span>
                        </div>
                    </FadeIn>
                    <FadeIn delay={0.2}>
                        <h2 style={{
                            fontSize: 'clamp(30px,4vw,52px)', fontWeight: 900,
                            color: '#fff', lineHeight: 1.15, letterSpacing: '-1.5px', marginBottom: 20,
                        }}>
                            Join Our Mission to Make
                            <br />
                            <span style={{
                                background: 'linear-gradient(135deg,#60a5fa,#818cf8,#a78bfa)',
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                            }}>Every Walk Safer</span>
                        </h2>
                    </FadeIn>
                    <FadeIn delay={0.35}>
                        <p style={{
                            color: 'rgba(255,255,255,0.55)', fontSize: 17, lineHeight: 1.75,
                            maxWidth: 540, margin: '0 auto 40px',
                        }}>
                            Baik sebagai pengguna, volunteer, partner kampus, atau developer —
                            kamu bisa menjadi bagian dari gerakan ini. Bersama, kita bisa membuat
                            dunia lebih aman untuk semua orang.
                        </p>
                    </FadeIn>
                    <FadeIn delay={0.5}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
                            <button style={{
                                background: '#fff', border: 'none', borderRadius: 14,
                                padding: '16px 36px', color: '#1a2d5a', fontSize: 16,
                                fontWeight: 800, boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                                letterSpacing: '-0.3px',
                            }}>
                                🛡️ Download SafeWalk
                            </button>
                            <button style={{
                                background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)',
                                border: '1.5px solid rgba(255,255,255,0.2)',
                                borderRadius: 14, padding: '16px 36px', color: '#fff', fontSize: 16,
                                fontWeight: 700,
                            }}>
                                Jadi Partner →
                            </button>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.65}>
                        <div style={{
                            marginTop: 56, display: 'flex', justifyContent: 'center',
                            gap: 40, flexWrap: 'wrap',
                        }}>
                            {[
                                { emoji: '🛡️', text: 'Gratis selamanya' },
                                { emoji: '🔒', text: 'Privasi terjaga' },
                                { emoji: '⚡', text: 'Setup 30 detik' },
                            ].map((item) => (
                                <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ fontSize: 18 }}>{item.emoji}</span>
                                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: 500 }}>{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </FadeIn>
                </div>
            </section>

            </div>
        </>
    );
}
