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
        
        // Ensure boot completes within 3 seconds max
        this.bootSequence();
        
        // Fallback: force hide boot screen after 3 seconds
        setTimeout(() => {
            const bootScreen = document.querySelector('.boot-screen');
            if (bootScreen && !bootScreen.classList.contains('hidden')) {
                bootScreen.classList.add('hidden');
                console.log('Boot sequence completed via fallback');
            }
        }, 3000);
        
        setInterval(() => this.updateTime(), 1000);
    }

    bootSequence() {
        // Accelerated loading for better UX
        const progressText = document.querySelector('.progress-text');
        
        const loadingSteps = [
            'Loading job opportunities...',
            'Connecting to employers...',
            'Preparing your dashboard...',
            'Ready!'
        ];
        
        let step = 0;
        const stepInterval = setInterval(() => {
            if (step < loadingSteps.length) {
                if (progressText) {
                    progressText.textContent = loadingSteps[step];
                }
                step++;
            } else {
                clearInterval(stepInterval);
                // Quick boot - hide after 2 seconds total
                setTimeout(() => {
                    const bootScreen = document.querySelector('.boot-screen');
                    if (bootScreen) {
                        bootScreen.classList.add('hidden');
                    }
                }, 200);
            }
        }, 400); // Faster steps
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

    createInterviewsContent() {
        const interviews = [
            {
                id: 1,
                company: 'TechCorp SRL',
                position: 'Senior React Developer',
                date: '2024-12-28',
                time: '14:00',
                type: 'Video Call',
                interviewer: 'Ana Popescu',
                status: 'confirmed',
                platform: 'Google Meet'
            },
            {
                id: 2,
                company: 'Digital Agency',
                position: 'Marketing Manager',
                date: '2024-12-30',
                time: '10:30',
                type: 'La sediu',
                interviewer: 'Mihai Ionescu',
                status: 'pending',
                address: 'Strada Victoriei 15, Cluj-Napoca'
            }
        ];

        return `
            <div style="padding: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                    <h2 style="color: #1e3c72; margin: 0;">Interviuri Programate</h2>
                    <button class="job-btn primary" onclick="jobOS.scheduleInterview()">
                        <i class="fas fa-plus"></i> Programează Interviu
                    </button>
                </div>
                
                <div style="display: grid; gap: 20px;">
                    ${interviews.map(interview => `
                        <div class="interview-card" style="background: white; border: 1px solid #e0e0e0; border-radius: 15px; padding: 20px; position: relative;">
                            <div class="interview-status ${interview.status}" style="position: absolute; top: 15px; right: 15px; padding: 5px 12px; border-radius: 12px; font-size: 11px; font-weight: bold;">
                                ${interview.status === 'confirmed' ? 'CONFIRMAT' : 'ÎN AȘTEPTARE'}
                            </div>
                            
                            <div style="display: flex; align-items: start; gap: 20px; margin-bottom: 20px;">
                                <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; font-weight: bold;">
                                    ${interview.company.split(' ').map(w => w[0]).join('').substring(0, 2)}
                                </div>
                                <div style="flex: 1;">
                                    <h3 style="color: #1e3c72; margin-bottom: 5px; font-size: 18px;">${interview.position}</h3>
                                    <p style="color: #666; margin-bottom: 10px; font-size: 16px; font-weight: 500;">${interview.company}</p>
                                    <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                                        <div style="display: flex; align-items: center; gap: 8px; color: #555;">
                                            <i class="fas fa-calendar" style="color: #64b5f6;"></i>
                                            <span>${new Date(interview.date).toLocaleDateString('ro-RO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                        </div>
                                        <div style="display: flex; align-items: center; gap: 8px; color: #555;">
                                            <i class="fas fa-clock" style="color: #64b5f6;"></i>
                                            <span>${interview.time}</span>
                                        </div>
                                        <div style="display: flex; align-items: center; gap: 8px; color: #555;">
                                            <i class="fas fa-${interview.type === 'Video Call' ? 'video' : 'building'}" style="color: #64b5f6;"></i>
                                            <span>${interview.type}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div style="background: #f8f9ff; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
                                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                                    <i class="fas fa-user" style="color: #1e3c72;"></i>
                                    <strong>Intervievator:</strong> ${interview.interviewer}
                                </div>
                                ${interview.platform ? `
                                    <div style="display: flex; align-items: center; gap: 10px;">
                                        <i class="fas fa-video" style="color: #1e3c72;"></i>
                                        <strong>Platformă:</strong> ${interview.platform}
                                    </div>
                                ` : ''}
                                ${interview.address ? `
                                    <div style="display: flex; align-items: center; gap: 10px;">
                                        <i class="fas fa-map-marker-alt" style="color: #1e3c72;"></i>
                                        <strong>Adresă:</strong> ${interview.address}
                                    </div>
                                ` : ''}
                            </div>
                            
                            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                                <button class="job-btn secondary" onclick="jobOS.rescheduleInterview(${interview.id})">
                                    <i class="fas fa-edit"></i> Reprogramează
                                </button>
                                <button class="job-btn primary" onclick="jobOS.joinInterview(${interview.id})">
                                    <i class="fas fa-${interview.type === 'Video Call' ? 'video' : 'directions'}"></i> 
                                    ${interview.type === 'Video Call' ? 'Alătură-te' : 'Indicații'}
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div style="margin-top: 30px; background: linear-gradient(135deg, #e8f5e8 0%, #f3e5f5 100%); padding: 20px; border-radius: 15px;">
                    <h3 style="color: #1e3c72; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-lightbulb"></i>
                        Sfaturi pentru interviu
                    </h3>
                    <ul style="list-style: none; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 10px;">
                        <li style="display: flex; align-items: center; gap: 10px; color: #555;">
                            <i class="fas fa-check-circle" style="color: #4caf50;"></i>
                            Testează tehnologia cu 30 min înainte
                        </li>
                        <li style="display: flex; align-items: center; gap: 10px; color: #555;">
                            <i class="fas fa-check-circle" style="color: #4caf50;"></i>
                            Pregătește întrebări despre companie
                        </li>
                        <li style="display: flex; align-items: center; gap: 10px; color: #555;">
                            <i class="fas fa-check-circle" style="color: #4caf50;"></i>
                            Îmbracă-te profesional
                        </li>
                        <li style="display: flex; align-items: center; gap: 10px; color: #555;">
                            <i class="fas fa-check-circle" style="color: #4caf50;"></i>
                            Ajunge cu 10 minute mai devreme
                        </li>
                    </ul>
                </div>
            </div>
        `;
    }

    scheduleInterview() {
        this.showNotification('Funcționalitatea de programare interviuri va fi disponibilă în curând!', 'info');
    }

    rescheduleInterview(interviewId) {
        this.showNotification('Cerere de reprogramare trimisă!', 'success');
    }

    joinInterview(interviewId) {
        this.showNotification('Deschidere link interviu...', 'info');
        // Simulate opening interview link
        setTimeout(() => {
            window.open('https://meet.google.com/demo', '_blank');
        }, 1000);
    }

    createProfileContent() {
        return `<div style="padding: 20px;"><h2 style="color: #1e3c72;">Profilul Meu</h2><p>Informații despre profilul tău profesional.</p></div>`;
    }

    createNotificationsContent() {
        const notifications = [
            {
                id: 1,
                type: 'job_match',
                title: 'Job nou potrivit pentru tine!',
                message: 'Frontend Developer la StartupTech - Salariu 6.000-9.000 RON',
                time: '5 minute în urmă',
                unread: true,
                action: 'Vezi jobul',
                icon: 'fa-briefcase',
                color: '#2196f3'
            },
            {
                id: 2,
                type: 'application_status',
                title: 'Aplicare vizualizată',
                message: 'TechCorp SRL a vizualizat aplicarea ta pentru Senior React Developer',
                time: '2 ore în urmă',
                unread: true,
                action: 'Vezi detalii',
                icon: 'fa-eye',
                color: '#ff9800'
            },
            {
                id: 3,
                type: 'interview_reminder',
                title: 'Reminder interviu',
                message: 'Ai un interviu mâine la ora 14:00 cu TechCorp SRL',
                time: '1 zi în urmă',
                unread: false,
                action: 'Vezi interviul',
                icon: 'fa-calendar-check',
                color: '#4caf50'
            },
            {
                id: 4,
                type: 'profile_view',
                title: 'Profil vizualizat',
                message: '3 companii noi au vizualizat profilul tău săptămâna aceasta',
                time: '2 zile în urmă',
                unread: false,
                action: 'Vezi profilul',
                icon: 'fa-user',
                color: '#9c27b0'
            },
            {
                id: 5,
                type: 'skill_recommendation',
                title: 'Recomandare competență',
                message: 'Adaugă TypeScript în profilul tău pentru mai multe oportunități',
                time: '3 zile în urmă',
                unread: false,
                action: 'Actualizează profilul',
                icon: 'fa-star',
                color: '#ff5722'
            }
        ];

        const unreadCount = notifications.filter(n => n.unread).length;

        return `
            <div style="padding: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                    <div>
                        <h2 style="color: #1e3c72; margin: 0;">Notificări</h2>
                        <p style="color: #666; margin: 5px 0 0 0;">${unreadCount} notificări necitite</p>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button class="job-btn secondary" onclick="jobOS.markAllAsRead()">
                            <i class="fas fa-check-double"></i> Marchează toate ca citite
                        </button>
                        <button class="job-btn primary" onclick="jobOS.configureNotifications()">
                            <i class="fas fa-cog"></i> Setări
                        </button>
                    </div>
                </div>

                <div style="display: grid; gap: 15px;">
                    ${notifications.map(notification => `
                        <div class="notification-item ${notification.unread ? 'unread' : ''}" 
                             style="background: white; border: 1px solid ${notification.unread ? '#64b5f6' : '#e0e0e0'}; 
                                    border-radius: 12px; padding: 20px; cursor: pointer; transition: all 0.3s ease;
                                    border-left: 4px solid ${notification.color};"
                             onclick="jobOS.openNotification(${notification.id})">
                            
                            <div style="display: flex; align-items: start; gap: 15px;">
                                <div style="width: 50px; height: 50px; background: ${notification.color}; 
                                           border-radius: 50%; display: flex; align-items: center; justify-content: center; 
                                           color: white; font-size: 18px; flex-shrink: 0;">
                                    <i class="fas ${notification.icon}"></i>
                                </div>
                                
                                <div style="flex: 1;">
                                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                                        <h3 style="margin: 0; color: #1e3c72; font-size: 16px; font-weight: 600;">
                                            ${notification.title}
                                            ${notification.unread ? '<span style="width: 8px; height: 8px; background: #2196f3; border-radius: 50%; display: inline-block; margin-left: 8px;"></span>' : ''}
                                        </h3>
                                        <span style="color: #999; font-size: 12px; white-space: nowrap; margin-left: 10px;">
                                            ${notification.time}
                                        </span>
                                    </div>
                                    
                                    <p style="margin: 0 0 15px 0; color: #555; line-height: 1.5;">
                                        ${notification.message}
                                    </p>
                                    
                                    <button class="job-btn primary small" 
                                            style="padding: 8px 15px; font-size: 13px;"
                                            onclick="event.stopPropagation(); jobOS.handleNotificationAction(${notification.id})">
                                        ${notification.action}
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div style="margin-top: 30px; text-align: center;">
                    <button class="job-btn secondary" onclick="jobOS.loadMoreNotifications()">
                        <i class="fas fa-chevron-down"></i> Încarcă mai multe notificări
                    </button>
                </div>

                <div style="margin-top: 30px; background: #f8f9ff; padding: 20px; border-radius: 15px;">
                    <h3 style="color: #1e3c72; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-bell"></i>
                        Setări Notificări
                    </h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
                        <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                            <input type="checkbox" checked style="transform: scale(1.2);">
                            <span>Job-uri noi potrivite</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                            <input type="checkbox" checked style="transform: scale(1.2);">
                            <span>Actualizări aplicări</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                            <input type="checkbox" checked style="transform: scale(1.2);">
                            <span>Reminder interviuri</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                            <input type="checkbox" style="transform: scale(1.2);">
                            <span>Newsletter săptămânal</span>
                        </label>
                    </div>
                </div>
            </div>
        `;
    }

    markAllAsRead() {
        this.showNotification('Toate notificările au fost marcate ca citite!', 'success');
        // Refresh notifications view
        setTimeout(() => {
            const activeWindow = document.querySelector('.window[id*="notifications"]');
            if (activeWindow) {
                const content = activeWindow.querySelector('.window-content');
                content.innerHTML = this.createNotificationsContent();
            }
        }, 1000);
    }

    configureNotifications() {
        this.showNotification('Setări notificări actualizate!', 'success');
    }

    openNotification(notificationId) {
        this.showNotification('Deschidere notificare...', 'info');
        // Simulate opening related content based on notification type
    }

    handleNotificationAction(notificationId) {
        this.showNotification('Acțiune executată!', 'success');
    }

    loadMoreNotifications() {
        this.showNotification('Se încarcă mai multe notificări...', 'info');
    }

    // Chat System
    toggleChat() {
        const chatWidget = document.getElementById('chat-widget');
        chatWidget.classList.toggle('minimized');
    }

    handleChatInput(event) {
        if (event.key === 'Enter') {
            this.sendChatMessage();
        }
    }

    sendChatMessage() {
        const chatInput = document.querySelector('.chat-input');
        const message = chatInput.value.trim();
        
        if (!message) return;
        
        // Add user message
        this.addChatMessage(message, 'user');
        chatInput.value = '';
        
        // Simulate bot response
        setTimeout(() => {
            this.showTypingIndicator();
            setTimeout(() => {
                this.hideTypingIndicator();
                this.respondToMessage(message);
            }, 1500);
        }, 500);
    }

    addChatMessage(message, sender = 'bot') {
        const chatMessages = document.getElementById('chat-messages');
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${sender}`;
        
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageElement.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-${sender === 'user' ? 'user' : 'robot'}"></i>
            </div>
            <div class="message-content">
                <div class="message-bubble">${message}</div>
                <div class="message-time">${time}</div>
            </div>
        `;
        
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    showTypingIndicator() {
        const chatMessages = document.getElementById('chat-messages');
        const typingElement = document.createElement('div');
        typingElement.className = 'chat-message bot typing-indicator';
        typingElement.id = 'typing-indicator';
        
        typingElement.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="message-bubble">
                    <div class="typing-indicator">
                        Scrie...
                        <div class="typing-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        chatMessages.appendChild(typingElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    respondToMessage(userMessage) {
        const responses = {
            'salut': 'Salut! Cu ce te pot ajuta astăzi?',
            'buna': 'Bună! Sunt aici să te ajut cu orice întrebări despre JobOS.',
            'ajutor': 'Desigur! Pot să te ajut cu: căutarea de joburi, aplicări, CV-ul tău, interviuri și multe altele.',
            'job': 'Poți căuta joburi folosind aplicația "Căutare Job" din desktop. Avem joburi noi zilnic!',
            'cv': 'Pentru a-ți construi CV-ul, deschide aplicația "CV Builder" din meniul start sau desktop.',
            'interviu': 'Vezi interviurile programate în aplicația "Interviuri". Îți voi trimite reminder-e automate.',
            'salariu': 'Folosește "Calculator Salariu" pentru a afla salariul net din cel brut cu taxele din România.',
            'mulțumesc': 'Cu plăcere! Dacă ai alte întrebări, sunt aici să te ajut.',
            'default': 'Înțeleg! Pentru informații detaliate, explorează aplicațiile din JobOS sau contactează echipa noastră de suport.'
        };
        
        // Simple keyword matching
        let response = responses.default;
        const lowerMessage = userMessage.toLowerCase();
        
        for (const keyword in responses) {
            if (keyword !== 'default' && lowerMessage.includes(keyword)) {
                response = responses[keyword];
                break;
            }
        }
        
        // Special responses for specific questions
        if (lowerMessage.includes('câte joburi')) {
            response = `În acest moment avem ${this.jobData.length} joburi active în platformă, cu noi oportunități adăugate zilnic!`;
        } else if (lowerMessage.includes('remote') || lowerMessage.includes('acasă')) {
            const remoteJobs = this.jobData.filter(job => job.remote).length;
            response = `Avem ${remoteJobs} joburi remote disponibile. Caută cu filtrul "Remote" activat!`;
        }
        
        this.addChatMessage(response, 'bot');
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
                remote: true,
                urgent: false,
                benefits: ['Asigurare medicală', 'Tichete de masă', 'Bonus anual', 'Training-uri']
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
                remote: false,
                urgent: true,
                benefits: ['Bonus performanță', 'Mașină de serviciu', 'Laptop']
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
                remote: true,
                urgent: false,
                benefits: ['Program flexibil', 'Zile libere suplimentare']
            },
            {
                id: 4,
                title: 'Data Scientist',
                company: 'AI Innovations',
                location: 'București',
                salary: '9.000 - 15.000 RON',
                type: 'Full-time',
                experience: '4+ ani',
                description: 'Analizează date complexe și dezvoltă modele de machine learning pentru proiecte enterprise.',
                tags: ['Python', 'Machine Learning', 'SQL', 'TensorFlow'],
                posted: '5 ore în urmă',
                remote: true,
                urgent: true,
                benefits: ['Stock options', 'Budget educație', 'Concediu nelimitat']
            },
            {
                id: 5,
                title: 'DevOps Engineer',
                company: 'CloudTech Solutions',
                location: 'Iași',
                salary: '7.500 - 11.000 RON',
                type: 'Full-time',
                experience: '3+ ani',
                description: 'Gestionează infrastructura cloud și automatizează procesele de deployment.',
                tags: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
                posted: '1 zi în urmă',
                remote: true,
                urgent: false,
                benefits: ['Certificări plătite', 'Conferințe internaționale']
            },
            {
                id: 6,
                title: 'Product Manager',
                company: 'StartupHub',
                location: 'București',
                salary: '8.500 - 13.000 RON',
                type: 'Full-time',
                experience: '5+ ani',
                description: 'Coordonează dezvoltarea produselor digitale de la concept la lansare.',
                tags: ['Product Strategy', 'Agile', 'Analytics', 'Leadership'],
                posted: '4 zile în urmă',
                remote: false,
                urgent: false,
                benefits: ['Equity', 'Team building lunar', 'Mentorship']
            }
        ];
        
        // Simulate real-time job updates
        setInterval(() => {
            this.updateJobStats();
        }, 30000); // Update every 30 seconds
    }

    updateJobStats() {
        const newJobsCount = Math.floor(Math.random() * 5) + 10;
        const applicationsCount = Math.floor(Math.random() * 3) + 3;
        
        const newJobsElement = document.querySelector('.new-jobs');
        const applicationsElement = document.querySelector('.applications');
        
        if (newJobsElement) {
            newJobsElement.textContent = `${newJobsCount} joburi noi`;
        }
        if (applicationsElement) {
            applicationsElement.textContent = `${applicationsCount} aplicări`;
        }
        
        // Update profile views randomly
        const profileViews = Math.floor(Math.random() * 50) + 200;
        const profileViewsElement = document.querySelector('.stat-item i.fa-eye + span');
        if (profileViewsElement) {
            profileViewsElement.textContent = `Vizualizări profil: ${profileViews}`;
        }
    }

    generateJobList() {
        return this.jobData.map(job => `
            <div class="job-item ${job.urgent ? 'urgent' : ''}" onclick="jobOS.viewJobDetails(${job.id})">
                ${job.urgent ? '<div class="urgent-badge"><i class="fas fa-fire"></i> URGENT</div>' : ''}
                <div class="job-header">
                    <div>
                        <div class="job-title">${job.title}</div>
                        <div class="job-company">
                            <i class="fas fa-building"></i>
                            ${job.company}
                        </div>
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
                    <div class="job-meta-item">
                        <i class="fas fa-calendar"></i>
                        <span>${job.posted}</span>
                    </div>
                </div>
                <div class="job-description">${job.description}</div>
                <div class="job-benefits">
                    <strong>Beneficii:</strong> ${job.benefits.join(', ')}
                </div>
                <div class="job-tags">
                    ${job.tags.map(tag => `<span class="job-tag">${tag}</span>`).join('')}
                </div>
                <div class="job-actions">
                    <button class="job-btn secondary" onclick="event.stopPropagation(); jobOS.saveJob(${job.id})">
                        <i class="fas fa-heart"></i> Salvează
                    </button>
                    <button class="job-btn primary" onclick="event.stopPropagation(); jobOS.applyToJob(${job.id})">
                        <i class="fas fa-paper-plane"></i> Aplică Acum
                    </button>
                </div>
            </div>
        `).join('');
    }

    viewJobDetails(jobId) {
        const job = this.jobData.find(j => j.id === jobId);
        if (!job) return;
        
        const detailWindow = this.createJobDetailWindow(job);
        document.querySelector('.windows-container').appendChild(detailWindow);
        this.windows.push({ 
            id: `job-detail-${jobId}`, 
            element: detailWindow, 
            app: 'job-detail' 
        });
        this.setupWindowControls(detailWindow);
        this.makeWindowDraggable(detailWindow);
        this.bringWindowToFront(detailWindow);
    }

    createJobDetailWindow(job) {
        const window = document.createElement('div');
        window.className = 'window';
        window.id = `job-detail-${job.id}`;
        window.style.left = '150px';
        window.style.top = '100px';
        window.style.width = '700px';
        window.style.height = '600px';

        window.innerHTML = `
            <div class="window-header">
                <div class="window-title">
                    <i class="fas fa-briefcase"></i>
                    <span>${job.title}</span>
                </div>
                <div class="window-controls">
                    <div class="window-control minimize" data-action="minimize">−</div>
                    <div class="window-control maximize" data-action="maximize">□</div>
                    <div class="window-control close" data-action="close">×</div>
                </div>
            </div>
            <div class="window-content" style="padding: 0;">
                <div class="job-detail-content">
                    <div class="job-detail-header">
                        <div class="job-company-logo">
                            ${job.company.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                        <div class="job-detail-info">
                            <h1>${job.title}</h1>
                            <h2>${job.company}</h2>
                            <div class="job-detail-meta">
                                <span><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
                                <span><i class="fas fa-clock"></i> ${job.type}</span>
                                <span><i class="fas fa-calendar"></i> ${job.posted}</span>
                                ${job.remote ? '<span><i class="fas fa-home"></i> Remote</span>' : ''}
                            </div>
                        </div>
                        <div class="job-detail-salary">
                            <div class="salary-amount">${job.salary}</div>
                            <div class="salary-label">pe lună</div>
                        </div>
                    </div>
                    
                    <div class="job-detail-body">
                        <div class="job-section">
                            <h3><i class="fas fa-file-alt"></i> Descrierea Jobului</h3>
                            <p>${job.description}</p>
                            <p>Această poziție oferă oportunitatea de a lucra într-un mediu dinamic și inovator, 
                            unde vei putea să-ți dezvolți abilitățile și să contribui la proiecte interesante.</p>
                        </div>
                        
                        <div class="job-section">
                            <h3><i class="fas fa-star"></i> Competențe Necesare</h3>
                            <div class="skills-list">
                                ${job.tags.map(tag => `<span class="skill-tag">${tag}</span>`).join('')}
                            </div>
                        </div>
                        
                        <div class="job-section">
                            <h3><i class="fas fa-gift"></i> Beneficii</h3>
                            <ul class="benefits-list">
                                ${job.benefits.map(benefit => `<li><i class="fas fa-check"></i> ${benefit}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div class="job-section">
                            <h3><i class="fas fa-building"></i> Despre Companie</h3>
                            <p>Compania noastră este lider în domeniu, cu o echipă de profesioniști dedicați 
                            și un mediu de lucru colaborativ. Oferim oportunități de dezvoltare și creștere în carieră.</p>
                        </div>
                    </div>
                    
                    <div class="job-detail-actions">
                        <button class="job-btn primary large" onclick="jobOS.applyToJob(${job.id})">
                            <i class="fas fa-paper-plane"></i> Aplică pentru acest job
                        </button>
                        <button class="job-btn secondary large" onclick="jobOS.saveJob(${job.id})">
                            <i class="fas fa-heart"></i> Salvează
                        </button>
                        <button class="job-btn secondary large" onclick="jobOS.shareJob(${job.id})">
                            <i class="fas fa-share"></i> Distribuie
                        </button>
                    </div>
                </div>
            </div>
        `;

        return window;
    }

    shareJob(jobId) {
        const job = this.jobData.find(j => j.id === jobId);
        if (navigator.share) {
            navigator.share({
                title: job.title,
                text: `Verifică acest job: ${job.title} la ${job.company}`,
                url: window.location.href
            });
        } else {
            // Fallback pentru browsere care nu suportă Web Share API
            navigator.clipboard.writeText(`${job.title} la ${job.company} - ${window.location.href}`);
            this.showNotification('Link copiat în clipboard!', 'success');
        }
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