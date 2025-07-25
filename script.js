class BinaryOS {
    constructor() {
        this.windows = [];
        this.windowZIndex = 1000;
        this.startMenuActive = false;
        this.calculator = {
            display: '0',
            operator: null,
            previousValue: null,
            waitingForOperand: false
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateTime();
        this.bootSequence();
        setInterval(() => this.updateTime(), 1000);
    }

    bootSequence() {
        setTimeout(() => {
            document.querySelector('.boot-screen').classList.add('hidden');
        }, 3000);
    }

    setupEventListeners() {
        // Start menu toggle
        document.querySelector('.start-menu-button').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleStartMenu();
        });

        // Desktop icon clicks
        document.querySelectorAll('.desktop-icon').forEach(icon => {
            icon.addEventListener('dblclick', () => {
                const app = icon.dataset.app;
                this.openApplication(app);
            });
        });

        // Start menu app clicks
        document.querySelectorAll('.start-app').forEach(app => {
            app.addEventListener('click', () => {
                if (app.dataset.app) {
                    this.openApplication(app.dataset.app);
                    this.toggleStartMenu();
                } else if (app.dataset.action) {
                    this.handleSystemAction(app.dataset.action);
                }
            });
        });

        // Close start menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.start-menu') && !e.target.closest('.start-menu-button')) {
                if (this.startMenuActive) {
                    this.toggleStartMenu();
                }
            }
        });

        // Window management
        document.addEventListener('mousedown', (e) => {
            if (e.target.closest('.window')) {
                this.bringWindowToFront(e.target.closest('.window'));
            }
        });
    }

    toggleStartMenu() {
        const startMenu = document.querySelector('.start-menu');
        this.startMenuActive = !this.startMenuActive;
        startMenu.classList.toggle('active', this.startMenuActive);
    }

    updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const dateString = now.toLocaleDateString([], { month: 'short', day: 'numeric' });
        
        document.querySelector('.system-time .time').textContent = timeString;
        document.querySelector('.system-time .date').textContent = dateString;
    }

    openApplication(appName) {
        const windowId = `window-${Date.now()}`;
        const window = this.createWindow(windowId, appName);
        document.querySelector('.windows-container').appendChild(window);
        this.windows.push({ id: windowId, element: window, app: appName });
        this.addToTaskbar(windowId, appName);
        this.setupWindowControls(window);
        this.makeWindowDraggable(window);
        this.bringWindowToFront(window);
    }

    createWindow(id, appName) {
        const window = document.createElement('div');
        window.className = 'window';
        window.id = id;
        window.style.left = Math.random() * 200 + 100 + 'px';
        window.style.top = Math.random() * 100 + 50 + 'px';
        window.style.width = '600px';
        window.style.height = '400px';

        const appInfo = this.getAppInfo(appName);
        
        window.innerHTML = `
            <div class="window-header">
                <div class="window-title">
                    <i class="${appInfo.icon}"></i>
                    <span>${appInfo.title}</span>
                </div>
                <div class="window-controls">
                    <div class="window-control minimize" data-action="minimize">−</div>
                    <div class="window-control maximize" data-action="maximize">□</div>
                    <div class="window-control close" data-action="close">×</div>
                </div>
            </div>
            <div class="window-content">
                ${this.getAppContent(appName)}
            </div>
        `;

        return window;
    }

    getAppInfo(appName) {
        const apps = {
            'terminal': { title: 'Terminal', icon: 'fas fa-terminal' },
            'file-manager': { title: 'File Manager', icon: 'fas fa-folder' },
            'text-editor': { title: 'Text Editor', icon: 'fas fa-edit' },
            'calculator': { title: 'Calculator', icon: 'fas fa-calculator' },
            'browser': { title: 'Web Browser', icon: 'fas fa-globe' },
            'settings': { title: 'Settings', icon: 'fas fa-cog' }
        };
        return apps[appName] || { title: 'Application', icon: 'fas fa-window-maximize' };
    }

    getAppContent(appName) {
        switch (appName) {
            case 'terminal':
                return this.createTerminalContent();
            case 'file-manager':
                return this.createFileManagerContent();
            case 'text-editor':
                return this.createTextEditorContent();
            case 'calculator':
                return this.createCalculatorContent();
            case 'browser':
                return this.createBrowserContent();
            case 'settings':
                return this.createSettingsContent();
            default:
                return '<p>Application content would go here.</p>';
        }
    }

    createTerminalContent() {
        setTimeout(() => {
            this.initTerminal();
        }, 100);
        
        return `
            <div class="terminal-content" id="terminal-content">
                <div class="terminal-line"><span class="terminal-prompt">user@binary-os:~$</span> Welcome to Binary OS Terminal</div>
                <div class="terminal-line"><span class="terminal-prompt">user@binary-os:~$</span> Type 'help' for available commands</div>
                <div class="terminal-line"><span class="terminal-prompt">user@binary-os:~$</span> <span class="terminal-cursor">|</span></div>
            </div>
        `;
    }

    createFileManagerContent() {
        return `
            <div class="file-manager-content">
                <div class="file-sidebar">
                    <h3>Quick Access</h3>
                    <div class="file-item">
                        <i class="fas fa-home"></i>
                        <span>Home</span>
                    </div>
                    <div class="file-item">
                        <i class="fas fa-desktop"></i>
                        <span>Desktop</span>
                    </div>
                    <div class="file-item">
                        <i class="fas fa-download"></i>
                        <span>Downloads</span>
                    </div>
                    <div class="file-item">
                        <i class="fas fa-file-alt"></i>
                        <span>Documents</span>
                    </div>
                    <div class="file-item">
                        <i class="fas fa-images"></i>
                        <span>Pictures</span>
                    </div>
                </div>
                <div class="file-main">
                    <h3>Home Directory</h3>
                    <div class="file-item">
                        <i class="fas fa-folder"></i>
                        <span>Documents</span>
                    </div>
                    <div class="file-item">
                        <i class="fas fa-folder"></i>
                        <span>Downloads</span>
                    </div>
                    <div class="file-item">
                        <i class="fas fa-folder"></i>
                        <span>Pictures</span>
                    </div>
                    <div class="file-item">
                        <i class="fas fa-file-alt"></i>
                        <span>readme.txt</span>
                    </div>
                    <div class="file-item">
                        <i class="fas fa-file-code"></i>
                        <span>script.js</span>
                    </div>
                </div>
            </div>
        `;
    }

    createTextEditorContent() {
        return `
            <div style="height: 100%; display: flex; flex-direction: column;">
                <div style="background: #f0f0f0; padding: 10px; border-bottom: 1px solid #ddd;">
                    <button onclick="this.nextElementSibling.click()" style="margin-right: 10px; padding: 5px 15px; background: #007acc; color: white; border: none; border-radius: 3px; cursor: pointer;">New</button>
                    <input type="file" style="display: none;" accept=".txt,.js,.html,.css">
                    <button style="margin-right: 10px; padding: 5px 15px; background: #28a745; color: white; border: none; border-radius: 3px; cursor: pointer;">Save</button>
                    <button style="padding: 5px 15px; background: #17a2b8; color: white; border: none; border-radius: 3px; cursor: pointer;">Save As</button>
                </div>
                <textarea style="flex: 1; border: none; padding: 15px; font-family: 'Courier New', monospace; font-size: 14px; resize: none; outline: none;" placeholder="Start typing your code or text here...">// Welcome to Binary OS Text Editor
// This is a simple text editor application

function helloWorld() {
    console.log("Hello from Binary OS!");
}</textarea>
            </div>
        `;
    }

    createCalculatorContent() {
        setTimeout(() => {
            this.initCalculator();
        }, 100);
        
        return `
            <div class="calculator-content">
                <div class="calc-display" id="calc-display">0</div>
                <div class="calc-buttons">
                    <button class="calc-button" onclick="binaryOS.clearCalculator()">C</button>
                    <button class="calc-button" onclick="binaryOS.inputCalculator('±')">±</button>
                    <button class="calc-button" onclick="binaryOS.inputCalculator('%')">%</button>
                    <button class="calc-button operator" onclick="binaryOS.inputCalculator('÷')">÷</button>
                    
                    <button class="calc-button" onclick="binaryOS.inputCalculator('7')">7</button>
                    <button class="calc-button" onclick="binaryOS.inputCalculator('8')">8</button>
                    <button class="calc-button" onclick="binaryOS.inputCalculator('9')">9</button>
                    <button class="calc-button operator" onclick="binaryOS.inputCalculator('×')">×</button>
                    
                    <button class="calc-button" onclick="binaryOS.inputCalculator('4')">4</button>
                    <button class="calc-button" onclick="binaryOS.inputCalculator('5')">5</button>
                    <button class="calc-button" onclick="binaryOS.inputCalculator('6')">6</button>
                    <button class="calc-button operator" onclick="binaryOS.inputCalculator('−')">−</button>
                    
                    <button class="calc-button" onclick="binaryOS.inputCalculator('1')">1</button>
                    <button class="calc-button" onclick="binaryOS.inputCalculator('2')">2</button>
                    <button class="calc-button" onclick="binaryOS.inputCalculator('3')">3</button>
                    <button class="calc-button operator" onclick="binaryOS.inputCalculator('+')">+</button>
                    
                    <button class="calc-button" onclick="binaryOS.inputCalculator('0')" style="grid-column: span 2;">0</button>
                    <button class="calc-button" onclick="binaryOS.inputCalculator('.')">.</button>
                    <button class="calc-button operator" onclick="binaryOS.calculateResult()">=</button>
                </div>
            </div>
        `;
    }

    createBrowserContent() {
        return `
            <div style="height: 100%; display: flex; flex-direction: column;">
                <div style="background: #f0f0f0; padding: 10px; border-bottom: 1px solid #ddd; display: flex; gap: 10px; align-items: center;">
                    <button style="padding: 5px 10px; background: #6c757d; color: white; border: none; border-radius: 3px;">←</button>
                    <button style="padding: 5px 10px; background: #6c757d; color: white; border: none; border-radius: 3px;">→</button>
                    <button style="padding: 5px 10px; background: #28a745; color: white; border: none; border-radius: 3px;">⟳</button>
                    <input type="text" value="https://binary-os.local" style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 3px;">
                    <button style="padding: 5px 15px; background: #007acc; color: white; border: none; border-radius: 3px;">Go</button>
                </div>
                <div style="flex: 1; padding: 20px; background: white;">
                    <h1 style="color: #667eea; margin-bottom: 20px;">Welcome to Binary OS Browser</h1>
                    <p style="margin-bottom: 15px;">This is a simulated web browser running inside Binary OS.</p>
                    <h2 style="color: #333; margin-bottom: 15px;">Features:</h2>
                    <ul style="margin-left: 20px; line-height: 1.6;">
                        <li>Address bar navigation</li>
                        <li>Back/Forward buttons</li>
                        <li>Refresh functionality</li>
                        <li>Modern web standards support</li>
                    </ul>
                    <br>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #667eea;">
                        <strong>Binary OS Browser v1.0</strong><br>
                        Built with modern web technologies for the Binary operating system.
                    </div>
                </div>
            </div>
        `;
    }

    createSettingsContent() {
        return `
            <div style="height: 100%; display: flex;">
                <div style="width: 200px; background: #f8f9fa; border-right: 1px solid #ddd; padding: 15px;">
                    <h3 style="margin-bottom: 15px; color: #333;">Settings</h3>
                    <div style="margin-bottom: 10px; padding: 8px; cursor: pointer; border-radius: 4px;" onmouseover="this.style.background='#e9ecef'" onmouseout="this.style.background='transparent'">
                        <i class="fas fa-desktop" style="margin-right: 8px;"></i>Display
                    </div>
                    <div style="margin-bottom: 10px; padding: 8px; cursor: pointer; border-radius: 4px;" onmouseover="this.style.background='#e9ecef'" onmouseout="this.style.background='transparent'">
                        <i class="fas fa-volume-up" style="margin-right: 8px;"></i>Sound
                    </div>
                    <div style="margin-bottom: 10px; padding: 8px; cursor: pointer; border-radius: 4px;" onmouseover="this.style.background='#e9ecef'" onmouseout="this.style.background='transparent'">
                        <i class="fas fa-wifi" style="margin-right: 8px;"></i>Network
                    </div>
                    <div style="margin-bottom: 10px; padding: 8px; cursor: pointer; border-radius: 4px;" onmouseover="this.style.background='#e9ecef'" onmouseout="this.style.background='transparent'">
                        <i class="fas fa-user" style="margin-right: 8px;"></i>Accounts
                    </div>
                    <div style="margin-bottom: 10px; padding: 8px; cursor: pointer; border-radius: 4px;" onmouseover="this.style.background='#e9ecef'" onmouseout="this.style.background='transparent'">
                        <i class="fas fa-shield-alt" style="margin-right: 8px;"></i>Security
                    </div>
                </div>
                <div style="flex: 1; padding: 20px;">
                    <h2 style="margin-bottom: 20px; color: #333;">Display Settings</h2>
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600;">Resolution:</label>
                        <select style="padding: 8px; border: 1px solid #ddd; border-radius: 4px; width: 200px;">
                            <option>1920 x 1080 (Recommended)</option>
                            <option>1680 x 1050</option>
                            <option>1440 x 900</option>
                            <option>1280 x 720</option>
                        </select>
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600;">Brightness:</label>
                        <input type="range" min="0" max="100" value="80" style="width: 200px;">
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label style="display: flex; align-items: center; gap: 8px;">
                            <input type="checkbox" checked>
                            <span>Enable dark mode</span>
                        </label>
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label style="display: flex; align-items: center; gap: 8px;">
                            <input type="checkbox">
                            <span>Show desktop icons</span>
                        </label>
                    </div>
                    <button style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;">Apply Changes</button>
                </div>
            </div>
        `;
    }

    initTerminal() {
        const terminal = document.getElementById('terminal-content');
        if (!terminal) return;

        let currentInput = '';
        const commands = {
            'help': 'Available commands: help, clear, ls, pwd, whoami, date, echo, neofetch',
            'clear': () => {
                terminal.innerHTML = '<div class="terminal-line"><span class="terminal-prompt">user@binary-os:~$</span> <span class="terminal-cursor">|</span></div>';
                return '';
            },
            'ls': 'Documents  Downloads  Pictures  Music  Videos  Desktop',
            'pwd': '/home/user',
            'whoami': 'user',
            'date': () => new Date().toString(),
            'neofetch': `
                Binary OS 1.0
                Kernel: Linux 5.15.0
                Uptime: 2 hours, 14 minutes
                Shell: bash 5.1.8
                Terminal: Binary Terminal
                CPU: Intel i7-12700K
                Memory: 16GB DDR4
            `
        };

        document.addEventListener('keydown', (e) => {
            if (!terminal.contains(document.activeElement) && 
                terminal.closest('.window') && 
                !terminal.closest('.window').classList.contains('minimized')) {
                
                if (e.key === 'Enter') {
                    const output = this.executeCommand(currentInput.trim(), commands);
                    this.addTerminalLine(terminal, `user@binary-os:~$ ${currentInput}`);
                    if (output) {
                        this.addTerminalLine(terminal, output);
                    }
                    currentInput = '';
                    this.addTerminalLine(terminal, 'user@binary-os:~$ ', true);
                } else if (e.key === 'Backspace') {
                    currentInput = currentInput.slice(0, -1);
                    this.updateTerminalCursor(terminal, currentInput);
                } else if (e.key.length === 1) {
                    currentInput += e.key;
                    this.updateTerminalCursor(terminal, currentInput);
                }
            }
        });
    }

    executeCommand(command, commands) {
        if (command.startsWith('echo ')) {
            return command.substring(5);
        }
        
        const cmd = commands[command];
        if (typeof cmd === 'function') {
            return cmd();
        }
        return cmd || `Command not found: ${command}`;
    }

    addTerminalLine(terminal, text, isCursor = false) {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        if (isCursor) {
            line.innerHTML = `<span class="terminal-prompt">${text}</span><span class="terminal-cursor">|</span>`;
        } else {
            line.textContent = text;
        }
        
        // Remove old cursor
        const oldCursor = terminal.querySelector('.terminal-cursor');
        if (oldCursor) {
            oldCursor.parentElement.remove();
        }
        
        terminal.appendChild(line);
        terminal.scrollTop = terminal.scrollHeight;
    }

    updateTerminalCursor(terminal, input) {
        const cursorLine = terminal.querySelector('.terminal-cursor');
        if (cursorLine) {
            cursorLine.parentElement.innerHTML = `<span class="terminal-prompt">user@binary-os:~$</span> ${input}<span class="terminal-cursor">|</span>`;
        }
    }

    initCalculator() {
        this.calculator = {
            display: '0',
            operator: null,
            previousValue: null,
            waitingForOperand: false
        };
        this.updateCalculatorDisplay();
    }

    inputCalculator(value) {
        const { display, operator, previousValue, waitingForOperand } = this.calculator;

        if (/\d/.test(value)) {
            if (waitingForOperand) {
                this.calculator.display = String(value);
                this.calculator.waitingForOperand = false;
            } else {
                this.calculator.display = display === '0' ? String(value) : display + value;
            }
        } else if (value === '.') {
            if (display.indexOf('.') === -1) {
                this.calculator.display = display + value;
            }
        } else if (value === '±') {
            this.calculator.display = String(parseFloat(display) * -1);
        } else if (value === '%') {
            this.calculator.display = String(parseFloat(display) / 100);
        } else if (['+', '−', '×', '÷'].includes(value)) {
            if (previousValue === null) {
                this.calculator.previousValue = parseFloat(display);
            } else if (operator) {
                const result = this.performCalculation();
                this.calculator.display = String(result);
                this.calculator.previousValue = result;
            }
            this.calculator.waitingForOperand = true;
            this.calculator.operator = value;
        }

        this.updateCalculatorDisplay();
    }

    performCalculation() {
        const { display, operator, previousValue } = this.calculator;
        const current = parseFloat(display);
        const prev = previousValue;

        switch (operator) {
            case '+': return prev + current;
            case '−': return prev - current;
            case '×': return prev * current;
            case '÷': return prev / current;
            default: return current;
        }
    }

    calculateResult() {
        const { display, operator, previousValue } = this.calculator;
        
        if (previousValue !== null && operator) {
            const result = this.performCalculation();
            this.calculator.display = String(result);
            this.calculator.previousValue = null;
            this.calculator.operator = null;
            this.calculator.waitingForOperand = true;
            this.updateCalculatorDisplay();
        }
    }

    clearCalculator() {
        this.calculator = {
            display: '0',
            operator: null,
            previousValue: null,
            waitingForOperand: false
        };
        this.updateCalculatorDisplay();
    }

    updateCalculatorDisplay() {
        const display = document.getElementById('calc-display');
        if (display) {
            display.textContent = this.calculator.display;
        }
    }

    setupWindowControls(window) {
        const controls = window.querySelectorAll('.window-control');
        controls.forEach(control => {
            control.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = control.dataset.action;
                const windowId = window.id;
                
                switch (action) {
                    case 'close':
                        this.closeWindow(windowId);
                        break;
                    case 'minimize':
                        this.minimizeWindow(windowId);
                        break;
                    case 'maximize':
                        this.maximizeWindow(windowId);
                        break;
                }
            });
        });
    }

    makeWindowDraggable(window) {
        const header = window.querySelector('.window-header');
        let isDragging = false;
        let startX, startY, initialX, initialY;

        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('.window-control')) return;
            
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            initialX = window.offsetLeft;
            initialY = window.offsetTop;
            
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        });

        function handleMouseMove(e) {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            window.style.left = initialX + deltaX + 'px';
            window.style.top = Math.max(0, initialY + deltaY) + 'px';
        }

        function handleMouseUp() {
            isDragging = false;
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }
    }

    bringWindowToFront(window) {
        this.windowZIndex++;
        window.style.zIndex = this.windowZIndex;
        
        // Update taskbar
        document.querySelectorAll('.taskbar-app').forEach(app => app.classList.remove('active'));
        const taskbarApp = document.querySelector(`[data-window="${window.id}"]`);
        if (taskbarApp) {
            taskbarApp.classList.add('active');
        }
    }

    closeWindow(windowId) {
        const windowElement = document.getElementById(windowId);
        const windowData = this.windows.find(w => w.id === windowId);
        
        if (windowElement) {
            windowElement.remove();
        }
        
        this.windows = this.windows.filter(w => w.id !== windowId);
        this.removeFromTaskbar(windowId);
    }

    minimizeWindow(windowId) {
        const windowElement = document.getElementById(windowId);
        if (windowElement) {
            windowElement.classList.add('minimized');
        }
    }

    maximizeWindow(windowId) {
        const windowElement = document.getElementById(windowId);
        if (windowElement) {
            windowElement.classList.toggle('maximized');
        }
    }

    addToTaskbar(windowId, appName) {
        const taskbarApps = document.querySelector('.taskbar-apps');
        const appInfo = this.getAppInfo(appName);
        
        const taskbarApp = document.createElement('div');
        taskbarApp.className = 'taskbar-app active';
        taskbarApp.dataset.window = windowId;
        taskbarApp.innerHTML = `
            <i class="${appInfo.icon}"></i>
            <span>${appInfo.title}</span>
        `;
        
        taskbarApp.addEventListener('click', () => {
            const windowElement = document.getElementById(windowId);
            if (windowElement.classList.contains('minimized')) {
                windowElement.classList.remove('minimized');
                this.bringWindowToFront(windowElement);
            } else {
                this.minimizeWindow(windowId);
            }
        });
        
        taskbarApps.appendChild(taskbarApp);
    }

    removeFromTaskbar(windowId) {
        const taskbarApp = document.querySelector(`[data-window="${windowId}"]`);
        if (taskbarApp) {
            taskbarApp.remove();
        }
    }

    handleSystemAction(action) {
        switch (action) {
            case 'shutdown':
                this.showShutdownScreen();
                break;
            case 'restart':
                this.showRestartScreen();
                break;
            case 'logout':
                this.showLogoutScreen();
                break;
        }
    }

    showShutdownScreen() {
        const bootScreen = document.querySelector('.boot-screen');
        bootScreen.classList.remove('hidden');
        bootScreen.querySelector('h1').textContent = 'Shutting Down...';
        bootScreen.querySelector('p').textContent = 'Binary OS is shutting down safely.';
        
        setTimeout(() => {
            document.body.style.background = '#000';
            bootScreen.style.display = 'none';
        }, 3000);
    }

    showRestartScreen() {
        const bootScreen = document.querySelector('.boot-screen');
        bootScreen.classList.remove('hidden');
        bootScreen.querySelector('h1').textContent = 'Restarting...';
        bootScreen.querySelector('p').textContent = 'Binary OS is restarting.';
        
        setTimeout(() => {
            location.reload();
        }, 3000);
    }

    showLogoutScreen() {
        const bootScreen = document.querySelector('.boot-screen');
        bootScreen.classList.remove('hidden');
        bootScreen.querySelector('h1').textContent = 'Logging Out...';
        bootScreen.querySelector('p').textContent = 'Saving your session and logging out.';
        
        setTimeout(() => {
            this.windows.forEach(window => this.closeWindow(window.id));
            bootScreen.classList.add('hidden');
        }, 2000);
    }
}

// Initialize Binary OS
const binaryOS = new BinaryOS();

// Make it globally accessible for calculator
window.binaryOS = binaryOS;