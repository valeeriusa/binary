// ===== MODERN JOB WEBSITE SCRIPT =====

// DOM Elements
const navbar = document.querySelector('.navbar');
const heroSection = document.querySelector('.hero');
const filterTabs = document.querySelectorAll('.filter-tab');
const jobCards = document.querySelectorAll('.job-card');
const searchInputs = document.querySelectorAll('.search-field input');
const applyBtns = document.querySelectorAll('.apply-btn');
const bookmarkBtns = document.querySelectorAll('.job-bookmark');
const navLinks = document.querySelectorAll('.nav-link');

// ===== NAVBAR SCROLL EFFECT =====
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add backdrop blur effect on scroll
    if (scrollTop > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.15)';
        navbar.style.backdropFilter = 'blur(25px)';
        navbar.style.borderBottom = '1px solid rgba(255, 255, 255, 0.3)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.1)';
        navbar.style.backdropFilter = 'blur(20px)';
        navbar.style.borderBottom = '1px solid rgba(255, 255, 255, 0.2)';
    }
    
    // Hide/show navbar on scroll
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
});

// ===== SMOOTH NAVIGATION =====
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all links
        navLinks.forEach(l => l.classList.remove('active'));
        
        // Add active class to clicked link
        link.classList.add('active');
        
        // Get target section
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
        
        // Add ripple effect
        createRipple(link, e);
    });
});

// ===== JOB FILTERING =====
filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const filter = tab.getAttribute('data-filter');
        
        // Update active tab
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Filter job cards with animation
        filterJobs(filter);
        
        // Add pulse effect
        tab.style.transform = 'scale(0.95)';
        setTimeout(() => {
            tab.style.transform = 'scale(1)';
        }, 150);
    });
});

function filterJobs(filter) {
    jobCards.forEach((card, index) => {
        const categories = card.getAttribute('data-category').split(' ');
        const shouldShow = filter === 'all' || categories.includes(filter);
        
        if (shouldShow) {
            // Show with staggered animation
            setTimeout(() => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px) scale(0.95)';
                
                setTimeout(() => {
                    card.style.display = 'block';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0) scale(1)';
                }, 50);
            }, index * 100);
        } else {
            // Hide with fade out
            card.style.opacity = '0';
            card.style.transform = 'translateY(-20px) scale(0.95)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

// ===== SEARCH FUNCTIONALITY =====
let searchTimeout;

searchInputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.style.transform = 'scale(1.02)';
        input.parentElement.style.boxShadow = '0 12px 40px rgba(102, 126, 234, 0.15)';
    });
    
    input.addEventListener('blur', () => {
        input.parentElement.style.transform = 'scale(1)';
        input.parentElement.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.12)';
    });
    
    input.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        
        // Add typing effect
        input.parentElement.style.borderColor = 'rgba(102, 126, 234, 0.4)';
        
        searchTimeout = setTimeout(() => {
            input.parentElement.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            
            // Perform search (placeholder functionality)
            const searchTerm = e.target.value.toLowerCase();
            if (searchTerm.length > 2) {
                performSearch(searchTerm);
            }
        }, 500);
    });
});

function performSearch(term) {
    // Advanced search functionality
    jobCards.forEach(card => {
        const title = card.querySelector('.job-title').textContent.toLowerCase();
        const company = card.querySelector('.company-name').textContent.toLowerCase();
        const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
        
        const matches = title.includes(term) || 
                       company.includes(term) || 
                       tags.some(tag => tag.includes(term));
        
        if (matches) {
            card.style.display = 'block';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
            
            // Highlight matching text
            highlightText(card, term);
        } else {
            card.style.opacity = '0.3';
            card.style.transform = 'translateY(10px)';
        }
    });
}

function highlightText(card, term) {
    // Add subtle glow effect to matching cards
    card.style.boxShadow = '0 20px 60px rgba(102, 126, 234, 0.2)';
    card.style.borderColor = 'rgba(102, 126, 234, 0.3)';
    
    setTimeout(() => {
        card.style.boxShadow = '';
        card.style.borderColor = '';
    }, 2000);
}

// ===== APPLY BUTTON INTERACTIONS =====
applyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        const jobCard = btn.closest('.job-card');
        const jobTitle = jobCard.querySelector('.job-title').textContent;
        const companyName = jobCard.querySelector('.company-name').textContent;
        
        // Button animation
        btn.style.transform = 'scale(0.95)';
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Applying...';
        btn.style.background = 'linear-gradient(135deg, #00c9ff 0%, #92fe9d 100%)';
        
        // Simulate API call
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-check"></i> Applied!';
            btn.style.background = 'linear-gradient(135deg, #92fe9d 0%, #a8edea 100%)';
            
            // Show success notification
            showNotification(`Successfully applied to ${jobTitle} at ${companyName}!`, 'success');
            
            // Reset button after delay
            setTimeout(() => {
                btn.innerHTML = '<span>Apply Now</span><i class="fas fa-arrow-right"></i>';
                btn.style.background = '';
                btn.style.transform = 'scale(1)';
            }, 3000);
        }, 2000);
    });
});

// ===== BOOKMARK FUNCTIONALITY =====
bookmarkBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        const icon = btn.querySelector('i');
        const isBookmarked = icon.classList.contains('fas');
        
        if (isBookmarked) {
            // Remove bookmark
            icon.classList.remove('fas');
            icon.classList.add('far');
            btn.style.background = 'rgba(255, 255, 255, 0.1)';
            btn.style.color = '';
            showNotification('Removed from bookmarks', 'info');
        } else {
            // Add bookmark
            icon.classList.remove('far');
            icon.classList.add('fas');
            btn.style.background = 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)';
            btn.style.color = 'white';
            showNotification('Added to bookmarks', 'success');
        }
        
        // Pulse animation
        btn.style.transform = 'scale(1.2)';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
        }, 200);
    });
});

// ===== JOB CARD HOVER EFFECTS =====
jobCards.forEach(card => {
    let hoverTimeout;
    
    card.addEventListener('mouseenter', () => {
        clearTimeout(hoverTimeout);
        
        // Enhanced hover effect
        card.style.transform = 'translateY(-8px) scale(1.02)';
        card.style.boxShadow = '0 25px 80px rgba(102, 126, 234, 0.15)';
        card.style.borderColor = 'rgba(102, 126, 234, 0.3)';
        
        // Add glow to apply button
        const applyBtn = card.querySelector('.apply-btn');
        applyBtn.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
    });
    
    card.addEventListener('mouseleave', () => {
        hoverTimeout = setTimeout(() => {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '';
            card.style.borderColor = '';
            
            const applyBtn = card.querySelector('.apply-btn');
            applyBtn.style.boxShadow = '';
        }, 100);
    });
    
    // Click animation
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.apply-btn') && !e.target.closest('.job-bookmark')) {
            createRipple(card, e);
            
            // Simulate opening job details
            setTimeout(() => {
                showJobDetails(card);
            }, 300);
        }
    });
});

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const colors = {
        success: 'linear-gradient(135deg, #92fe9d 0%, #a8edea 100%)',
        error: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
        info: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        transform: translateX(400px);
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        z-index: 10000;
        font-weight: 500;
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 400);
    }, 4000);
}

// ===== RIPPLE EFFECT =====
function createRipple(element, event) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
        z-index: 1;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// ===== JOB DETAILS MODAL =====
function showJobDetails(jobCard) {
    const jobTitle = jobCard.querySelector('.job-title').textContent;
    const companyName = jobCard.querySelector('.company-name').textContent;
    const location = jobCard.querySelector('.job-location span').textContent;
    const salary = jobCard.querySelector('.job-salary').textContent;
    
    const modal = document.createElement('div');
    modal.className = 'job-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div class="modal-content" style="
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 20px;
            padding: 2rem;
            max-width: 600px;
            width: 90%;
            transform: scale(0.9);
            transition: transform 0.3s ease;
        ">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h2 style="color: white; margin: 0;">${jobTitle}</h2>
                <button class="modal-close" style="
                    background: rgba(255, 255, 255, 0.1);
                    border: none;
                    color: white;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 1.2rem;
                ">×</button>
            </div>
            <div style="color: rgba(255, 255, 255, 0.9); line-height: 1.6;">
                <p><strong>Company:</strong> ${companyName}</p>
                <p><strong>Location:</strong> ${location}</p>
                <p><strong>Salary:</strong> ${salary}</p>
                <p><strong>Description:</strong> This is a fantastic opportunity to join our team and make a real impact. We're looking for passionate individuals who want to grow their career in a dynamic environment.</p>
            </div>
            <div style="margin-top: 2rem; display: flex; gap: 1rem;">
                <button class="btn-primary" style="
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 12px;
                    cursor: pointer;
                    font-weight: 600;
                ">Apply Now</button>
                <button class="btn-secondary" style="
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    padding: 0.75rem 1.5rem;
                    border-radius: 12px;
                    cursor: pointer;
                    font-weight: 600;
                ">Save for Later</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Animate in
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.querySelector('.modal-content').style.transform = 'scale(1)';
    }, 10);
    
    // Close functionality
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('modal-close')) {
            closeModal(modal);
        }
    });
}

function closeModal(modal) {
    modal.style.opacity = '0';
    modal.querySelector('.modal-content').style.transform = 'scale(0.9)';
    setTimeout(() => {
        document.body.removeChild(modal);
    }, 300);
}

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Staggered animation for job cards
            if (entry.target.classList.contains('job-card')) {
                const cards = Array.from(document.querySelectorAll('.job-card'));
                const index = cards.indexOf(entry.target);
                entry.target.style.animationDelay = `${index * 0.1}s`;
            }
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.job-card, .company-card, .hero-badge').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    // Search shortcut (Ctrl/Cmd + K)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('.search-field input');
        searchInput.focus();
        searchInput.select();
    }
    
    // Escape to clear search
    if (e.key === 'Escape') {
        const searchInputs = document.querySelectorAll('.search-field input');
        searchInputs.forEach(input => {
            input.value = '';
            input.blur();
        });
        
        // Reset job cards
        jobCards.forEach(card => {
            card.style.display = 'block';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
    }
});

// ===== PERFORMANCE OPTIMIZATIONS =====
// Debounce function for search
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

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== CSS ANIMATION KEYFRAMES =====
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .notification {
        animation: slideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(400px);
        }
        to {
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);

// ===== INITIALIZE APP =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 JobsSpace Ultra Modern Website Loaded!');
    
    // Add loading animation to job cards
    jobCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Initialize smooth scroll
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Show welcome notification
    setTimeout(() => {
        showNotification('Welcome to JobsSpace! Find your dream job today 🚀', 'info');
    }, 1000);
});

// ===== EXPORT FOR MODULES (if needed) =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showNotification,
        createRipple,
        filterJobs,
        performSearch
    };
}