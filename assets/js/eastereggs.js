/**
 * EASTER EGGS - Gaming UI
 * Fun, cool, useful hidden features
 */

// ============================================
// 1. KONAMI CODE - MATRIX RAIN (FIXÉ!)
// ============================================

const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 
                    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 
                    'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    // Check si la touche correspond
    const key = e.key.toLowerCase();
    const expected = konamiCode[konamiIndex].toLowerCase();
    
    if (key === expected || e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        console.log(`Konami progress: ${konamiIndex}/${konamiCode.length}`);
        
        if (konamiIndex === konamiCode.length) {
            activateMatrixRain();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateMatrixRain() {
    console.log('🎉 KONAMI CODE ACTIVATED!');
    
    // Créer canvas Matrix
    const canvas = document.createElement('canvas');
    canvas.id = 'matrix-canvas';
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 99999;
        pointer-events: none;
    `;
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Matrix characters
    const chars = 'RPMN0ISE01アイウエオカキクケコサシスセソタチツテト';
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);
    
    // Animation
    let frameCount = 0;
    const maxFrames = 300; // 5 secondes à 60fps
    
    const draw = () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#88c0d0'; // Nord cyan
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
        
        frameCount++;
        if (frameCount < maxFrames) {
            requestAnimationFrame(draw);
        } else {
            // Fade out
            canvas.style.transition = 'opacity 1s';
            canvas.style.opacity = '0';
            setTimeout(() => canvas.remove(), 1000);
        }
    };
    
    draw();
    
    // Notification
    showNotification('🎮 KONAMI CODE ACTIVATED! Matrix mode enabled.');
}

// ============================================
// 2. CLICK LOGO 5X - THEME SWITCH
// ============================================

let logoClickCount = 0;
let logoClickTimer = null;

document.addEventListener('DOMContentLoaded', () => {
    const logo = document.querySelector('.nav-logo, nav a.logo');
    if (!logo) return;
    
    logo.addEventListener('click', (e) => {
        logoClickCount++;
        
        // Reset après 2 secondes sans click
        clearTimeout(logoClickTimer);
        logoClickTimer = setTimeout(() => {
            logoClickCount = 0;
        }, 2000);
        
        if (logoClickCount === 5) {
            toggleTheme();
            logoClickCount = 0;
        }
    });
});

function toggleTheme() {
    const root = document.documentElement;
    const currentTheme = root.getAttribute('data-theme') || 'nord';
    
    const themes = {
        nord: { name: 'Cyberpunk', accent: '#ff00ff', bg: '#0a0a0a' },
        cyberpunk: { name: 'Matrix', accent: '#00ff00', bg: '#000000' },
        matrix: { name: 'Valorant', accent: '#ff4655', bg: '#0f1923' },
        valorant: { name: 'Nord', accent: '#88c0d0', bg: '#2e3440' }
    };
    
    const nextTheme = currentTheme === 'nord' ? 'cyberpunk' :
                      currentTheme === 'cyberpunk' ? 'matrix' :
                      currentTheme === 'matrix' ? 'valorant' : 'nord';
    
    const theme = themes[nextTheme];
    
    root.style.setProperty('--accent-primary', theme.accent);
    root.style.setProperty('--bg-primary', theme.bg);
    root.setAttribute('data-theme', nextTheme);
    
    showNotification(`🎨 Theme changed to ${theme.name}!`);
}

// ============================================
// 3. TYPE "SECRET" - SECRET MESSAGE
// ============================================

let typedSequence = '';
const secretWord = 'secret';

document.addEventListener('keypress', (e) => {
    typedSequence += e.key.toLowerCase();
    
    // Garder seulement les 10 derniers caractères
    if (typedSequence.length > 10) {
        typedSequence = typedSequence.slice(-10);
    }
    
    if (typedSequence.includes(secretWord)) {
        showSecretMessage();
        typedSequence = '';
    }
});

function showSecretMessage() {
    const messages = [
        "🎮 You found a secret! Keep exploring...",
        "🚀 RPMN0ISE says: Gaming is life!",
        "💻 Arch btw",
        "🎵 Music makes everything better",
        "⚡ Speed and precision win races"
    ];
    
    const msg = messages[Math.floor(Math.random() * messages.length)];
    showNotification(msg, 5000);
}

// ============================================
// 4. MIDNIGHT SPECIAL
// ============================================

setInterval(() => {
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() === 0) {
        midnightAnimation();
    }
}, 60000); // Check chaque minute

function midnightAnimation() {
    // Particles explosion
    for (let i = 0; i < 50; i++) {
        createParticle();
    }
    
    showNotification('🌙 Midnight strikes! Keep gaming!', 3000);
}

function createParticle() {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: #88c0d0;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        left: ${Math.random() * 100}vw;
        top: ${Math.random() * 100}vh;
        animation: particle-float 2s ease-out forwards;
    `;
    document.body.appendChild(particle);
    
    setTimeout(() => particle.remove(), 2000);
}

// CSS Animation pour particles
const style = document.createElement('style');
style.textContent = `
@keyframes particle-float {
    0% { transform: translateY(0) scale(1); opacity: 1; }
    100% { transform: translateY(-200px) scale(0); opacity: 0; }
}
`;
document.head.appendChild(style);

// ============================================
// 5. SCROLL TO BOTTOM - ACHIEVEMENT
// ============================================

let hasScrolledToBottom = false;

window.addEventListener('scroll', () => {
    const scrollPercentage = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
    
    if (scrollPercentage > 0.99 && !hasScrolledToBottom) {
        hasScrolledToBottom = true;
        unlockAchievement('Scroll Master', 'You reached the bottom!');
    }
});

function unlockAchievement(title, desc) {
    const achievement = document.createElement('div');
    achievement.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(59, 66, 82, 0.95);
        border: 2px solid #88c0d0;
        border-radius: 12px;
        padding: 20px;
        z-index: 10000;
        animation: slideIn 0.5s ease-out;
        box-shadow: 0 0 20px rgba(136, 192, 208, 0.5);
    `;
    achievement.innerHTML = `
        <div style="font-family: 'Orbitron', sans-serif; color: #88c0d0; margin-bottom: 5px;">
            🏆 ACHIEVEMENT UNLOCKED
        </div>
        <div style="font-weight: 700; margin-bottom: 5px;">${title}</div>
        <div style="color: #d8dee9; font-size: 0.9rem;">${desc}</div>
    `;
    document.body.appendChild(achievement);
    
    setTimeout(() => {
        achievement.style.animation = 'slideOut 0.5s ease-in forwards';
        setTimeout(() => achievement.remove(), 500);
    }, 3000);
}

// Animations
const achievementStyle = document.createElement('style');
achievementStyle.textContent = `
@keyframes slideIn {
    from { transform: translateX(400px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}
@keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(400px); opacity: 0; }
}
`;
document.head.appendChild(achievementStyle);

// ============================================
// NOTIFICATION SYSTEM
// ============================================

function showNotification(message, duration = 3000) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: rgba(59, 66, 82, 0.95);
        border: 1px solid #88c0d0;
        border-radius: 8px;
        padding: 15px 20px;
        z-index: 10000;
        animation: fadeInSlide 0.3s ease-out;
        box-shadow: 0 4px 16px rgba(0,0,0,0.5);
        font-family: 'Inter', sans-serif;
        color: #eceff4;
        max-width: 300px;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOutSlide 0.3s ease-in forwards';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

const notifStyle = document.createElement('style');
notifStyle.textContent = `
@keyframes fadeInSlide {
    from { transform: translateX(400px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}
@keyframes fadeOutSlide {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(400px); opacity: 0; }
}
`;
document.head.appendChild(notifStyle);

// ============================================
// CONSOLE EASTER EGG
// ============================================

console.log('%c🎮 RPMN0ISE Gaming Hub', 'font-size: 20px; font-weight: bold; color: #88c0d0;');
console.log('%cLooking for easter eggs? Try:', 'font-size: 14px; color: #d8dee9;');
console.log('%c- Konami Code: ↑↑↓↓←→←→BA', 'font-size: 12px; color: #81a1c1;');
console.log('%c- Click logo 5 times', 'font-size: 12px; color: #81a1c1;');
console.log('%c- Type "secret"', 'font-size: 12px; color: #81a1c1;');
console.log('%c- Scroll to bottom', 'font-size: 12px; color: #81a1c1;');
console.log('%c- Visit at midnight', 'font-size: 12px; color: #81a1c1;');

// ============================================
// INIT
// ============================================

console.log('✅ Easter eggs loaded!');
