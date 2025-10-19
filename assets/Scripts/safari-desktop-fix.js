// Safari 15.6.1 Desktop Detection and Fixes
(function() {
    'use strict';
    
    // Detect Safari 15.6.1 specifically
    function isSafari15_6_1() {
        const ua = navigator.userAgent;
        const safari = ua.match(/Version\/([\d.]+).*Safari/);
        return safari && parseFloat(safari[1]) >= 15.6 && parseFloat(safari[1]) < 16;
    }
    
    // Force desktop mode for Safari 15.6.1
    function forceDesktopMode() {
        // Remove mobile classes if Safari is incorrectly detecting mobile
        document.body.classList.add('force-desktop-safari');
        
        // Override viewport if needed
        let viewport = document.querySelector('meta[name="viewport"]');
        if (viewport && window.screen.width >= 768) {
            viewport.setAttribute('content', 'width=1200, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no');
        }
        
        // Force window width detection
        Object.defineProperty(window, 'innerWidth', {
            get: function() {
                return Math.max(window.screen.width, 1024);
            }
        });
        
        // Force media query matches for desktop
        if (window.matchMedia) {
            const originalMatchMedia = window.matchMedia;
            window.matchMedia = function(query) {
                const result = originalMatchMedia.call(window, query);
                
                // Force desktop media queries to match
                if (query.includes('min-width: 768px') || query.includes('min-width: 1024px')) {
                    return {
                        ...result,
                        matches: window.screen.width >= 768
                    };
                }
                
                return result;
            };
        }
    }
    
    // Add CSS fixes for Safari 15.6.1
    function addSafariCSS() {
        const style = document.createElement('style');
        style.textContent = `
            .force-desktop-safari {
                min-width: 1024px !important;
            }
            
            .force-desktop-safari .container,
            .force-desktop-safari .max-w-7xl,
            .force-desktop-safari .max-w-6xl {
                width: 100% !important;
                max-width: 80rem !important;
                margin: 0 auto !important;
                padding-left: 2rem !important;
                padding-right: 2rem !important;
            }
            
            /* Force grid layouts */
            .force-desktop-safari .grid.grid-cols-1.md\\:grid-cols-2 {
                grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }
            
            .force-desktop-safari .grid.grid-cols-1.lg\\:grid-cols-2 {
                grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }
            
            .force-desktop-safari .grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-4 {
                grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
            }
            
            /* Force text sizes */
            .force-desktop-safari h1.text-6xl.md\\:text-7xl.lg\\:text-8xl {
                font-size: 6rem !important;
                line-height: 1 !important;
            }
            
            .force-desktop-safari h2.text-4xl.md\\:text-6xl.lg\\:text-8xl {
                font-size: 6rem !important;
                line-height: 1 !important;
            }
            
            /* Force spacing */
            .force-desktop-safari .py-16.md\\:py-24 {
                padding-top: 6rem !important;
                padding-bottom: 6rem !important;
            }
            
            .force-desktop-safari .gap-10.md\\:gap-16.lg\\:gap-20 {
                gap: 5rem !important;
            }
            
            /* Force carousel size */
            .force-desktop-safari .carousel-container {
                width: 550px !important;
                height: 410px !important;
            }
            
            /* Force flex direction */
            .force-desktop-safari .flex-col.sm\\:flex-row {
                flex-direction: row !important;
            }
            
            /* Force card spacing */
            .force-desktop-safari .grid.max-w-5xl.gap-16.lg\\:grid-cols-2.lg\\:gap-24 {
                grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                gap: 6rem !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Apply fixes when page loads
    function applySafariFixes() {
        if (isSafari15_6_1() && window.screen.width >= 768) {
            console.log('Safari 15.6.1 detected on desktop - applying fixes');
            forceDesktopMode();
            addSafariCSS();
            
            // Force a reflow after styles are applied
            setTimeout(() => {
                document.body.style.display = 'none';
                document.body.offsetHeight; // Trigger reflow
                document.body.style.display = '';
            }, 100);
        }
    }
    
    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applySafariFixes);
    } else {
        applySafariFixes();
    }
    
    // Also run on window resize to catch orientation changes
    window.addEventListener('resize', () => {
        if (isSafari15_6_1() && window.screen.width >= 768) {
            applySafariFixes();
        }
    });
})();