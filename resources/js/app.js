const demoTriggers = document.querySelectorAll('[data-demo-trigger]');
const demoModal = document.querySelector('[data-demo-modal]');
const demoCloseButtons = document.querySelectorAll('[data-demo-close]');
const heroSection = document.querySelector('.safe-hero');
const cursorGlow = document.querySelector('[data-cursor-glow]');
const parallaxNodes = document.querySelectorAll('[data-parallax]');
const scenarioButtons = document.querySelectorAll('[data-scenario-btn]');
const scenarioTitle = document.querySelector('[data-scenario-title]');
const scenarioOutput = document.querySelector('[data-scenario-output]');
const counterNodes = document.querySelectorAll('[data-count]');

const scenarios = {
    safe: {
        title: 'Status: Safe',
        output: 'Contact notified: Mom is watching your live route and ETA.',
    },
    caution: {
        title: 'Status: Caution',
        output: 'No check-in detected for 4 minutes. Sending "Are you safe?" prompt now.',
    },
    emergency: {
        title: 'Status: Emergency',
        output: 'SOS activated. Trusted contacts receive your location and emergency alert.',
    },
};

const animateCounters = () => {
    counterNodes.forEach((node) => {
        const target = Number(node.getAttribute('data-count') || 0);
        const durationMs = 800;
        const frameMs = 16;
        const step = Math.max(1, Math.round(target / (durationMs / frameMs)));
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                node.textContent = String(target);
                clearInterval(timer);
                return;
            }
            node.textContent = String(current);
        }, frameMs);
    });
};

demoTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
        demoModal?.classList.add('is-open');
    });
});

demoCloseButtons.forEach((button) => {
    button.addEventListener('click', () => {
        demoModal?.classList.remove('is-open');
    });
});

demoModal?.addEventListener('click', (event) => {
    if (event.target === demoModal) {
        demoModal.classList.remove('is-open');
    }
});

scenarioButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const key = button.getAttribute('data-scenario-btn');
        const scenario = key ? scenarios[key] : null;
        if (!scenario) return;

        scenarioButtons.forEach((item) => item.classList.remove('is-active'));
        button.classList.add('is-active');
        if (scenarioTitle) scenarioTitle.textContent = scenario.title;
        if (scenarioOutput) scenarioOutput.textContent = scenario.output;
    });
});

if (heroSection && cursorGlow) {
    heroSection.addEventListener('pointermove', (event) => {
        const rect = heroSection.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        cursorGlow.style.left = `${x}px`;
        cursorGlow.style.top = `${y}px`;

        const xRatio = (x / rect.width - 0.5) * 9;
        const yRatio = (y / rect.height - 0.5) * 9;
        parallaxNodes.forEach((node) => {
            node.style.transform = `translate3d(${xRatio}px, ${yRatio}px, 0)`;
        });
    });
}

animateCounters();
