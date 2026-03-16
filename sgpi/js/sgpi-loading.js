/**
 * SGPI Loading Screen - Hacker Style (FIXED)
 * Loading prend TOUT l'écran
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
        
        this.injectCSS();
        this.create();
        this.start();
    }
    
    injectCSS() {
        const style = document.createElement('style');
        style.id = 'sgpi-loader-style';
        style.textContent = `
            /* Loading Screen - FULL SCREEN */
            .sgpi-loading-screen {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                background: #000000 !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                z-index: 99999 !important;
                transition: opacity 0.5s ease;
            }
            
            .sgpi-loading-screen.hidden {
                opacity: 0;
                pointer-events: none;
            }
            
            .loader-content {
                text-align: center;
                max-width: 600px;
                width: 90%;
            }
            
            .loader-logo h1 {
                font-family: 'Orbitron', monospace;
                color: #00ff88;
                font-size: 3rem;
                margin-bottom: 2rem;
                text-transform: uppercase;
                letter-spacing: 4px;
            }
            
            .loader-logs {
                background: rgba(0, 0, 0, 0.8);
                border: 1px solid #00ff88;
                border-radius: 4px;
                padding: 1rem;
                height: 200px;
                overflow-y: auto;
                margin-bottom: 2rem;
                text-align: left;
                font-family: 'JetBrains Mono', 'Courier New', monospace;
            }
            
            #loader-log-output {
                color: #00ff88;
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
                color: #00d4ff;
            }
            
            .log-success {
                color: #00ff88;
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
                background: #00ff88;
                width: 0%;
                transition: width 0.3s ease;
                box-shadow: 0 0 10px #00ff88;
            }
            
            .progress-text {
                display: flex;
                justify-content: space-between;
                font-family: 'JetBrains Mono', monospace;
                font-size: 0.85rem;
                color: #666;
            }
            
            #loader-percent {
                color: #00ff88;
                font-weight: 700;
            }
            
            @keyframes fadeIn {
                to { opacity: 1; }
            }
            
            /* Mobile */
            @media (max-width: 768px) {
                .loader-logo h1 {
                    font-size: 2rem;
                }
                
                .loader-logs {
                    height: 150px;
                    font-size: 0.8rem;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    create() {
        const loader = document.createElement('div');
        loader.id = 'sgpi-loader';
        loader.className = 'sgpi-loading-screen';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-logo">
                    <h1>SGPI</h1>
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
                // Cleanup CSS
                const style = document.getElementById('sgpi-loader-style');
                if (style) style.remove();
            }, 500);
        }, 800);
    }
}

// Auto-initialize on page load
window.addEventListener('load', () => {
    new SGPILoader();
});
