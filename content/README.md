# Content Management System Documentation

This document explains how to manage and update the bilingual content for the Indian Political Portfolio website.

## 📁 Content Structure

```
content/
├── en/                 # English content
│   ├── main.json       # Hero, About, Manifesto sections
│   ├── initiatives.json # Initiatives section
│   ├── events.json     # Events section
│   ├── campaigns.json  # Campaigns section
│   ├── gallery.json    # Gallery section
│   ├── testimonials.json # Testimonials section
│   └── contact.json    # Contact section
└── te/                 # Telugu content
    ├── main.json       # Hero, About, Manifesto sections (Telugu)
    ├── initiatives.json # Initiatives section (Telugu)
    ├── events.json     # Events section (Telugu)
    ├── campaigns.json  # Campaigns section (Telugu)
    ├── gallery.json    # Gallery section (Telugu)
    ├── testimonials.json # Testimonials section (Telugu)
    └── contact.json    # Contact section (Telugu)
```

## 🔧 How It Works

### Content Loading System

The website uses a dynamic content loading system that:

1. **Separates content from code** - All text content is stored in JSON files
2. **Supports bilingual switching** - Instantly switches between English and Telugu
3. **Maintains consistency** - Same structure for both languages
4. **Easy updates** - Edit JSON files without touching HTML/CSS/JS

### Content Loader (js/content-loader.js)

- Loads JSON content based on selected language
- Updates page elements dynamically
- Caches content for performance
- Handles fallbacks if content fails to load

## 📝 Updating Content

### 1. Site-Wide Settings (main.json)

Update basic site information:

```json
{
  "site": {
    "title": "Your Leader Name - Serving the Nation",
    "tagline": "Truth • Service • Progress",
    "newspaper_name": "The People's Voice",
    "description": "Site description for SEO"
  }
}
```

### 2. Hero Section (main.json)

Update the main newspaper front-page content:

```json
{
  "hero": {
    "breaking_banner": "EXCLUSIVE INTERVIEW",
    "main_headline": "LEADER UNVEILS VISION FOR NEW INDIA",
    "lead_story": "Main story text...",
    "cta_primary": "Join the Movement",
    "cta_secondary": "Read Full Story"
  }
}
```

### 3. About Section (main.json)

Update personal information:

```json
{
  "about": {
    "quote": "Your inspiring quote here",
    "biography": [
      "First paragraph of biography...",
      "Second paragraph of biography..."
    ],
    "stats": [
      { "number": "15+", "label": "Years in Service" },
      { "number": "100+", "label": "Bills Sponsored" }
    ],
    "timeline": [{ "year": "2008", "event": "Started political career" }]
  }
}
```

### 4. Initiatives (initiatives.json)

Add or update your key programs:

```json
{
  "initiatives": [
    {
      "title": "Program Name",
      "description": "Program description",
      "impact_number": "50K+",
      "impact_label": "Beneficiaries",
      "progress": 85,
      "image": "program-image.jpg"
    }
  ]
}
```

### 5. Events (events.json)

Update upcoming events:

```json
{
  "events": [
    {
      "date": { "day": "15", "month": "Nov" },
      "title": "Event Title",
      "location": "Event Location",
      "time": "10:00 AM - 12:00 PM",
      "description": "Event description",
      "cta": "Register Now"
    }
  ]
}
```

### 6. Campaigns (campaigns.json)

Manage active campaigns:

```json
{
  "featured_campaign": {
    "title": "Campaign Name",
    "progress": 75,
    "raised": "₹45L Raised of ₹60L Goal",
    "supporters": "1,250+ Supporters",
    "description": "Campaign description"
  }
}
```

### 7. Testimonials (testimonials.json)

Add public testimonials:

```json
{
  "testimonials": [
    {
      "text": "Testimonial text here",
      "author": {
        "name": "Person Name",
        "title": "Person Title, Location",
        "image": "person-photo.jpg"
      }
    }
  ]
}
```

### 8. Contact Information (contact.json)

Update contact details:

```json
{
  "contact_methods": [
    {
      "icon": "fas fa-map-marker-alt",
      "title": "Office",
      "details": "Office address"
    }
  ],
  "office_hours": {
    "schedule": [{ "days": "Mon-Fri:", "time": "9:00 AM - 6:00 PM" }]
  }
}
```

## 🌐 Language Management

### Adding New Languages

1. Create new language folder: `content/hi/` (for Hindi)
2. Copy all JSON files from `content/en/`
3. Translate all content while maintaining JSON structure
4. Update language toggle in HTML and JavaScript

### Translation Guidelines

- Keep JSON structure identical across languages
- Maintain the same number of array items
- Preserve HTML tags within strings if present
- Use appropriate fonts for regional scripts
- Test thoroughly after translation

## 🔄 Content Workflow

### For Regular Updates:

1. **Edit JSON files** directly in your preferred editor
2. **Test locally** to ensure content loads correctly
3. **Deploy changes** - content updates instantly
4. **No code changes needed** - just update JSON files

### For Major Changes:

1. **Plan structure changes** in English version first
2. **Update content-loader.js** if new fields are added
3. **Update corresponding Telugu files** to match structure
4. **Test both languages** thoroughly
5. **Update documentation** if needed

## 🚀 Best Practices

### Content Management:

- **Keep consistent structure** across all language files
- **Use descriptive field names** for maintainability
- **Validate JSON syntax** before deploying
- **Backup content** before major changes
- **Version control** your content files

### Performance:

- **Optimize images** referenced in JSON files
- **Keep JSON files reasonably sized** (split large sections if needed)
- **Use content caching** (already implemented)
- **Minimize HTTP requests** by combining related content

### SEO & Accessibility:

- **Include descriptive alt text** for images in JSON
- **Use semantic headings** hierarchy in content
- **Maintain keyword consistency** across languages
- **Include proper meta descriptions** in site config

## 🛠️ Technical Details

### File Format:

- All content files are in **JSON format**
- Use UTF-8 encoding for proper character support
- Maintain proper JSON syntax (validate before deployment)

### Content Caching:

- Content is cached in browser for performance
- Cache is cleared when language is changed
- Force reload by clearing browser cache if needed

### Error Handling:

- Falls back to English if Telugu content fails to load
- Logs errors to browser console for debugging
- Graceful degradation if content files are missing

### Integration:

- Content loads automatically on page load
- Updates instantly when language is changed
- No page refresh required for content changes

## 📋 Content Checklist

Before publishing content updates:

- [ ] JSON syntax is valid (use JSON validator)
- [ ] Both English and Telugu versions are updated
- [ ] Image references are correct
- [ ] Links and contact information are current
- [ ] Dates and event information are accurate
- [ ] Content displays correctly in both languages
- [ ] Mobile view is tested
- [ ] All sections load without errors

## 🆘 Troubleshooting

### Content Not Loading:

1. Check browser console for errors
2. Verify JSON file syntax
3. Ensure file paths are correct
4. Check server/hosting configuration

### Language Switch Not Working:

1. Verify both language files exist
2. Check content-loader.js is included
3. Ensure JSON structure matches between languages
4. Clear browser cache and reload

### Missing Content:

1. Check if corresponding JSON field exists
2. Verify content-loader.js is mapping the field correctly
3. Ensure HTML elements have correct selectors
4. Check for typos in JSON field names

## 📞 Support

For technical issues with the content management system:

1. Check browser console for error messages
2. Validate JSON files using online JSON validators
3. Test with simple content first to isolate issues
4. Keep backups of working content files

This content management system makes it easy to maintain a professional, bilingual political portfolio website without technical expertise. Simply edit the JSON files and your changes will appear immediately on the website.
