# Protocol for Localizing CDN Assets and Scaling Multi-Page Websites

This document outlines the comprehensive methodology used to download CSS and JavaScript files from a Content Delivery Network (CDN), link them locally in HTML files, and scale the project into a multi-page website while maintaining Webflow design integrity.

## 1. Initial Asset Localization Process

### 1.1 Identify and List All CDN Assets

The first step is to manually inspect the HTML file and identify all external resources being loaded from a CDN. These are found in `<link>` tags for CSS and `<script>` tags for JavaScript.

Example from the original `index.html`:
```html
<link href="https://cdn.prod.website-files.com/68cb38dfbae5b4c56edac13a/css/nevado-trek-e4497d.webflow.shared.f242acfb1.css" rel="stylesheet" type="text/css" />
<script src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js" type="text/javascript"></script>
```

### 1.2 Create Local Directories

Create `css` and `js` directories in the root of the project to store the downloaded files.

```bash
mkdir css
mkdir js
```

### 1.3 Download CDN Files

Using a shell command like `Invoke-WebRequest` (for PowerShell), download each file into the appropriate local directory. It's important to use a User-Agent string to mimic a browser request, as some CDNs may block requests without one.

Example command:
```powershell
powershell -command "Invoke-WebRequest -Uri 'https://domain.com/path/to/file.css' -OutFile 'css/file.css' -UserAgent 'Mozilla/5.0'"
```
This process should be repeated for every CSS and JavaScript file identified in step 1.1.

### 1.4 Update HTML Files

Finally, update the `href` and `src` attributes in the `<link>` and `<script>` tags in the HTML file to point to the local files.

For example, the links from step 1.1 would be changed to:
```html
<link href="css/nevado-trek-e4497d.webflow.shared.f242acfb1.css" rel="stylesheet" type="text/css" />
<script src="js/webfont.js" type="text/javascript"></script>
```

After completing these steps, the project will no longer depend on external CDNs for its core assets.

## 2. Multi-Page Website Scaling Methodology

### 2.1 Component-Based Architecture Setup

To scale the project into multiple pages while maintaining Webflow design integrity, a component-based architecture was implemented:

#### 2.1.1 Create Component Directory Structure
```
project-root/
├── components/
│   ├── header.html
│   └── footer.html
├── templates/
│   └── base.html
└── js/
    └── components.js
```

#### 2.1.2 Extract Shared Components
1. **Header Component**: Extract the navigation and header section from the original HTML file
2. **Footer Component**: Extract the footer section from the original HTML file
3. **Base Template**: Create a template with common HTML structure, meta tags, and script includes

#### 2.1.3 Component Loader Implementation
Create `js/components.js` to dynamically load components into page placeholders:

```javascript
document.addEventListener('DOMContentLoaded', () => {
    loadComponent('header-placeholder', 'components/header.html');
    loadComponent('footer-placeholder', 'components/footer.html');
});

async function loadComponent(placeholderId, componentPath) {
    try {
        const response = await fetch(componentPath);
        const html = await response.text();
        const placeholder = document.getElementById(placeholderId);
        
        if (placeholder) {
            placeholder.innerHTML = html;
            
            // Re-initialize Webflow components after loading
            if (typeof Webflow !== 'undefined') {
                Webflow.require('ix2').init();
            }
        }
    } catch (error) {
        console.error(`Error loading component ${componentPath}:`, error);
    }
}
```

### 2.2 New Page Creation Process

For each new page to be added to the website:

#### 2.2.1 Webflow Export
1. Design the new page in Webflow
2. Export as HTML file
3. Save with descriptive filename (e.g., `tours.html`, `contact.html`, `booking.html`)

#### 2.2.2 Asset Localization
Apply the same CDN localization process (steps 1.1-1.4) to the new HTML file:
1. Identify all external CSS and JavaScript dependencies
2. Download assets to local directories
3. Update file paths in the HTML

#### 2.2.3 Component Integration
1. **Add Component Placeholders**: Insert `<div id="header-placeholder"></div>` and `<div id="footer-placeholder"></div>` where shared components should appear
2. **Include Component Loader**: Add `<script src="js/components.js"></script>` to the page
3. **Update Navigation**: Ensure navigation links point to correct page files

#### 2.2.4 Translation Integration
1. **Mark Translatable Content**: Add `data-i18n` attributes to all text elements
2. **Update Translation Files**: Add new content to `en.json` and `es.json`
3. **Test Language Switching**: Verify bilingual functionality works on the new page

### 2.3 Enhanced Language System

#### 2.3.1 Multi-Page Language Support
Update the language switching system to work across all pages:

```javascript
// Enhanced language switcher with error handling
const setLanguage = async (lang) => {
    try {
        const response = await fetch(`${lang}.json`);
        const translations = await response.json();

        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[key]) {
                element.innerHTML = translations[key];
            }
        });

        localStorage.setItem('language', lang);
        // Update active language indicator
    } catch (error) {
        console.error('Error loading translations:', error);
    }
};
```

#### 2.3.2 Translation File Management
- **Centralized Content**: All translatable text stored in JSON files
- **Easy Updates**: Content changes only require updating JSON files
- **Consistent Keys**: Use descriptive keys for easy maintenance

### 2.4 Styling and Layout Management

#### 2.4.1 Component-Specific Styles
Add styles for new page components to `css/custom.css`:

```css
/* Example: Tours page styles */
.tours-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin: 2rem 0;
}

.tour-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}
```

#### 2.4.2 Responsive Design Maintenance
- Ensure all new components work with Webflow's responsive system
- Test on multiple screen sizes
- Maintain design consistency across pages

### 2.5 Performance Optimization

#### 2.5.1 Asset Management
- **Minification**: Minify CSS and JavaScript files for production
- **Compression**: Use gzip compression for text assets
- **Caching**: Implement proper cache headers for static assets

#### 2.5.2 Loading Optimization
- **Lazy Loading**: Implement lazy loading for images
- **Critical CSS**: Inline critical CSS for above-the-fold content
- **Async Loading**: Load non-critical JavaScript asynchronously

## 3. Scaling Best Practices

### 3.1 File Organization
- **Consistent Naming**: Use descriptive, consistent file names
- **Directory Structure**: Maintain clear separation of concerns
- **Documentation**: Keep method.md and context.md updated

### 3.2 Code Maintenance
- **DRY Principle**: Don't repeat yourself - use shared components
- **Error Handling**: Implement proper error handling for all async operations
- **Testing**: Test each new page thoroughly before deployment

### 3.3 Content Management
- **Translation Keys**: Use descriptive, hierarchical keys for translations
- **Content Updates**: Establish process for updating content across all pages
- **SEO Considerations**: Ensure each page has proper meta tags and structured data

## 4. Future Scaling Considerations

### 4.1 Build Process Integration
Consider implementing a build process for:
- **Asset Bundling**: Combine and minify CSS/JS files
- **Image Optimization**: Automatic image compression and WebP conversion
- **Cache Busting**: Automatic versioning for cache invalidation

### 4.2 Dynamic Content Management
- **JSON Data Files**: Store page content in JSON files for easier management
- **Template Engine**: Consider using a simple template engine for dynamic content
- **CMS Integration**: Plan for potential CMS integration in the future

### 4.3 Advanced Features
- **Form Handling**: Implement contact and booking forms
- **Search Functionality**: Add site-wide search capabilities
- **Analytics Integration**: Implement tracking and analytics

This methodology ensures that the Nevado Trek website can scale effectively while maintaining the design integrity and performance characteristics of the original Webflow export.
