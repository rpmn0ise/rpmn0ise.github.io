/**
 * SGPI V2 - JavaScript
 * Dark/Light mode + Interactions
 */

// ====================================
// DARK / LIGHT MODE TOGGLE
// ====================================

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    
    // Charger thème sauvegardé
    const savedTheme = localStorage.getItem('sgpi-theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        if (themeToggle) themeToggle.textContent = '🌙';
    }
    
    // Toggle theme
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const isLight = document.body.classList.contains('light-mode');
            themeToggle.textContent = isLight ? '🌙' : '☀️';
            localStorage.setItem('sgpi-theme', isLight ? 'light' : 'dark');
        });
    }
});

// ====================================
// PAGE ACCÈS DISCORD - WORKFLOW
// ====================================

// Step management
let currentStep = 1;

function showStep(step) {
    // Cacher tous les steps
    document.querySelectorAll('.access-step').forEach(el => {
        el.style.display = 'none';
    });
    
    // Afficher step actuel
    const stepEl = document.getElementById(`step${step}`);
    if (stepEl) {
        stepEl.style.display = 'block';
        currentStep = step;
    }
}

// Captcha success callback
function onCaptchaSuccess(token) {
    console.log('✅ Captcha validé');
    document.getElementById('captcha-error')?.style.display = 'none';
    
    // Activer bouton suivant
    const nextBtn = document.getElementById('captcha-next');
    if (nextBtn) {
        nextBtn.disabled = false;
        nextBtn.classList.add('btn-primary');
        nextBtn.classList.remove('btn-disabled');
    }
}

// Captcha error callback
function onCaptchaError() {
    console.error('❌ Captcha erreur');
    const errorEl = document.getElementById('captcha-error');
    if (errorEl) {
        errorEl.style.display = 'block';
        errorEl.textContent = '❌ Erreur captcha. Réessaye.';
    }
}

// Step 1: Captcha → Step 2: Question
function nextFromCaptcha() {
    showStep(2);
}

// Step 2: Question → Step 3: Règles
function nextFromQuestion() {
    const answer = document.getElementById('why-join')?.value.trim();
    
    if (!answer || answer.length < 20) {
        alert('❌ Réponds avec au moins 20 caractères.');
        return;
    }
    
    if (answer.length > 500) {
        alert('❌ Maximum 500 caractères.');
        return;
    }
    
    // Sauvegarder réponse (optionnel - juste pour stats)
    localStorage.setItem('sgpi-answer', answer);
    console.log('💾 Réponse sauvegardée:', answer);
    
    showStep(3);
}

// Step 3: Règles → Step 4: Discord link
function nextFromRules() {
    const checkbox = document.getElementById('accept-rules');
    
    if (!checkbox || !checkbox.checked) {
        alert('❌ Tu dois accepter les règles pour continuer.');
        return;
    }
    
    showStep(4);
}

// Copier lien Discord
function copyDiscordLink() {
    const link = document.getElementById('discord-link')?.textContent;
    
    if (navigator.clipboard && link) {
        navigator.clipboard.writeText(link).then(() => {
            const btn = document.getElementById('copy-btn');
            if (btn) {
                const original = btn.textContent;
                btn.textContent = '✅ Copié !';
                btn.classList.add('btn-success');
                
                setTimeout(() => {
                    btn.textContent = original;
                    btn.classList.remove('btn-success');
                }, 2000);
            }
        });
    }
}

// ====================================
// WIKI - CATEGORIES COLLAPSE
// ====================================

function toggleCategory(categoryId) {
    const subcats = document.getElementById(categoryId);
    if (!subcats) return;
    
    const isHidden = subcats.style.display === 'none';
    subcats.style.display = isHidden ? 'block' : 'none';
    
    // Rotate icon
    const icon = subcats.previousElementSibling?.querySelector('.collapse-icon');
    if (icon) {
        icon.style.transform = isHidden ? 'rotate(90deg)' : 'rotate(0deg)';
    }
}

// ====================================
// SMOOTH SCROLL
// ====================================

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

// ====================================
// ACTIVE NAV LINK
// ====================================

function setActiveNavLink() {
    const currentPath = window.location.pathname;
    document.querySelectorAll('nav a').forEach(link => {
        const href = link.getAttribute('href');
        if (currentPath.includes(href) && href !== '/') {
            link.classList.add('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', setActiveNavLink);

// ====================================
// CONSOLE EASTER EGG
// ====================================

console.log('%c🎮 SGPI V2', 'font-size: 24px; font-weight: bold; color: #00ff88;');
console.log('%cBienvenue dans la zone grise 🔓', 'font-size: 14px; color: #00d4ff;');
console.log('%cSi tu cherches quelque chose, regarde le wiki 📚', 'font-size: 12px; color: #a0a0a0;');

// ====================================
// UTILITIES
// ====================================

// Fade in elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.card, .hero').forEach(el => {
    observer.observe(el);
});
