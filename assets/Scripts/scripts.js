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


// ====== Menú móvil con observador de mutaciones ======
document.addEventListener('DOMContentLoaded', () => {
    const $ = (sel) => document.querySelector(sel);

    let mobileMenuInitialized = false;
    function initMobileMenu() {
        if (mobileMenuInitialized) return true;
        const openMenuBtn = $('#openMenuBtn');
        const closeMenuBtn = $('#closeMenuBtn');
        const mobileMenuPanel = $('#mobileMenuPanel');
        const mobileMenuOverlay = $('#mobileMenuOverlay');

        if (!openMenuBtn || !closeMenuBtn || !mobileMenuPanel || !mobileMenuOverlay) {
            return false;
        }

        function openMenu() {
            mobileMenuOverlay.classList.remove('hidden', 'opacity-0');
            void mobileMenuOverlay.offsetWidth;
            mobileMenuOverlay.classList.add('opacity-100');
            mobileMenuPanel.classList.remove('translate-x-full');
            mobileMenuPanel.setAttribute('aria-hidden', 'false');
            openMenuBtn.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
            setTimeout(() => mobileMenuPanel.focus(), 100);
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

        // Evitar listeners duplicados
        openMenuBtn.removeEventListener('click', openMenu);
        closeMenuBtn.removeEventListener('click', closeMenu);
        mobileMenuOverlay.removeEventListener('click', closeMenu);

        openMenuBtn.addEventListener('click', openMenu);
        closeMenuBtn.addEventListener('click', closeMenu);
        mobileMenuOverlay.addEventListener('click', closeMenu);

        // Manejar enlaces del menú
        const mobileMenuLinks = mobileMenuPanel.querySelectorAll('a');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                setTimeout(closeMenu, 100);
            });
        });

        // Tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !mobileMenuOverlay.classList.contains('hidden')) {
                closeMenu();
            }
        });

        mobileMenuInitialized = true;
        //console.log('Menú móvil inicializado correctamente');
        return true;
    }

    // Observador para detectar cuando se carga el header
    const headerObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                const headerElement = $('#header');
                if (headerElement && headerElement.children.length > 0) {
                    // El header se ha cargado, intentar inicializar el menú
                    setTimeout(() => {
                        if (initMobileMenu()) {
                            headerObserver.disconnect();
                        }
                    }, 100);
                }
            }
        });
    });

    // Comenzar a observar el elemento header
    const headerElement = $('#header');
    if (headerElement) {
        headerObserver.observe(headerElement, {
            childList: true,
            subtree: true
        });
    }

    // Intentar inicializar inmediatamente también
    setTimeout(() => {
        if (initMobileMenu()) {
            headerObserver.disconnect();
        }
    }, 500);

    // Año dinámico del footer
    const yearElement = $('#year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});
