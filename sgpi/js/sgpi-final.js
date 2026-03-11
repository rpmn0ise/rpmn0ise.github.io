/**
 * SGPI V2 FINAL - JavaScript
 * Fix captcha + Dark mode + Search + Interactions
 */

// ====================================
// DARK MODE
// ====================================
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('sgpi-theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        if (themeToggle) themeToggle.textContent = '🌙';
    }
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
// CAPTCHA FIX (CRITIQUE!)
// ====================================
window.onCaptchaSuccess = function(token) {
    console.log('✅ Captcha validé:', token);
    const nextBtn = document.getElementById('captcha-next');
    if (nextBtn) {
        nextBtn.disabled = false;
        nextBtn.classList.remove('btn-disabled');
        nextBtn.classList.add('btn-primary');
        nextBtn.style.cursor = 'pointer';
        nextBtn.style.opacity = '1';
    }
};

window.onCaptchaError = function() {
    console.error('❌ Captcha erreur');
    const errorEl = document.getElementById('captcha-error');
    if (errorEl) {
        errorEl.style.display = 'block';
        errorEl.textContent = '❌ Erreur captcha. Recharge la page.';
    }
};

// ====================================
// WORKFLOW ACCÈS DISCORD
// ====================================
let currentStep = 1;

function showStep(step) {
    document.querySelectorAll('.access-step').forEach(el => el.style.display = 'none');
    const stepEl = document.getElementById(`step${step}`);
    if (stepEl) {
        stepEl.style.display = 'block';
        currentStep = step;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function nextFromCaptcha() {
    showStep(2);
}

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
    localStorage.setItem('sgpi-answer', answer);
    console.log('💾 Réponse:', answer);
    showStep(3);
}

function nextFromRules() {
    const checkbox = document.getElementById('accept-rules');
    if (!checkbox || !checkbox.checked) {
        alert('❌ Tu dois accepter les règles.');
        return;
    }
    showStep(4);
}

function copyDiscordLink() {
    const link = document.getElementById('discord-link')?.textContent;
    if (navigator.clipboard && link) {
        navigator.clipboard.writeText(link).then(() => {
            const btn = document.getElementById('copy-btn');
            if (btn) {
                const original = btn.textContent;
                btn.textContent = '✅ Copié !';
                setTimeout(() => btn.textContent = original, 2000);
            }
        });
    }
}

// Character counter
document.addEventListener('DOMContentLoaded', () => {
    const textarea = document.getElementById('why-join');
    const counter = document.getElementById('char-count');
    if (textarea && counter) {
        textarea.addEventListener('input', () => {
            counter.textContent = textarea.value.length;
        });
    }
});

// ====================================
// WIKI SEARCH (CLIENT-SIDE)
// ====================================
function searchWiki() {
    const query = document.getElementById('wiki-search')?.value.toLowerCase();
    if (!query || query.length < 2) {
        document.querySelectorAll('.wiki-category, .wiki-link').forEach(el => {
            el.style.display = '';
        });
        return;
    }
    
    let foundCount = 0;
    document.querySelectorAll('.wiki-category').forEach(cat => {
        const catText = cat.textContent.toLowerCase();
        const hasMatch = catText.includes(query);
        cat.style.display = hasMatch ? '' : 'none';
        if (hasMatch) foundCount++;
    });
    
    document.querySelectorAll('.wiki-link').forEach(link => {
        const linkText = link.textContent.toLowerCase();
        link.style.display = linkText.includes(query) ? '' : 'none';
    });
    
    const resultEl = document.getElementById('search-results');
    if (resultEl) {
        resultEl.textContent = foundCount > 0 ? 
            `${foundCount} résultat(s) trouvé(s)` : 
            'Aucun résultat';
    }
}

function clearSearch() {
    const searchInput = document.getElementById('wiki-search');
    if (searchInput) searchInput.value = '';
    searchWiki();
}

// ====================================
// WIKI CATEGORIES COLLAPSE
// ====================================
function toggleCategory(categoryId) {
    const subcats = document.getElementById(categoryId);
    if (!subcats) return;
    const isHidden = subcats.style.display === 'none';
    subcats.style.display = isHidden ? 'block' : 'none';
    const icon = subcats.previousElementSibling?.querySelector('.collapse-icon');
    if (icon) icon.textContent = isHidden ? '▼' : '▶';
}

// ====================================
// SMOOTH SCROLL
// ====================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ====================================
// ACTIVE NAV
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
// FADE IN ON SCROLL
// ====================================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.card, .hero').forEach(el => observer.observe(el));

// ====================================
// CONSOLE
// ====================================
console.log('%c🎮 SGPI V2 FINAL', 'font-size: 24px; font-weight: bold; color: #00ff88;');
console.log('%cBienvenue dans la zone grise 🔓', 'font-size: 14px; color: #00d4ff;');
