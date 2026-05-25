import React, { useState, useEffect, useRef } from 'react';
import { FiShield, FiMapPin, FiUsers, FiClock, FiSettings, FiHome, FiAlertTriangle, FiNavigation, FiPhone, FiLogOut, FiPlus, FiTrash2, FiMap, FiActivity } from 'react-icons/fi';

/* ── Leaflet Map Component ── */
const LeafletMap = ({ origin, destination, isWalking, onMapReady }) => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markersRef = useRef([]);
    const routeLineRef = useRef(null);

    useEffect(() => {
        // Load Leaflet CSS
        if (!document.querySelector('link[href*="leaflet"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(link);
        }
        // Load Leaflet JS
        const loadLeaflet = () => {
            return new Promise((resolve) => {
                if (window.L) { resolve(window.L); return; }
                const script = document.createElement('script');
                script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                script.onload = () => resolve(window.L);
                document.head.appendChild(script);
            });
        };

        loadLeaflet().then((L) => {
            if (!mapRef.current || mapInstance.current) return;
            const map = L.map(mapRef.current, {
                zoomControl: false,
            }).setView([-7.2756, 112.7526], 14); // Surabaya center

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap',
                maxZoom: 19,
            }).addTo(map);

            L.control.zoom({ position: 'bottomright' }).addTo(map);

            mapInstance.current = map;
            if (onMapReady) onMapReady(map);

            // Force map to recalculate size after a brief delay
            setTimeout(() => map.invalidateSize(), 200);
        });

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, []);

    // Update markers based on origin/destination
    useEffect(() => {
        if (!mapInstance.current || !window.L) return;
        const L = window.L;
        const map = mapInstance.current;

        // Clear existing markers
        markersRef.current.forEach(m => map.removeLayer(m));
        markersRef.current = [];
        if (routeLineRef.current) {
            map.removeLayer(routeLineRef.current);
            routeLineRef.current = null;
        }

        if (origin) {
            const startIcon = L.divIcon({
                html: '<div style="width:16px;height:16px;background:#3b82f6;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 8px rgba(59,130,246,0.5);"></div>',
                className: '', iconSize: [16, 16], iconAnchor: [8, 8],
            });
            const m = L.marker(origin.coords, { icon: startIcon }).addTo(map).bindPopup(`<b>Dari:</b> ${origin.name}`);
            markersRef.current.push(m);
        }

        if (destination) {
            const endIcon = L.divIcon({
                html: '<div style="width:16px;height:16px;background:#22c55e;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 8px rgba(34,197,94,0.5);"></div>',
                className: '', iconSize: [16, 16], iconAnchor: [8, 8],
            });
            const m = L.marker(destination.coords, { icon: endIcon }).addTo(map).bindPopup(`<b>Ke:</b> ${destination.name}`);
            markersRef.current.push(m);
        }

        if (origin && destination) {
            // Draw simple route line
            routeLineRef.current = L.polyline([origin.coords, destination.coords], {
                color: isWalking ? '#f59e0b' : '#3b82f6',
                weight: 4,
                opacity: 0.8,
                dashArray: isWalking ? null : '10, 8',
            }).addTo(map);

            map.fitBounds(L.latLngBounds([origin.coords, destination.coords]).pad(0.3));
        } else if (origin) {
            map.setView(origin.coords, 15);
        }
    }, [origin, destination, isWalking]);

    return <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: 20, zIndex: 1 }} />;
};

/* ── Location Presets ── */
const LOCATION_PRESETS = [
    { name: 'Gedung Teknik ITS', coords: [-7.2819, 112.7945] },
    { name: 'Perpustakaan ITS', coords: [-7.2804, 112.7937] },
    { name: 'Asrama Mahasiswa ITS', coords: [-7.2862, 112.7918] },
    { name: 'Masjid Manarul Ilmi', coords: [-7.2808, 112.7899] },
    { name: 'Kantin ITS', coords: [-7.2835, 112.7912] },
    { name: 'Gedung Rektorat ITS', coords: [-7.2799, 112.7968] },
    { name: 'RS UNAIR', coords: [-7.2700, 112.7599] },
    { name: 'Tunjungan Plaza', coords: [-7.2617, 112.7381] },
    { name: 'Galaxy Mall', coords: [-7.2934, 112.7687] },
    { name: 'Kost Gebang Lor', coords: [-7.2761, 112.7573] },
];

export default function DashboardPage({ user, onLogout, onNavigate }) {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 820);
    const [activeTab, setActiveTab] = useState('overview');

    // Map & Journey state
    const [originSearch, setOriginSearch] = useState('');
    const [destSearch, setDestSearch] = useState('');
    const [origin, setOrigin] = useState(null);
    const [destination, setDestination] = useState(null);
    const [showOriginDropdown, setShowOriginDropdown] = useState(false);
    const [showDestDropdown, setShowDestDropdown] = useState(false);
    const [isWalking, setIsWalking] = useState(false);
    const [walkProgress, setWalkProgress] = useState(0);
    const walkTimerRef = useRef(null);

    // SOS state
    const [sosActive, setSosActive] = useState(false);
    const [sosHoldProgress, setSosHoldProgress] = useState(0);
    const [sosHeld, setSosHeld] = useState(false);
    const sosTimerRef = useRef(null);

    // Fake Call
    const [fakeCallState, setFakeCallState] = useState('idle');

    // Guardians and Journeys database-backed states
    const [guardians, setGuardians] = useState([]);
    const [journeys, setJourneys] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showAddGuardianModal, setShowAddGuardianModal] = useState(false);
    const [newGuardianName, setNewGuardianName] = useState('');
    const [newGuardianPhone, setNewGuardianPhone] = useState('');
    const [newGuardianAvatar, setNewGuardianAvatar] = useState('👥');

    // Fetch initial data from database
    useEffect(() => {
        const token = localStorage.getItem('safewalk_token');
        if (!token) {
            onLogout();
            return;
        }

        fetch('/api/dashboard', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        })
        .then(res => {
            if (!res.ok) throw new Error('Unauthorized');
            return res.json();
        })
        .then(data => {
            setGuardians(data.guardians || []);
            setJourneys(data.journeys || []);
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            onLogout();
        });
    }, []);

    // Resize handler
    useEffect(() => {
        const h = () => setIsMobile(window.innerWidth <= 820);
        window.addEventListener('resize', h);
        return () => {
            window.removeEventListener('resize', h);
            clearInterval(walkTimerRef.current);
            clearInterval(sosTimerRef.current);
        };
    }, []);

    // Helper to save journeys to database
    const saveJourney = (route, duration, status) => {
        const token = localStorage.getItem('safewalk_token');
        if (!token) return;

        fetch('/api/journeys', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                route,
                duration_minutes: duration,
                status
            })
        })
        .then(res => {
            if (!res.ok) throw new Error('Failed to save journey');
            return res.json();
        })
        .then(newJourney => {
            setJourneys(prev => [newJourney, ...prev]);
        })
        .catch(err => console.error('Error saving journey:', err));
    };

    // Walk simulation
    useEffect(() => {
        if (isWalking) {
            walkTimerRef.current = setInterval(() => {
                setWalkProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(walkTimerRef.current);
                        setIsWalking(false);
                        const routeName = (origin && destination)
                            ? `${origin.name} → ${destination.name}`
                            : 'Gedung Teknik ITS → Asrama Mahasiswa ITS';
                        saveJourney(routeName, 12, 'Completed');
                        return 100;
                    }
                    return prev + 5; // Faster simulation progress (+5% every 250ms)
                });
            }, 250);
        }
        return () => clearInterval(walkTimerRef.current);
    }, [isWalking, origin, destination]);

    // SOS hold
    const startSosHold = () => {
        setSosHeld(true);
        setSosHoldProgress(0);
        sosTimerRef.current = setInterval(() => {
            setSosHoldProgress(prev => {
                if (prev >= 100) {
                    clearInterval(sosTimerRef.current);
                    setSosActive(true);
                    setSosHeld(false);
                    const routeName = (origin && destination)
                        ? `${origin.name} → ${destination.name}`
                        : 'Panggilan Darurat';
                    saveJourney(routeName, 5, 'SOS');
                    return 100;
                }
                return prev + 5;
            });
        }, 100);
    };
    const stopSosHold = () => {
        clearInterval(sosTimerRef.current);
        setSosHeld(false);
        if (!sosActive) setSosHoldProgress(0);
    };

    const startWalk = () => {
        if (!origin || !destination) return;
        setWalkProgress(0);
        setIsWalking(true);
    };
    const resetWalk = () => {
        clearInterval(walkTimerRef.current);
        setIsWalking(false);
        setWalkProgress(0);
    };

    const handleAddGuardian = (e) => {
        e.preventDefault();
        if (!newGuardianName || !newGuardianPhone) return;

        const token = localStorage.getItem('safewalk_token');
        fetch('/api/guardians', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: newGuardianName,
                phone: newGuardianPhone,
                avatar: newGuardianAvatar
            })
        })
        .then(res => {
            if (!res.ok) throw new Error('Failed to add guardian');
            return res.json();
        })
        .then(newGuardian => {
            setGuardians(prev => [...prev, newGuardian]);
            setNewGuardianName('');
            setNewGuardianPhone('');
            setShowAddGuardianModal(false);
        })
        .catch(err => {
            console.error(err);
            alert('Gagal menambahkan Pelindung.');
        });
    };

    const handleDeleteGuardian = (id) => {
        const token = localStorage.getItem('safewalk_token');
        fetch(`/api/guardians/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        })
        .then(res => {
            if (!res.ok) throw new Error('Failed to delete');
            setGuardians(prev => prev.filter(x => x.id !== id));
        })
        .catch(err => {
            console.error(err);
            alert('Gagal menghapus Pelindung.');
        });
    };

    const filteredOrigins = LOCATION_PRESETS.filter(l => l.name.toLowerCase().includes(originSearch.toLowerCase()));
    const filteredDests = LOCATION_PRESETS.filter(l => l.name.toLowerCase().includes(destSearch.toLowerCase()));

    /* ── Location Input Component ── */
    const LocationInput = ({ label, icon, color, value, onChange, suggestions, showDropdown, setShowDropdown, onSelect, placeholder }) => (
        <div style={{ position: 'relative', flex: 1 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
                {label}
            </label>
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => { onChange(e.target.value); setShowDropdown(true); }}
                onFocus={() => setShowDropdown(true)}
                style={{
                    width: '100%', padding: '12px 16px', borderRadius: 14,
                    border: '1.5px solid #e2e8f0', outline: 'none', fontSize: 14,
                    background: '#fff', transition: 'all 0.2s', boxSizing: 'border-box',
                }}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            />
            {showDropdown && suggestions.length > 0 && (
                <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0,
                    background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14,
                    boxShadow: '0 8px 28px rgba(0,0,0,0.12)', maxHeight: 200,
                    overflowY: 'auto', zIndex: 50, marginTop: 4,
                }}>
                    {suggestions.map(loc => (
                        <div
                            key={loc.name}
                            onClick={() => { onSelect(loc); onChange(loc.name); setShowDropdown(false); }}
                            style={{
                                padding: '10px 16px', cursor: 'pointer', fontSize: 13,
                                color: '#1a2d5a', display: 'flex', alignItems: 'center', gap: 8,
                                borderBottom: '1px solid #f8fafc', transition: 'background 0.15s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#f0f4ff'}
                            onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                        >
                            <FiMapPin size={14} color={color} />
                            {loc.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    /* ── Map + Route Panel ── */
    const renderMapPanel = (height = 400) => (
        <div style={{ background: '#fff', border: '1px solid #e8edf5', borderRadius: 28, overflow: 'hidden', boxShadow: '0 4px 24px rgba(30,60,120,0.06)' }}>
            {/* Route Inputs */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: '#1a2d5a', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FiNavigation size={18} color="#3b82f6" /> Rute Perjalanan
                </h3>
                <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 16px' }}>Pilih lokasi asal dan tujuan perjalananmu</p>

                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <LocationInput
                        label="DARI" icon={FiMapPin} color="#3b82f6" value={originSearch}
                        onChange={setOriginSearch} suggestions={filteredOrigins}
                        showDropdown={showOriginDropdown} setShowDropdown={setShowOriginDropdown}
                        onSelect={setOrigin} placeholder="Mau dari mana?"
                    />
                    <div style={{ fontSize: 18, color: '#cbd5e1', padding: '0 4px 12px' }}>→</div>
                    <LocationInput
                        label="KE" icon={FiMapPin} color="#22c55e" value={destSearch}
                        onChange={setDestSearch} suggestions={filteredDests}
                        showDropdown={showDestDropdown} setShowDropdown={setShowDestDropdown}
                        onSelect={setDestination} placeholder="Mau ke mana?"
                    />
                    <div style={{ paddingBottom: 0 }}>
                        {!isWalking ? (
                            <button onClick={startWalk} disabled={!origin || !destination} style={{
                                background: origin && destination ? 'linear-gradient(135deg,#3b82f6,#6366f1)' : '#e2e8f0',
                                border: 'none', borderRadius: 14, padding: '12px 24px',
                                color: origin && destination ? '#fff' : '#94a3b8',
                                fontSize: 14, fontWeight: 700, cursor: origin && destination ? 'pointer' : 'not-allowed',
                                boxShadow: origin && destination ? '0 4px 14px rgba(99,102,241,0.25)' : 'none',
                                display: 'flex', alignItems: 'center', gap: 6,
                                whiteSpace: 'nowrap',
                            }}>
                                <FiNavigation size={14} /> Mulai
                            </button>
                        ) : (
                            <button onClick={resetWalk} style={{
                                background: '#ef4444', border: 'none', borderRadius: 14,
                                padding: '12px 24px', color: '#fff', fontSize: 14, fontWeight: 700,
                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                                whiteSpace: 'nowrap',
                            }}>
                                <FiAlertTriangle size={14} /> Stop
                            </button>
                        )}
                    </div>
                </div>

                {/* Walking progress bar */}
                {isWalking && (
                    <div style={{ marginTop: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b', marginBottom: 6 }}>
                            <span style={{ fontWeight: 700, color: '#f59e0b' }}>⏳ Dalam perjalanan...</span>
                            <span style={{ fontWeight: 700 }}>{walkProgress}%</span>
                        </div>
                        <div style={{ height: 6, background: '#f1f5f9', borderRadius: 8, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${walkProgress}%`, background: 'linear-gradient(90deg,#3b82f6,#22c55e)', borderRadius: 8, transition: 'width 0.3s' }} />
                        </div>
                    </div>
                )}
                {walkProgress === 100 && !isWalking && (
                    <div style={{ marginTop: 12, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 18 }}>✅</span>
                        <span style={{ color: '#16a34a', fontSize: 13, fontWeight: 700 }}>Kamu sudah sampai dengan selamat!</span>
                    </div>
                )}
            </div>

            {/* Map */}
            <div style={{ height, position: 'relative' }}>
                <LeafletMap origin={origin} destination={destination} isWalking={isWalking} />
                {/* Overlay Status */}
                <div style={{
                    position: 'absolute', bottom: 16, left: 16,
                    background: 'rgba(255,255,255,0.94)', backdropFilter: 'blur(10px)',
                    border: '1px solid #dbeafe', borderRadius: 14,
                    padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.06)', zIndex: 10,
                }}>
                    <div style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: sosActive ? '#ef4444' : isWalking ? '#f59e0b' : '#22c55e',
                        boxShadow: `0 0 6px ${sosActive ? '#ef4444' : isWalking ? '#f59e0b' : '#22c55e'}`,
                    }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#1a2d5a' }}>
                        {sosActive ? '🚨 SOS AKTIF' : isWalking ? `Melacak lokasi... ${walkProgress}%` : walkProgress === 100 ? 'Sampai tujuan!' : 'Siap berangkat'}
                    </span>
                </div>
            </div>
        </div>
    );

    /* ── SOS Panel ── */
    const renderSOSPanel = () => (
        <div style={{
            background: '#fff', border: '1px solid #e8edf5', borderRadius: 28,
            padding: 28, boxShadow: '0 4px 24px rgba(30,60,120,0.05)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
        }}>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#1a2d5a', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                <FiAlertTriangle size={18} color="#ef4444" /> Tindakan Darurat
            </h3>
            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 20 }}>Tahan tombol SOS selama 3 detik untuk memicu alarm</p>

            {/* SOS Button */}
            <div
                onMouseDown={startSosHold} onMouseUp={stopSosHold} onMouseLeave={stopSosHold}
                onTouchStart={startSosHold} onTouchEnd={stopSosHold}
                style={{
                    width: 130, height: 130, borderRadius: '50%',
                    background: sosActive ? '#ef4444' : '#fff5f5',
                    border: `3px solid ${sosActive ? '#ef4444' : '#fecaca'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', position: 'relative', userSelect: 'none',
                    boxShadow: sosActive ? '0 0 40px rgba(239,68,68,0.5)' : '0 8px 28px rgba(239,68,68,0.12)',
                    transition: 'all 0.2s', marginBottom: 16,
                }}
            >
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 130 130">
                    <circle cx="65" cy="65" r="58" fill="none" stroke="rgba(239,68,68,0.1)" strokeWidth="6" />
                    <circle cx="65" cy="65" r="58" fill="none" stroke="#ef4444" strokeWidth="6" strokeDasharray={`${sosHoldProgress * 3.64} 364`} strokeLinecap="round" />
                </svg>
                <div style={{ textAlign: 'center', zIndex: 2 }}>
                    <FiAlertTriangle size={28} color={sosActive ? '#fff' : '#ef4444'} />
                    <p style={{ color: sosActive ? '#fff' : '#ef4444', fontWeight: 900, fontSize: 16, margin: '4px 0 0' }}>
                        {sosHeld ? `${Math.round(sosHoldProgress)}%` : sosActive ? 'AKTIF!' : 'SOS'}
                    </p>
                </div>
            </div>

            {sosActive && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 14, padding: '12px 18px', marginBottom: 14, width: '100%' }}>
                    <p style={{ color: '#ef4444', fontSize: 13, fontWeight: 700, margin: 0 }}>🚨 Sinyal darurat dikirim ke semua Pelindung!</p>
                    <button onClick={() => setSosActive(false)} style={{ marginTop: 8, background: '#ef4444', border: 'none', borderRadius: 10, padding: '6px 16px', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                        Matikan Alarm
                    </button>
                </div>
            )}

            <div style={{ display: 'flex', gap: 12, width: '100%' }}>
                <button onClick={() => setFakeCallState('ringing')} style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    background: '#faf5ff', border: '1.5px solid #e9d5ff', borderRadius: 16,
                    padding: '12px 0', color: '#7c3aed', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                }}>
                    <FiPhone size={14} /> Fake Call
                </button>
                <button onClick={() => { setOriginSearch('Gedung Teknik ITS'); setOrigin(LOCATION_PRESETS[0]); setDestSearch('Asrama Mahasiswa ITS'); setDestination(LOCATION_PRESETS[2]); setActiveTab('overview'); }} style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    background: '#eff6ff', border: '1.5px solid #bfdbfe', borderRadius: 16,
                    padding: '12px 0', color: '#3b82f6', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                }}>
                    <FiMap size={14} /> Mulai Rute
                </button>
            </div>
        </div>
    );

    /* ── Stats Cards ── */
    const renderStats = () => (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
            {[
                { label: 'Status', val: sosActive ? 'SOS AKTIF' : isWalking ? 'Berjalan' : 'Aman', color: sosActive ? '#ef4444' : isWalking ? '#f59e0b' : '#22c55e', icon: <FiShield size={20} />, desc: sosActive ? 'Bantuan dikirim' : isWalking ? 'GPS aktif' : 'Sistem normal' },
                { label: 'Perjalanan', val: `${journeys.length} Kali`, color: '#3b82f6', icon: <FiActivity size={20} />, desc: `Pemicu SOS: ${journeys.filter(j => j.status === 'SOS').length}` },
                { label: 'Pelindung', val: `${guardians.length} Aktif`, color: '#8b5cf6', icon: <FiUsers size={20} />, desc: 'Siaga menerima sinyal' },
            ].map((s, idx) => (
                <div key={idx} style={{
                    background: '#fff', border: '1px solid #e8edf5', borderRadius: 22, padding: 22,
                    boxShadow: '0 2px 12px rgba(30,60,120,0.04)', position: 'relative', overflow: 'hidden',
                }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: s.color }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>{s.label}</span>
                        <span style={{ color: s.color }}>{s.icon}</span>
                    </div>
                    <p style={{ fontSize: 20, fontWeight: 900, color: s.color, margin: '0 0 2px', letterSpacing: '-0.5px' }}>{s.val}</p>
                    <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>{s.desc}</p>
                </div>
            ))}
        </div>
    );

    /* ── Guardians ── */
    const renderGuardians = () => (
        <div style={{ background: '#fff', border: '1px solid #e8edf5', borderRadius: 28, padding: 28, boxShadow: '0 4px 24px rgba(30,60,120,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
                <div>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: '#1a2d5a', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FiUsers size={18} color="#8b5cf6" /> Kontak Pelindung
                    </h3>
                    <p style={{ fontSize: 12, color: '#94a3b8', margin: '2px 0 0' }}>Menerima notifikasi GPS & sinyal SOS</p>
                </div>
                <button onClick={() => setShowAddGuardianModal(true)} style={{
                    background: 'linear-gradient(135deg,#3b82f6,#6366f1)', border: 'none',
                    borderRadius: 12, padding: '8px 16px', color: '#fff', fontSize: 13,
                    fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                    boxShadow: '0 4px 12px rgba(99,102,241,0.2)',
                }}>
                    <FiPlus size={14} /> Tambah
                </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 14 }}>
                {guardians.map(g => (
                    <div key={g.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8faff', border: '1px solid #e8edf5', borderRadius: 18, padding: '14px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#fff', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{g.avatar}</div>
                            <div>
                                <h4 style={{ fontSize: 13, fontWeight: 700, color: '#1a2d5a', margin: 0 }}>{g.name}</h4>
                                <p style={{ fontSize: 11, color: '#64748b', margin: '2px 0 0' }}>{g.phone}</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontSize: 10, background: '#dcfce7', color: '#16a34a', fontWeight: 700, padding: '3px 8px', borderRadius: 8 }}>{g.status}</span>
                            <button onClick={() => handleDeleteGuardian(g.id)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}>
                                <FiTrash2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showAddGuardianModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(9,13,26,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
                    <div style={{ background: '#fff', borderRadius: 24, padding: 32, width: '100%', maxWidth: 400, boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}>
                        <h3 style={{ fontSize: 20, fontWeight: 800, color: '#1a2d5a', margin: '0 0 6px' }}>Tambah Pelindung Baru</h3>
                        <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 20px' }}>Masukkan nama dan nomor telepon aktif.</p>
                        <form onSubmit={handleAddGuardian}>
                            <div style={{ marginBottom: 14 }}>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#475569', marginBottom: 6 }}>Avatar</label>
                                <div style={{ display: 'flex', gap: 10 }}>
                                    {['👩', '👨', '👵', '👴', '👮', '👥'].map(e => (
                                        <button key={e} type="button" onClick={() => setNewGuardianAvatar(e)} style={{
                                            width: 40, height: 40, borderRadius: 10,
                                            background: newGuardianAvatar === e ? '#eff6ff' : '#f1f5f9',
                                            border: newGuardianAvatar === e ? '2px solid #3b82f6' : '1px solid #cbd5e1',
                                            fontSize: 18, cursor: 'pointer',
                                        }}>{e}</button>
                                    ))}
                                </div>
                            </div>
                            <div style={{ marginBottom: 14 }}>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#475569', marginBottom: 6 }}>Nama</label>
                                <input required placeholder="Contoh: Kakak Dian" value={newGuardianName} onChange={e => setNewGuardianName(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1.5px solid #cbd5e1', outline: 'none', boxSizing: 'border-box' }} />
                            </div>
                            <div style={{ marginBottom: 22 }}>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#475569', marginBottom: 6 }}>Nomor Telepon</label>
                                <input required type="tel" placeholder="0812-xxxx-xxxx" value={newGuardianPhone} onChange={e => setNewGuardianPhone(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1.5px solid #cbd5e1', outline: 'none', boxSizing: 'border-box' }} />
                            </div>
                            <div style={{ display: 'flex', gap: 12 }}>
                                <button type="button" onClick={() => setShowAddGuardianModal(false)} style={{ flex: 1, padding: 12, border: '1px solid #cbd5e1', background: '#fff', borderRadius: 12, fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>Batal</button>
                                <button type="submit" style={{ flex: 1, padding: 12, border: 'none', background: 'linear-gradient(135deg,#3b82f6,#6366f1)', borderRadius: 12, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );

    /* ── Journey Logs ── */
    const renderJourneys = () => (
        <div style={{ background: '#fff', border: '1px solid #e8edf5', borderRadius: 28, padding: 28, boxShadow: '0 4px 24px rgba(30,60,120,0.05)' }}>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#1a2d5a', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <FiClock size={18} color="#3b82f6" /> Riwayat Perjalanan
            </h3>
            <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 20px' }}>Log rute dan aktivitas SafeWalk Anda</p>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                            <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 700 }}>Tanggal</th>
                            <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 700 }}>Rute</th>
                            <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 700 }}>Durasi</th>
                            <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 700 }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {journeys.map((l, i) => {
                            const date = new Date(l.created_at || new Date()).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                            });
                            const statusLabel = l.status === 'Completed' ? 'Aman' : l.status === 'SOS' ? 'SOS Ditekan' : 'Dibatalkan';
                            const statusColor = l.status === 'Completed' ? '#22c55e' : '#ef4444';
                            return (
                                <tr key={l.id || i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: 14, color: '#1a2d5a', fontWeight: 600 }}>{date}</td>
                                    <td style={{ padding: 14, color: '#475569' }}>{l.route}</td>
                                    <td style={{ padding: 14, color: '#64748b' }}>{l.duration_minutes} mnt</td>
                                    <td style={{ padding: 14 }}>
                                        <span style={{ color: statusColor, background: statusColor + '14', padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700 }}>{statusLabel}</span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );

    /* ── Settings ── */
    const renderSettings = () => (
        <div style={{ background: '#fff', border: '1px solid #e8edf5', borderRadius: 28, padding: 28, boxShadow: '0 4px 24px rgba(30,60,120,0.05)' }}>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#1a2d5a', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <FiSettings size={18} color="#64748b" /> Pengaturan
            </h3>
            <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 24px' }}>Preferensi keamanan dan notifikasi</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 500 }}>
                {[
                    { label: 'Deteksi Kecelakaan (AI)', desc: 'Kirim notifikasi jika jatuh atau rute terhenti.', active: true },
                    { label: 'Sirene SOS', desc: 'Bunyikan alarm saat SOS ditekan.', active: false },
                    { label: 'Perekam Audio', desc: 'Rekam suara otomatis saat SOS aktif.', active: true },
                ].map((p, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, borderBottom: '1px solid #f1f5f9' }}>
                        <div style={{ paddingRight: 16 }}>
                            <h4 style={{ fontSize: 14, fontWeight: 700, color: '#1a2d5a', margin: '0 0 4px' }}>{p.label}</h4>
                            <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>{p.desc}</p>
                        </div>
                        <div style={{ position: 'relative', width: 44, height: 24, background: p.active ? '#3b82f6' : '#cbd5e1', borderRadius: 12, cursor: 'pointer' }}>
                            <div style={{ position: 'absolute', top: 2, left: p.active ? 22 : 2, width: 20, height: 20, background: '#fff', borderRadius: '50%', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', transition: 'left 0.3s' }} />
                        </div>
                    </div>
                ))}
                <button onClick={onLogout} style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: '12px 24px', color: '#ef4444', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8 }}>
                    <FiLogOut size={16} /> Keluar dari Akun
                </button>
            </div>
        </div>
    );

    /* ── Fake Call Overlay ── */
    const renderFakeCallOverlay = () => {
        if (fakeCallState === 'idle') return null;
        return (
            <div style={{ position: 'fixed', inset: 0, background: '#090d1a', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '60px 40px', zIndex: 9999 }}>
                <div style={{ textAlign: 'center', marginTop: 40 }}>
                    {fakeCallState === 'ringing' && <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, letterSpacing: 1, textTransform: 'uppercase' }}>Panggilan Masuk</p>}
                    <h2 style={{ color: '#fff', fontSize: 32, fontWeight: 700, marginTop: 10 }}>Mama</h2>
                    <p style={{ color: fakeCallState === 'active' ? '#22c55e' : '#a78bfa', fontSize: 15, marginTop: 8 }}>
                        {fakeCallState === 'active' ? 'Terhubung (00:08)' : 'SafeWalk Sim Escape'}
                    </p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginBottom: 40 }}>
                    <div style={{ textAlign: 'center' }}>
                        <button onClick={() => setFakeCallState('idle')} style={{ width: 68, height: 68, borderRadius: '50%', background: '#ef4444', border: 'none', fontSize: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(239,68,68,0.4)' }}>📵</button>
                        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 10, display: 'block' }}>{fakeCallState === 'active' ? 'Akhiri' : 'Tolak'}</span>
                    </div>
                    {fakeCallState === 'ringing' && (
                        <div style={{ textAlign: 'center' }}>
                            <button onClick={() => setFakeCallState('active')} style={{ width: 68, height: 68, borderRadius: '50%', background: '#22c55e', border: 'none', fontSize: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(34,197,94,0.4)' }}>📞</button>
                            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 10, display: 'block' }}>Jawab</span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8faff', fontFamily: "'DM Sans', sans-serif" }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', border: '4px solid #e8edf5', borderTopColor: '#3b82f6', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }}/>
                    <p style={{ color: '#64748b', fontSize: 14, fontWeight: 600 }}>Memuat Data Keamanan...</p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            </div>
        );
    }

    /* ─────────────── MOBILE LAYOUT ─────────────── */
    if (isMobile) {
        return (
            <div style={{ minHeight: '100vh', background: '#f8faff', paddingBottom: 84, fontFamily: "'DM Sans', sans-serif", position: 'relative' }}>
                <style>{`
                    @keyframes pulse-sos { 0% { box-shadow: 0 0 0 0 rgba(239,68,68,0.4); } 70% { box-shadow: 0 0 0 20px rgba(239,68,68,0); } 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); } }
                `}</style>

                {/* Mobile Header */}
                <header style={{ background: '#fff', borderBottom: '1px solid #e8edf5', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 30, height: 30, borderRadius: 9, background: 'linear-gradient(135deg,#3b82f6,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>🛡️</div>
                        <span style={{ fontWeight: 800, fontSize: 17, color: '#1a2d5a' }}>SafeWalk</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {sosActive && (
                            <span style={{ fontSize: 10, background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444', fontWeight: 800, padding: '3px 8px', borderRadius: 20 }}>SOS</span>
                        )}
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                            {user?.avatar || '👨‍💻'}
                        </div>
                    </div>
                </header>

                <main style={{ padding: 16 }}>
                    {activeTab === 'overview' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {sosActive && (
                                <div style={{ background: 'linear-gradient(135deg,#ef4444,#dc2626)', borderRadius: 20, padding: 18, color: '#fff' }}>
                                    <h4 style={{ fontSize: 15, fontWeight: 800, margin: '0 0 6px' }}>🚨 SOS AKTIF!</h4>
                                    <p style={{ fontSize: 12, margin: '0 0 12px', opacity: 0.9 }}>Sinyal darurat dikirimkan ke semua Pelindung.</p>
                                    <button onClick={() => setSosActive(false)} style={{ background: '#fff', color: '#ef4444', border: 'none', borderRadius: 10, padding: '6px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Matikan</button>
                                </div>
                            )}
                            {renderMapPanel(260)}
                            {renderSOSPanel()}
                            {renderStats()}
                        </div>
                    )}
                    {activeTab === 'map' && renderMapPanel(350)}
                    {activeTab === 'guardians' && renderGuardians()}
                    {activeTab === 'journeys' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {renderJourneys()}
                            {renderSettings()}
                        </div>
                    )}
                </main>

                {/* Mobile Bottom Nav */}
                <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #e8edf5', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', padding: '6px 0', zIndex: 100, height: 64, boxShadow: '0 -4px 16px rgba(0,0,0,0.04)' }}>
                    {[
                        { id: 'overview', label: 'Home', Icon: FiHome },
                        { id: 'map', label: 'Peta', Icon: FiMap },
                        { id: 'guardians', label: 'Pelindung', Icon: FiUsers },
                        { id: 'journeys', label: 'Akun', Icon: FiSettings },
                    ].map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                            background: 'none', border: 'none', display: 'flex', flexDirection: 'column',
                            alignItems: 'center', gap: 3, color: activeTab === tab.id ? '#3b82f6' : '#94a3b8',
                            fontSize: 10, fontWeight: activeTab === tab.id ? 700 : 500, cursor: 'pointer',
                            justifyContent: 'center',
                        }}>
                            <tab.Icon size={20} />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </nav>
                {renderFakeCallOverlay()}
            </div>
        );
    }

    /* ─────────────── DESKTOP LAYOUT ─────────────── */
    return (
        <div style={{ minHeight: '100vh', display: 'flex', background: '#f8faff', fontFamily: "'DM Sans', sans-serif" }}>
            <style>{`
                @keyframes pulse-glow { 0% { box-shadow: 0 0 0 0 rgba(59,130,246,0.4); } 70% { box-shadow: 0 0 0 12px rgba(59,130,246,0); } 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0); } }
            `}</style>

            {/* Sidebar */}
            <aside style={{ width: 250, background: '#fff', borderRight: '1px solid #e8edf5', display: 'flex', flexDirection: 'column', padding: '28px 20px', position: 'sticky', top: 0, height: '100vh' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 11, background: 'linear-gradient(135deg,#3b82f6,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>🛡️</div>
                    <span style={{ fontWeight: 800, fontSize: 18, color: '#1a2d5a', letterSpacing: '-0.5px' }}>SafeWalk</span>
                </div>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {[
                        { id: 'overview', label: 'Ringkasan', Icon: FiHome },
                        { id: 'map', label: 'Peta', Icon: FiMap },
                        { id: 'guardians', label: 'Pelindung', Icon: FiUsers },
                        { id: 'journeys', label: 'Riwayat', Icon: FiClock },
                        { id: 'settings', label: 'Pengaturan', Icon: FiSettings },
                    ].map(item => (
                        <button key={item.id} onClick={() => setActiveTab(item.id)} style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            background: activeTab === item.id ? '#eff6ff' : 'transparent',
                            border: 'none', color: activeTab === item.id ? '#3b82f6' : '#4b6080',
                            padding: '11px 14px', borderRadius: 14, fontSize: 14,
                            fontWeight: activeTab === item.id ? 700 : 500, cursor: 'pointer',
                            textAlign: 'left', transition: 'all 0.2s',
                        }}>
                            <item.Icon size={16} />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                            {user?.avatar || '👨‍💻'}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#1a2d5a', margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{user?.name || 'Jauhar Fauzi Ulul Albab'}</h4>
                            <p style={{ fontSize: 11, color: '#94a3b8', margin: '2px 0 0', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{user?.email || 'jauhar@safewalk.id'}</p>
                        </div>
                    </div>
                    <button onClick={onLogout} style={{
                        background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12,
                        padding: 10, color: '#ef4444', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                        textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}>
                        <FiLogOut size={14} /> Keluar
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '36px 44px', overflowY: 'auto', height: '100vh' }}>
                {/* Header */}
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
                    <div>
                        <h2 style={{ fontSize: 26, fontWeight: 800, color: '#1a2d5a', margin: 0, letterSpacing: '-0.8px' }}>
                            {activeTab === 'overview' && 'Selamat Malam, Jauhar'}
                            {activeTab === 'map' && 'Peta Perjalanan'}
                            {activeTab === 'guardians' && 'Daftar Pelindung'}
                            {activeTab === 'journeys' && 'Riwayat Perjalanan'}
                            {activeTab === 'settings' && 'Pengaturan'}
                        </h2>
                        <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>
                            {activeTab === 'overview' && 'Sistem pemantauan SafeWalk aktif dan siaga.'}
                            {activeTab === 'map' && 'Pilih rute dan mulai perjalanan aman.'}
                            {activeTab === 'guardians' && 'Kelola kontak pelindung.'}
                            {activeTab === 'journeys' && 'Log perjalanan dan insiden.'}
                            {activeTab === 'settings' && 'Kelola preferensi keamanan.'}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        {sosActive ? (
                            <button onClick={() => setSosActive(false)} style={{ background: '#ef4444', border: 'none', borderRadius: 14, padding: '11px 22px', color: '#fff', fontSize: 13, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                                <FiAlertTriangle size={16} /> SOS AKTIF
                            </button>
                        ) : (
                            <button onMouseDown={startSosHold} onMouseUp={stopSosHold} onMouseLeave={stopSosHold} style={{
                                background: 'linear-gradient(135deg,#ef4444,#dc2626)', border: 'none',
                                borderRadius: 14, padding: '11px 22px', color: '#fff', fontSize: 13,
                                fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                            }}>
                                <FiAlertTriangle size={16} /> {sosHeld ? `${Math.round(sosHoldProgress)}%` : 'SOS'}
                            </button>
                        )}
                        <button onClick={() => setFakeCallState('ringing')} style={{
                            background: '#fff', border: '1px solid #cbd5e1', color: '#1a2d5a',
                            borderRadius: 14, padding: '11px 18px', fontSize: 13, fontWeight: 600,
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                        }}>
                            <FiPhone size={14} /> Fake Call
                        </button>
                    </div>
                </header>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        {renderStats()}
                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24, alignItems: 'start' }}>
                            {renderMapPanel(380)}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                {renderSOSPanel()}
                                {renderGuardians()}
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'map' && renderMapPanel(520)}
                {activeTab === 'guardians' && renderGuardians()}
                {activeTab === 'journeys' && renderJourneys()}
                {activeTab === 'settings' && renderSettings()}
            </main>
            {renderFakeCallOverlay()}
        </div>
    );
}
