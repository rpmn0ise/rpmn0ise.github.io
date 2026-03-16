/**
 * SGPI Loading Screen - Hacker Style
 * Uses existing SGPI CSS classes
 */

class SGPILoader {
    constructor() {
        this.logs = [
            'Initializing SGPI Underground...',
            'Connecting to secure server...',
            'Establishing encrypted connection...',
            'Loading wiki database...',
            'Decrypting resources...',
            'Verifying integrity...',
            'Loading tutorials...',
            'Configuring terminal...',
            'Checking VPN status...',
            'Access granted.'
        ];
        
        this.currentLog = 0;
        this.progress = 0;
        
        this.create();
        this.start();
    }
    
    create() {
        const loader = document.createElement('div');
        loader.id = 'sgpi-loader';
        loader.className = 'loading-screen'; // Use existing SGPI class
        loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-logo">
                    <h1 style="font-family: 'Orbitron', monospace; color: var(--neon-green); font-size: 3rem; margin-bottom: 2rem;">
                        SGPI
                    </h1>
                </div>
                
                <div class="loader-logs">
                    <div id="loader-log-output"></div>
                </div>
                
                <div class="loader-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" id="loader-progress"></div>
                    </div>
                    <div class="progress-text">
                        <span id="loader-percent">0%</span>
                        <span id="loader-status">Initializing...</span>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(loader);
        this.loader = loader;
        this.logOutput = document.getElementById('loader-log-output');
        this.progressBar = document.getElementById('loader-progress');
        this.percentText = document.getElementById('loader-percent');
        this.statusText = document.getElementById('loader-status');
        
        this.injectCSS();
    }
    
    injectCSS() {
        const style = document.createElement('style');
        style.textContent = `
            .loader-content {
                text-align: center;
                max-width: 600px;
            }
            
            .loader-logs {
                background: rgba(0, 0, 0, 0.8);
                border: 1px solid var(--neon-green);
                border-radius: 4px;
                padding: 1rem;
                height: 200px;
                overflow-y: auto;
                margin-bottom: 2rem;
                text-align: left;
                font-family: 'JetBrains Mono', 'Courier New', monospace;
            }
            
            #loader-log-output {
                color: var(--neon-green);
                font-size: 0.9rem;
                line-height: 1.6;
            }
            
            .log-line {
                margin: 0.25rem 0;
                opacity: 0;
                animation: fadeIn 0.3s ease forwards;
            }
            
            .log-line::before {
                content: '> ';
                color: var(--neon-cyan);
            }
            
            .log-success {
                color: var(--neon-green);
            }
            
            .log-success::after {
                content: ' ✓';
            }
            
            .progress-bar {
                width: 100%;
                height: 4px;
                background: rgba(0, 255, 136, 0.1);
                border-radius: 2px;
                overflow: hidden;
                margin-bottom: 0.5rem;
            }
            
            .progress-fill {
                height: 100%;
                background: var(--neon-green);
                width: 0%;
                transition: width 0.3s ease;
                box-shadow: 0 0 10px var(--neon-green);
            }
            
            .progress-text {
                display: flex;
                justify-content: space-between;
                font-family: 'JetBrains Mono', monospace;
                font-size: 0.85rem;
                color: var(--text-muted);
            }
            
            #loader-percent {
                color: var(--neon-green);
                font-weight: 700;
            }
            
            @keyframes fadeIn {
                to { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    start() {
        this.logInterval = setInterval(() => {
            if (this.currentLog < this.logs.length) {
                this.addLog(this.logs[this.currentLog]);
                this.currentLog++;
                this.updateProgress();
            } else {
                this.complete();
            }
        }, 400);
    }
    
    addLog(text) {
        const line = document.createElement('div');
        line.className = this.currentLog === this.logs.length - 1 ? 'log-line log-success' : 'log-line';
        line.textContent = text;
        this.logOutput.appendChild(line);
        this.logOutput.scrollTop = this.logOutput.scrollHeight;
    }
    
    updateProgress() {
        this.progress = Math.min(100, (this.currentLog / this.logs.length) * 100);
        this.progressBar.style.width = this.progress + '%';
        this.percentText.textContent = Math.floor(this.progress) + '%';
        this.statusText.textContent = this.logs[this.currentLog - 1] || 'Loading...';
    }
    
    complete() {
        clearInterval(this.logInterval);
        
        setTimeout(() => {
            this.loader.classList.add('hidden');
            setTimeout(() => {
                this.loader.remove();
            }, 500);
        }, 800);
    }
}

// Auto-initialize on page load
window.addEventListener('load', () => {
    new SGPILoader();
});
