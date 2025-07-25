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
    
    // Keep navbar completely transparent on scroll
    navbar.style.background = 'transparent';
    navbar.style.backdropFilter = 'none';
    navbar.style.borderBottom = 'none';
    
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
    
    // Initialize Social Network functionality
    initializeSocialNetwork();
    
    // Show welcome notification
    setTimeout(() => {
        showNotification('Welcome to JobsSpace! Find your dream job today 🚀', 'info');
    }, 1000);
});

// ===== SOCIAL NETWORK FUNCTIONALITY =====

// Social Network Elements
const networkSection = document.querySelector('.network-section');
const storyItems = document.querySelectorAll('.story-item');
const sidebarItems = document.querySelectorAll('.sidebar-item');
const postInput = document.querySelector('.post-input');
const postBtn = document.querySelector('.post-btn');
const actionBtns = document.querySelectorAll('.action-btn');
const commentBtns = document.querySelectorAll('.comment-btn');

// Initialize Social Network when section is visible
function initializeSocialNetwork() {
    if (!networkSection) return;
    
    setupSocialEventListeners();
    setupPostInteractions();
    setupCommentSystems();
}

function setupSocialEventListeners() {
    // Story interactions
    storyItems.forEach(story => {
        story.addEventListener('click', handleStoryClick);
    });
    
    // Sidebar navigation
    sidebarItems.forEach(item => {
        item.addEventListener('click', handleSidebarClick);
    });
    
    // Post creation
    if (postInput) {
        postInput.addEventListener('focus', () => {
            postInput.parentElement.style.transform = 'scale(1.02)';
            postInput.parentElement.style.boxShadow = '0 8px 30px rgba(139, 92, 246, 0.15)';
        });
        
        postInput.addEventListener('blur', () => {
            postInput.parentElement.style.transform = 'scale(1)';
            postInput.parentElement.style.boxShadow = '';
        });
    }
    
    if (postBtn) {
        postBtn.addEventListener('click', handleCreatePost);
    }
}

function setupPostInteractions() {
    // Like, Comment, Share buttons
    document.addEventListener('click', (e) => {
        if (e.target.closest('.like-btn')) {
            handleLikePost(e);
        } else if (e.target.closest('.comment-btn')) {
            handleCommentToggle(e);
        } else if (e.target.closest('.share-btn')) {
            handleSharePost(e);
        } else if (e.target.closest('.send-comment')) {
            handleSendComment(e);
        }
    });
}

function setupCommentSystems() {
    // Comment input interactions
    const commentInputs = document.querySelectorAll('.comment-input');
    commentInputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSendComment(e);
            }
        });
    });
}

function handleStoryClick(e) {
    const storyItem = e.currentTarget;
    const storyName = storyItem.querySelector('span').textContent;
    
    if (storyItem.classList.contains('add-story')) {
        // Handle add story
        showStoryModal('create');
    } else {
        // View story
        showStoryModal('view', storyName);
    }
    
    // Animation
    storyItem.style.transform = 'scale(0.95)';
    setTimeout(() => {
        storyItem.style.transform = 'translateY(-5px)';
    }, 150);
}

function handleSidebarClick(e) {
    e.preventDefault();
    
    // Remove active from all items
    sidebarItems.forEach(item => item.classList.remove('active'));
    
    // Add active to clicked item
    e.currentTarget.classList.add('active');
    
    // Add ripple effect
    createRipple(e.currentTarget, e);
    
    // Filter posts based on sidebar selection
    const itemText = e.currentTarget.querySelector('span').textContent;
    filterPosts(itemText);
    
    showNotification(`Viewing ${itemText}`, 'info');
}

function handleCreatePost() {
    const postText = postInput.value.trim();
    
    if (!postText) {
        showNotification('Please write something to post!', 'error');
        return;
    }
    
    // Create new post
    createNewPost(postText);
    
    // Clear input
    postInput.value = '';
    
    // Animation
    postBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        postBtn.style.transform = 'scale(1)';
    }, 150);
    
    showNotification('Post created successfully! 🎉', 'success');
}

function handleLikePost(e) {
    e.preventDefault();
    const likeBtn = e.target.closest('.like-btn');
    const icon = likeBtn.querySelector('i');
    const span = likeBtn.querySelector('span');
    const postStats = likeBtn.closest('.post-item').querySelector('.post-stats');
    
    // Toggle like state
    if (likeBtn.classList.contains('liked')) {
        // Unlike
        likeBtn.classList.remove('liked');
        icon.className = 'far fa-thumbs-up';
        span.textContent = 'Like';
        likeBtn.style.color = '';
        
        // Update stats
        updatePostStats(postStats, 'like', -1);
    } else {
        // Like
        likeBtn.classList.add('liked');
        icon.className = 'fas fa-thumbs-up';
        span.textContent = 'Liked';
        likeBtn.style.color = '#3b82f6';
        
        // Animation
        icon.style.transform = 'scale(1.3)';
        setTimeout(() => {
            icon.style.transform = 'scale(1)';
        }, 200);
        
        // Update stats
        updatePostStats(postStats, 'like', 1);
        
        // Show heart animation
        showLikeAnimation(likeBtn);
    }
}

function handleCommentToggle(e) {
    e.preventDefault();
    const commentBtn = e.target.closest('.comment-btn');
    const postItem = commentBtn.closest('.post-item');
    const commentsSection = postItem.querySelector('.comments-section');
    
    if (commentsSection.style.display === 'none' || !commentsSection.style.display) {
        // Show comments
        commentsSection.style.display = 'block';
        commentsSection.style.opacity = '0';
        commentsSection.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            commentsSection.style.opacity = '1';
            commentsSection.style.transform = 'translateY(0)';
        }, 10);
        
        // Focus comment input
        const commentInput = commentsSection.querySelector('.comment-input');
        if (commentInput) {
            setTimeout(() => commentInput.focus(), 300);
        }
    } else {
        // Hide comments
        commentsSection.style.opacity = '0';
        commentsSection.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            commentsSection.style.display = 'none';
        }, 300);
    }
}

function handleSharePost(e) {
    e.preventDefault();
    const shareBtn = e.target.closest('.share-btn');
    const postItem = shareBtn.closest('.post-item');
    const postStats = postItem.querySelector('.post-stats');
    
    // Animation
    shareBtn.style.transform = 'scale(0.9)';
    setTimeout(() => {
        shareBtn.style.transform = 'scale(1)';
    }, 150);
    
    // Update stats
    updatePostStats(postStats, 'share', 1);
    
    // Show share options (simplified)
    showNotification('Post shared! 📤', 'success');
}

function handleSendComment(e) {
    e.preventDefault();
    const sendBtn = e.target.closest('.send-comment');
    const commentInput = e.target.closest('.add-comment').querySelector('.comment-input');
    const commentText = commentInput.value.trim();
    
    if (!commentText) return;
    
    // Create new comment
    createNewComment(sendBtn, commentText);
    
    // Clear input
    commentInput.value = '';
    
    // Animation
    sendBtn.style.transform = 'scale(0.9)';
    setTimeout(() => {
        sendBtn.style.transform = 'scale(1)';
    }, 150);
}

function createNewPost(text) {
    const postsContainer = document.querySelector('.posts-feed');
    const newPost = document.createElement('div');
    newPost.className = 'post-item';
    newPost.style.opacity = '0';
    newPost.style.transform = 'translateY(20px)';
    
    newPost.innerHTML = `
        <div class="post-header">
            <div class="post-user">
                <div class="user-avatar">
                    <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iMjAiIGZpbGw9IiM4YjVjZjYiLz4KPHRleHQgeD0iMjAiIHk9IjI2IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+WTwvdGV4dD4KPC9zdmc+" alt="You">
                </div>
                <div class="user-info">
                    <h4>You</h4>
                    <p>Just now</p>
                </div>
            </div>
            <button class="post-menu">
                <i class="fas fa-ellipsis-h"></i>
            </button>
        </div>
        <div class="post-content">
            <p>${text}</p>
        </div>
        <div class="post-stats">
            <span>👍 0 • 💬 0 • 📤 0</span>
        </div>
        <div class="post-actions">
            <button class="action-btn like-btn">
                <i class="far fa-thumbs-up"></i>
                <span>Like</span>
            </button>
            <button class="action-btn comment-btn">
                <i class="far fa-comment"></i>
                <span>Comment</span>
            </button>
            <button class="action-btn share-btn">
                <i class="far fa-share-square"></i>
                <span>Share</span>
            </button>
        </div>
        <div class="comments-section" style="display: none;"></div>
    `;
    
    // Insert after create post
    const createPost = postsContainer.querySelector('.create-post');
    createPost.insertAdjacentElement('afterend', newPost);
    
    // Animate in
    setTimeout(() => {
        newPost.style.opacity = '1';
        newPost.style.transform = 'translateY(0)';
    }, 100);
}

function createNewComment(sendBtn, text) {
    const addComment = sendBtn.closest('.add-comment');
    const commentsSection = addComment.closest('.comments-section');
    const postStats = commentsSection.closest('.post-item').querySelector('.post-stats');
    
    const newComment = document.createElement('div');
    newComment.className = 'comment-item';
    newComment.style.opacity = '0';
    newComment.style.transform = 'translateX(-20px)';
    
    newComment.innerHTML = `
        <div class="user-avatar small">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iMTYiIGZpbGw9IiM4YjVjZjYiLz4KPHRleHQgeD0iMTYiIHk9IjIwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+WTwvdGV4dD4KPC9zdmc+" alt="You">
        </div>
        <div class="comment-content">
            <div class="comment-bubble">
                <strong>You</strong>
                <p>${text}</p>
            </div>
            <div class="comment-actions">
                <button class="comment-like">Like</button>
                <button class="comment-reply">Reply</button>
                <span class="comment-time">Now</span>
            </div>
        </div>
    `;
    
    // Insert before add comment
    addComment.insertAdjacentElement('beforebegin', newComment);
    
    // Update post stats
    updatePostStats(postStats, 'comment', 1);
    
    // Animate in
    setTimeout(() => {
        newComment.style.opacity = '1';
        newComment.style.transform = 'translateX(0)';
    }, 100);
}

function updatePostStats(statsElement, type, change) {
    const statsText = statsElement.textContent;
    const regex = type === 'like' ? /👍 (\d+)/ : type === 'comment' ? /💬 (\d+)/ : /📤 (\d+)/;
    const match = statsText.match(regex);
    
    if (match) {
        const currentCount = parseInt(match[1]);
        const newCount = Math.max(0, currentCount + change);
        const emoji = type === 'like' ? '👍' : type === 'comment' ? '💬' : '📤';
        
        const newStatsText = statsText.replace(regex, `${emoji} ${newCount}`);
        statsElement.textContent = newStatsText;
    }
}

function showLikeAnimation(element) {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.style.cssText = `
        position: absolute;
        font-size: 1.5rem;
        pointer-events: none;
        z-index: 1000;
        animation: likeFloat 1s ease-out forwards;
    `;
    
    const rect = element.getBoundingClientRect();
    heart.style.left = rect.left + rect.width / 2 + 'px';
    heart.style.top = rect.top + rect.height / 2 + 'px';
    
    document.body.appendChild(heart);
    
    setTimeout(() => {
        document.body.removeChild(heart);
    }, 1000);
}

function showStoryModal(type, name = '') {
    const modal = document.createElement('div');
    modal.className = 'story-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    const content = type === 'create' ? 
        '<h2 style="color: white; text-align: center;">Create Story Feature Coming Soon! 📸</h2>' :
        `<h2 style="color: white; text-align: center;">Viewing ${name}'s Story 👀</h2>`;
    
    modal.innerHTML = `
        <div style="background: var(--glass-bg); backdrop-filter: blur(20px); border-radius: 20px; padding: 3rem; text-align: center; border: 1px solid var(--glass-border);">
            ${content}
            <button onclick="this.closest('.story-modal').remove()" style="margin-top: 2rem; background: var(--gradient-purple); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 12px; cursor: pointer;">Close</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function filterPosts(filterType) {
    const posts = document.querySelectorAll('.post-item');
    
    posts.forEach((post, index) => {
        // Simple animation for filtering
        post.style.opacity = '0.5';
        setTimeout(() => {
            post.style.opacity = '1';
        }, index * 100);
    });
}

// Add CSS for like animation
const socialStyle = document.createElement('style');
socialStyle.textContent = `
    @keyframes likeFloat {
        0% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(-50px) scale(1.5);
        }
    }
    
    .comments-section {
        transition: all 0.3s ease;
    }
    
    .story-item:hover .story-avatar {
        transform: scale(1.1);
    }
    
    .post-item {
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(socialStyle);

// ===== EXPORT FOR MODULES (if needed) =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showNotification,
        createRipple,
        filterJobs,
        performSearch,
        initializeSocialNetwork
    };
}