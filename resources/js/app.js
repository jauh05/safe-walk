const demoTriggers = document.querySelectorAll('[data-demo-trigger]');
const demoModal = document.querySelector('[data-demo-modal]');
const demoCloseButtons = document.querySelectorAll('[data-demo-close]');

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
