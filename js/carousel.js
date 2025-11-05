/**
 * Side Stories Carousel Handler
 * Manages dynamic loading and navigation of side stories content
 */

class SideStoriesCarousel {
    constructor() {
        this.currentIndex = 0;
        this.stories = [];
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000; // 5 seconds
        
        // Cache DOM elements - wait for DOM to be ready
        this.initElements();
        this.init();
    }
    
    initElements() {
        // Cache DOM elements with error checking
        this.carousel = document.querySelector('.stories-carousel');
        this.prevBtn = document.querySelector('.carousel-btn-small.prev');
        this.nextBtn = document.querySelector('.carousel-btn-small.next');
        this.dotsContainer = document.querySelector('.story-dots');
        
        // Debug element selection
        console.log('Carousel elements found:', {
            carousel: !!this.carousel,
            prevBtn: !!this.prevBtn,
            nextBtn: !!this.nextBtn,
            dotsContainer: !!this.dotsContainer
        });
        
        if (!this.carousel) {
            console.error('Carousel container not found! Make sure .stories-carousel exists in the DOM.');
        }
        if (!this.prevBtn || !this.nextBtn) {
            console.error('Navigation buttons not found! Make sure .carousel-btn-small.prev and .carousel-btn-small.next exist in the DOM.');
        }
    }
    
    async init() {
        try {
            await this.loadStories();
            console.log(`Side Stories Carousel: Loaded ${this.stories.length} stories`);
            
            if (this.stories.length === 0) {
                console.error('No stories loaded, showing error state');
                this.showErrorState();
                return;
            }
            
            this.setupEventListeners();
            this.createDots();
            this.updateCarousel();
            
            // Start auto-play after a short delay to ensure everything is set up
            setTimeout(() => {
                this.isVisible = true;
                this.startAutoPlay();
            }, 1000);
            
            console.log('Carousel initialization complete');
            
        } catch (error) {
            console.error('Failed to initialize carousel:', error);
            this.showErrorState();
        }
    }
    
    async loadStories() {
        // Get current language from active language option or default to English
        const activeLangOption = document.querySelector('.lang-option.active');
        const currentLang = activeLangOption ? activeLangOption.getAttribute('data-lang') : 'en';
        const storiesPath = `content/${currentLang}/side-stories.json`;
        
        try {
            const response = await fetch(storiesPath);
            if (!response.ok) {
                throw new Error(`Failed to load stories: ${response.status}`);
            }
            
            const data = await response.json();
            const rawStories = data.side_stories || data.stories || [];
            
            if (rawStories.length === 0) {
                throw new Error('No stories found in data');
            }
            
            // Transform stories to flat structure with current language
            this.stories = rawStories.map(story => ({
                id: story.id,
                headline: typeof story.headline === 'object' ? story.headline[currentLang] || story.headline.en : story.headline,
                summary: typeof story.summary === 'object' ? story.summary[currentLang] || story.summary.en : story.summary,
                category: typeof story.category === 'object' ? story.category[currentLang] || story.category.en : story.category,
                date: story.date,
                featured: story.featured || false
            }));
            
            // Sort stories to show featured ones first
            this.stories.sort((a, b) => {
                if (a.featured && !b.featured) return -1;
                if (!a.featured && b.featured) return 1;
                return 0;
            });
            
        } catch (error) {
            console.error('Error loading stories:', error);
            // Fallback to sample data if loading fails
            this.loadFallbackStories();
        }
    }
    
    loadFallbackStories() {
        this.stories = [
            {
                id: 'fallback-1',
                headline: 'System News',
                summary: 'Unable to load news content. Please check your connection and try again.',
                category: 'System',
                date: new Date().toISOString().split('T')[0],
                featured: false
            }
        ];
    }
    
    setupEventListeners() {
        // Navigation buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.pauseAutoPlay();
                this.prevStory();
            });
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.pauseAutoPlay();
                this.nextStory();
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.pauseAutoPlay();
                this.prevStory();
            } else if (e.key === 'ArrowRight') {
                this.pauseAutoPlay();
                this.nextStory();
            }
        });
        
        // Pause auto-play on hover
        if (this.carousel) {
            this.carousel.addEventListener('mouseenter', () => this.pauseAutoPlay());
            this.carousel.addEventListener('mouseleave', () => {
                if (this.isVisible !== false) {
                    this.startAutoPlay();
                }
            });
        }
        
        // Set up intersection observer to pause when not visible
        this.setupVisibilityObserver();
        
        // Touch/swipe support for mobile
        this.setupTouchEvents();
    }
    
    setupTouchEvents() {
        if (!this.carousel) return;
        
        let startX = 0;
        let startY = 0;
        let currentX = 0;
        let currentY = 0;
        let isDragging = false;
        
        this.carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isDragging = true;
            this.pauseAutoPlay();
        }, { passive: true });
        
        this.carousel.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            currentX = e.touches[0].clientX;
            currentY = e.touches[0].clientY;
        }, { passive: true });
        
        this.carousel.addEventListener('touchend', () => {
            if (!isDragging) return;
            
            const deltaX = startX - currentX;
            const deltaY = Math.abs(startY - currentY);
            
            // Only handle horizontal swipes
            if (Math.abs(deltaX) > 50 && deltaY < 100) {
                if (deltaX > 0) {
                    this.nextStory();
                } else {
                    this.prevStory();
                }
            }
            
            isDragging = false;
        }, { passive: true });
    }
    
    createDots() {
        if (!this.dotsContainer) return;
        
        this.dotsContainer.innerHTML = '';
        
        this.stories.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'story-dot';
            dot.addEventListener('click', () => {
                this.pauseAutoPlay();
                this.goToStory(index);
            });
            this.dotsContainer.appendChild(dot);
        });
    }
    
    updateCarousel() {
        if (!this.carousel) return;
        
        // Always render stories to ensure content is displayed
        this.renderStories();
        
        // For vertical layout, show current story by hiding others
        this.showCurrentStory();
        
        // Update dots
        this.updateDots();
        
        // Update button states
        this.updateButtonStates();
    }
    
    renderStories() {
        if (!this.carousel) {
            console.error('Carousel container not found in renderStories');
            return;
        }
        
        console.log(`Rendering ${this.stories.length} stories`);
        this.carousel.innerHTML = '';
        
        this.stories.forEach((story, index) => {
            const storyCard = this.createStoryCard(story, index);
            this.carousel.appendChild(storyCard);
            console.log(`Added story ${index + 1}: ${story.headline}`);
        });
        
        console.log(`Carousel now has ${this.carousel.children.length} children`);
    }
    
    showCurrentStory() {
        // For breaking news, show multiple stories but highlight current one
        const storyCards = this.carousel.querySelectorAll('.story-card');
        const maxVisible = 4; // Show 4 stories at a time
        
        storyCards.forEach((card, index) => {
            // Calculate which stories should be visible
            const startIndex = Math.max(0, Math.min(this.currentIndex, this.stories.length - maxVisible));
            const endIndex = Math.min(startIndex + maxVisible, this.stories.length);
            
            if (index >= startIndex && index < endIndex) {
                card.style.display = 'block';
                // Highlight current story
                if (index === this.currentIndex) {
                    card.classList.add('current-story');
                } else {
                    card.classList.remove('current-story');
                }
            } else {
                card.style.display = 'none';
                card.classList.remove('current-story');
            }
        });
    }
    
    createStoryCard(story, index) {
        const card = document.createElement('div');
        card.className = `story-card ${story.featured ? 'featured' : ''}`;
        card.setAttribute('data-story-id', story.id);
        
        // Format date for display
        const displayDate = this.formatDate(story.date);
        
        // Generate placeholder image based on category
        const imageUrl = this.generatePlaceholderImage(story.category, index);
        
        card.innerHTML = `
            <div class="story-image-small">
                <img src="${imageUrl}" alt="${this.escapeHtml(story.headline)}" loading="lazy" 
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMwMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMTgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgOTBMMTI1IDY1SDE3NUwxNTAgOTBaIiBmaWxsPSIjOTM5RkJBIi8+CjxjaXJjbGUgY3g9IjEzMCIgY3k9IjcwIiByPSI1IiBmaWxsPSIjOTM5RkJBIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTIwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5MzlGQkEiPk5ld3MgSW1hZ2U8L3RleHQ+Cjwvc3ZnPgo='">
            </div>
            <h3>${this.escapeHtml(story.headline)}</h3>
            <p>${this.escapeHtml(story.summary)}</p>
            <div class="story-meta">
                <span class="story-category">${this.escapeHtml(story.category)}</span>
                <span class="story-date">${displayDate}</span>
            </div>
        `;
        
        // Add click handler for story interaction
        card.addEventListener('click', () => {
            this.handleStoryClick(story, index);
        });
        
        return card;
    }
    
    generatePlaceholderImage(category, index) {
        // Generate category-based placeholder images
        const imageMap = {
            'Education': 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=300&h=180&fit=crop&auto=format',
            'Healthcare': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=180&fit=crop&auto=format',
            'Employment': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=180&fit=crop&auto=format',
            'Infrastructure': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&h=180&fit=crop&auto=format',
            'Technology': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=180&fit=crop&auto=format',
            'Empowerment': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=180&fit=crop&auto=format'
        };
        
        // Fallback to a generic government/political image
        return imageMap[category] || 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=300&h=180&fit=crop&auto=format';
    }
    
    formatDate(dateString) {
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffTime = Math.abs(now - date);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 0) {
                return 'Today';
            } else if (diffDays === 1) {
                return 'Yesterday';
            } else if (diffDays < 7) {
                return `${diffDays} days ago`;
            } else {
                return date.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
                });
            }
        } catch (error) {
            return dateString;
        }
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    updateDots() {
        const dots = this.dotsContainer?.querySelectorAll('.story-dot');
        if (!dots) return;
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }
    
    updateButtonStates() {
        // Enable/disable previous button
        if (this.prevBtn) {
            const isFirstStory = this.currentIndex === 0;
            this.prevBtn.disabled = isFirstStory;
            this.prevBtn.style.opacity = isFirstStory ? '0.5' : '1';
            this.prevBtn.style.cursor = isFirstStory ? 'not-allowed' : 'pointer';
        }
        
        // Enable/disable next button
        if (this.nextBtn) {
            const isLastStory = this.currentIndex === this.stories.length - 1;
            this.nextBtn.disabled = isLastStory;
            this.nextBtn.style.opacity = isLastStory ? '0.5' : '1';
            this.nextBtn.style.cursor = isLastStory ? 'not-allowed' : 'pointer';
        }
        

    }
    
    nextStory() {
        if (this.currentIndex < this.stories.length - 1) {
            this.currentIndex++;
            this.scrollToCurrentStory();
        }
    }
    
    prevStory() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.scrollToCurrentStory();
        }
    }
    
    scrollToCurrentStory() {
        const storyCards = this.carousel.querySelectorAll('.story-card');
        const carouselContainer = this.carousel.parentElement; // .stories-carousel-container
        
        if (storyCards[this.currentIndex] && carouselContainer) {
            // Calculate scroll position within the container only
            const cardTop = storyCards[this.currentIndex].offsetTop;
            const containerHeight = carouselContainer.clientHeight;
            const cardHeight = storyCards[this.currentIndex].offsetHeight;
            
            // Center the card in the container
            const scrollTop = Math.max(0, cardTop - (containerHeight - cardHeight) / 2);
            
            carouselContainer.scrollTo({
                top: scrollTop,
                behavior: 'smooth'
            });
        }
        this.updateDots();
        this.updateButtonStates();
    }
    
    goToStory(index) {
        if (index >= 0 && index < this.stories.length && index !== this.currentIndex) {
            this.currentIndex = index;
            this.updateCarousel();
        }
    }
    
    startAutoPlay() {
        if (this.stories.length <= 1 || this.autoPlayInterval) return;
        
        this.autoPlayInterval = setInterval(() => {
            if (this.currentIndex < this.stories.length - 1) {
                this.currentIndex++;
            } else {
                this.currentIndex = 0; // Loop back to first story
            }
            
            // Update display and scroll within carousel container
            this.showCurrentStory();
            this.scrollToCurrentStory();
            this.updateDots();
            this.updateButtonStates();
        }, this.autoPlayDelay);
    }
    
    isCarouselVisible() {
        if (!this.carousel) return false;
        
        const rect = this.carousel.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        
        // Check if at least part of the carousel is visible
        return rect.top < windowHeight && rect.bottom > 0;
    }
    
    setupVisibilityObserver() {
        if (!this.carousel || !window.IntersectionObserver) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Carousel is visible, start auto-play if not already running
                    this.isVisible = true;
                    if (!this.autoPlayInterval) {
                        this.startAutoPlay();
                    }
                } else {
                    // Carousel is not visible, pause auto-play
                    this.isVisible = false;
                    this.pauseAutoPlay();
                }
            });
        }, {
            threshold: 0.1 // Trigger when 10% visible
        });
        
        observer.observe(this.carousel);
        this.visibilityObserver = observer;
    }
    
    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    handleStoryClick(story, index) {
        // Emit custom event for story interaction
        const event = new CustomEvent('storyClick', {
            detail: { story, index }
        });
        document.dispatchEvent(event);
        
        // You can add more interaction logic here
        console.log(`Story clicked: ${story.headline}`);
    }
    
    showErrorState() {
        if (!this.carousel) return;
        
        this.carousel.innerHTML = `
            <div class="story-card loading">
                <div class="loading-content">
                    <div class="loading-headline"></div>
                    <div class="loading-summary"></div>
                    <div class="loading-summary" style="width: 70%;"></div>
                </div>
            </div>
        `;
    }
    
    // Public methods for external control
    refresh() {
        this.pauseAutoPlay();
        this.init();
    }
    
    destroy() {
        this.pauseAutoPlay();
        if (this.visibilityObserver) {
            this.visibilityObserver.disconnect();
        }
        // Remove event listeners if needed
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if carousel elements exist before initializing
    const carouselContainer = document.querySelector('.stories-carousel');
    if (carouselContainer) {
        window.sideStoriesCarousel = new SideStoriesCarousel();
    }
});

// Handle language switching
document.addEventListener('languageChanged', () => {
    if (window.sideStoriesCarousel) {
        window.sideStoriesCarousel.refresh();
    }
});