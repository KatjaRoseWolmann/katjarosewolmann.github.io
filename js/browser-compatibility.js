/**
 * Cross-browser compatibility script
 * Detects browser-specific issues and applies fixes
 */
(function() {
    // Detect browser
    function detectBrowser() {
        const userAgent = navigator.userAgent.toLowerCase();
        
        if (userAgent.indexOf('firefox') > -1) {
            return 'firefox';
        } else if (userAgent.indexOf('chrome') > -1) {
            return 'chrome';
        } else if (userAgent.indexOf('safari') > -1 && userAgent.indexOf('chrome') === -1) {
            return 'safari';
        } else if (userAgent.indexOf('edge') > -1 || userAgent.indexOf('edg') > -1) {
            return 'edge';
        } else if (userAgent.indexOf('trident') > -1 || userAgent.indexOf('msie') > -1) {
            return 'ie';
        } else {
            return 'unknown';
        }
    }
    
    // Apply browser-specific fixes
    function applyBrowserFixes() {
        const browser = detectBrowser();
        document.documentElement.classList.add(`browser-${browser}`);
        document.body.classList.add(browser);
        
        // Firefox-specific fixes
        if (browser === 'firefox') {
            // Fix for values layout in Firefox
            const valuesColumns = document.querySelectorAll('.values-column');
            if (valuesColumns.length > 0) {
                valuesColumns.forEach(column => {
                    // Ensure proper flex behavior
                    column.style.display = 'block';
                    column.style.float = 'left';
                    
                    // Adjust based on viewport width
                    if (window.innerWidth > 992) {
                        column.style.width = '33.333%';
                    } else if (window.innerWidth > 768) {
                        column.style.width = '50%';
                    } else {
                        column.style.width = '100%';
                    }
                    
                    // Apply padding to create spacing
                    column.style.padding = '0 15px';
                    column.style.marginBottom = '30px';
                    column.style.boxSizing = 'border-box';
                });
                
                // Make cards proper height
                const valueCards = document.querySelectorAll('.value-card');
                valueCards.forEach(card => {
                    card.style.height = '100%';
                    card.style.display = 'flex';
                    card.style.flexDirection = 'column';
                    card.style.alignItems = 'center';
                    card.style.textAlign = 'center';
                });
                
                // Ensure row display is proper
                const valuesRow = document.querySelector('.values-row');
                if (valuesRow) {
                    valuesRow.style.display = 'block';
                    valuesRow.style.marginRight = '-15px';
                    valuesRow.style.marginLeft = '-15px';
                    valuesRow.style.overflow = 'hidden'; // Clear floats
                }
            }
            
            // Fix buttons in Firefox
            const buttons = document.querySelectorAll('.btn');
            buttons.forEach(btn => {
                btn.classList.add('firefox-btn');
                btn.style.display = 'inline-block';
                btn.style.textDecoration = 'none';
            });
            
            // Fix backdrop-filter for older Firefox versions
            if (!CSS.supports('backdrop-filter', 'blur(10px)')) {
                const elementsWithBackdrop = document.querySelectorAll('header, nav.active, .contact-form, .service-card, .value-card');
                elementsWithBackdrop.forEach(el => {
                    el.classList.add('no-backdrop-filter');
                });
            }
            
            // Fix for CSS gradient text
            const gradientTextElements = document.querySelectorAll('.hero h1, .page-header h1, .footer-info h3, .about-text h2, .upcoming-info h3');
            gradientTextElements.forEach(el => {
                el.classList.add('firefox-gradient-text');
            });
        }
        
        // Safari-specific fixes
        else if (browser === 'safari') {
            // Fix for values layout in Safari
            const valueCards = document.querySelectorAll('.value-card');
            valueCards.forEach(card => {
                card.style.display = 'flex';
                card.style.flexDirection = 'column';
                card.style.alignItems = 'center';
                card.style.height = '100%';
            });
            
            // Fix for flexbox gaps in Safari
            const flexContainers = document.querySelectorAll('.values-row, .button-container');
            flexContainers.forEach(container => {
                container.classList.add('safari-flex-gap');
            });
        }
        
        // IE/Edge legacy fixes
        else if (browser === 'ie' || (browser === 'edge' && navigator.userAgent.indexOf('edg') === -1)) {
            document.documentElement.classList.add('legacy-browser');
            
            // Add polyfill for CSS variables if needed
            if (!window.CSS || !window.CSS.supports || !window.CSS.supports('--a', '0')) {
                const link = document.createElement('script');
                link.src = 'https://cdn.jsdelivr.net/npm/css-vars-ponyfill@2';
                link.onload = function() {
                    cssVars({});
                };
                document.head.appendChild(link);
            }
            
            // Fix layout for older Edge
            const valuesColumns = document.querySelectorAll('.values-column');
            valuesColumns.forEach(column => {
                column.style.float = 'left';
                if (window.innerWidth > 992) {
                    column.style.width = '33.333%';
                } else if (window.innerWidth > 768) {
                    column.style.width = '50%';
                } else {
                    column.style.width = '100%';
                }
            });
        }
    }
    
    // Feature detection and polyfills
    function applyPolyfills() {
        // Check for IntersectionObserver support 
        if (!('IntersectionObserver' in window)) {
            const script = document.createElement('script');
            script.src = 'https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver';
            document.head.appendChild(script);
        }
        
        // Apply gap polyfill for flex layouts in older browsers
        if (!CSS.supports('gap', '1px')) {
            document.documentElement.classList.add('no-gap-support');
            
            // Add spacers for browsers without gap support
            const buttonContainer = document.querySelector('.button-container');
            if (buttonContainer) {
                const buttons = buttonContainer.querySelectorAll('.btn');
                buttons.forEach(btn => {
                    btn.style.margin = '10px';
                });
            }
        }
    }
    
    // Fix for viewport height issues on mobile browsers
    function fixMobileViewportHeight() {
        // First we get the viewport height and we multiply it by 1% to get a value for a vh unit
        const vh = window.innerHeight * 0.01;
        // Then we set the value in the --vh custom property to the root of the document
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        // We listen to the resize event
        window.addEventListener('resize', () => {
            // We execute the same script as before
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
            
            // Adjust column widths on resize
            if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
                const valuesColumns = document.querySelectorAll('.values-column');
                valuesColumns.forEach(column => {
                    if (window.innerWidth > 992) {
                        column.style.width = '33.333%';
                    } else if (window.innerWidth > 768) {
                        column.style.width = '50%';
                    } else {
                        column.style.width = '100%';
                    }
                });
            }
        });
    }
    
    // Ensure consistent layout after the page has loaded
    function fixLayoutAfterLoad() {
        window.addEventListener('load', () => {
            // Specifically for Firefox, make one more attempt to fix layout after full load
            if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
                setTimeout(() => {
                    // Clear any unwanted float behaviors
                    document.querySelectorAll('.values-row').forEach(row => {
                        row.style.overflow = 'hidden';
                    });
                    
                    // Force redraw of cards
                    const valueCards = document.querySelectorAll('.value-card');
                    valueCards.forEach(card => {
                        card.style.opacity = '0.99';
                        setTimeout(() => {
                            card.style.opacity = '1';
                        }, 10);
                    });
                }, 100);
            }
        });
    }
    
    // Run all compatibility functions
    document.addEventListener('DOMContentLoaded', function() {
        applyBrowserFixes();
        applyPolyfills();
        fixMobileViewportHeight();
        fixLayoutAfterLoad();
    });
})(); 