/**
 * SGPI Terminal - Navigation via commandes
 * Toggle: ~ ou Ctrl+`
 */

class SGPITerminal {
    constructor() {
        this.history = [];
        this.historyIndex = -1;
        this.commands = {
            help: this.cmdHelp.bind(this),
            ls: this.cmdLs.bind(this),
            cd: this.cmdCd.bind(this),
            cat: this.cmdCat.bind(this),
            search: this.cmdSearch.bind(this),
            download: this.cmdDownload.bind(this),
            clear: this.cmdClear.bind(this),
            exit: this.cmdExit.bind(this),
            about: this.cmdAbout.bind(this),
            wiki: this.cmdWiki.bind(this),
            tutos: this.cmdTutos.bind(this)
        };
        
        this.pages = {
            'wiki': '/sgpi/wiki/index.html',
            'tutos': '/sgpi/wiki/tutos.html',
            'projets': '/sgpi/pages/projets.html',
            'about': '/sgpi/pages/about.html',
            'discord': '/sgpi/acces.html',
            'home': '/sgpi/index.html'
        };
        
        this.init();
    }
    
    init() {
        this.createTerminal();
        this.attachEvents();
        this.printWelcome();
    }
    
    createTerminal() {
        const terminal = document.createElement('div');
        terminal.id = 'sgpi-terminal';
        terminal.className = 'terminal-hidden';
        terminal.innerHTML = `
            <div class="terminal-header">
                <span class="terminal-title">SGPI Terminal v1.0</span>
                <button class="terminal-close" onclick="sgpiTerm.toggle()">✕</button>
            </div>
            <div class="terminal-body">
                <div class="terminal-output"></div>
                <div class="terminal-input-line">
                    <span class="terminal-prompt">sgpi@underground:~$</span>
                    <input type="text" class="terminal-input" autocomplete="off" spellcheck="false">
                </div>
            </div>
        `;
        document.body.appendChild(terminal);
        
        this.terminal = terminal;
        this.output = terminal.querySelector('.terminal-output');
        this.input = terminal.querySelector('.terminal-input');
    }
    
    attachEvents() {
        // Toggle terminal avec ~ ou Ctrl+`
        document.addEventListener('keydown', (e) => {
            if (e.key === '_' || e.key === '`' && e.ctrlKey) {
                e.preventDefault();
                this.toggle();
            }
            
            // ESC pour fermer
            if (e.key === 'Escape' && !this.terminal.classList.contains('terminal-hidden')) {
                this.toggle();
            }
        });
        
        // Input handler
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.handleCommand(this.input.value);
                this.input.value = '';
            }
            
            // History navigation
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (this.historyIndex < this.history.length - 1) {
                    this.historyIndex++;
                    this.input.value = this.history[this.history.length - 1 - this.historyIndex] || '';
                }
            }
            
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (this.historyIndex > 0) {
                    this.historyIndex--;
                    this.input.value = this.history[this.history.length - 1 - this.historyIndex] || '';
                } else {
                    this.historyIndex = -1;
                    this.input.value = '';
                }
            }
            
            // Tab autocomplete
            if (e.key === 'Tab') {
                e.preventDefault();
                this.autocomplete();
            }
        });
    }
    
    toggle() {
        this.terminal.classList.toggle('terminal-hidden');
        if (!this.terminal.classList.contains('terminal-hidden')) {
            this.input.focus();
        }
    }
    
    printWelcome() {
        this.print(`
╔═══════════════════════════════════════╗
║   SGPI UNDERGROUND TERMINAL v1.0     ║
║   Type 'help' for available commands  ║
╚═══════════════════════════════════════╝
        `, 'success');
    }
    
    print(text, type = 'normal') {
        const line = document.createElement('div');
        line.className = `terminal-line terminal-${type}`;
        line.textContent = text;
        this.output.appendChild(line);
        this.output.scrollTop = this.output.scrollHeight;
    }
    
    handleCommand(input) {
        if (!input.trim()) return;
        
        // Add to history
        this.history.push(input);
        this.historyIndex = -1;
        
        // Echo command
        this.print(`sgpi@underground:~$ ${input}`, 'command');
        
        // Parse command
        const parts = input.trim().split(' ');
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);
        
        // Execute
        if (this.commands[cmd]) {
            this.commands[cmd](args);
        } else {
            this.print(`Command not found: ${cmd}. Type 'help' for available commands.`, 'error');
        }
    }
    
    // ========== COMMANDS ==========
    
    cmdHelp() {
        this.print(`
Available commands:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  help              Show this message
  ls                List available pages
  cd [page]         Navigate to page
  cat [page]        Show page info
  search [query]    Search in wiki
  download          Download offline package
  wiki              Go to wiki
  tutos             Go to tutorials
  about             About SGPI
  clear             Clear terminal
  exit              Close terminal
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Shortcuts:
  ~  or  Ctrl+`     Toggle terminal
  Tab               Autocomplete
  ↑ ↓               Command history
  ESC               Close terminal
        `, 'info');
    }
    
    cmdLs() {
        this.print('\nAvailable pages:', 'info');
        Object.keys(this.pages).forEach(page => {
            this.print(`  📄 ${page.padEnd(15)} → ${this.pages[page]}`);
        });
        this.print('');
    }
    
    cmdCd(args) {
        if (!args[0]) {
            this.print('Usage: cd [page]', 'error');
            this.print('Try: ls  to see available pages');
            return;
        }
        
        const page = args[0].toLowerCase();
        if (this.pages[page]) {
            this.print(`Navigating to ${page}...`, 'success');
            setTimeout(() => {
                window.location.href = this.pages[page];
            }, 500);
        } else {
            this.print(`Page not found: ${page}`, 'error');
            this.print('Try: ls  to see available pages');
        }
    }
    
    cmdCat(args) {
        if (!args[0]) {
            this.print('Usage: cat [page]', 'error');
            return;
        }
        
        const page = args[0].toLowerCase();
        const info = {
            wiki: 'Wiki SGPI - 14 catégories, 150+ ressources',
            tutos: 'Tutoriels zone grise - Guides détaillés',
            projets: 'Projets de la communauté',
            about: 'À propos de SGPI',
            discord: 'Rejoindre le Discord SGPI'
        };
        
        if (info[page]) {
            this.print(info[page], 'success');
        } else {
            this.print(`No info for: ${page}`, 'error');
        }
    }
    
    cmdSearch(args) {
        if (!args[0]) {
            this.print('Usage: search [query]', 'error');
            return;
        }
        
        const query = args.join(' ');
        this.print(`Searching for: ${query}...`, 'info');
        
        // Redirect to wiki with search
        setTimeout(() => {
            window.location.href = `/sgpi/wiki/index.html?search=${encodeURIComponent(query)}`;
        }, 500);
    }
    
    cmdDownload() {
        this.print('Generating offline package...', 'info');
        this.print('⏳ Collecting wiki markdown files...', 'success');
        this.print('⏳ Collecting tutorial files...', 'success');
        this.print('⏳ Packaging scripts...', 'success');
        
        setTimeout(() => {
            this.print('✅ Package ready!', 'success');
            this.print('Redirecting to download page...', 'info');
            setTimeout(() => {
                window.location.href = '/sgpi/offline-package/index.html';
            }, 1000);
        }, 2000);
    }
    
    cmdClear() {
        this.output.innerHTML = '';
        this.printWelcome();
    }
    
    cmdExit() {
        this.print('Closing terminal...', 'info');
        setTimeout(() => this.toggle(), 500);
    }
    
    cmdAbout() {
        this.print(`
╔═══════════════════════════════════════╗
║           SGPI UNDERGROUND            ║
╠═══════════════════════════════════════╣
║  Communauté Tech Underground          ║
║  Wiki • Tutos • Ressources            ║
║  Zone Grise assumée                   ║
║                                       ║
║  📚 150+ ressources                   ║
║  📖 60+ tutoriels                     ║
║  👥 Communauté active                 ║
╚═══════════════════════════════════════╝
        `, 'success');
    }
    
    cmdWiki() {
        this.cmdCd(['wiki']);
    }
    
    cmdTutos() {
        this.cmdCd(['tutos']);
    }
    
    autocomplete() {
        const input = this.input.value.toLowerCase();
        const matches = Object.keys(this.commands).filter(cmd => cmd.startsWith(input));
        
        if (matches.length === 1) {
            this.input.value = matches[0];
        } else if (matches.length > 1) {
            this.print('\nPossible commands:');
            matches.forEach(cmd => this.print(`  ${cmd}`));
            this.print('');
        }
    }
}

// CSS pour le terminal (à ajouter dans sgpi-style.css ou inline)
const terminalCSS = `
#sgpi-terminal {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 400px;
    background: rgba(0, 0, 0, 0.95);
    border-top: 2px solid var(--neon-green);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    font-family: 'JetBrains Mono', 'Courier New', monospace;
    transition: transform 0.3s ease;
}

#sgpi-terminal.terminal-hidden {
    transform: translateY(100%);
}

.terminal-header {
    background: var(--bg-tertiary);
    padding: 0.5rem 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--neon-green);
}

.terminal-title {
    color: var(--neon-green);
    font-weight: 700;
    font-size: 0.9rem;
}

.terminal-close {
    background: none;
    border: none;
    color: var(--neon-green);
    cursor: pointer;
    font-size: 1.2rem;
    padding: 0 0.5rem;
    transition: color 0.2s;
}

.terminal-close:hover {
    color: #ff3366;
}

.terminal-body {
    flex: 1;
    padding: 1rem;
    overflow-y: auto;
    color: var(--neon-green);
}

.terminal-output {
    margin-bottom: 1rem;
}

.terminal-line {
    margin: 0.25rem 0;
    white-space: pre-wrap;
    font-size: 0.9rem;
}

.terminal-command {
    color: var(--neon-cyan);
}

.terminal-error {
    color: #ff3366;
}

.terminal-success {
    color: var(--neon-green);
}

.terminal-info {
    color: var(--neon-cyan);
}

.terminal-input-line {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

.terminal-prompt {
    color: var(--neon-green);
    font-weight: 700;
}

.terminal-input {
    flex: 1;
    background: none;
    border: none;
    color: var(--neon-green);
    font-family: inherit;
    font-size: 0.9rem;
    outline: none;
}

@media (max-width: 768px) {
    #sgpi-terminal {
        height: 50vh;
    }
}
`;

// Inject CSS
const style = document.createElement('style');
style.textContent = terminalCSS;
document.head.appendChild(style);

// Initialize terminal
window.sgpiTerm = new SGPITerminal();

// Show hint on first load
if (!localStorage.getItem('sgpi-terminal-hint-shown')) {
    setTimeout(() => {
        const hint = document.createElement('div');
        hint.className = 'terminal-hint';
        hint.innerHTML = '💡 Press <kbd>~</kbd> to open terminal';
        hint.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--bg-secondary);
            color: var(--neon-green);
            padding: 1rem 1.5rem;
            border-radius: 8px;
            border: 1px solid var(--neon-green);
            z-index: 9998;
            animation: fadeIn 0.5s ease;
            font-family: 'JetBrains Mono', monospace;
        `;
        document.body.appendChild(hint);
        
        setTimeout(() => {
            hint.style.animation = 'fadeOut 0.5s ease';
            setTimeout(() => hint.remove(), 500);
        }, 5000);
        
        localStorage.setItem('sgpi-terminal-hint-shown', 'true');
    }, 2000);
}
