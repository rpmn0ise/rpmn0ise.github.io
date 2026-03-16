/**
 * SGPI Custom Cursor avec particules
 * Toggle: Alt+C
 */

class SGPICursor {
    constructor() {
        this.enabled = localStorage.getItem('sgpi-cursor-enabled') !== 'false';
        this.particles = [];
        this.maxParticles = 20;
        this.mouseX = 0;
        this.mouseY = 0;
        
        if (this.enabled) {
            this.init();
        }
    }
    
    init() {
        this.createCanvas();
        this.attachEvents();
        this.animate();
        this.hideCursor();
    }
    
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'sgpi-cursor';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            pointer-events: none;
            z-index: 99999;
        `;
        document.body.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        this.resize();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    hideCursor() {
        const style = document.createElement('style');
        style.id = 'sgpi-cursor-style';
        style.textContent = `
            * {
                cursor: none !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    showCursor() {
        const style = document.getElementById('sgpi-cursor-style');
        if (style) style.remove();
    }
    
    attachEvents() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.addParticle(e.clientX, e.clientY);
        });
        
        window.addEventListener('resize', () => this.resize());
        
        // Toggle cursor avec Alt+C
        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.key.toLowerCase() === 'c') {
                this.toggle();
            }
        });
        
        // Click effect
        document.addEventListener('click', (e) => {
            for (let i = 0; i < 8; i++) {
                this.addParticle(e.clientX, e.clientY, true);
            }
        });
    }
    
    addParticle(x, y, burst = false) {
        if (this.particles.length >= this.maxParticles && !burst) {
            this.particles.shift();
        }
        
        this.particles.push({
            x,
            y,
            vx: burst ? (Math.random() - 0.5) * 4 : 0,
            vy: burst ? (Math.random() - 0.5) * 4 : 0,
            life: 1,
            size: burst ? Math.random() * 3 + 2 : Math.random() * 2 + 1,
            hue: 150 // Green
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw crosshair cursor
        this.ctx.strokeStyle = 'rgba(0, 255, 136, 0.8)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        
        // Horizontal line
        this.ctx.moveTo(this.mouseX - 10, this.mouseY);
        this.ctx.lineTo(this.mouseX + 10, this.mouseY);
        
        // Vertical line
        this.ctx.moveTo(this.mouseX, this.mouseY - 10);
        this.ctx.lineTo(this.mouseX, this.mouseY + 10);
        
        this.ctx.stroke();
        
        // Center dot
        this.ctx.fillStyle = 'rgba(0, 255, 136, 1)';
        this.ctx.beginPath();
        this.ctx.arc(this.mouseX, this.mouseY, 2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw and update particles
        this.particles.forEach((p, index) => {
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.02;
            
            if (p.life <= 0) {
                this.particles.splice(index, 1);
                return;
            }
            
            this.ctx.fillStyle = `hsla(${p.hue}, 100%, 50%, ${p.life * 0.8})`;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        requestAnimationFrame(() => this.animate());
    }
    
    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('sgpi-cursor-enabled', this.enabled);
        
        if (this.enabled) {
            this.canvas.style.display = 'block';
            this.hideCursor();
            console.log('✅ Custom cursor enabled');
        } else {
            this.canvas.style.display = 'none';
            this.showCursor();
            console.log('❌ Custom cursor disabled');
        }
    }
}

// Initialize
window.sgpiCursor = new SGPICursor();

// Show toggle hint
if (!localStorage.getItem('sgpi-cursor-hint-shown')) {
    setTimeout(() => {
        console.log('%c 💡 TIP: Press Alt+C to toggle custom cursor ', 
            'background: #00ff88; color: #000; padding: 5px; font-weight: bold;');
        localStorage.setItem('sgpi-cursor-hint-shown', 'true');
    }, 3000);
}
