/**
 * INDIAN POLITICIAN PORTFOLIO - MAIN JAVASCRIPT
 * Features: Bilingual Support (English/Telugu), Smooth Scrolling, 
 * Mobile Navigation, Animations, and Interactive Elements
 */

// =============================================================================
// GLOBAL VARIABLES AND CONFIGURATION
// =============================================================================

const CONFIG = {
    currentLanguage: localStorage.getItem('preferred-language') || 'en',
    animationDuration: 300,
    scrollOffset: 80,
    dateFormat: {
        en: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
        te: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    }
};

// Telugu translations for date formatting
const teluguTranslations = {
    months: [
        'జనవరి', 'ఫిబ్రవరి', 'మార్చి', 'ఏప్రిల్', 'మే', 'జూన్',
        'జూలై', 'ఆగస్టు', 'సెప్టెంబర్', 'అక్టోబర్', 'నవంబర్', 'డిసెంబర్'
    ],
    days: ['ఆదివారం', 'సోమవారం', 'మంగళవారం', 'బుధవారం', 'గురువారం', 'శుక్రవారం', 'శనివారం']
};

// =============================================================================
// DOM READY AND INITIALIZATION
// =============================================================================

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize all components
    setupLanguageToggle();
    setupVNRLogo();
    setupMobileNavigation();
    setupSmoothScrolling();
    setupAnimations();
    setupFormHandlers();
    setupNewsletterSignup();
    setupGalleryFilters();
    setupTestimonialsCarousel();
    
    // Set initial language
    setLanguage(CONFIG.currentLanguage);
    
    console.log('Portfolio initialized successfully');
}

// =============================================================================
// LANGUAGE SWITCHING FUNCTIONALITY
// =============================================================================

function setupLanguageToggle() {
    const langToggle = document.getElementById('langToggle');
    const langOptions = document.querySelectorAll('.lang-option');
    
    if (!langToggle) return;
    
    langToggle.addEventListener('click', function() {
        const newLang = CONFIG.currentLanguage === 'en' ? 'te' : 'en';
        setLanguage(newLang);
        
        // Update visual active state
        langOptions.forEach(option => {
            option.classList.toggle('active', option.dataset.lang === newLang);
        });
    });
}

function setLanguage(lang) {
    CONFIG.currentLanguage = lang;
    localStorage.setItem('preferred-language', lang);
    
    // Update all elements with data attributes
    const elements = document.querySelectorAll('[data-en][data-te]');
    elements.forEach(element => {
        const text = element.getAttribute(`data-${lang}`);
        if (text) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = text;
            } else {
                element.innerHTML = text;
            }
        }
    });
    
    // Update document title
    const titleElement = document.querySelector('title[data-en][data-te]');
    if (titleElement) {
        document.title = titleElement.getAttribute(`data-${lang}`);
    }
    
    // Update HTML lang attribute
    document.documentElement.lang = lang === 'te' ? 'te-IN' : 'en-IN';
    
    // Trigger custom event for other components
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
}

// =============================================================================
// VNR LOGO FUNCTIONALITY
// =============================================================================

function setupVNRLogo() {
    const logoCircle = document.querySelector('.logo-circle');
    if (!logoCircle) return;
    
    // Add click animation
    logoCircle.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
    });
}

// =============================================================================
// MOBILE NAVIGATION
// =============================================================================

function setupMobileNavigation() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!mobileToggle || !navMenu) return;
    
    mobileToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        this.classList.toggle('active');
        
        // Update ARIA attributes
        const isOpen = navMenu.classList.contains('active');
        this.setAttribute('aria-expanded', isOpen);
        
        // Change icon
        const icon = this.querySelector('i');
        if (icon) {
            icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
        }
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    
    // Close menu when clicking nav links
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
            mobileToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
            
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-bars';
            }
        });
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
            mobileToggle.focus();
        }
    });
}

// =============================================================================
// SMOOTH SCROLLING AND NAVIGATION HIGHLIGHTING
// =============================================================================

function setupSmoothScrolling() {
    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - CONFIG.scrollOffset;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                history.pushState(null, null, `#${targetId}`);
                
                // Focus management for accessibility
                targetElement.focus({ preventScroll: true });
            }
        });
    });
    
    // Highlight active navigation item on scroll
    setupScrollSpy();
}

function setupScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    if (sections.length === 0 || navLinks.length === 0) return;
    
    function updateActiveNav() {
        const scrollPosition = window.pageYOffset + CONFIG.scrollOffset + 100;
        
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.id;
            }
        });
        
        // Update active nav link
        navLinks.forEach(link => {
            const isActive = link.getAttribute('href') === `#${currentSection}`;
            link.classList.toggle('active', isActive);
            link.setAttribute('aria-current', isActive ? 'page' : 'false');
        });
    }
    
    // Throttled scroll listener for performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateActiveNav, 10);
    });
}

// =============================================================================
// ANIMATIONS AND VISUAL EFFECTS
// =============================================================================

function setupAnimations() {
    // Initialize AOS (Animate On Scroll) if available
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100,
            disable: 'mobile' // Disable on mobile for performance
        });
    }
    
    // Setup intersection observer for custom animations
    setupIntersectionObserver();
    
    // Setup parallax effects
    setupParallaxEffects();
}

function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Trigger counter animations for stats
                if (entry.target.classList.contains('stat-number')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const elementsToAnimate = document.querySelectorAll('.story-card, .pillar-card, .stat-number, .timeline-item');
    elementsToAnimate.forEach(el => observer.observe(el));
}

function animateCounter(element) {
    if (element.dataset.animated) return;
    element.dataset.animated = 'true';
    
    const target = parseInt(element.textContent.replace(/[^\d]/g, ''));
    const suffix = element.textContent.replace(/[\d]/g, '');
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + suffix;
    }, 16);
}

function setupParallaxEffects() {
    // Subtle parallax for hero image
    const heroImage = document.querySelector('.hero-image img');
    if (!heroImage) return;
    
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (scrolled <= window.innerHeight) {
            heroImage.style.transform = `translateY(${rate}px)`;
        }
        
        ticking = false;
    }
    
    function requestParallaxUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    // Only on desktop for performance
    if (window.innerWidth > 768) {
        window.addEventListener('scroll', requestParallaxUpdate);
    }
}

// =============================================================================
// FORM HANDLING AND VALIDATION
// =============================================================================

function setupFormHandlers() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearErrors);
        });
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    // Validate form
    if (!validateForm(form)) {
        return;
    }
    
    // Show loading state
    showFormLoading(form, true);
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        showFormLoading(form, false);
        showFormSuccess(form);
        form.reset();
    }, 2000);
}

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Clear previous errors
    clearFieldError(field);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        errorMessage = CONFIG.currentLanguage === 'en' ? 
            'This field is required' : 'ఈ ఫీల్డ్ అవసరం';
        isValid = false;
    }
    
    // Email validation
    else if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            errorMessage = CONFIG.currentLanguage === 'en' ? 
                'Please enter a valid email address' : 'దయచేసి చెల్లుబాటు అయ్యే ఇమెయిల్ చిరునామా నమోదు చేయండి';
            isValid = false;
        }
    }
    
    // Phone validation
    else if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            errorMessage = CONFIG.currentLanguage === 'en' ? 
                'Please enter a valid phone number' : 'దయచేసి చెల్లుబాటు అయ్యే ఫోన్ నంబర్ నమోదు చేయండి';
            isValid = false;
        }
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    field.setAttribute('aria-invalid', 'true');
    
    // Create or update error message
    let errorElement = field.parentElement.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.setAttribute('role', 'alert');
        field.parentElement.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
}

function clearFieldError(field) {
    field.classList.remove('error');
    field.setAttribute('aria-invalid', 'false');
    
    const errorElement = field.parentElement.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

function clearErrors(e) {
    const field = e.target;
    if (field.classList.contains('error') && field.value.trim()) {
        clearFieldError(field);
    }
}

function showFormLoading(form, isLoading) {
    const submitButton = form.querySelector('button[type="submit"]');
    if (!submitButton) return;
    
    if (isLoading) {
        submitButton.disabled = true;
        submitButton.innerHTML = CONFIG.currentLanguage === 'en' ? 
            '<i class="fas fa-spinner fa-spin"></i> Sending...' : 
            '<i class="fas fa-spinner fa-spin"></i> పంపుతోంది...';
    } else {
        submitButton.disabled = false;
        submitButton.innerHTML = CONFIG.currentLanguage === 'en' ? 
            '<i class="fas fa-paper-plane"></i> Send Message' : 
            '<i class="fas fa-paper-plane"></i> సందేశం పంపండి';
    }
}

function showFormSuccess(form) {
    const successMessage = document.createElement('div');
    successMessage.className = 'form-success';
    successMessage.innerHTML = CONFIG.currentLanguage === 'en' ? 
        '<i class="fas fa-check-circle"></i> Thank you! Your message has been sent successfully.' : 
        '<i class="fas fa-check-circle"></i> ధన్యవాదములు! మీ సందేశం విజయవంతంగా పంపబడింది.';
    
    form.parentElement.insertBefore(successMessage, form);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        if (successMessage.parentElement) {
            successMessage.remove();
        }
    }, 5000);
}

// =============================================================================
// NEWSLETTER SIGNUP
// =============================================================================

function setupNewsletterSignup() {
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = form.querySelector('input[type="email"]').value;
            
            // Simulate newsletter signup
            const button = form.querySelector('button');
            const originalText = button.innerHTML;
            
            button.innerHTML = CONFIG.currentLanguage === 'en' ? 
                '<i class="fas fa-spinner fa-spin"></i> Subscribing...' : 
                '<i class="fas fa-spinner fa-spin"></i> సబ్‌స్క్రైబ్ చేస్తోంది...';
            button.disabled = true;
            
            setTimeout(() => {
                button.innerHTML = CONFIG.currentLanguage === 'en' ? 
                    '<i class="fas fa-check"></i> Subscribed!' : 
                    '<i class="fas fa-check"></i> సబ్‌స్క్రైబ్ అయ్యారు!';
                
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.disabled = false;
                    form.reset();
                }, 2000);
            }, 1500);
        });
    });
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

// Debounce function for performance optimization
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

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// =============================================================================
// KEYBOARD NAVIGATION AND ACCESSIBILITY
// =============================================================================

// Improve keyboard navigation
document.addEventListener('keydown', function(e) {
    // Skip links navigation
    if (e.key === 'Tab' && e.target.classList.contains('skip-link')) {
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.focus();
            e.preventDefault();
        }
    }
});

// Focus management for modal-like interactions
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        }
    });
}

// =============================================================================
// PERFORMANCE MONITORING AND ERROR HANDLING
// =============================================================================

// Log performance metrics
window.addEventListener('load', function() {
    if ('performance' in window) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Page load time: ${loadTime}ms`);
    }
});

// Global error handler
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // In production, you might want to send this to an error tracking service
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
});

// =============================================================================
// GALLERY FILTERS
// =============================================================================

function setupGalleryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (filterButtons.length === 0 || galleryItems.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                const category = item.dataset.category;
                const shouldShow = filter === 'all' || category === filter;
                
                if (shouldShow) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// =============================================================================
// TESTIMONIALS CAROUSEL
// =============================================================================

function setupTestimonialsCarousel() {
    const carousel = document.querySelector('.testimonials-carousel');
    const slides = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    
    if (!carousel || slides.length === 0) return;
    
    let currentSlide = 0;
    const slideCount = slides.length;
    
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Show current slide
        slides[index].classList.add('active');
        dots[index].classList.add('active');
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slideCount;
        showSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slideCount) % slideCount;
        showSlide(currentSlide);
    }
    
    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });
    
    // Auto-advance slides (optional)
    setInterval(nextSlide, 8000); // Change slide every 8 seconds
    
    // Keyboard navigation
    carousel.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
    
    // Make carousel focusable for keyboard navigation
    carousel.setAttribute('tabindex', '0');
}

// =============================================================================
// PROGRESS ANIMATIONS
// =============================================================================

function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.style.width;
                
                // Reset and animate
                progressBar.style.width = '0%';
                setTimeout(() => {
                    progressBar.style.width = width;
                }, 100);
                
                observer.unobserve(progressBar);
            }
        });
    });
    
    progressBars.forEach(bar => observer.observe(bar));
}

// =============================================================================
// VIDEO PLAYER INTERACTIONS
// =============================================================================

function setupVideoInteractions() {
    const videoCards = document.querySelectorAll('.video-card');
    
    videoCards.forEach(card => {
        card.addEventListener('click', function() {
            // In a real implementation, this would open a video modal or navigate to YouTube
            const videoTitle = this.querySelector('h4').textContent;
            alert(`Opening video: ${videoTitle}`);
        });
        
        // Keyboard support
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // Make focusable
        card.setAttribute('tabindex', '0');
    });
}

// =============================================================================
// CAMPAIGN PROGRESS CIRCLES
// =============================================================================

function animateProgressCircles() {
    const progressCircles = document.querySelectorAll('.progress-circle');
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const circle = entry.target;
                const progress = parseInt(circle.dataset.progress) || 75;
                const color1 = getComputedStyle(document.documentElement).getPropertyValue('--saffron');
                const color2 = getComputedStyle(document.documentElement).getPropertyValue('--light-gray');
                
                // Animate the conic gradient
                let currentProgress = 0;
                const targetProgress = progress;
                const duration = 2000;
                const stepTime = 16;
                const steps = duration / stepTime;
                const progressStep = targetProgress / steps;
                
                const animateProgress = () => {
                    if (currentProgress < targetProgress) {
                        currentProgress += progressStep;
                        const backgroundImage = `conic-gradient(${color1} ${currentProgress}%, ${color2} 0)`;
                        circle.style.background = backgroundImage;
                        requestAnimationFrame(animateProgress);
                    }
                };
                
                animateProgress();
                observer.unobserve(circle);
            }
        });
    });
    
    progressCircles.forEach(circle => observer.observe(circle));
}

// Initialize new animations when page loads
document.addEventListener('DOMContentLoaded', function() {
    animateProgressBars();
    animateProgressCircles();
    setupVideoInteractions();
});

// =============================================================================
// EXPORT FOR TESTING (if needed)
// =============================================================================

// Make functions available for testing in development
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        setLanguage,
        validateField,
        isInViewport,
        debounce,
        throttle,
        setupGalleryFilters,
        setupTestimonialsCarousel
    };
}