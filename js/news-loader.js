/**
 * NEWS LOADER - MODAL NEWS CONTENT MANAGEMENT
 * Loads news content from modal-news.json and manages story categories
 */

class NewsLoader {
    constructor() {
        this.currentLang = localStorage.getItem('preferred-language') || 'en';
        this.newsData = null;
        this.storyCategories = {
            exclusive: [],
            regular: [],
            side: [],
            magazine: [],
            editorial: []
        };
    }

    /**
     * Load news data from modal-news.json
     */
    async loadNewsData() {
        try {
            const response = await fetch('content/news-content/modal-news.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.newsData = await response.json();
            this.categorizeStories();
            return this.newsData;
        } catch (error) {
            console.error('Error loading news data:', error);
            return null;
        }
    }

    /**
     * Categorize stories by type
     */
    categorizeStories() {
        if (!this.newsData) return;

        this.storyCategories = {
            exclusive: [],
            regular: [],
            side: [],
            magazine: [],
            editorial: []
        };

        this.newsData.forEach(story => {
            if (story.status !== 'published') return;

            switch (story.category) {
                case 'exclusive_story':
                    this.storyCategories.exclusive.push(story);
                    break;
                case 'regular_story':
                    this.storyCategories.regular.push(story);
                    break;
                case 'side_story':
                    this.storyCategories.side.push(story);
                    break;
                case 'magazine_story':
                    this.storyCategories.magazine.push(story);
                    break;
                case 'editorial_story':
                    this.storyCategories.editorial.push(story);
                    break;
            }
        });

        // Sort by publish date (newest first)
        Object.keys(this.storyCategories).forEach(category => {
            this.storyCategories[category].sort((a, b) => 
                new Date(b.publishDate) - new Date(a.publishDate)
            );
        });
    }

    /**
     * Get stories by category
     * @param {string} category - Story category (exclusive, regular, side, magazine, editorial)
     * @param {number} limit - Maximum number of stories to return
     */
    getStoriesByCategory(category, limit = null) {
        const stories = this.storyCategories[category] || [];
        return limit ? stories.slice(0, limit) : stories;
    }

    /**
     * Get the latest exclusive story for hero section
     */
    getLatestExclusiveStory() {
        return this.storyCategories.exclusive[0] || null;
    }

    /**
     * Get side stories for carousel
     * @param {number} limit - Number of side stories to return
     */
    getSideStories(limit = 5) {
        return this.getStoriesByCategory('side', limit);
    }

    /**
     * Get regular stories for news feed
     * @param {number} limit - Number of regular stories to return
     */
    getRegularStories(limit = 10) {
        return this.getStoriesByCategory('regular', limit);
    }

    /**
     * Get story title based on current language
     * @param {object} story - Story object
     */
    getStoryTitle(story) {
        return this.currentLang === 'te' && story.title_telugu 
            ? story.title_telugu.replace('[translate:', '').replace(']', '')
            : story.title;
    }

    /**
     * Get story summary based on current language
     * @param {object} story - Story object
     */
    getStorySummary(story) {
        return this.currentLang === 'te' && story.summary_telugu 
            ? story.summary_telugu.replace('[translate:', '').replace(']', '')
            : story.summary;
    }

    /**
     * Get story content based on current language
     * @param {object} story - Story object
     */
    getStoryContent(story) {
        return this.currentLang === 'te' && story.content_telugu 
            ? story.content_telugu.replace('[translate:', '').replace(']', '')
            : story.content;
    }

    /**
     * Format publish date
     * @param {string} dateString - ISO date string
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        
        return this.currentLang === 'te' 
            ? date.toLocaleDateString('te-IN', options)
            : date.toLocaleDateString('en-IN', options);
    }

    /**
     * Update hero section with latest exclusive story
     */
    updateHeroSection() {
        const exclusiveStory = this.getLatestExclusiveStory();
        if (!exclusiveStory) {
            console.log('No exclusive story found for hero section');
            return;
        }

        console.log('Updating hero section with story:', exclusiveStory.title);

        // Update main headline
        const mainHeadline = document.querySelector('.main-headline');
        if (mainHeadline) {
            mainHeadline.textContent = this.getStoryTitle(exclusiveStory);
        }

        // Update lead story
        const leadStory = document.querySelector('.lead-story');
        if (leadStory) {
            leadStory.textContent = this.getStorySummary(exclusiveStory);
        }

        // Update hero image if available
        const heroImage = document.querySelector('.hero-image img');
        if (heroImage && exclusiveStory.featuredImageUrl) {
            heroImage.src = exclusiveStory.featuredImageUrl;
            heroImage.alt = this.getStoryTitle(exclusiveStory);
        }

        // Update image caption
        const imageCaption = document.querySelector('.image-caption p');
        if (imageCaption) {
            imageCaption.textContent = `Published: ${this.formatDate(exclusiveStory.publishDate)}`;
        }
    }

    /**
     * Update side stories carousel - Let carousel.js handle the rendering
     */
    updateSideStoriesCarousel() {
        const sideStories = this.getSideStories();
        
        console.log('Side stories found:', sideStories.length);
        
        if (!sideStories.length) return;

        // Just trigger an event to let the carousel know stories are ready
        document.dispatchEvent(new CustomEvent('sideStoriesReady', {
            detail: { stories: sideStories }
        }));
    }

    /**
     * Update ticker with latest news
     */
    updateNewsTicker() {
        const regularStories = this.getRegularStories(3);
        const tickerContent = document.querySelector('.ticker-content span');
        
        if (tickerContent && regularStories.length) {
            const tickerText = regularStories
                .map(story => this.getStoryTitle(story))
                .join(' • ');
            
            tickerContent.textContent = tickerText;
        }
    }

    /**
     * Update entire homepage with news data
     */
    async updateHomePage() {
        console.log('Starting news data load...');
        await this.loadNewsData();
        
        if (!this.newsData) {
            console.error('Failed to load news data');
            return;
        }

        console.log('News data loaded, updating sections...');
        this.updateHeroSection();
        this.updateSideStoriesCarousel();
        this.updateNewsTicker();

        console.log('Homepage updated with news data');
        
        // Notify that news data is ready
        document.dispatchEvent(new CustomEvent('newsDataReady', { 
            detail: { newsLoader: this } 
        }));
    }

    /**
     * Set language and update content
     */
    async setLanguage(lang) {
        this.currentLang = lang;
        this.updateHomePage();
    }

    /**
     * Get story by ID
     * @param {string} storyId - Story ID
     */
    getStoryById(storyId) {
        return this.newsData ? this.newsData.find(story => story.id === storyId) : null;
    }
}

// Initialize news loader
const newsLoader = new NewsLoader();

// Export for global use
window.newsLoader = newsLoader;