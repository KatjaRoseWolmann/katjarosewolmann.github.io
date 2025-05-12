document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    // Function to handle mobile menu based on screen size
    function handleMobileMenu() {
        if (window.innerWidth <= 768 && menuToggle) {
            // Mobile view - setup mobile menu toggle
            menuToggle.style.display = 'flex';
            
            // Use touchstart event for mobile devices
            menuToggle.addEventListener('touchstart', function(e) {
                e.preventDefault(); // Prevent ghost clicks
                nav.classList.toggle('active');
            }, { passive: false });
            
            // Keep click for desktop
            menuToggle.addEventListener('click', function(e) {
                nav.classList.toggle('active');
            });
        } else if (menuToggle) {
            // Desktop view - ensure menu toggle is hidden
            menuToggle.style.display = 'none';
            
            // Make sure navigation is visible and not in mobile mode
            if (nav) {
                nav.classList.remove('active');
                nav.style.left = '0';
            }
        }
    }
    
    // Initialize on page load
    handleMobileMenu();
    
    // Re-evaluate on window resize
    window.addEventListener('resize', handleMobileMenu);
    
    // Add click/touch event listener to close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (nav && nav.classList.contains('active') && !nav.contains(event.target) && event.target !== menuToggle) {
            nav.classList.remove('active');
        }
    });
    
    // Also handle touch events for closing the menu
    document.addEventListener('touchstart', function(event) {
        if (nav && nav.classList.contains('active') && !nav.contains(event.target) && event.target !== menuToggle) {
            nav.classList.remove('active');
        }
    }, { passive: true });
    
    // Header scroll effect
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Text animation effect for the hero heading
    const heroHeading = document.querySelector('.animate-text');
    
    if (heroHeading) {
        const text = heroHeading.textContent;
        heroHeading.textContent = '';
        
        // Create typing animation
        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                heroHeading.textContent += text.charAt(i);
                i++;
                
                // Adjust animation speed based on screen size
                // Faster on mobile to complete sooner
                const delay = window.innerWidth <= 768 ? 70 : 100;
                setTimeout(typeWriter, delay);
            }
        }
        
        // Start typing animation after a brief delay
        setTimeout(typeWriter, 500);
    }
    
    // Scroll reveal animation with IntersectionObserver for better performance
    const revealElements = document.querySelectorAll('.services-grid, .work-grid, .testimonial');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target); // Stop observing once revealed
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        function checkReveal() {
            for (let i = 0; i < revealElements.length; i++) {
                const element = revealElements[i];
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;
                
                if (elementTop < window.innerHeight - elementVisible) {
                    element.classList.add('revealed');
                }
            }
        }
        
        window.addEventListener('scroll', checkReveal);
        checkReveal(); // Check on initial load
    }
    
    // Generate stars dynamically for the background
    function generateStars(id, count) {
        const stars = document.getElementById(id);
        if (!stars) return;
        
        for (let i = 0; i < count; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.top = `${Math.random() * 100}%`;
            star.style.left = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 10}s`;
            star.style.animationDuration = `${Math.random() * 20 + 10}s`;
            stars.appendChild(star);
        }
    }
    
    // Pulsating stars effect
    function createPulsatingStars() {
        const starsContainer = document.querySelector('.stars-container');
        if (!starsContainer) return;
        
        const starCount = window.matchMedia('(max-width: 768px)').matches ? 50 : 100;
        
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'pulsating-star';
            
            // Random position
            star.style.top = `${Math.random() * 100}%`;
            star.style.left = `${Math.random() * 100}%`;
            
            // Random size (1-3px)
            const size = Math.random() * 2 + 1;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            
            // Random animation delay
            star.style.animationDelay = `${Math.random() * 5}s`;
            
            // Random animation duration (1-5s)
            star.style.animationDuration = `${Math.random() * 4 + 1}s`;
            
            starsContainer.appendChild(star);
        }
    }
    
    createPulsatingStars();
    
    // Add CSS for pulsating stars with vendor prefixes
    const style = document.createElement('style');
    style.textContent = `
        .pulsating-star {
            position: absolute;
            background-color: #fff;
            border-radius: 50%;
            -webkit-animation: pulsate 3s infinite ease-in-out;
            -moz-animation: pulsate 3s infinite ease-in-out;
            animation: pulsate 3s infinite ease-in-out;
            z-index: -1;
        }
        
        @-webkit-keyframes pulsate {
            0%, 100% {
                -webkit-transform: scale(1);
                transform: scale(1);
                opacity: 0.3;
            }
            50% {
                -webkit-transform: scale(1.5);
                transform: scale(1.5);
                opacity: 1;
            }
        }
        
        @keyframes pulsate {
            0%, 100% {
                transform: scale(1);
                opacity: 0.3;
            }
            50% {
                transform: scale(1.5);
                opacity: 1;
            }
        }
        
        .revealed {
            -webkit-animation: fadeInUp 1s forwards;
            -moz-animation: fadeInUp 1s forwards;
            animation: fadeInUp 1s forwards;
        }
    `;
    document.head.appendChild(style);
    
    // Fix for Firefox grid layout issues
    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
        const gridContainers = document.querySelectorAll('.values-grid, .services-grid, .work-grid, .footer-content, .contact-grid, .about-grid, .vision-values, .news-grid, .gallery-grid, .upcoming-book');
        
        gridContainers.forEach(container => {
            if (window.getComputedStyle(container).display === 'grid') {
                const items = container.children;
                const itemCount = items.length;
                
                // Add Firefox-specific styling if needed
                container.classList.add('firefox-grid');
            }
        });
    }
}); 