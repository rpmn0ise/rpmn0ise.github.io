/**
 * SGPI Online Users - Tracking anonyme
 * Simulation réaliste basée sur localStorage
 */

class SGPIOnline {
    constructor() {
        this.baseUsers = 15; // Utilisateurs de base
        this.maxVariance = 12; // Variance max
        this.updateInterval = 30000; // 30 secondes
        
        this.init();
    }
    
    init() {
        this.createWidget();
        this.updateCount();
        
        // Update périodique
        setInterval(() => this.updateCount(), this.updateInterval);
        
        // Track this user
        this.trackVisit();
    }
    
    createWidget() {
        const widget = document.createElement('div');
        widget.id = 'sgpi-online';
        widget.innerHTML = `
            <span class="online-dot"></span>
            <span class="online-count">Loading...</span>
            <span class="online-label">online</span>
        `;
        
        // Append to footer or create floating widget
        const footer = document.querySelector('footer');
        if (footer) {
            footer.insertBefore(widget, footer.firstChild);
        } else {
            widget.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 20px;
                z-index: 9000;
            `;
            document.body.appendChild(widget);
        }
        
        this.widget = widget;
        this.countElement = widget.querySelector('.online-count');
        
        this.injectCSS();
    }
    
    injectCSS() {
        const style = document.createElement('style');
        style.textContent = `
            #sgpi-online {
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                background: rgba(0, 0, 0, 0.6);
                padding: 0.5rem 1rem;
                border-radius: 20px;
                border: 1px solid var(--neon-green);
                font-family: 'JetBrains Mono', monospace;
                font-size: 0.85rem;
                backdrop-filter: blur(10px);
            }
            
            .online-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: var(--neon-green);
                box-shadow: 0 0 10px var(--neon-green);
                animation: pulse 2s ease-in-out infinite;
            }
            
            .online-count {
                color: var(--neon-green);
                font-weight: 700;
            }
            
            .online-label {
                color: var(--text-muted);
            }
            
            @keyframes pulse {
                0%, 100% {
                    opacity: 1;
                    transform: scale(1);
                }
                50% {
                    opacity: 0.6;
                    transform: scale(1.1);
                }
            }
            
            @media (max-width: 768px) {
                #sgpi-online {
                    font-size: 0.75rem;
                    padding: 0.4rem 0.8rem;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    updateCount() {
        const count = this.calculateOnline();
        this.countElement.textContent = count;
        
        // Animation
        this.countElement.style.animation = 'none';
        setTimeout(() => {
            this.countElement.style.animation = 'pulse 0.5s ease';
        }, 10);
    }
    
    calculateOnline() {
        // Génère un nombre réaliste basé sur l'heure
        const hour = new Date().getHours();
        
        // Plus d'utilisateurs en soirée (18h-23h)
        let timeFactor = 1;
        if (hour >= 18 && hour <= 23) {
            timeFactor = 1.5;
        } else if (hour >= 0 && hour <= 6) {
            timeFactor = 0.5;
        }
        
        // Ajoute variance aléatoire
        const variance = Math.floor(Math.random() * this.maxVariance);
        const total = Math.floor((this.baseUsers + variance) * timeFactor);
        
        return Math.max(5, total); // Min 5 users
    }
    
    trackVisit() {
        // Track last visit (anonyme, localStorage only)
        const now = Date.now();
        const lastVisit = localStorage.getItem('sgpi-last-visit');
        
        if (!lastVisit || now - parseInt(lastVisit) > 3600000) { // 1 hour
            // Increment total visits
            const visits = parseInt(localStorage.getItem('sgpi-visits') || '0') + 1;
            localStorage.setItem('sgpi-visits', visits);
        }
        
        localStorage.setItem('sgpi-last-visit', now);
    }
    
    getTotalVisits() {
        return parseInt(localStorage.getItem('sgpi-visits') || '0');
    }
}

// Initialize
window.sgpiOnline = new SGPIOnline();

// Expose visit count for console
window.sgpiStats = function() {
    console.log('📊 SGPI Stats:');
    console.log('  Your visits:', window.sgpiOnline.getTotalVisits());
    console.log('  Last visit:', new Date(parseInt(localStorage.getItem('sgpi-last-visit'))));
};
