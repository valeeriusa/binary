// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initSearch();
    initAnimations();
    initJobFilters();
    initScrollEffects();
});

// Navigation functionality
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
            
            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Close mobile menu
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    });

    // Update active nav link on scroll
    window.addEventListener('scroll', () => {
        let currentSection = '';
        const sections = ['home', 'jobs', 'companies', 'about', 'contact'];
        
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                const sectionTop = section.offsetTop - 120;
                const sectionHeight = section.offsetHeight;
                
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    currentSection = sectionId;
                }
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });
}

// Search functionality
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    const locationInput = document.querySelector('.location-input');
    const searchBtn = document.querySelector('.search-btn');
    const filterTags = document.querySelectorAll('.filter-tag');

    // Search button click
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }

    // Enter key search
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    if (locationInput) {
        locationInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    // Filter tags
    filterTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const filterValue = tag.textContent;
            searchInput.value = filterValue;
            performSearch();
            
            // Add active state
            filterTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
        });
    });

    function performSearch() {
        const searchTerm = searchInput?.value || '';
        const location = locationInput?.value || '';
        
        // Simulate search (in a real app, this would make an API call)
        console.log('Searching for:', searchTerm, 'in', location);
        
        // Add loading animation
        if (searchBtn) {
            searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            
            setTimeout(() => {
                searchBtn.innerHTML = '<i class="fas fa-arrow-right"></i>';
                // Scroll to jobs section
                const jobsSection = document.getElementById('jobs');
                if (jobsSection) {
                    jobsSection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 1000);
        }
    }
}

// Animation initialization
function initAnimations() {
    // Animate gradient orbs
    const orbs = document.querySelectorAll('.gradient-orb');
    orbs.forEach((orb, index) => {
        orb.style.animationDelay = `${index * 2}s`;
    });

    // Intersection Observer for fade-in animations
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
    const animateElements = document.querySelectorAll('.job-card, .feature-card, .company-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Job filters and interactions
function initJobFilters() {
    const jobCards = document.querySelectorAll('.job-card');
    const applyBtns = document.querySelectorAll('.apply-btn');

    // Apply button functionality
    applyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const jobCard = btn.closest('.job-card');
            const jobTitle = jobCard.querySelector('.job-title').textContent;
            const companyName = jobCard.querySelector('.company-name').textContent;
            
            // Show application modal (simplified)
            showApplicationModal(jobTitle, companyName);
        });
    });

    // Job card hover effects
    jobCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Scroll effects
function initScrollEffects() {
    let ticking = false;
    
    function updateScrollEffects() {
        const scrolled = window.scrollY;
        const rate = scrolled * -0.5;
        
        // Parallax effect for hero background
        const heroBackground = document.querySelector('.hero-background');
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${rate}px)`;
        }
        
        // Navbar background opacity
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            const opacity = Math.min(scrolled / 100, 1);
            navbar.style.background = `rgba(255, 255, 255, ${0.25 + opacity * 0.5})`;
        }
        
        ticking = false;
    }
    
    function requestScrollUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestScrollUpdate);
}

// Application modal (simplified)
function showApplicationModal(jobTitle, companyName) {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(20px);
        z-index: 2000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    // Create modal content
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = `
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        border-radius: 20px;
        padding: 40px;
        max-width: 500px;
        width: 90%;
        text-align: center;
        transform: scale(0.8);
        transition: transform 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div style="margin-bottom: 24px;">
            <div style="width: 80px; height: 80px; margin: 0 auto 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                <i class="fas fa-briefcase" style="color: white; font-size: 2rem;"></i>
            </div>
            <h3 style="font-size: 1.8rem; font-weight: 700; color: #1d1d1f; margin-bottom: 8px;">Apply for ${jobTitle}</h3>
            <p style="color: #6e6e73; font-size: 1.1rem; margin-bottom: 24px;">at ${companyName}</p>
        </div>
        
        <div style="margin-bottom: 32px;">
            <p style="color: #6e6e73; line-height: 1.6;">
                This is a demo application. In a real job portal, this would redirect to the application form or the company's career page.
            </p>
        </div>
        
        <div style="display: flex; gap: 16px; justify-content: center;">
            <button class="close-modal" style="padding: 12px 24px; background: transparent; border: 2px solid rgba(0, 0, 0, 0.2); border-radius: 12px; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">
                Close
            </button>
            <button class="apply-now" style="padding: 12px 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 12px; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">
                Apply Now
            </button>
        </div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Animate in
    setTimeout(() => {
        overlay.style.opacity = '1';
        modal.style.transform = 'scale(1)';
    }, 10);
    
    // Close functionality
    const closeModal = () => {
        overlay.style.opacity = '0';
        modal.style.transform = 'scale(0.8)';
        setTimeout(() => {
            document.body.removeChild(overlay);
        }, 300);
    };
    
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });
    
    modal.querySelector('.close-modal').addEventListener('click', closeModal);
    
    modal.querySelector('.apply-now').addEventListener('click', () => {
        alert('Redirecting to application form...');
        closeModal();
    });
}

// Utility functions
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

// Smooth reveal animation for elements
function revealElement(element, delay = 0) {
    setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }, delay);
}

// Add some interactive particle effects (optional)
function createParticleEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            pointer-events: none;
            opacity: 0;
            animation: float-particle ${5 + Math.random() * 10}s linear infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 5}s;
        `;
        hero.appendChild(particle);
    }
}

// CSS animation for particles
const style = document.createElement('style');
style.textContent = `
    @keyframes float-particle {
        0% {
            opacity: 0;
            transform: translateY(100vh) scale(0);
        }
        10% {
            opacity: 1;
            transform: translateY(90vh) scale(1);
        }
        90% {
            opacity: 1;
            transform: translateY(-10vh) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(-20vh) scale(0);
        }
    }
    
    .filter-tag.active {
        background: rgba(102, 126, 234, 0.2) !important;
        color: #667eea !important;
        border-color: #667eea !important;
    }
    
    .nav-menu.active {
        display: flex !important;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        padding: 20px;
        border-radius: 0 0 20px 20px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    }
    
    .nav-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .nav-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .nav-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
`;
document.head.appendChild(style);

// Initialize particle effect
// createParticleEffect();