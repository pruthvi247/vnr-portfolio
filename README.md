# Andhrapradesh-India Political Portfolio Website

A visually impressive, mobile-first personal portfolio website for a modern Andhrapradesh state in india politician, designed with a newspaper theme that blends cultural heritage and optimism.

## 🌟 Features

- **Newspaper-Themed Design**: Creative front-page layout with authentic newspaper styling
- **Bilingual Support**: Complete English/Telugu language switching
- **Mobile-First**: Fully responsive design optimized for all devices
- **Andhrapradesh state Cultural Elements**: Tricolor accents, traditional typography, and cultural sensitivity
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation
- **SEO Optimized**: Meta tags, Open Graph, and structured data
- **Interactive Elements**: Smooth animations, carousels, and form validation

## 🏗️ Structure

### Main Sections

- **Hero/Banner**: Newspaper front-page with inspiring content and CTAs
- **About**: Personal story, achievements, timeline, and statistics
- **Manifesto**: Core beliefs and vision with data-driven infographics
- **Initiatives**: Key programs with progress tracking and impact metrics
- **Events**: Upcoming rallies, meetings, and public appearances
- **Campaigns**: Active campaigns with donation/volunteer opportunities
- **Media Gallery**: Photos, videos, and speech archives with filtering
- **Testimonials**: Public endorsements in an interactive carousel
- **Contact**: Multiple contact methods and secure contact form
- **Newsletter**: Email subscription for updates

### Technology Stack

- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Custom newspaper styling with CSS Grid/Flexbox
- **JavaScript**: Vanilla JS for interactions and bilingual support
- **Font Awesome**: Icons and social media symbols
- **AOS (Animate On Scroll)**: Smooth scroll animations
- **Google Fonts**: Typography (Playfair Display, Crimson Text, Old Standard TT)

## 🚀 Setup Instructions

### 1. Prerequisites

- Modern web browser
- Local web server (recommended for development)

### 2. Installation

```bash
# Clone or download the project files
cd vnrPortfolio

# Start a local server (choose one):
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (if you have live-server installed)
npx live-server

# PHP
php -S localhost:8000
```

### 3. Open in Browser

Navigate to `http://localhost:8000` to view the website.

## 📁 File Structure

```
vnrPortfolio/
├── index.html              # Main HTML file
├── css/
│   └── styles.css          # All CSS styles
├── js/
│   └── main.js            # JavaScript functionality
├── assets/
│   └── images/            # Image assets (see Image Setup below)
│       ├── gallery/       # Gallery images
│       ├── leader-hero.jpg
│       ├── leader-portrait.jpg
│       └── ...
├── docs/
│   └── prompt.md          # Original project requirements
└── README.md              # This file
```

## 🖼️ Image Setup

The website requires several images to be fully functional. Create or add the following images to the `assets/images/` directory:

### Required Images

#### Main Leader Images

- `leader-hero.jpg` (1920x1080) - Hero section background image
- `leader-portrait.jpg` (600x800) - About section portrait
- `favicon.ico` - Website favicon

#### Initiative Images

- `education-initiative.jpg` (400x200) - Education program photo
- `healthcare-initiative.jpg` (400x200) - Healthcare program photo
- `women-empowerment.jpg` (400x200) - Women's program photo

#### Gallery Images (in `gallery/` subfolder)

- `event-1.jpg` (400x300) - Community rally photo
- `initiative-1.jpg` (400x300) - Healthcare camp photo
- `meeting-1.jpg` (600x400) - Parliamentary session (featured)
- `community-1.jpg` (400x300) - Village visit photo
- `initiative-2.jpg` (400x300) - Women's training photo
- `event-2.jpg` (400x300) - Independence Day celebration

#### Video Thumbnails

- `video-thumb-1.jpg` (400x225) - Education speech thumbnail
- `video-thumb-2.jpg` (400x225) - TV interview thumbnail

#### Testimonials

- `testimonial-1.jpg` (120x120) - Farmer testimonial photo
- `testimonial-2.jpg` (120x120) - Entrepreneur testimonial photo
- `testimonial-3.jpg` (120x120) - Teacher testimonial photo

### Image Guidelines

- Use high-quality, professional photos
- Ensure faces are clearly visible and well-lit
- Maintain consistent aspect ratios as specified
- Optimize images for web (compress without losing quality)
- Use authentic photos that represent Indian and Andhrapradesh political context

## 🌐 Customization

### 1. Content Updates

Edit `index.html` to update:

- Leader name and titles
- Personal biography and achievements
- Contact information
- Social media links
- Event details and dates

### 2. Styling Changes

Modify `css/styles.css` to adjust:

- Color scheme (CSS variables in `:root`)
- Typography and fonts
- Layout spacing and sizing
- Animation timings

### 3. Language Content

Update bilingual content by modifying the `data-en` and `data-te` attributes throughout the HTML.

### 4. JavaScript Features

Extend functionality in `js/main.js`:

- Add new interactive elements
- Integrate with backend APIs
- Enhance form handling
- Add analytics tracking

## 🎨 Design Philosophy

### Newspaper Theme

- Authentic newspaper masthead and typography
- Column-based layouts with proper gutters
- Breaking news ticker and category headers
- Print-inspired color scheme and borders

### Party/Andhra Cultural Elements

- Tricolor (#0266B4,#FFFFFF, #008E46, optional : #dc3f34 ) color accents

- Traditional typography with modern readability
- Cultural sensitivity in imagery and content
- Regional language support (Telugu)

### Accessibility Features

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- High contrast mode compatibility
- Screen reader optimization
- Focus management

## 🔧 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Mobile Optimization

- Touch-friendly interface elements
- Optimized images and loading
- Simplified navigation for small screens
- Readable typography on mobile devices
- Fast loading times

## 🚀 Deployment

### Static Hosting Options

- **GitHub Pages**: Push to GitHub repository and enable Pages
- **Netlify**: Drag and drop the folder to Netlify
- **Vercel**: Connect repository for automatic deployments
- **Firebase Hosting**: Use Firebase CLI to deploy

### Before Deployment

1. Add all required images to assets folder
2. Test bilingual functionality
3. Verify all links and forms work correctly
4. Optimize images for faster loading
5. Update contact information and social links

## 🤝 Contributing

To contribute to this project:

1. Update content and images as needed
2. Test functionality across different devices
3. Ensure accessibility standards are maintained
4. Validate HTML and CSS
5. Test language switching functionality

## 📄 License

This project is designed for educational and political portfolio purposes. Please ensure appropriate usage rights for all images and content.

---

**Note**: This is a complete, production-ready website that requires only image assets and content updates to be fully functional. The newspaper theme provides a unique, engaging way to present political content while maintaining professionalism and cultural authenticity.
