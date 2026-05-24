<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="theme-color" content="#06101f">

        <title>SafeWalk - Smart Safety Companion</title>

        @fonts
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body class="min-h-screen bg-[#f5f8fb] font-sans text-[#0b1220] antialiased">
        <main class="overflow-hidden">
            <section class="safe-hero relative min-h-[82svh] bg-[#07111f] text-white">
                <div class="absolute inset-0 safe-night-scene" aria-hidden="true">
                    <div class="safe-stars"></div>
                    <div class="safe-grid"></div>
                    <div class="safe-route safe-route-a"></div>
                    <div class="safe-route safe-route-b"></div>
                    <div class="safe-location-dot"></div>
                    <div class="safe-cityline"></div>
                </div>

                <header class="relative z-20 flex items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
                    <a href="/" class="flex items-center gap-3">
                        <span class="flex size-10 items-center justify-center rounded-2xl border border-white/25 bg-white/15 shadow-lg shadow-sky-950/20 backdrop-blur-xl">
                            <span class="safe-shield-mark"></span>
                        </span>
                        <span class="text-lg font-semibold tracking-normal">SafeWalk</span>
                    </a>

                    <nav class="hidden rounded-full border border-white/20 bg-white/10 px-2 py-2 text-sm text-white/80 shadow-2xl shadow-black/20 backdrop-blur-2xl md:flex">
                        <a class="rounded-full px-5 py-2 transition hover:bg-white/15 hover:text-white" href="#features">Features</a>
                        <a class="rounded-full px-5 py-2 transition hover:bg-white/15 hover:text-white" href="#impact">Impact</a>
                        <a class="rounded-full px-5 py-2 transition hover:bg-white/15 hover:text-white" href="#journey">Journey</a>
                        <a class="rounded-full px-5 py-2 transition hover:bg-white/15 hover:text-white" href="#stack">Tech</a>
                    </nav>

                    <a href="#journey" class="rounded-full border border-white/40 bg-white px-5 py-2 text-sm font-semibold text-[#07111f] shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:bg-sky-50">
                        Start
                    </a>
                </header>

                <div class="relative z-10 mx-auto flex min-h-[calc(82svh-88px)] max-w-7xl items-center px-5 pb-6 pt-3 sm:px-8 lg:px-12">
                    <div class="safe-window-shell mx-auto w-full">
                        <div class="safe-window">
                            <div class="safe-window-glare"></div>
                            <div class="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-5 py-10 text-center sm:px-8 sm:py-12 lg:py-14">
                                <div class="mb-4 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-xs font-medium text-white/85 shadow-lg shadow-black/10 backdrop-blur-2xl">
                                    Live tracking, trusted contacts, SOS, and fake call in one calm flow
                                </div>

                                <h1 data-parallax class="max-w-5xl text-balance text-[clamp(2.4rem,7.2vw,5.8rem)] font-semibold leading-[0.95] tracking-normal">
                                    Your smart companion for safer journeys.
                                </h1>

                                <p class="mt-5 max-w-2xl text-pretty text-base leading-7 text-white/78 sm:text-lg">
                                    Walk safer, stay connected. SafeWalk keeps students and women linked with people they trust during late-night trips.
                                </p>

                                <div class="mt-7 flex w-full max-w-xl flex-col gap-3 rounded-[2rem] border border-white/25 bg-white/14 p-2 shadow-2xl shadow-black/25 backdrop-blur-2xl sm:flex-row">
                                    <a href="#journey" class="flex min-h-12 flex-1 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-[#07111f] transition hover:-translate-y-0.5 hover:bg-sky-50">
                                        Start Journey
                                    </a>
                                    <button type="button" data-demo-trigger class="flex min-h-12 flex-1 items-center justify-center rounded-full border border-white/25 px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/15">
                                        Watch Demo
                                    </button>
                                </div>

                                <div class="mt-7 grid w-full max-w-3xl grid-cols-2 gap-3 text-left sm:grid-cols-4">
                                    <div class="safe-mini-stat">
                                        <span class="safe-stat-dot bg-emerald-300"></span>
                                        <span>Trusted link active</span>
                                    </div>
                                    <div class="safe-mini-stat">
                                        <span class="safe-stat-dot bg-sky-300"></span>
                                        <span>ETA 14 min</span>
                                    </div>
                                    <div class="safe-mini-stat">
                                        <span class="safe-stat-dot bg-rose-300"></span>
                                        <span>SOS ready</span>
                                    </div>
                                    <div class="safe-mini-stat">
                                        <span class="safe-stat-dot bg-violet-300"></span>
                                        <span>Fake call set</span>
                                    </div>
                                </div>

                                <div class="safe-activity-ticker mt-6 w-full max-w-3xl overflow-hidden rounded-2xl border border-white/20 bg-white/10">
                                    <div class="safe-activity-track">
                                        <span>Mom received tracking link</span>
                                        <span>Route check-in successful</span>
                                        <span>Auto safety timer: active</span>
                                        <span>ETA updated: 13 min</span>
                                        <span>Fake call preset: Mom</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div data-cursor-glow class="safe-cursor-glow" aria-hidden="true"></div>
            </section>

            <section id="features" class="relative bg-[#f5f8fb] px-5 py-16 sm:px-8 lg:px-12">
                <div class="mx-auto max-w-7xl">
                    <div class="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
                        <div>
                            <p class="text-sm font-semibold text-sky-600">Smart Safety Companion</p>
                            <h2 class="mt-3 max-w-2xl text-4xl font-semibold leading-tight tracking-normal text-[#0b1220] sm:text-5xl">
                                A safety experience that feels human, not technical.
                            </h2>
                        </div>
                        <p class="max-w-2xl text-base leading-7 text-slate-600 lg:justify-self-end">
                            SafeWalk is designed around reassurance: clear status, soft alerts, trusted people nearby, and emergency actions that stay within reach.
                        </p>
                    </div>

                    <div class="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <article class="safe-feature-card">
                            <span class="safe-feature-icon safe-icon-track"></span>
                            <h3>Live Tracking</h3>
                            <p>Share a real-time journey link with a trusted contact while route, ETA, and status stay visible.</p>
                        </article>
                        <article class="safe-feature-card">
                            <span class="safe-feature-icon safe-icon-sos"></span>
                            <h3>Emergency SOS</h3>
                            <p>Hold to activate, send current location, and keep an emergency log through the Laravel backend.</p>
                        </article>
                        <article class="safe-feature-card">
                            <span class="safe-feature-icon safe-icon-call"></span>
                            <h3>Fake Call</h3>
                            <p>Schedule a convincing incoming call from Mom, Friend, or Security when a quick exit helps.</p>
                        </article>
                        <article class="safe-feature-card">
                            <span class="safe-feature-icon safe-icon-alert"></span>
                            <h3>Auto Safety Alert</h3>
                            <p>Detects long stops, missed check-ins, or route changes and asks whether the user is safe.</p>
                        </article>
                    </div>
                </div>
            </section>

            <section class="safe-simulator-wrap bg-white px-5 py-14 sm:px-8 lg:px-12">
                <div class="mx-auto grid max-w-7xl gap-8 rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white to-sky-50 p-5 shadow-[0_30px_90px_rgba(15,23,42,0.1)] md:grid-cols-[1.05fr_0.95fr] md:p-8">
                    <div>
                        <p class="text-sm font-semibold text-sky-700">Interactive Safety Simulator</p>
                        <h2 class="mt-3 text-3xl font-semibold leading-tight text-[#0b1220] sm:text-4xl">
                            Tap scenarios and see how SafeWalk responds in real time.
                        </h2>
                        <p class="mt-4 max-w-xl text-slate-600">
                            This prototype shows the human-centered flow: reassure first, then escalate only when needed.
                        </p>
                        <div class="mt-6 grid gap-3 sm:grid-cols-3">
                            <button type="button" data-scenario-btn="safe" class="safe-scenario-btn is-active">Safe Flow</button>
                            <button type="button" data-scenario-btn="caution" class="safe-scenario-btn">No Check-in</button>
                            <button type="button" data-scenario-btn="emergency" class="safe-scenario-btn">Emergency</button>
                        </div>
                    </div>
                    <div class="safe-sim-console">
                        <div class="safe-sim-top">
                            <span class="safe-ping safe-ping-a"></span>
                            <span class="safe-ping safe-ping-b"></span>
                            <span class="safe-ping safe-ping-c"></span>
                        </div>
                        <h3 data-scenario-title class="mt-4 text-xl font-semibold text-slate-900">Status: Safe</h3>
                        <p data-scenario-output class="mt-2 text-sm leading-6 text-slate-600">Contact notified: Mom is watching your live route and ETA.</p>
                        <div class="mt-6 grid grid-cols-3 gap-2 text-center">
                            <div class="safe-kpi">
                                <strong data-count="98">0</strong>
                                <span>Trust Score</span>
                            </div>
                            <div class="safe-kpi">
                                <strong data-count="14">0</strong>
                                <span>ETA (min)</span>
                            </div>
                            <div class="safe-kpi">
                                <strong data-count="3">0</strong>
                                <span>SOS Hold</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="journey" class="bg-white px-5 py-16 sm:px-8 lg:px-12">
                <div class="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
                    <div class="safe-phone-stage">
                        <div class="safe-phone">
                            <div class="safe-phone-top"></div>
                            <div class="safe-phone-map">
                                <div class="safe-map-line"></div>
                                <div class="safe-map-card safe-map-card-a">
                                    <span>Good evening, Jauki</span>
                                    <strong>Safe</strong>
                                </div>
                                <div class="safe-map-card safe-map-card-b">
                                    <span>Trusted contact</span>
                                    <strong>Mom is watching</strong>
                                </div>
                                <div class="safe-sos-button">SOS</div>
                            </div>
                            <div class="safe-phone-panel">
                                <div>
                                    <p class="text-xs font-medium uppercase text-slate-400">Current walk</p>
                                    <h3 class="mt-1 text-xl font-semibold text-slate-950">Campus Gate to Dorm</h3>
                                </div>
                                <div class="mt-5 grid grid-cols-3 gap-2">
                                    <div class="safe-phone-chip">14m</div>
                                    <div class="safe-phone-chip">1.8km</div>
                                    <div class="safe-phone-chip">Live</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <p class="text-sm font-semibold text-sky-600">Dashboard Preview</p>
                        <h2 class="mt-3 text-4xl font-semibold leading-tight tracking-normal text-[#0b1220] sm:text-5xl">
                            The main actions stay obvious, even under pressure.
                        </h2>
                        <p class="mt-5 max-w-xl text-base leading-7 text-slate-600">
                            Start Safe Walk, Emergency SOS, Fake Call, and trusted contact controls are built as large, calm actions with clear feedback.
                        </p>
                        <div class="mt-8 grid gap-3 sm:grid-cols-2">
                            <div class="safe-action-tile">
                                <span class="safe-action-mark bg-emerald-100 text-emerald-700">Go</span>
                                <div>
                                    <h3>Start Safe Walk</h3>
                                    <p>Choose destination and contacts.</p>
                                </div>
                            </div>
                            <div class="safe-action-tile">
                                <span class="safe-action-mark bg-rose-100 text-rose-700">SOS</span>
                                <div>
                                    <h3>Hold Emergency</h3>
                                    <p>Three-second countdown.</p>
                                </div>
                            </div>
                            <div class="safe-action-tile">
                                <span class="safe-action-mark bg-sky-100 text-sky-700">Call</span>
                                <div>
                                    <h3>Fake Call</h3>
                                    <p>Mom, Friend, Security.</p>
                                </div>
                            </div>
                            <div class="safe-action-tile">
                                <span class="safe-action-mark bg-violet-100 text-violet-700">Auto</span>
                                <div>
                                    <h3>Safety Check</h3>
                                    <p>Alert if no response.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="impact" class="bg-[#0b1220] px-5 py-16 text-white sm:px-8 lg:px-12">
                <div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                    <div>
                        <p class="text-sm font-semibold text-sky-300">Social Impact</p>
                        <h2 class="mt-3 text-4xl font-semibold leading-tight tracking-normal sm:text-5xl">
                            Built for people who should never feel alone on the way home.
                        </h2>
                    </div>
                    <div class="grid gap-4 sm:grid-cols-3">
                        <div class="safe-impact-panel">
                            <strong>Realtime</strong>
                            <span>trusted contact visibility</span>
                        </div>
                        <div class="safe-impact-panel">
                            <strong>3 sec</strong>
                            <span>hold-to-SOS flow</span>
                        </div>
                        <div class="safe-impact-panel">
                            <strong>Auto</strong>
                            <span>check-in escalation</span>
                        </div>
                    </div>
                </div>
            </section>

            <section id="stack" class="bg-[#f5f8fb] px-5 py-16 sm:px-8 lg:px-12">
                <div class="mx-auto max-w-7xl">
                    <div class="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
                        <div>
                            <p class="text-sm font-semibold text-sky-600">MVP Stack</p>
                            <h2 class="mt-3 text-4xl font-semibold leading-tight tracking-normal text-[#0b1220] sm:text-5xl">
                                Laravel backend, React-ready frontend, realtime safety flow.
                            </h2>
                        </div>
                        <div class="grid gap-3 sm:grid-cols-2">
                            <div class="safe-stack-row"><span>Laravel</span><strong>REST API, auth, emergency logs</strong></div>
                            <div class="safe-stack-row"><span>React.js</span><strong>interactive dashboard and motion</strong></div>
                            <div class="safe-stack-row"><span>Tailwind CSS</span><strong>Apple-like minimal interface</strong></div>
                            <div class="safe-stack-row"><span>Mapbox / Leaflet</span><strong>route and live location</strong></div>
                            <div class="safe-stack-row"><span>Pusher</span><strong>broadcast tracking alerts</strong></div>
                            <div class="safe-stack-row"><span>MySQL</span><strong>users, trips, contacts, logs</strong></div>
                        </div>
                    </div>
                </div>
            </section>
        </main>

        <div data-demo-modal class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-[#06101f]/70 px-5 opacity-0 backdrop-blur-xl transition duration-300">
            <div class="w-full max-w-sm translate-y-4 rounded-[2rem] border border-white/20 bg-white/95 p-5 text-center text-[#0b1220] shadow-2xl transition duration-300">
                <div class="mx-auto flex size-20 items-center justify-center rounded-full bg-sky-100 text-2xl font-semibold text-sky-700">SW</div>
                <p class="mt-5 text-sm font-medium text-slate-500">Incoming fake call</p>
                <h2 class="mt-1 text-3xl font-semibold">Mom</h2>
                <div class="mt-6 grid grid-cols-2 gap-3">
                    <button type="button" data-demo-close class="rounded-full bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700">Later</button>
                    <button type="button" data-demo-close class="rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white">Answer</button>
                </div>
            </div>
        </div>
    </body>
</html>
