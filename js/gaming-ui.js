/**
 * GAMING UI - JavaScript Interactions
 * Professional gaming interface with smooth animations
 */

// ==========================================
// LOADING SCREEN
// ==========================================
window.addEventListener('load', () => {
    setTimeout(() => {
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }, 1500);
});

// ==========================================
// NAVBAR SCROLL EFFECT
// ==========================================
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add scrolled class
    if (currentScroll > 50) {
        navbar?.classList.add('scrolled');
    } else {
        navbar?.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ==========================================
// MOBILE MENU TOGGLE
// ==========================================
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle?.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks?.classList.toggle('active');
});

// Close menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navToggle?.classList.remove('active');
        navLinks?.classList.remove('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navToggle?.contains(e.target) && !navLinks?.contains(e.target)) {
        navToggle?.classList.remove('active');
        navLinks?.classList.remove('active');
    }
});

// ==========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==========================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ==========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all cards, sections, etc.
document.querySelectorAll('.card, .section-title, .hero-content').forEach(el => {
    observer.observe(el);
});

// ==========================================
// PARALLAX EFFECT
// ==========================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    parallaxElements.forEach(el => {
        const speed = el.dataset.parallax || 0.5;
        el.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ==========================================
// TYPING EFFECT
// ==========================================
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Auto-apply to elements with .typing-effect
document.querySelectorAll('.typing-effect').forEach(el => {
    const text = el.textContent;
    el.textContent = '';
    setTimeout(() => typeWriter(el, text), 500);
});

// ==========================================
// BUTTON RIPPLE EFFECT
// ==========================================
function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    ripple.style.top = `${event.clientY - button.offsetTop - radius}px`;
    ripple.classList.add('ripple');
    
    const rippleElement = button.querySelector('.ripple');
    if (rippleElement) {
        rippleElement.remove();
    }
    
    button.appendChild(ripple);
}

document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', createRipple);
});

// Add ripple CSS
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(136, 192, 208, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ==========================================
// CURSOR TRAIL EFFECT
// ==========================================
const cursorTrail = [];
const trailLength = 10;

document.addEventListener('mousemove', (e) => {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.left = e.pageX + 'px';
    trail.style.top = e.pageY + 'px';
    
    document.body.appendChild(trail);
    cursorTrail.push(trail);
    
    if (cursorTrail.length > trailLength) {
        const oldTrail = cursorTrail.shift();
        oldTrail?.remove();
    }
    
    setTimeout(() => trail.remove(), 500);
});

// Cursor trail CSS
const trailStyle = document.createElement('style');
trailStyle.textContent = `
    .cursor-trail {
        position: absolute;
        width: 4px;
        height: 4px;
        background: var(--accent-primary);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        opacity: 0;
        animation: trail-fade 0.5s ease-out;
        box-shadow: 0 0 10px var(--accent-primary);
    }
    
    @keyframes trail-fade {
        0% {
            opacity: 1;
            transform: scale(1);
        }
        100% {
            opacity: 0;
            transform: scale(0);
        }
    }
`;
document.head.appendChild(trailStyle);

// ==========================================
// STATS COUNTER ANIMATION
// ==========================================
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Auto-apply to elements with .counter
const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.dataset.target);
            animateCounter(entry.target, target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

counters.forEach(counter => counterObserver.observe(counter));

// ==========================================
// GLITCH TEXT EFFECT (EASTER EGG)
// ==========================================
function glitchText(element) {
    const originalText = element.textContent;
    const chars = '!<>-_\\/[]{}—=+*^?#________';
    let iterations = 0;
    
    const interval = setInterval(() => {
        element.textContent = originalText
            .split('')
            .map((char, index) => {
                if (index < iterations) {
                    return originalText[index];
                }
                return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('');
        
        iterations += 1/3;
        
        if (iterations >= originalText.length) {
            clearInterval(interval);
            element.textContent = originalText;
        }
    }, 30);
}

// Apply glitch effect on hover for specific elements
document.querySelectorAll('[data-glitch]').forEach(el => {
    el.addEventListener('mouseenter', () => glitchText(el));
});

// ==========================================
// KEYBOARD SHORTCUTS (EASTER EGG)
// ==========================================
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateEasterEgg() {
    // Matrix rain effect
    document.body.style.background = '#000';
    document.body.innerHTML += '<div class="matrix-rain"></div>';
    
    setTimeout(() => {
        location.reload();
    }, 5000);
}

// ==========================================
// PAGE TRANSITION
// ==========================================
function pageTransition() {
    const transition = document.createElement('div');
    transition.className = 'page-transition';
    document.body.appendChild(transition);
    
    setTimeout(() => transition.classList.add('active'), 10);
    
    setTimeout(() => {
        transition.remove();
    }, 1000);
}

// Add transition CSS
const transitionStyle = document.createElement('style');
transitionStyle.textContent = `
    .page-transition {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--bg-primary);
        z-index: 99999;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.5s ease;
    }
    
    .page-transition.active {
        opacity: 1;
    }
`;
document.head.appendChild(transitionStyle);

// Apply to all internal links
document.querySelectorAll('a:not([href^="http"]):not([href^="#"])').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        pageTransition();
        setTimeout(() => {
            window.location.href = href;
        }, 500);
    });
});

// ==========================================
// PROGRESS BAR
// ==========================================
function createProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

const progressStyle = document.createElement('style');
progressStyle.textContent = `
    .progress-bar {
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: var(--gradient-primary);
        z-index: 99999;
        box-shadow: var(--glow-primary);
        transition: width 0.1s ease;
    }
`;
document.head.appendChild(progressStyle);

createProgressBar();

// ==========================================
// CONSOLE EASTER EGG
// ==========================================
console.log('%c🎮 GAMING UI v1.0', 'color: #88c0d0; font-size: 24px; font-weight: bold;');
console.log('%cBuilt with passion for gamers', 'color: #81a1c1; font-size: 14px;');
console.log('%c⚡ Try the Konami Code!', 'color: #a3be8c; font-size: 12px;');

// ==========================================
// PERFORMANCE MONITORING
// ==========================================
if (window.performance) {
    window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`⚡ Page loaded in ${pageLoadTime}ms`);
    });
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export for use in other scripts
window.gamingUI = {
    typeWriter,
    animateCounter,
    glitchText,
    pageTransition,
    debounce,
    throttle
};
