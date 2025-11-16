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

        // ===== CORRECCIÓN PRINCIPAL: Manejar enlaces del menú con smooth scroll =====
        const mobileMenuLinks = mobileMenuPanel.querySelectorAll('a[href^="#"]');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault(); // Prevenir el comportamiento por defecto
                
                const href = link.getAttribute('href');
                const targetId = href.replace('#', '');
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Primero cerrar el menú
                    mobileMenuOverlay.classList.remove('opacity-100');
                    mobileMenuOverlay.classList.add('opacity-0');
                    mobileMenuPanel.classList.add('translate-x-full');
                    mobileMenuPanel.setAttribute('aria-hidden', 'true');
                    openMenuBtn.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                    
                    // Esperar a que termine la animación de cierre (300ms) + delay adicional
                    setTimeout(() => {
                        mobileMenuOverlay.classList.add('hidden');
                    }, 300);
                    
                    // Hacer el smooth scroll después de un delay mayor para que sea más suave
                    setTimeout(() => {
                        targetElement.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'start' 
                        });
                    }, 500); // 500ms para una transición más suave y natural
                } else {
                    // Si no encuentra el elemento, solo cierra el menú
                    closeMenu();
                }
            });
        });

        // Tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !mobileMenuOverlay.classList.contains('hidden')) {
                closeMenu();
            }
        });

        mobileMenuInitialized = true;
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

    // ====== Flip Cards para Mobile ======
    // Detectar si es REALMENTE mobile (no solo touch-capable)
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth < 1024;
    
    console.log('🔍 User Agent:', navigator.userAgent);
    console.log('📱 Es móvil real:', isMobile);
    console.log('👆 Tiene touch:', isTouchDevice);
    console.log('📏 Pantalla pequeña (<1024px):', isSmallScreen);
    console.log('🎯 Activar modo mobile:', isMobile || (isTouchDevice && isSmallScreen));
    
    // Solo activar en mobile real O en pantallas pequeñas con touch
    if (isMobile || (isTouchDevice && isSmallScreen)) {
        const flipCards = document.querySelectorAll('.flip-card');
        console.log('🃏 Tarjetas encontradas:', flipCards.length);
        
        flipCards.forEach((card, index) => {
            console.log(`✅ Agregando eventos a tarjeta ${index + 1}`);
            
            // Usar touchend en lugar de click para mejor rendimiento en mobile
            card.addEventListener('touchend', function(e) {
                e.preventDefault(); // Prevenir el click que viene después
                console.log(`👆 TOUCHEND en tarjeta ${index + 1}`);
                console.log('   Estado anterior:', this.classList.contains('is-flipped') ? 'VOLTEADA' : 'NORMAL');
                
                // Alternar el estado de esta tarjeta específica
                this.classList.toggle('is-flipped');
                
                console.log('   Estado nuevo:', this.classList.contains('is-flipped') ? 'VOLTEADA' : 'NORMAL');
                console.log('   Clases actuales:', this.className);
            });
            
            // También agregar click como fallback
            card.addEventListener('click', function(e) {
                e.preventDefault();
                console.log(`🖱️ CLICK en tarjeta ${index + 1}`);
                console.log('   Estado anterior:', this.classList.contains('is-flipped') ? 'VOLTEADA' : 'NORMAL');
                
                // Alternar el estado de esta tarjeta específica
                this.classList.toggle('is-flipped');
                
                console.log('   Estado nuevo:', this.classList.contains('is-flipped') ? 'VOLTEADA' : 'NORMAL');
                console.log('   Clases actuales:', this.className);
            });
        });
    } else {
        console.log('💻 Modo desktop - usando hover CSS');
    }
});