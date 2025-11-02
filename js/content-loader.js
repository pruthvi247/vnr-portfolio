/**
 * CONTENT LOADER - BILINGUAL CONTENT MANAGEMENT
 * Loads content from JSON files based on selected language
 */

class ContentLoader {
    constructor() {
        this.currentLang = localStorage.getItem('preferred-language') || 'en';
        this.contentCache = {};
        this.loadedSections = new Set();
    }

    /**
     * Load content for a specific section
     * @param {string} section - Section name (main, initiatives, events, etc.)
     * @param {string} lang - Language code (en, te)
     */
    async loadContent(section, lang = this.currentLang) {
        const cacheKey = `${section}_${lang}`;
        
        if (this.contentCache[cacheKey]) {
            return this.contentCache[cacheKey];
        }

        try {
            const response = await fetch(`content/${lang}/${section}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load ${section} content for ${lang}`);
            }
            
            const content = await response.json();
            this.contentCache[cacheKey] = content;
            return content;
        } catch (error) {
            console.error(`Error loading content for ${section} in ${lang}:`, error);
            
            // Fallback to English if Telugu fails
            if (lang === 'te') {
                return this.loadContent(section, 'en');
            }
            
            return null;
        }
    }

    /**
     * Load all content sections
     */
    async loadAllContent(lang = this.currentLang) {
        const sections = ['main', 'initiatives', 'events', 'campaigns', 'gallery', 'testimonials', 'contact'];
        const loadPromises = sections.map(section => this.loadContent(section, lang));
        
        try {
            const results = await Promise.all(loadPromises);
            const contentMap = {};
            
            sections.forEach((section, index) => {
                contentMap[section] = results[index];
            });
            
            return contentMap;
        } catch (error) {
            console.error('Error loading all content:', error);
            return null;
        }
    }

    /**
     * Update page content based on loaded JSON
     * @param {string} lang - Language code
     */
    async updatePageContent(lang = this.currentLang) {
        try {
            const allContent = await this.loadAllContent(lang);
            
            if (!allContent) {
                console.error('Failed to load content');
                return;
            }

            // Update main content (hero, about, manifesto)
            this.updateMainContent(allContent.main);
            
            // Update initiatives section
            this.updateInitiativesContent(allContent.initiatives);
            
            // Update events section
            this.updateEventsContent(allContent.events);
            
            // Update campaigns section
            this.updateCampaignsContent(allContent.campaigns);
            
            // Update gallery section
            this.updateGalleryContent(allContent.gallery);
            
            // Update testimonials section
            this.updateTestimonialsContent(allContent.testimonials);
            
            // Update contact section
            this.updateContactContent(allContent.contact);

            console.log(`Content updated for language: ${lang}`);
            
        } catch (error) {
            console.error('Error updating page content:', error);
        }
    }

    /**
     * Update main content sections (hero, about, manifesto)
     */
    updateMainContent(content) {
        if (!content) return;

        // Update site title
        if (content.site) {
            document.title = content.site.title;
            
            const newspaperTitle = document.querySelector('.newspaper-title span');
            if (newspaperTitle) {
                newspaperTitle.textContent = content.site.newspaper_name;
            }
            
            const tagline = document.querySelector('.tagline');
            if (tagline) {
                tagline.textContent = content.site.tagline;
            }
        }

        // Update hero section
        if (content.hero) {
            this.updateElement('.breaking-banner span', content.hero.breaking_banner);
            this.updateElement('.main-headline', content.hero.main_headline);
            this.updateElement('.lead-story', content.hero.lead_story);
            this.updateElement('[data-en="Join the Movement"]', content.hero.cta_primary);
            this.updateElement('[data-en="Read Full Story"]', content.hero.cta_secondary);
            this.updateElement('.image-caption p', content.hero.image_caption);
            
            // Update ticker
            this.updateElement('.ticker-content span', content.hero.ticker);
            
            // Update side stories
            if (content.hero.side_stories) {
                const storyCards = document.querySelectorAll('.story-card');
                content.hero.side_stories.forEach((story, index) => {
                    if (storyCards[index]) {
                        const titleEl = storyCards[index].querySelector('h3');
                        const summaryEl = storyCards[index].querySelector('p');
                        if (titleEl) titleEl.textContent = story.headline;
                        if (summaryEl) summaryEl.textContent = story.summary;
                    }
                });
            }
        }

        // Update about section
        if (content.about) {
            this.updateElement('.about-section .section-category', content.about.section_category);
            this.updateElement('.about-section .section-title', content.about.section_title);
            this.updateElement('.quote-box blockquote', `"${content.about.quote}"`);
            
            // Update biography
            if (content.about.biography) {
                const bioTextDiv = document.querySelector('.bio-text');
                if (bioTextDiv) {
                    bioTextDiv.innerHTML = content.about.biography.map(p => `<p>${p}</p>`).join('');
                }
            }
            
            // Update stats
            if (content.about.stats) {
                const statItems = document.querySelectorAll('.stat-item');
                content.about.stats.forEach((stat, index) => {
                    if (statItems[index]) {
                        const numberEl = statItems[index].querySelector('.stat-number');
                        const labelEl = statItems[index].querySelector('.stat-label');
                        if (numberEl) numberEl.textContent = stat.number;
                        if (labelEl) labelEl.textContent = stat.label;
                    }
                });
            }
            
            // Update timeline
            if (content.about.timeline) {
                const timelineItems = document.querySelectorAll('.timeline-item');
                content.about.timeline.forEach((item, index) => {
                    if (timelineItems[index]) {
                        const yearEl = timelineItems[index].querySelector('.year');
                        const eventEl = timelineItems[index].querySelector('.event');
                        if (yearEl) yearEl.textContent = item.year;
                        if (eventEl) eventEl.textContent = item.event;
                    }
                });
            }
        }

        // Update manifesto section
        if (content.manifesto) {
            this.updateElement('.manifesto-section .section-category', content.manifesto.section_category);
            this.updateElement('.manifesto-section .section-title', content.manifesto.section_title);
            
            if (content.manifesto.pillars) {
                const pillarCards = document.querySelectorAll('.pillar-card');
                content.manifesto.pillars.forEach((pillar, index) => {
                    if (pillarCards[index]) {
                        const titleEl = pillarCards[index].querySelector('h3');
                        const descEl = pillarCards[index].querySelector('p');
                        if (titleEl) titleEl.textContent = pillar.title;
                        if (descEl) descEl.textContent = pillar.description;
                    }
                });
            }
        }
    }

    /**
     * Update initiatives section
     */
    updateInitiativesContent(content) {
        if (!content) return;

        this.updateElement('.initiatives-section .section-category', content.section_category);
        this.updateElement('.initiatives-section .section-title', content.section_title);
        
        if (content.initiatives) {
            const initiativeCards = document.querySelectorAll('.initiative-card');
            content.initiatives.forEach((initiative, index) => {
                if (initiativeCards[index]) {
                    const card = initiativeCards[index];
                    const titleEl = card.querySelector('h3');
                    const descEl = card.querySelector('p');
                    const impactNumberEl = card.querySelector('.impact-number');
                    const impactLabelEl = card.querySelector('.impact-label');
                    
                    if (titleEl) titleEl.textContent = initiative.title;
                    if (descEl) descEl.textContent = initiative.description;
                    if (impactNumberEl) impactNumberEl.textContent = initiative.impact_number;
                    if (impactLabelEl) impactLabelEl.textContent = initiative.impact_label;
                }
            });
        }
    }

    /**
     * Update events section
     */
    updateEventsContent(content) {
        if (!content) return;

        this.updateElement('.events-section .section-category', content.section_category);
        this.updateElement('.events-section .section-title', content.section_title);
        
        if (content.events) {
            const eventItems = document.querySelectorAll('.event-item');
            content.events.forEach((event, index) => {
                if (eventItems[index]) {
                    const item = eventItems[index];
                    const dayEl = item.querySelector('.day');
                    const monthEl = item.querySelector('.month');
                    const titleEl = item.querySelector('h3');
                    const locationEl = item.querySelector('.event-location span');
                    const descEl = item.querySelector('.event-description');
                    const ctaEl = item.querySelector('.btn');
                    
                    if (dayEl) dayEl.textContent = event.date.day;
                    if (monthEl) monthEl.textContent = event.date.month;
                    if (titleEl) titleEl.textContent = event.title;
                    if (locationEl) locationEl.textContent = event.location;
                    if (descEl) descEl.textContent = event.description;
                    if (ctaEl) ctaEl.textContent = event.cta;
                }
            });
        }
    }

    /**
     * Update campaigns section
     */
    updateCampaignsContent(content) {
        if (!content) return;

        this.updateElement('.campaigns-section .section-category', content.section_category);
        this.updateElement('.campaigns-section .section-title', content.section_title);
        
        // Update featured campaign
        if (content.featured_campaign) {
            const featured = content.featured_campaign;
            this.updateElement('.campaign-tag', featured.tag);
            this.updateElement('.campaign-card.featured h3', featured.title);
            this.updateElement('.raised', featured.raised);
            this.updateElement('.supporters', featured.supporters);
            this.updateElement('.campaign-description', featured.description);
        }
        
        // Update volunteer section
        if (content.volunteer_section) {
            this.updateElement('.volunteer-section h3', content.volunteer_section.title);
            this.updateElement('.volunteer-section p', content.volunteer_section.description);
        }
    }

    /**
     * Update gallery section
     */
    updateGalleryContent(content) {
        if (!content) return;

        this.updateElement('.gallery-section .section-category', content.section_category);
        this.updateElement('.gallery-section .section-title', content.section_title);
        
        // Update video section title
        if (content.video_section) {
            this.updateElement('.video-section h3', content.video_section.title);
        }
    }

    /**
     * Update testimonials section
     */
    updateTestimonialsContent(content) {
        if (!content) return;

        this.updateElement('.testimonials-section .section-category', content.section_category);
        this.updateElement('.testimonials-section .section-title', content.section_title);
        
        if (content.testimonials) {
            const testimonialCards = document.querySelectorAll('.testimonial-card');
            content.testimonials.forEach((testimonial, index) => {
                if (testimonialCards[index]) {
                    const card = testimonialCards[index];
                    const textEl = card.querySelector('.testimonial-text');
                    const nameEl = card.querySelector('.author-info h4');
                    const titleEl = card.querySelector('.author-info p');
                    
                    if (textEl) textEl.textContent = `"${testimonial.text}"`;
                    if (nameEl) nameEl.textContent = testimonial.author.name;
                    if (titleEl) titleEl.textContent = testimonial.author.title;
                }
            });
        }
    }

    /**
     * Update contact section
     */
    updateContactContent(content) {
        if (!content) return;

        this.updateElement('.contact-section .section-category', content.section_category);
        this.updateElement('.contact-section .section-title', content.section_title);
        
        if (content.intro) {
            this.updateElement('.contact-info h3', content.intro.title);
            this.updateElement('.contact-info > p', content.intro.description);
        }
        
        // Update contact methods
        if (content.contact_methods) {
            const contactItems = document.querySelectorAll('.contact-item');
            content.contact_methods.forEach((method, index) => {
                if (contactItems[index]) {
                    const titleEl = contactItems[index].querySelector('h4');
                    const detailsEl = contactItems[index].querySelector('.contact-details p');
                    
                    if (titleEl) titleEl.textContent = method.title;
                    if (detailsEl) detailsEl.innerHTML = method.details.replace(/\n/g, '<br>');
                }
            });
        }
        
        // Update office hours
        if (content.office_hours) {
            this.updateElement('.office-hours h4', content.office_hours.title);
        }
        
        // Update form
        if (content.contact_form) {
            this.updateElement('.contact-form h3', content.contact_form.title);
        }
        
        // Update social media section
        if (content.social_media) {
            this.updateElement('.social-media-section h3', content.social_media.title);
        }
        
        // Update newsletter
        if (content.newsletter) {
            this.updateElement('.newsletter-content h3', content.newsletter.title);
            this.updateElement('.newsletter-content p', content.newsletter.description);
        }
    }

    /**
     * Helper method to update element content
     */
    updateElement(selector, content) {
        const element = document.querySelector(selector);
        if (element && content) {
            element.textContent = content;
        }
    }

    /**
     * Set current language and update content
     */
    async setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('preferred-language', lang);
        await this.updatePageContent(lang);
    }
}

// Initialize content loader
const contentLoader = new ContentLoader();

// Load content when DOM is ready
document.addEventListener('DOMContentLoaded', async function() {
    try {
        await contentLoader.updatePageContent();
    } catch (error) {
        console.error('Error initializing content:', error);
    }
});

// Update content when language changes
document.addEventListener('languageChanged', async function(e) {
    const newLang = e.detail.language;
    await contentLoader.updatePageContent(newLang);
});

// Export for use in main.js
window.contentLoader = contentLoader;