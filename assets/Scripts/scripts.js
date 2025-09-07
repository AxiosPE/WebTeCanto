// ====== Formulario con Formspree ======
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('fs-form');
    if (!form) return;

    const btn = document.getElementById('fs-submit');
    const ok = document.getElementById('fs-success');
    const err = document.getElementById('fs-error');

    form.addEventListener('submit', async (e) => {
        // Limpiar mensajes previos
        ok.classList.add('hidden');
        err.classList.add('hidden');

        // Validación de campos obligatorios
        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const tipo = document.getElementById('tipo').value;
        const fecha = document.getElementById('fecha').value;
        const mensaje = document.getElementById('mensaje').value.trim();

        // Verificar que todos los campos estén completos
        if (!nombre) {
            e.preventDefault();
            err.textContent = 'Por favor, ingresa tu nombre.';
            err.classList.remove('hidden');
            document.getElementById('nombre').focus();
            return;
        }
        
        if (!email) {
            e.preventDefault();
            err.textContent = 'Por favor, ingresa tu correo electrónico.';
            err.classList.remove('hidden');
            document.getElementById('email').focus();
            return;
        }
        
        if (!telefono) {
            e.preventDefault();
            err.textContent = 'Por favor, ingresa tu número de teléfono.';
            err.classList.remove('hidden');
            document.getElementById('telefono').focus();
            return;
        }
        
        if (!tipo) {
            e.preventDefault();
            err.textContent = 'Por favor, selecciona el tipo de ceremonia.';
            err.classList.remove('hidden');
            document.getElementById('tipo').focus();
            return;
        }
        
        if (!fecha) {
            e.preventDefault();
            err.textContent = 'Por favor, selecciona la fecha de tu ceremonia.';
            err.classList.remove('hidden');
            document.getElementById('fecha').focus();
            return;
        }
        
        if (!mensaje) {
            e.preventDefault();
            err.textContent = 'Por favor, escribe un mensaje describiendo tu evento.';
            err.classList.remove('hidden');
            document.getElementById('mensaje').focus();
            return;
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            e.preventDefault();
            err.textContent = 'Por favor, ingresa un correo electrónico válido.';
            err.classList.remove('hidden');
            document.getElementById('email').focus();
            return;
        }

        // Validar formato de teléfono (solo números, espacios, guiones, paréntesis y +)
        const telefonoRegex = /^[0-9+\-\s()]+$/;
        if (!telefonoRegex.test(telefono)) {
            e.preventDefault();
            err.textContent = 'El teléfono solo puede contener números, espacios, guiones, paréntesis y el signo +.';
            err.classList.remove('hidden');
            document.getElementById('telefono').focus();
            return;
        }

        // Validar que el teléfono tenga al menos 8 dígitos
        const soloNumeros = telefono.replace(/[^0-9]/g, '');
        if (soloNumeros.length < 8) {
            e.preventDefault();
            err.textContent = 'El teléfono debe tener al menos 8 dígitos.';
            err.classList.remove('hidden');
            document.getElementById('telefono').focus();
            return;
        }

        // Si llegamos aquí, todo está válido - dejar que el formulario se envíe normalmente
        btn.disabled = true;
        btn.textContent = 'Enviando…';
        
        // El formulario se enviará automáticamente a Formspree
        console.log('Formulario válido, enviando a Formspree...');
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
