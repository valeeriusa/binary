class JobOS {
    constructor() {
        this.windows = [];
        this.windowZIndex = 1000;
        this.startMenuActive = false;
        this.jobData = [];
        this.userProfile = {
            name: 'Ion Popescu',
            email: 'ion.popescu@email.com',
            phone: '+40 123 456 789',
            location: 'București, România',
            experience: '5+ ani',
            skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL']
        };
        
        this.init();
        this.loadJobData();
    }

    init() {
        this.setupEventListeners();
        this.updateTime();
        this.bootSequence();
        setInterval(() => this.updateTime(), 1000);
    }

    bootSequence() {
        // Simulate loading job data
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        
        const loadingSteps = [
            'Loading job opportunities...',
            'Connecting to employers...',
            'Preparing your dashboard...',
            'Almost ready...'
        ];
        
        let step = 0;
        const stepInterval = setInterval(() => {
            if (step < loadingSteps.length) {
                progressText.textContent = loadingSteps[step];
                step++;
            } else {
                clearInterval(stepInterval);
                setTimeout(() => {
                    document.querySelector('.boot-screen').classList.add('hidden');
                }, 500);
            }
        }, 750);
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
            'job-search': { title: 'Căutare Job', icon: 'fas fa-search' },
            'my-jobs': { title: 'Job-urile Mele', icon: 'fas fa-briefcase' },
            'cv-builder': { title: 'CV Builder', icon: 'fas fa-file-alt' },
            'companies': { title: 'Companii', icon: 'fas fa-building' },
            'interviews': { title: 'Interviuri', icon: 'fas fa-calendar-check' },
            'profile': { title: 'Profilul Meu', icon: 'fas fa-user' },
            'notifications': { title: 'Notificări', icon: 'fas fa-bell' },
            'salary-calculator': { title: 'Calculator Salariu', icon: 'fas fa-calculator' },
            'skills-test': { title: 'Test Competențe', icon: 'fas fa-graduation-cap' },
            'saved-jobs': { title: 'Job-uri Salvate', icon: 'fas fa-heart' },
            'career-path': { title: 'Traseul Carierei', icon: 'fas fa-route' },
            'settings': { title: 'Setări', icon: 'fas fa-cog' }
        };
        return apps[appName] || { title: 'Aplicație', icon: 'fas fa-window-maximize' };
    }

    getAppContent(appName) {
        switch (appName) {
            case 'job-search':
                return this.createJobSearchContent();
            case 'my-jobs':
                return this.createMyJobsContent();
            case 'cv-builder':
                return this.createCVBuilderContent();
            case 'companies':
                return this.createCompaniesContent();
            case 'interviews':
                return this.createInterviewsContent();
            case 'profile':
                return this.createProfileContent();
            case 'notifications':
                return this.createNotificationsContent();
            case 'salary-calculator':
                return this.createSalaryCalculatorContent();
            case 'skills-test':
                return this.createSkillsTestContent();
            case 'saved-jobs':
                return this.createSavedJobsContent();
            case 'career-path':
                return this.createCareerPathContent();
            case 'settings':
                return this.createSettingsContent();
            default:
                return '<p>Conținutul aplicației va fi aici.</p>';
        }
    }

    createJobSearchContent() {
        return `
            <div class="job-search-content">
                <div class="search-header">
                    <div class="search-form">
                        <input type="text" class="search-input" placeholder="Caută joburi (ex: dezvoltator, manager, designer...)">
                        <select class="filter-select">
                            <option value="">Toate orașele</option>
                            <option value="bucuresti">București</option>
                            <option value="cluj">Cluj-Napoca</option>
                            <option value="timisoara">Timișoara</option>
                            <option value="iasi">Iași</option>
                        </select>
                        <select class="filter-select">
                            <option value="">Toate categoriile</option>
                            <option value="it">IT & Software</option>
                            <option value="marketing">Marketing</option>
                            <option value="sales">Vânzări</option>
                            <option value="hr">Resurse Umane</option>
                        </select>
                        <button class="search-btn" onclick="jobOS.searchJobs()">
                            <i class="fas fa-search"></i> Caută
                        </button>
                    </div>
                </div>
                <div class="job-list" id="job-list">
                    ${this.generateJobList()}
                </div>
            </div>
        `;
    }

    createMyJobsContent() {
        return `
            <div class="my-jobs-content">
                <h2 style="margin-bottom: 20px; color: #1e3c72;">Job-urile Mele</h2>
                <div style="background: #f8f9ff; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                    <h3 style="color: #1e3c72; margin-bottom: 15px;">Aplicări Recent</h3>
                    <div class="job-item">
                        <div class="job-header">
                            <div>
                                <div class="job-title">Senior React Developer</div>
                                <div class="job-company">TechCorp SRL</div>
                            </div>
                            <span style="background: #fff3cd; color: #856404; padding: 5px 15px; border-radius: 15px; font-size: 12px;">În așteptare</span>
                        </div>
                        <div class="job-meta">
                            <div class="job-meta-item">
                                <i class="fas fa-calendar"></i>
                                <span>Aplicat la 23 Dec 2024</span>
                            </div>
                            <div class="job-meta-item">
                                <i class="fas fa-eye"></i>
                                <span>Vizualizat de angajator</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    createCompaniesContent() {
        return `
            <div class="companies-content">
                <h2 style="margin-bottom: 20px; color: #1e3c72;">Companii Partenere</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
                    <div style="background: white; border: 1px solid #e0e0e0; border-radius: 15px; padding: 20px; text-align: center;">
                        <div style="width: 60px; height: 60px; background: #1e3c72; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">TC</div>
                        <h3 style="color: #1e3c72; margin-bottom: 10px;">TechCorp SRL</h3>
                        <p style="color: #666; margin-bottom: 15px;">Companie de software cu peste 500 de angajați</p>
                        <div style="margin-bottom: 15px;">
                            <span style="background: #e3f2fd; color: #1976d2; padding: 5px 10px; border-radius: 15px; font-size: 12px; margin-right: 5px;">IT</span>
                            <span style="background: #e8f5e8; color: #2e7d32; padding: 5px 10px; border-radius: 15px; font-size: 12px;">15 joburi</span>
                        </div>
                        <button style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: white; border: none; padding: 10px 20px; border-radius: 20px; cursor: pointer;">Vezi joburi</button>
                    </div>
                </div>
            </div>
        `;
    }

    createSalaryCalculatorContent() {
        return `
            <div style="padding: 20px;">
                <h2 style="margin-bottom: 20px; color: #1e3c72;">Calculator Salariu</h2>
                <div style="background: #f8f9ff; padding: 20px; border-radius: 15px; margin-bottom: 20px;">
                    <div class="form-group">
                        <label class="form-label">Salariul brut lunar (RON)</label>
                        <input type="number" class="form-input" id="gross-salary" placeholder="8000" onchange="jobOS.calculateNetSalary()">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Numărul de persoane în întreținere</label>
                        <select class="form-input" id="dependents" onchange="jobOS.calculateNetSalary()">
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3+</option>
                        </select>
                    </div>
                </div>
                <div id="salary-result" style="background: white; border: 1px solid #e0e0e0; border-radius: 15px; padding: 20px;">
                    <h3 style="color: #1e3c72; margin-bottom: 15px;">Rezultat</h3>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                        <div style="text-align: center;">
                            <div style="font-size: 24px; font-weight: bold; color: #2e7d32;" id="net-salary">- RON</div>
                            <div style="color: #666;">Salariu net</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 24px; font-weight: bold; color: #d32f2f;" id="taxes">- RON</div>
                            <div style="color: #666;">Taxe și contribuții</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    calculateNetSalary() {
        const grossSalary = parseFloat(document.getElementById('gross-salary').value) || 0;
        const dependents = parseInt(document.getElementById('dependents').value) || 0;
        
        if (grossSalary > 0) {
            // Simplified Romanian tax calculation
            const socialContributions = grossSalary * 0.25; // 25% social contributions
            const taxableIncome = grossSalary - socialContributions;
            const personalDeduction = 300 + (dependents * 300); // Basic deduction + dependents
            const taxableAfterDeduction = Math.max(0, taxableIncome - personalDeduction);
            const incomeTax = taxableAfterDeduction * 0.10; // 10% income tax
            
            const totalTaxes = socialContributions + incomeTax;
            const netSalary = grossSalary - totalTaxes;
            
            document.getElementById('net-salary').textContent = Math.round(netSalary) + ' RON';
            document.getElementById('taxes').textContent = Math.round(totalTaxes) + ' RON';
        }
    }

    // Add stub methods for other apps
    createInterviewsContent() {
        return `<div style="padding: 20px;"><h2 style="color: #1e3c72;">Interviuri Programate</h2><p>Nu există interviuri programate în acest moment.</p></div>`;
    }

    createProfileContent() {
        return `<div style="padding: 20px;"><h2 style="color: #1e3c72;">Profilul Meu</h2><p>Informații despre profilul tău profesional.</p></div>`;
    }

    createNotificationsContent() {
        return `<div style="padding: 20px;"><h2 style="color: #1e3c72;">Notificări</h2><p>Nu există notificări noi.</p></div>`;
    }

    createSkillsTestContent() {
        return `<div style="padding: 20px;"><h2 style="color: #1e3c72;">Test Competențe</h2><p>Evaluează-ți competențele profesionale.</p></div>`;
    }

    createSavedJobsContent() {
        return `<div style="padding: 20px;"><h2 style="color: #1e3c72;">Job-uri Salvate</h2><p>Nu ai job-uri salvate încă.</p></div>`;
    }

    createCareerPathContent() {
        return `<div style="padding: 20px;"><h2 style="color: #1e3c72;">Traseul Carierei</h2><p>Planifică-ți următorul pas în carieră.</p></div>`;
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

    loadJobData() {
        this.jobData = [
            {
                id: 1,
                title: 'Senior React Developer',
                company: 'TechCorp SRL',
                location: 'București',
                salary: '8.000 - 12.000 RON',
                type: 'Full-time',
                experience: '3+ ani',
                description: 'Căutăm un dezvoltator React senior pentru echipa noastră dinamică. Vei lucra la proiecte inovatoare și vei avea oportunitatea să înveți tehnologii noi.',
                tags: ['React', 'JavaScript', 'TypeScript', 'Node.js'],
                posted: '2 zile în urmă',
                remote: true
            },
            {
                id: 2,
                title: 'Marketing Manager',
                company: 'Digital Agency',
                location: 'Cluj-Napoca',
                salary: '5.000 - 8.000 RON',
                type: 'Full-time',
                experience: '2+ ani',
                description: 'Responsabil cu strategiile de marketing digital și campanii online. Experiență în social media și Google Ads necesară.',
                tags: ['Marketing Digital', 'Social Media', 'Google Ads', 'Analytics'],
                posted: '1 zi în urmă',
                remote: false
            },
            {
                id: 3,
                title: 'UX/UI Designer',
                company: 'Creative Studio',
                location: 'Timișoara',
                salary: '4.500 - 7.000 RON',
                type: 'Full-time',
                experience: '1+ ani',
                description: 'Designer creativ pentru aplicații mobile și web. Cunoștințe Figma, Adobe Creative Suite necesare.',
                tags: ['Figma', 'Adobe XD', 'Photoshop', 'UI/UX'],
                posted: '3 zile în urmă',
                remote: true
            }
        ];
    }

    generateJobList() {
        return this.jobData.map(job => `
            <div class="job-item" onclick="jobOS.viewJobDetails(${job.id})">
                <div class="job-header">
                    <div>
                        <div class="job-title">${job.title}</div>
                        <div class="job-company">${job.company}</div>
                    </div>
                    <div class="job-salary">${job.salary}</div>
                </div>
                <div class="job-meta">
                    <div class="job-meta-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${job.location}</span>
                    </div>
                    <div class="job-meta-item">
                        <i class="fas fa-clock"></i>
                        <span>${job.type}</span>
                    </div>
                    <div class="job-meta-item">
                        <i class="fas fa-user-tie"></i>
                        <span>${job.experience}</span>
                    </div>
                    ${job.remote ? '<div class="job-meta-item"><i class="fas fa-home"></i><span>Remote</span></div>' : ''}
                </div>
                <div class="job-description">${job.description}</div>
                <div class="job-tags">
                    ${job.tags.map(tag => `<span class="job-tag">${tag}</span>`).join('')}
                </div>
                <div class="job-actions">
                    <button class="job-btn secondary" onclick="event.stopPropagation(); jobOS.saveJob(${job.id})">
                        <i class="fas fa-heart"></i> Salvează
                    </button>
                    <button class="job-btn primary" onclick="event.stopPropagation(); jobOS.applyToJob(${job.id})">
                        <i class="fas fa-paper-plane"></i> Aplică
                    </button>
                </div>
            </div>
        `).join('');
    }

    createCVBuilderContent() {
        return `
            <div class="cv-builder-content">
                <div class="cv-sidebar">
                    <h3>Secțiuni CV</h3>
                    <div class="cv-nav">
                        <div class="cv-nav-item active" data-section="personal">
                            <i class="fas fa-user"></i> Date Personale
                        </div>
                        <div class="cv-nav-item" data-section="experience">
                            <i class="fas fa-briefcase"></i> Experiență
                        </div>
                        <div class="cv-nav-item" data-section="education">
                            <i class="fas fa-graduation-cap"></i> Educație
                        </div>
                        <div class="cv-nav-item" data-section="skills">
                            <i class="fas fa-star"></i> Competențe
                        </div>
                    </div>
                </div>
                <div class="cv-main">
                    <div class="cv-section">
                        <div class="cv-section-header">
                            <h3>Date Personale</h3>
                        </div>
                        <div class="cv-section-content">
                            <div class="form-group">
                                <label class="form-label">Nume complet</label>
                                <input type="text" class="form-input" value="${this.userProfile.name}">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-input" value="${this.userProfile.email}">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Telefon</label>
                                <input type="tel" class="form-input" value="${this.userProfile.phone}">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Locația</label>
                                <input type="text" class="form-input" value="${this.userProfile.location}">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    searchJobs() {
        const searchInput = document.querySelector('.search-input').value;
        console.log('Searching for jobs:', searchInput);
        // Simulate search functionality
        this.showNotification('Căutare efectuată!', 'success');
    }

    applyToJob(jobId) {
        const job = this.jobData.find(j => j.id === jobId);
        this.showNotification(`Aplicare trimisă pentru ${job.title}!`, 'success');
    }

    saveJob(jobId) {
        const job = this.jobData.find(j => j.id === jobId);
        this.showNotification(`Job salvat: ${job.title}`, 'info');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : 'info'}-circle"></i>
            <span>${message}</span>
        `;
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'success' ? '#4caf50' : '#2196f3',
            color: 'white',
            padding: '15px 20px',
            borderRadius: '10px',
            zIndex: '10000',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'slideDown 0.3s ease'
        });
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize JobOS
const jobOS = new JobOS();

// Make it globally accessible
window.jobOS = jobOS;