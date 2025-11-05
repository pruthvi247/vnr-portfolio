// Profile Page Sidebar Navigation JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize sidebar navigation
    initializeSidebarNavigation();
    
    // Initialize section switching based on URL hash
    initializeSectionRouting();
    
    // Handle window resize for responsive behavior
    handleResponsiveNavigation();
    
    // Initialize AOS animations when sections change
    initializeAnimations();
    
    // Initialize overview button functionality
    initializeOverviewButton();
    // Initialize main navigation for profile page
    initializeMainNavigation();
});

function initializeSidebarNavigation() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const contentSections = document.querySelectorAll('.content-section');
    
    // Add click event listeners to sidebar links
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSection = this.getAttribute('data-section');
            switchToSection(targetSection);
            
            // Update URL hash
            window.history.pushState(null, null, `#${targetSection}`);
        });
    });
    
    function switchToSection(targetSectionId) {
        // Remove active class from all sidebar links
        sidebarLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Hide all content sections
        contentSections.forEach(section => {
            section.style.display = 'none';
            section.classList.remove('active');
        });
        
        // Activate the clicked sidebar link
        const activeLink = document.querySelector(`[data-section="${targetSectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        
        // Special handling for profile-overview - scroll to top of page
        if (targetSectionId === 'profile-overview') {
            // Show the overview message section
            const targetSection = document.getElementById(targetSectionId);
            if (targetSection) {
                targetSection.style.display = 'block';
                targetSection.classList.add('active');
            }
            
            // Scroll to the top of the profile page (breadcrumb area)
            const breadcrumbContainer = document.querySelector('.breadcrumb-container') || document.querySelector('.detailed-profile-section');
            if (breadcrumbContainer) {
                breadcrumbContainer.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            } else {
                // Fallback - scroll to top of page
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        } else {
            // Show the target section for other sections
            const targetSection = document.getElementById(targetSectionId);
            if (targetSection) {
                targetSection.style.display = 'block';
                targetSection.classList.add('active');
                
                // Scroll to top of the section
                targetSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
        
        // Re-initialize AOS animations for the new section
        if (typeof AOS !== 'undefined') {
            setTimeout(() => {
                AOS.refresh();
            }, 100);
        }
    }
    
    // Expose function globally for URL routing
    window.switchToSection = switchToSection;
}

function initializeSectionRouting() {
    // Handle initial page load with hash
    const initialHash = window.location.hash.substr(1);
    if (initialHash && document.getElementById(initialHash)) {
        switchToSection(initialHash);
    } else {
        // Default to profile overview
        switchToSection('profile-overview');
    }
    
    // Handle back/forward navigation
    window.addEventListener('popstate', function() {
        const hash = window.location.hash.substr(1);
        if (hash && document.getElementById(hash)) {
            switchToSection(hash);
        } else {
            switchToSection('profile-overview');
        }
    });
}

function handleResponsiveNavigation() {
    // Create mobile sidebar toggle functionality
    createMobileSidebarToggle();
    
    // Handle window resize
    window.addEventListener('resize', function() {
        handleSidebarResponsive();
    });
    
    // Initial call
    handleSidebarResponsive();
}

function createMobileSidebarToggle() {
    const sidebar = document.querySelector('.profile-sidebar');
    const mainContent = document.querySelector('.profile-main-content');
    
    if (!sidebar || !mainContent) return;
    
    // Create mobile toggle button
    const toggleButton = document.createElement('button');
    toggleButton.className = 'mobile-sidebar-toggle';
    toggleButton.innerHTML = '<i class="fas fa-bars"></i>';
    toggleButton.setAttribute('aria-label', 'Toggle Sidebar Menu');
    
    // Add toggle button to the page
    const profileLayout = document.querySelector('.profile-layout');
    if (profileLayout) {
        profileLayout.insertBefore(toggleButton, sidebar);
    }
    
    // Toggle functionality
    toggleButton.addEventListener('click', function() {
        sidebar.classList.toggle('mobile-open');
        toggleButton.classList.toggle('active');
        
        // Update icon
        const icon = toggleButton.querySelector('i');
        if (sidebar.classList.contains('mobile-open')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-bars';
        }
    });
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !toggleButton.contains(e.target)) {
                sidebar.classList.remove('mobile-open');
                toggleButton.classList.remove('active');
                toggleButton.querySelector('i').className = 'fas fa-bars';
            }
        }
    });
    
    // Close sidebar when selecting a section on mobile
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('mobile-open');
                toggleButton.classList.remove('active');
                toggleButton.querySelector('i').className = 'fas fa-bars';
            }
        });
    });
}

function handleSidebarResponsive() {
    const sidebar = document.querySelector('.profile-sidebar');
    if (!sidebar) return;
    
    if (window.innerWidth > 768) {
        // Desktop: ensure sidebar is visible
        sidebar.classList.remove('mobile-open');
        const toggleButton = document.querySelector('.mobile-sidebar-toggle');
        if (toggleButton) {
            toggleButton.classList.remove('active');
            toggleButton.querySelector('i').className = 'fas fa-bars';
        }
    }
}

function initializeAnimations() {
    // Initialize AOS if available
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out',
            once: false,
            mirror: true,
            offset: 100
        });
    }
}

// Gallery filter functionality (if gallery section exists)
document.addEventListener('DOMContentLoaded', function() {
    initializeGalleryFilters();
});

function initializeGalleryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (!filterButtons.length || !galleryItems.length) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeInUp 0.6s ease-out';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substr(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Add smooth transitions when sections change
function addSectionTransitions() {
    const style = document.createElement('style');
    style.textContent = `
        .content-section {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease-out;
        }
        
        .content-section.active {
            opacity: 1;
            transform: translateY(0);
        }
        
        .sidebar-link {
            transition: all 0.3s ease;
        }
        
        .sidebar-link.active {
            background-color: #dc2626;
            color: white;
        }
    `;
    document.head.appendChild(style);
}

// Initialize section transitions
document.addEventListener('DOMContentLoaded', addSectionTransitions);

// Language toggle support (if language functionality exists)
document.addEventListener('DOMContentLoaded', function() {
    // Ensure language toggle works on profile page
    const langToggle = document.getElementById('langToggle');
    if (langToggle && typeof window.toggleLanguage === 'function') {
        // Language functionality should already be loaded from main.js
        console.log('Language toggle functionality available on profile page');
    }
    
    // Initialize profile image carousel
    initializeProfileCarousel();
    
    // Initialize overview button
    initializeOverviewButton();
});

// Profile Image Carousel Functionality
function initializeProfileCarousel() {
    const carousel = document.querySelector('.profile-image-carousel');
    if (!carousel) return;
    
    const images = carousel.querySelectorAll('.leader-image-large');
    const dots = carousel.querySelectorAll('.carousel-dot');
    const captions = document.querySelectorAll('.carousel-caption');
    
    if (images.length === 0) return;
    
    let currentSlide = 0;
    let autoplayInterval;
    
    // Initialize carousel
    function initCarousel() {
        // Show first image and caption
        showSlide(0);
        
        // Add click listeners to dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
            });
        });
        
        // Add hover listeners to pause/resume autoplay
        carousel.addEventListener('mouseenter', pauseAutoplay);
        carousel.addEventListener('mouseleave', startAutoplay);
        
        // Start autoplay
        startAutoplay();
    }
    
    // Show specific slide
    function showSlide(slideIndex) {
        // Hide all images and remove active class
        images.forEach((img, index) => {
            img.classList.remove('active');
        });
        
        // Hide all captions
        captions.forEach((caption, index) => {
            caption.classList.remove('active');
        });
        
        // Remove active class from all dots
        dots.forEach((dot, index) => {
            dot.classList.remove('active');
        });
        
        // Show current image, caption, and dot
        if (images[slideIndex]) {
            images[slideIndex].classList.add('active');
        }
        
        if (captions[slideIndex]) {
            captions[slideIndex].classList.add('active');
        }
        
        if (dots[slideIndex]) {
            dots[slideIndex].classList.add('active');
        }
        
        currentSlide = slideIndex;
    }
    
    // Go to specific slide
    function goToSlide(slideIndex) {
        if (slideIndex >= 0 && slideIndex < images.length) {
            showSlide(slideIndex);
            // Reset autoplay timer
            pauseAutoplay();
            startAutoplay();
        }
    }
    
    // Next slide
    function nextSlide() {
        const nextIndex = (currentSlide + 1) % images.length;
        showSlide(nextIndex);
    }
    
    // Start autoplay
    function startAutoplay() {
        // Only start autoplay if there are multiple images
        if (images.length > 1) {
            autoplayInterval = setInterval(nextSlide, 4000); // Change every 4 seconds
        }
    }
    
    // Pause autoplay
    function pauseAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
        }
    }
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!carousel.matches(':hover')) return;
        
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            const prevIndex = (currentSlide - 1 + images.length) % images.length;
            goToSlide(prevIndex);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            const nextIndex = (currentSlide + 1) % images.length;
            goToSlide(nextIndex);
        }
    });
    
    // Add touch/swipe support for mobile
    let startX = 0;
    let startY = 0;
    
    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        pauseAutoplay();
    }, { passive: true });
    
    carousel.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        // Only handle horizontal swipes
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
                // Swipe left - next image
                nextSlide();
            } else {
                // Swipe right - previous image
                const prevIndex = (currentSlide - 1 + images.length) % images.length;
                goToSlide(prevIndex);
            }
        }
        
        startAutoplay();
    }, { passive: true });
    
    // Add intersection observer for performance
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startAutoplay();
            } else {
                pauseAutoplay();
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(carousel);
    
    // Initialize the carousel
    initCarousel();
    
    // Cleanup function
    function cleanup() {
        pauseAutoplay();
        observer.disconnect();
    }
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', cleanup);
    
    // Return control object for external access
    return {
        goToSlide,
        nextSlide,
        startAutoplay,
        pauseAutoplay,
        getCurrentSlide: () => currentSlide
    };
}

// Initialize Overview Button Functionality
function initializeOverviewButton() {
    const overviewButton = document.querySelector('.overview-scroll-btn');
    
    if (overviewButton) {
        overviewButton.addEventListener('click', function() {
            // Scroll to the top of the profile page (breadcrumb area)
            const breadcrumbContainer = document.querySelector('.breadcrumb-container') || document.querySelector('.detailed-profile-section');
            if (breadcrumbContainer) {
                breadcrumbContainer.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            } else {
                // Fallback - scroll to top of page
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    }
}
// Initialize Main Navigation for Profile Page
function initializeMainNavigation() {
    const mainNavLinks = document.querySelectorAll('.main-nav .nav-menu a');
    
    mainNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Handle sections that exist on this page
            if (href.startsWith('#') && !href.includes('index.html')) {
                e.preventDefault();
                
                const sectionId = href.substring(1);
                
                // Special handling for profile link
                if (sectionId === "profile") {
                    sectionId = "profile-overview";
                }
                const targetSection = document.getElementById(sectionId);
                
                if (targetSection) {
                    // Switch to the section using sidebar navigation
                    if (typeof window.switchToSection === 'function') {
                        window.switchToSection(sectionId);
                    }
                    
                    // Update URL hash
                    window.history.pushState(null, null, href);
                    
                    // Update active nav item
                    mainNavLinks.forEach(navLink => {
                        navLink.classList.remove('active');
                    });
                    this.classList.add('active');
                }
            }
            // For external links (like index.html#hero), let them work normally
        });
    });
}
