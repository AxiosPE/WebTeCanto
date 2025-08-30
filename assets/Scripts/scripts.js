// ====== Formulario con Formspree ======
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('fs-form');
    if (!form) return;

    const btn = document.getElementById('fs-submit');
    const ok = document.getElementById('fs-success');
    const err = document.getElementById('fs-error');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        ok.classList.add('hidden');
        err.classList.add('hidden');
        btn.disabled = true;
        btn.textContent = 'Enviando…';

        try {
            const data = new FormData(form);
            const res = await fetch('https://formspree.io/f/xnnzkzov', {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: data
            });

            if (res.ok) {
                form.reset();
                ok.classList.remove('hidden');
            } else {
                err.textContent = 'No pudimos enviar tu mensaje. Revisa los campos e inténtalo nuevamente.';
                err.classList.remove('hidden');
            }
        } catch {
            err.textContent = 'Ocurrió un error de red. Inténtalo de nuevo.';
            err.classList.remove('hidden');
        } finally {
            btn.disabled = false;
            btn.textContent = 'Enviar mensaje';
        }
    });
});


// ====== Menú móvil ======
document.addEventListener('DOMContentLoaded', () => {
    const $ = (sel) => document.querySelector(sel);

    const openMenuBtn = $('#openMenuBtn');
    const closeMenuBtn = $('#closeMenuBtn');
    const mobileMenuPanel = $('#mobileMenuPanel');
    const mobileMenuOverlay = $('#mobileMenuOverlay');

    if (!openMenuBtn || !closeMenuBtn || !mobileMenuPanel || !mobileMenuOverlay) {
        console.error('Error: Algunos elementos del menú móvil no fueron encontrados');
        return;
    }

    function openMenu() {
        mobileMenuOverlay.classList.remove('hidden', 'opacity-0');
        void mobileMenuOverlay.offsetWidth;
        mobileMenuOverlay.classList.add('opacity-100');

        mobileMenuPanel.classList.remove('translate-x-full');
        mobileMenuPanel.setAttribute('aria-hidden', 'false');
        openMenuBtn.setAttribute('aria-expanded', 'true');

        document.body.style.overflow = 'hidden';
        mobileMenuPanel.focus();
    }

    function closeMenu() {
        mobileMenuOverlay.classList.remove('opacity-100');
        mobileMenuOverlay.classList.add('opacity-0');
        setTimeout(() => mobileMenuOverlay.classList.add('hidden'), 300);

        mobileMenuPanel.classList.add('translate-x-full');
        mobileMenuPanel.setAttribute('aria-hidden', 'true');
        openMenuBtn.setAttribute('aria-expanded', 'false');

        document.body.style.overflow = '';
        openMenuBtn.focus();
    }

    openMenuBtn.addEventListener('click', openMenu);
    closeMenuBtn.addEventListener('click', closeMenu);
    mobileMenuOverlay.addEventListener('click', closeMenu);

    const mobileMenuLinks = mobileMenuPanel.querySelectorAll('a[href^="#"]');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (link.getAttribute('href') !== '#') {
                closeMenu();
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !mobileMenuOverlay.classList.contains('hidden')) {
            closeMenu();
        }
    });

    // Año dinámico del footer
    const yearElement = $('#year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});
