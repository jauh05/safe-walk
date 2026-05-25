import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FiShield, FiMapPin, FiUsers, FiClock, FiSettings, FiHome, FiAlertTriangle, FiNavigation, FiPhone, FiLogOut, FiPlus, FiTrash2, FiMap, FiActivity } from 'react-icons/fi';

/* ── Leaflet Map Component ── */
const LeafletMap = ({ origin, destination, isWalking, trailCoords, routeCoords, currentAccuracy, onMapReady, onMapMoved }) => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markersRef = useRef([]);
    const routeLineRef = useRef(null);
    const onMapReadyRef = useRef(onMapReady);
    const onMapMovedRef = useRef(onMapMoved);

    useEffect(() => {
        onMapReadyRef.current = onMapReady;
    }, [onMapReady]);

    useEffect(() => {
        onMapMovedRef.current = onMapMoved;
    }, [onMapMoved]);

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
            map.on('dragstart zoomstart', () => {
                if (onMapMovedRef.current) onMapMovedRef.current();
            });

            mapInstance.current = map;
            if (onMapReadyRef.current) onMapReadyRef.current(map);

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
            if (currentAccuracy && currentAccuracy > 0) {
                const acc = L.circle(origin.coords, {
                    radius: Math.min(currentAccuracy, 120),
                    color: '#3b82f6',
                    fillColor: '#60a5fa',
                    fillOpacity: 0.18,
                    weight: 1,
                }).addTo(map);
                markersRef.current.push(acc);
            }
        }

        if (destination) {
            const endIcon = L.divIcon({
                html: '<div style="width:16px;height:16px;background:#22c55e;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 8px rgba(34,197,94,0.5);"></div>',
                className: '', iconSize: [16, 16], iconAnchor: [8, 8],
            });
            const m = L.marker(destination.coords, { icon: endIcon }).addTo(map).bindPopup(`<b>Ke:</b> ${destination.name}`);
            markersRef.current.push(m);
        }

        if (routeCoords && routeCoords.length > 1) {
            routeLineRef.current = L.polyline(routeCoords, {
                color: '#3b82f6',
                weight: 4,
                opacity: 0.75,
                dashArray: '8, 6',
            }).addTo(map);
            map.fitBounds(L.latLngBounds(routeCoords).pad(0.2));
        }

        if (trailCoords && trailCoords.length > 1) {
            const trailLine = L.polyline(trailCoords, {
                color: '#f59e0b',
                weight: 5,
                opacity: 0.95,
            }).addTo(map);
            markersRef.current.push(trailLine);
        } else if (origin && destination && (!routeCoords || routeCoords.length < 2)) {
            routeLineRef.current = L.polyline([origin.coords, destination.coords], {
                color: '#f59e0b',
                weight: 4,
                opacity: 0.9,
            }).addTo(map);

            map.fitBounds(L.latLngBounds([origin.coords, destination.coords]).pad(0.3));
        } else if (origin) {
            map.setView(origin.coords, 15);
        }
    }, [origin, destination, isWalking, trailCoords, routeCoords, currentAccuracy]);

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

const LocationInput = ({ label, color, value, onChange, suggestions, showDropdown, setShowDropdown, onSelect, placeholder, disabled, loading, compact }) => (
    <div style={{ position: 'relative', flex: 1 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: compact ? 10 : 12, fontWeight: 700, color: '#64748b', marginBottom: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
            {label}
        </label>
        <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => { onChange(e.target.value); setShowDropdown(true); }}
            onFocus={() => setShowDropdown(true)}
            disabled={disabled}
            style={{
                width: '100%', padding: compact ? '9px 12px' : '12px 16px', borderRadius: compact ? 10 : 14,
                border: '1.5px solid #e2e8f0', outline: 'none', fontSize: compact ? 12 : 14,
                background: disabled ? '#f8fafc' : '#fff', transition: 'all 0.2s', boxSizing: 'border-box',
            }}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        />
        {showDropdown && !disabled && suggestions.length > 0 && (
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
                            padding: compact ? '8px 12px' : '10px 16px', cursor: 'pointer', fontSize: compact ? 12 : 13,
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
        {loading && !disabled && (
            <p style={{ margin: '6px 0 0', fontSize: compact ? 10 : 11, color: '#94a3b8' }}>Mencari lokasi...</p>
        )}
    </div>
);

export default function DashboardPage({ user, onLogout, onNavigate }) {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 820);
    const [activeTab, setActiveTab] = useState('overview');

    // Map & Journey state
    const [originSearch, setOriginSearch] = useState('Lokasi saat ini');
    const [destSearch, setDestSearch] = useState('');
    const [origin, setOrigin] = useState(null);
    const [destination, setDestination] = useState(null);
    const [showOriginDropdown, setShowOriginDropdown] = useState(false);
    const [showDestDropdown, setShowDestDropdown] = useState(false);
    const [geoSuggestions, setGeoSuggestions] = useState([]);
    const [loadingGeoSuggestions, setLoadingGeoSuggestions] = useState(false);
    const [gpsError, setGpsError] = useState('');
    const [currentAccuracy, setCurrentAccuracy] = useState(null);
    const [currentCoordsText, setCurrentCoordsText] = useState('');
    const [isWalking, setIsWalking] = useState(false);
    const [walkProgress, setWalkProgress] = useState(0);
    const walkTimerRef = useRef(null);
    const walkFinishedRef = useRef(false);
    const [trailCoords, setTrailCoords] = useState([]);
    const [routeCoords, setRouteCoords] = useState([]);
    const [showRecenterButton, setShowRecenterButton] = useState(false);
    const [idleAlertOpen, setIdleAlertOpen] = useState(false);
    const [idleReason, setIdleReason] = useState('');
    const idleTriggerTimerRef = useRef(null);
    const idleEscalationTimerRef = useRef(null);
    const lastMovementAtRef = useRef(null);
    const mapRef = useRef(null);
    const mapMovedRef = useRef(false);

    // SOS state
    const [sosActive, setSosActive] = useState(false);
    const [sosHoldProgress, setSosHoldProgress] = useState(0);
    const [sosHeld, setSosHeld] = useState(false);
    const sosTimerRef = useRef(null);

    // Fake Call
    const [fakeCallState, setFakeCallState] = useState('idle');
    const [fakeCaller, setFakeCaller] = useState(null);
    const [showFakeCallModal, setShowFakeCallModal] = useState(false);
    const [showSosContactModal, setShowSosContactModal] = useState(false);
    const [selectedSosContacts, setSelectedSosContacts] = useState([]);
    const geoWatchRef = useRef(null);

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

    const startGeoWatcher = () => {
        mapMovedRef.current = false;
        setShowRecenterButton(false);
        if (!navigator.geolocation) {
            setGpsError('GPS tidak didukung di browser ini.');
            return;
        }
        if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            setGpsError('GPS butuh HTTPS. Buka aplikasi lewat https atau localhost.');
            return;
        }
        if (geoWatchRef.current !== null) navigator.geolocation.clearWatch(geoWatchRef.current);
        const applyPosition = (position) => {
            const currentCoords = [position.coords.latitude, position.coords.longitude];
            setOrigin({ name: 'Lokasi saat ini', coords: currentCoords });
            setOriginSearch('Lokasi saat ini');
            setCurrentAccuracy(position.coords.accuracy || null);
            setCurrentCoordsText(`${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`);
            setGpsError('');
            if (mapRef.current && !mapMovedRef.current) mapRef.current.setView(currentCoords, 16);
        };

        const onInitialError = (err) => {
            if (err?.code === 1) setGpsError('Izin lokasi ditolak. Izinkan akses lokasi di browser.');
            else if (err?.code === 2) setGpsError('Lokasi tidak tersedia. Pastikan GPS/perangkat aktif.');
            else if (err?.code === 3) setGpsError('Permintaan lokasi timeout. Coba lagi di area sinyal bagus.');
            else setGpsError('Gagal membaca lokasi awal.');
        };

        navigator.geolocation.getCurrentPosition(
            applyPosition,
            () => {
                navigator.geolocation.getCurrentPosition(
                    applyPosition,
                    onInitialError,
                    { enableHighAccuracy: false, timeout: 20000, maximumAge: 60000 }
                );
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
        geoWatchRef.current = navigator.geolocation.watchPosition(
            (position) => {
                const currentCoords = [position.coords.latitude, position.coords.longitude];
                setOrigin({
                    name: 'Lokasi saat ini',
                    coords: currentCoords,
                });
                setCurrentAccuracy(position.coords.accuracy || null);
                setCurrentCoordsText(`${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`);
                setGpsError('');
                if (mapRef.current && !mapMovedRef.current) mapRef.current.setView(currentCoords, 16);
            },
            (err) => {
                if (err?.code === 1) setGpsError('Izin lokasi ditolak. Izinkan akses lokasi di browser.');
                else if (err?.code === 2) setGpsError('Lokasi tidak tersedia. Pastikan GPS/perangkat aktif.');
                else if (err?.code === 3) setGpsError('Permintaan lokasi timeout. Coba lagi di area sinyal bagus.');
                else setGpsError('Lokasi belum terdeteksi. Aktifkan GPS lalu coba lagi.');
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 2000 }
        );
    };

    useEffect(() => {
        startGeoWatcher();

        return () => {
            if (geoWatchRef.current !== null) navigator.geolocation.clearWatch(geoWatchRef.current);
        };
    }, []);

    useEffect(() => {
        const q = destSearch.trim();
        if (q.length < 3) {
            setGeoSuggestions([]);
            return;
        }

        const timer = setTimeout(async () => {
            try {
                setLoadingGeoSuggestions(true);
                const res = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(q)}&limit=5`);
                const data = await res.json();
                const mapped = (data || []).map((item) => ({
                    name: item.display_name,
                    coords: [parseFloat(item.lat), parseFloat(item.lon)],
                }));
                setGeoSuggestions(mapped);
            } catch (err) {
                console.error('Failed to search destination', err);
            } finally {
                setLoadingGeoSuggestions(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [destSearch]);

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
    useEffect(() => () => clearInterval(walkTimerRef.current), []);

    useEffect(() => {
        if (!isWalking || !origin || !destination || walkFinishedRef.current) return;
        const [lat1, lon1] = origin.coords;
        const [lat2, lon2] = destination.coords;
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const meters = 6371000 * c;

        const totalMeters = trailCoords.length > 1
            ? trailCoords.slice(1).reduce((acc, point, idx) => {
                const prev = trailCoords[idx];
                const [a1, o1] = prev;
                const [a2, o2] = point;
                const ddLat = (a2 - a1) * (Math.PI / 180);
                const ddLon = (o2 - o1) * (Math.PI / 180);
                const aa = Math.sin(ddLat / 2) ** 2 + Math.cos(a1 * (Math.PI / 180)) * Math.cos(a2 * (Math.PI / 180)) * Math.sin(ddLon / 2) ** 2;
                return acc + (6371000 * 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa)));
            }, 0)
            : 0;
        const estimateTotal = Math.max(totalMeters + meters, 1);
        setWalkProgress(Math.min(99, Math.round((totalMeters / estimateTotal) * 100)));

        if (meters <= 20) {
            walkFinishedRef.current = true;
            setWalkProgress(100);
            setIsWalking(false);
            saveJourney(`${origin.name} → ${destination.name}`, Math.max(1, Math.round(totalMeters / 75)), 'Completed');
        }
    }, [origin, destination, isWalking, trailCoords]);

    useEffect(() => {
        if (!isWalking) return;
        if (!navigator.geolocation) return;
        lastMovementAtRef.current = Date.now();
        const watchId = navigator.geolocation.watchPosition((position) => {
            const next = [position.coords.latitude, position.coords.longitude];
            setOrigin({ name: 'Lokasi saat ini', coords: next });
            setCurrentAccuracy(position.coords.accuracy || null);
            if (mapRef.current && !mapMovedRef.current) mapRef.current.setView(next, 16);
            setTrailCoords((prev) => {
                if (!prev.length) return [next];
                const last = prev[prev.length - 1];
                const moved = Math.abs(last[0] - next[0]) > 0.00003 || Math.abs(last[1] - next[1]) > 0.00003;
                if (!moved) return prev;
                lastMovementAtRef.current = Date.now();
                return [...prev, next];
            });
        }, () => {}, { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 });
        return () => navigator.geolocation.clearWatch(watchId);
    }, [isWalking]);

    useEffect(() => {
        clearTimeout(idleTriggerTimerRef.current);
        clearTimeout(idleEscalationTimerRef.current);
        if (!isWalking) return;
        idleTriggerTimerRef.current = setTimeout(() => {
            if (!isWalking) return;
            const last = lastMovementAtRef.current || Date.now();
            if (Date.now() - last >= 20 * 60 * 1000) {
                setIdleAlertOpen(true);
                idleEscalationTimerRef.current = setTimeout(() => {
                    const token = localStorage.getItem('safewalk_token');
                    fetch('/api/alerts/idle-whatsapp', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({ reason: idleReason || 'Tidak menjawab alert 20 menit' })
                    }).catch(() => {});
                    setIdleAlertOpen(false);
                }, 20 * 60 * 1000);
            }
        }, 20 * 60 * 1000);
        return () => {
            clearTimeout(idleTriggerTimerRef.current);
            clearTimeout(idleEscalationTimerRef.current);
        };
    }, [isWalking, trailCoords.length, idleReason]);

    useEffect(() => {
        const fetchRoute = async () => {
            if (!origin || !destination) {
                setRouteCoords([]);
                return;
            }
            try {
                const [oLat, oLon] = origin.coords;
                const [dLat, dLon] = destination.coords;
                const url = `https://router.project-osrm.org/route/v1/foot/${oLon},${oLat};${dLon},${dLat}?overview=full&geometries=geojson`;
                const res = await fetch(url);
                const data = await res.json();
                const coords = data?.routes?.[0]?.geometry?.coordinates || [];
                const latLng = coords.map(([lon, lat]) => [lat, lon]);
                setRouteCoords(latLng);
            } catch (err) {
                console.error('Failed to fetch route', err);
                setRouteCoords([]);
            }
        };
        fetchRoute();
    }, [origin, destination]);

    const handleMapReady = useCallback((map) => {
        mapRef.current = map;
    }, []);

    const handleMapMoved = useCallback(() => {
        mapMovedRef.current = true;
        setShowRecenterButton(true);
    }, []);

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
        const start = async () => {
            let activeOrigin = origin;
            let activeDestination = destination;

            if (!activeOrigin && navigator.geolocation) {
                try {
                    const pos = await new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 10000 }));
                    activeOrigin = {
                        name: 'Lokasi saat ini',
                        coords: [pos.coords.latitude, pos.coords.longitude],
                    };
                    setOrigin(activeOrigin);
                    setOriginSearch('Lokasi saat ini');
                } catch (err) {
                    alert('Izin GPS dibutuhkan untuk memulai perjalanan.');
                    return;
                }
            }

            if (!activeDestination && destSearch.trim().length > 2) {
                const fromPreset = LOCATION_PRESETS.find((l) => l.name.toLowerCase() === destSearch.trim().toLowerCase());
                if (fromPreset) {
                    activeDestination = fromPreset;
                    setDestination(fromPreset);
                } else {
                    try {
                        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(destSearch.trim())}&limit=1`);
                        const data = await res.json();
                        if (data?.[0]) {
                            activeDestination = {
                                name: data[0].display_name,
                                coords: [parseFloat(data[0].lat), parseFloat(data[0].lon)],
                            };
                            setDestination(activeDestination);
                            setDestSearch(activeDestination.name);
                        }
                    } catch (err) {
                        console.error('Failed geocoding destination', err);
                    }
                }
            }

            if (!activeOrigin || !activeDestination) {
                alert('Isi tujuan terlebih dahulu, lalu pilih dari hasil pencarian.');
                return;
            }

            setWalkProgress(0);
            walkFinishedRef.current = false;
            setTrailCoords(activeOrigin ? [activeOrigin.coords] : []);
            mapMovedRef.current = false;
            setShowRecenterButton(false);
            setIsWalking(true);
        };

        start();
    };
    const resetWalk = () => {
        clearInterval(walkTimerRef.current);
        setIsWalking(false);
        setWalkProgress(0);
        setTrailCoords([]);
        setRouteCoords([]);
        setIdleAlertOpen(false);
        clearTimeout(idleTriggerTimerRef.current);
        clearTimeout(idleEscalationTimerRef.current);
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

    const filteredDests = [
        ...LOCATION_PRESETS.filter(l => l.name.toLowerCase().includes(destSearch.toLowerCase())),
        ...geoSuggestions,
    ].slice(0, 8);

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
                        label="DARI" color="#3b82f6" value={originSearch}
                        onChange={setOriginSearch} suggestions={[]}
                        showDropdown={showOriginDropdown} setShowDropdown={setShowOriginDropdown}
                        onSelect={setOrigin} placeholder={gpsError ? 'GPS belum aktif' : 'Mengambil GPS...'} disabled compact={isMobile}
                    />
                    <div style={{ fontSize: 18, color: '#cbd5e1', padding: '0 4px 12px' }}>→</div>
                    <LocationInput
                        label="KE" color="#22c55e" value={destSearch}
                        onChange={setDestSearch} suggestions={filteredDests}
                        showDropdown={showDestDropdown} setShowDropdown={setShowDestDropdown}
                        onSelect={setDestination} placeholder="Mau ke mana?" loading={loadingGeoSuggestions} compact={isMobile}
                    />
                    {isMobile && gpsError && (
                        <button onClick={startGeoWatcher} style={{ border: '1px solid #cbd5e1', background: '#fff', borderRadius: 10, padding: '8px 10px', fontSize: 11, color: '#1e40af', fontWeight: 700 }}>
                            Aktifkan GPS
                        </button>
                    )}
                    <div style={{ paddingBottom: 0 }}>
                        {!isWalking ? (
                            <button onClick={startWalk} disabled={!origin || (!destination && destSearch.trim().length < 2)} style={{
                                background: origin && (destination || destSearch.trim().length >= 2) ? 'linear-gradient(135deg,#3b82f6,#6366f1)' : '#e2e8f0',
                                border: 'none', borderRadius: 14, padding: '12px 24px',
                                color: origin && (destination || destSearch.trim().length >= 2) ? '#fff' : '#94a3b8',
                                fontSize: 14, fontWeight: 700, cursor: origin && (destination || destSearch.trim().length >= 2) ? 'pointer' : 'not-allowed',
                                boxShadow: origin && (destination || destSearch.trim().length >= 2) ? '0 4px 14px rgba(99,102,241,0.25)' : 'none',
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
                {gpsError && <p style={{ margin: '8px 0 0', fontSize: isMobile ? 10 : 11, color: '#ef4444' }}>{gpsError}</p>}
                {!gpsError && currentCoordsText && (
                    <p style={{ margin: '6px 0 0', fontSize: isMobile ? 10 : 11, color: '#64748b' }}>
                        GPS: {currentCoordsText}{currentAccuracy ? ` (±${Math.round(currentAccuracy)}m)` : ''}
                    </p>
                )}

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
                <LeafletMap
                    origin={origin}
                    destination={destination}
                    isWalking={isWalking}
                    trailCoords={trailCoords}
                    routeCoords={routeCoords}
                    currentAccuracy={currentAccuracy}
                    onMapReady={handleMapReady}
                    onMapMoved={handleMapMoved}
                />
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
                {showRecenterButton && origin && (
                    <button
                        onClick={() => {
                            if (mapRef.current) mapRef.current.setView(origin.coords, 16);
                            mapMovedRef.current = false;
                            setShowRecenterButton(false);
                        }}
                        style={{
                            position: 'absolute', top: 16, right: 16, zIndex: 15,
                            background: '#1e40af', color: '#fff', border: 'none', borderRadius: 10,
                            padding: '8px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer'
                        }}
                    >
                        Kembali ke Perjalanan
                    </button>
                )}
            </div>
            {idleAlertOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(9,13,26,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, padding: 20 }}>
                    <div style={{ background: '#fff', borderRadius: 16, padding: 20, width: '100%', maxWidth: 420 }}>
                        <h3 style={{ margin: '0 0 8px', color: '#1a2d5a' }}>Kamu masih aman?</h3>
                        <p style={{ margin: '0 0 12px', fontSize: 13, color: '#64748b' }}>Kami mendeteksi kamu diam 20 menit. Sedang isi bensin, makan, istirahat, atau lainnya?</p>
                        <input value={idleReason} onChange={(e) => setIdleReason(e.target.value)} placeholder="Contoh: Lagi istirahat makan" style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid #cbd5e1', marginBottom: 10, boxSizing: 'border-box' }} />
                        <button onClick={() => { setIdleAlertOpen(false); clearTimeout(idleEscalationTimerRef.current); }} style={{ width: '100%', border: 'none', borderRadius: 10, padding: 10, background: '#16a34a', color: '#fff', fontWeight: 700 }}>
                            Ya, Saya Aman
                        </button>
                    </div>
                </div>
            )}
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
                    <p style={{ color: '#ef4444', fontSize: 13, fontWeight: 700, margin: 0 }}>
                        🚨 Sinyal darurat dikirim ke {selectedSosContacts.length > 0 ? `${selectedSosContacts.length} kontak terpilih` : 'semua Pelindung'}!
                    </p>
                    <button onClick={() => setSosActive(false)} style={{ marginTop: 8, background: '#ef4444', border: 'none', borderRadius: 10, padding: '6px 16px', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                        Matikan Alarm
                    </button>
                </div>
            )}

            <div style={{ display: 'flex', gap: 12, width: '100%' }}>
                <button onClick={() => setShowFakeCallModal(true)} style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    background: '#faf5ff', border: '1.5px solid #e9d5ff', borderRadius: 16,
                    padding: '12px 0', color: '#7c3aed', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                }}>
                    <FiPhone size={14} /> Fake Call
                </button>
                <button onClick={() => setShowSosContactModal(true)} style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    background: '#eff6ff', border: '1.5px solid #bfdbfe', borderRadius: 16,
                    padding: '12px 0', color: '#3b82f6', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                }}>
                    <FiAlertTriangle size={14} /> Pilih Kontak SOS
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
            {journeys.length === 0 && (
                <div style={{ padding: '20px 16px', border: '1px dashed #cbd5e1', borderRadius: 14, textAlign: 'center', color: '#64748b', fontSize: 13 }}>
                    Belum ada data riwayat perjalanan.
                </div>
            )}
            {journeys.length > 0 && !isMobile && (
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
            )}
            {journeys.length > 0 && isMobile && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {journeys.map((l, i) => {
                        const date = new Date(l.created_at || new Date()).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
                        const statusLabel = l.status === 'Completed' ? 'Aman' : l.status === 'SOS' ? 'SOS Ditekan' : 'Dibatalkan';
                        const statusColor = l.status === 'Completed' ? '#22c55e' : '#ef4444';
                        return (
                            <div key={l.id || i} style={{ border: '1px solid #e8edf5', borderRadius: 14, padding: 12, background: '#f8fafc' }}>
                                <p style={{ margin: 0, fontSize: 11, color: '#64748b' }}>{date}</p>
                                <p style={{ margin: '6px 0', fontSize: 13, color: '#1a2d5a', fontWeight: 700 }}>{l.route}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: 12, color: '#64748b' }}>{l.duration_minutes} mnt</span>
                                    <span style={{ color: statusColor, background: statusColor + '14', padding: '4px 8px', borderRadius: 8, fontSize: 11, fontWeight: 700 }}>{statusLabel}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
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
                    <h2 style={{ color: '#fff', fontSize: 32, fontWeight: 700, marginTop: 10 }}>{fakeCaller?.name || 'Kontak Pilihan'}</h2>
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

    const renderContactPickerModal = ({ title, open, onClose, onSelect, multi = false, selectedIds = [] }) => {
        if (!open) return null;
        return (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(9,13,26,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: 20 }}>
                <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 420, padding: 20 }}>
                    <h3 style={{ margin: '0 0 12px', fontSize: 18, color: '#1a2d5a' }}>{title}</h3>
                    {guardians.length === 0 && <p style={{ margin: 0, color: '#64748b', fontSize: 13 }}>Belum ada kontak pelindung.</p>}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 320, overflowY: 'auto', marginBottom: 14 }}>
                        {guardians.map((g) => (
                            <button key={g.id} onClick={() => onSelect(g.id)} style={{ border: selectedIds.includes(g.id) ? '1.5px solid #3b82f6' : '1px solid #e2e8f0', background: selectedIds.includes(g.id) ? '#eff6ff' : '#fff', borderRadius: 12, padding: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={{ fontSize: 20 }}>{g.avatar}</span>
                                <span style={{ color: '#1a2d5a', fontWeight: 700, fontSize: 13 }}>{g.name}</span>
                            </button>
                        ))}
                    </div>
                    <button onClick={onClose} style={{ width: '100%', border: 'none', borderRadius: 12, padding: 10, background: '#1a2d5a', color: '#fff', fontWeight: 700 }}>
                        {multi ? 'Selesai' : 'Tutup'}
                    </button>
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
                {renderContactPickerModal({
                    title: 'Pilih Kontak Fake Call',
                    open: showFakeCallModal,
                    onClose: () => setShowFakeCallModal(false),
                    onSelect: (id) => {
                        const picked = guardians.find((g) => g.id === id);
                        setFakeCaller(picked || null);
                        setShowFakeCallModal(false);
                        setFakeCallState('ringing');
                    },
                })}
                {renderContactPickerModal({
                    title: 'Pilih Kontak SOS',
                    open: showSosContactModal,
                    onClose: () => setShowSosContactModal(false),
                    multi: true,
                    selectedIds: selectedSosContacts,
                    onSelect: (id) => {
                        setSelectedSosContacts((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
                    },
                })}
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
                        <button onClick={() => setShowFakeCallModal(true)} style={{
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
            {renderContactPickerModal({
                title: 'Pilih Kontak Fake Call',
                open: showFakeCallModal,
                onClose: () => setShowFakeCallModal(false),
                onSelect: (id) => {
                    const picked = guardians.find((g) => g.id === id);
                    setFakeCaller(picked || null);
                    setShowFakeCallModal(false);
                    setFakeCallState('ringing');
                },
            })}
            {renderContactPickerModal({
                title: 'Pilih Kontak SOS',
                open: showSosContactModal,
                onClose: () => setShowSosContactModal(false),
                multi: true,
                selectedIds: selectedSosContacts,
                onSelect: (id) => {
                    setSelectedSosContacts((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
                },
            })}
            {renderFakeCallOverlay()}
        </div>
    );
}
