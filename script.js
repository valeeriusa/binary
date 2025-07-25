// DOM Elements
const searchInput = document.querySelector('.search-box input');
const searchBtn = document.querySelector('.search-btn');
const jobsContainer = document.getElementById('jobsContainer');
const viewToggleBtns = document.querySelectorAll('.toggle-btn');
const filterCheckboxes = document.querySelectorAll('input[type="checkbox"]');
const salarySlider = document.querySelector('.salary-slider');
const applyBtns = document.querySelectorAll('.apply-btn');

// Job Data
const jobsData = [
    {
        id: 1,
        title: 'Senior Frontend Developer',
        company: 'TechCorp Solutions',
        location: 'București, România',
        salary: '8000-12000 RON',
        time: '2 ore',
        tags: ['React', 'TypeScript', 'Remote'],
        type: 'Remote',
        experience: 'Senior Level',
        salaryMin: 8000,
        category: 'IT & Software'
    },
    {
        id: 2,
        title: 'UX/UI Designer',
        company: 'DesignHub Agency',
        location: 'Cluj-Napoca, România',
        salary: '6000-9000 RON',
        time: '4 ore',
        tags: ['Figma', 'Adobe XD', 'Full-time'],
        type: 'Full-time',
        experience: 'Mid Level',
        salaryMin: 6000,
        category: 'Design'
    },
    {
        id: 3,
        title: 'Digital Marketing Specialist',
        company: 'MarketingPro',
        location: 'Timișoara, România',
        salary: '4500-7000 RON',
        time: '1 zi',
        tags: ['Google Ads', 'Facebook Ads', 'Hybrid'],
        type: 'Hybrid',
        experience: 'Mid Level',
        salaryMin: 4500,
        category: 'Marketing'
    },
    {
        id: 4,
        title: 'Product Manager',
        company: 'StartupXYZ',
        location: 'București, România',
        salary: '9000-15000 RON',
        time: '2 zile',
        tags: ['Agile', 'Scrum', 'Remote'],
        type: 'Remote',
        experience: 'Senior Level',
        salaryMin: 9000,
        category: 'IT & Software'
    },
    {
        id: 5,
        title: 'Data Scientist',
        company: 'DataCorp Analytics',
        location: 'Iași, România',
        salary: '7000-11000 RON',
        time: '3 zile',
        tags: ['Python', 'Machine Learning', 'Full-time'],
        type: 'Full-time',
        experience: 'Senior Level',
        salaryMin: 7000,
        category: 'IT & Software'
    },
    {
        id: 6,
        title: 'Cybersecurity Engineer',
        company: 'CyberTech Security',
        location: 'București, România',
        salary: '8500-13000 RON',
        time: '1 săptămână',
        tags: ['Security', 'Penetration Testing', 'Hybrid'],
        type: 'Hybrid',
        experience: 'Senior Level',
        salaryMin: 8500,
        category: 'IT & Software'
    }
];

// Company logos for dynamic rendering
const companyLogos = {
    'TechCorp Solutions': '#6666FF',
    'DesignHub Agency': '#00BCD4',
    'MarketingPro': '#10B981',
    'StartupXYZ': '#F59E0B',
    'DataCorp Analytics': '#EF4444',
    'CyberTech Security': '#8333EA'
};

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    renderJobs(jobsData);
    setupEventListeners();
    setupAnimations();
}

function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', handleSearch);
    searchBtn.addEventListener('click', handleSearchClick);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearchClick();
        }
    });

    // View toggle
    viewToggleBtns.forEach(btn => {
        btn.addEventListener('click', handleViewToggle);
    });

    // Filters
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleFilterChange);
    });

    // Salary slider
    if (salarySlider) {
        salarySlider.addEventListener('input', handleSalaryChange);
        updateSalaryDisplay();
    }

    // Apply buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('apply-btn')) {
            handleApplyClick(e);
        }
    });

    // Quick links
    const quickLinks = document.querySelectorAll('.quick-links a');
    quickLinks.forEach(link => {
        link.addEventListener('click', handleQuickLinkClick);
    });
}

function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    filterJobs();
}

function handleSearchClick() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (searchTerm) {
        filterJobs();
        // Add search animation
        searchBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            searchBtn.style.transform = 'scale(1)';
        }, 150);
    }
}

function handleViewToggle(e) {
    const viewType = e.target.closest('.toggle-btn').dataset.view;
    
    // Update active state
    viewToggleBtns.forEach(btn => btn.classList.remove('active'));
    e.target.closest('.toggle-btn').classList.add('active');
    
    // Change grid layout
    if (viewType === 'list') {
        jobsContainer.style.gridTemplateColumns = '1fr';
        jobsContainer.querySelectorAll('.job-card').forEach(card => {
            card.style.display = 'flex';
            card.style.alignItems = 'center';
            card.style.gap = '2rem';
        });
    } else {
        jobsContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(350px, 1fr))';
        jobsContainer.querySelectorAll('.job-card').forEach(card => {
            card.style.display = 'block';
        });
    }
}

function handleFilterChange() {
    filterJobs();
}

function handleSalaryChange() {
    updateSalaryDisplay();
    filterJobs();
}

function handleApplyClick(e) {
    e.preventDefault();
    const jobCard = e.target.closest('.job-card');
    const jobTitle = jobCard.querySelector('h3').textContent;
    
    // Animation
    e.target.style.transform = 'scale(0.95)';
    e.target.style.background = '#10b981';
    e.target.textContent = 'Aplicat!';
    
    setTimeout(() => {
        e.target.style.transform = 'scale(1)';
        showNotification(`Aplicația pentru "${jobTitle}" a fost trimisă cu succes!`);
    }, 150);
    
    setTimeout(() => {
        e.target.style.background = '';
        e.target.textContent = 'Aplică';
    }, 2000);
}

function handleQuickLinkClick(e) {
    e.preventDefault();
    const category = e.target.textContent.trim();
    
    // Add visual feedback
    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
    setTimeout(() => {
        e.target.style.background = '';
    }, 200);
    
    // Filter by category
    filterJobsByCategory(category);
}

function filterJobs() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedTypes = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.parentElement.textContent.trim());
    const salaryValue = salarySlider ? parseInt(salarySlider.value) : 0;
    
    const filteredJobs = jobsData.filter(job => {
        const matchesSearch = !searchTerm || 
            job.title.toLowerCase().includes(searchTerm) ||
            job.company.toLowerCase().includes(searchTerm) ||
            job.location.toLowerCase().includes(searchTerm) ||
            job.tags.some(tag => tag.toLowerCase().includes(searchTerm));
        
        const matchesType = selectedTypes.length === 0 || 
            selectedTypes.some(type => job.type.includes(type) || job.experience.includes(type));
        
        const matchesSalary = job.salaryMin >= salaryValue;
        
        return matchesSearch && matchesType && matchesSalary;
    });
    
    renderJobs(filteredJobs);
}

function filterJobsByCategory(category) {
    const categoryMap = {
        'IT & Software': 'IT & Software',
        'Marketing': 'Marketing',
        'Design': 'Design',
        'Vânzări': 'Sales',
        'Engineering': 'Engineering'
    };
    
    const filteredJobs = jobsData.filter(job => 
        job.category === categoryMap[category] || job.category === category
    );
    
    renderJobs(filteredJobs);
}

function renderJobs(jobs) {
    if (jobs.length === 0) {
        jobsContainer.innerHTML = `
            <div class="no-jobs">
                <i class="fas fa-search" style="font-size: 3rem; color: var(--color-gray-400); margin-bottom: 1rem;"></i>
                <h3 style="color: var(--color-gray-600); margin-bottom: 0.5rem;">Nu s-au găsit joburi</h3>
                <p style="color: var(--color-gray-500);">Încearcă să modifici criteriile de căutare</p>
            </div>
        `;
        return;
    }
    
    jobsContainer.innerHTML = jobs.map((job, index) => `
        <div class="job-card" style="animation-delay: ${index * 0.1}s">
            <div class="company-logo">
                ${generateCompanyLogo(job.company)}
            </div>
            <div class="job-details">
                <h3>${job.title}</h3>
                <p class="company">${job.company}</p>
                <p class="location"><i class="fas fa-map-marker-alt"></i> ${job.location}</p>
                <div class="job-tags">
                    ${job.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
            <div class="job-meta">
                <span class="salary">${job.salary}</span>
                <span class="time">${job.time}</span>
                <button class="apply-btn">Aplică</button>
            </div>
        </div>
    `).join('');
}

function generateCompanyLogo(companyName) {
    const color = companyLogos[companyName] || '#667eea';
    const letter = companyName.charAt(0).toUpperCase();
    
    return `
        <svg width="50" height="50" viewBox="0 0 50 50">
            <rect width="50" height="50" rx="12" fill="${color}"/>
            <text x="25" y="32" font-family="Arial" font-size="20" font-weight="bold" fill="white" text-anchor="middle">${letter}</text>
        </svg>
    `;
}

function updateSalaryDisplay() {
    if (!salarySlider) return;
    
    const value = salarySlider.value;
    const salaryValues = document.querySelector('.salary-values');
    if (salaryValues) {
        salaryValues.innerHTML = `
            <span>${value} RON</span>
            <span>20000+ RON</span>
        `;
    }
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
        font-weight: 500;
    `;
    notification.innerHTML = `
        <i class="fas fa-check-circle" style="margin-right: 0.5rem;"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function setupAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.hero, .job-card, .stat');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Smooth scrolling for quick links
function smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Add loading states
function showLoading() {
    jobsContainer.innerHTML = `
        <div class="loading" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
            <div class="loading-spinner" style="
                width: 40px; 
                height: 40px; 
                border: 4px solid var(--color-gray-200); 
                border-top: 4px solid var(--color-primary); 
                border-radius: 50%; 
                animation: spin 1s linear infinite; 
                margin: 0 auto 1rem;
            "></div>
            <p style="color: var(--color-gray-600);">Se încarcă joburile...</p>
        </div>
    `;
}

// Add CSS for spinner animation
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .no-jobs {
        grid-column: 1 / -1;
        text-align: center;
        padding: 4rem 2rem;
        background: rgba(255, 255, 255, 0.5);
        border-radius: var(--border-radius-lg);
        border: 2px dashed var(--color-gray-300);
    }
    
    .job-card {
        opacity: 0;
        animation: fadeInUp 0.6s ease forwards;
    }
`;
document.head.appendChild(style);

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === '/') {
        e.preventDefault();
        searchInput.focus();
    }
    
    if (e.key === 'Escape') {
        searchInput.blur();
        searchInput.value = '';
        filterJobs();
    }
});

// Add search suggestions (optional enhancement)
const searchSuggestions = [
    'Frontend Developer',
    'Backend Developer',
    'UX/UI Designer',
    'Product Manager',
    'Data Scientist',
    'Marketing Specialist',
    'React',
    'Python',
    'JavaScript',
    'Remote',
    'Full-time',
    'Part-time'
];

// Auto-complete functionality
searchInput.addEventListener('input', function() {
    const value = this.value.toLowerCase();
    if (value.length < 2) return;
    
    const suggestions = searchSuggestions.filter(suggestion => 
        suggestion.toLowerCase().includes(value)
    );
    
    // You can implement dropdown suggestions here
});

// Performance optimization: Debounce search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Replace direct search with debounced version
const debouncedSearch = debounce(filterJobs, 300);
searchInput.removeEventListener('input', handleSearch);
searchInput.addEventListener('input', debouncedSearch);