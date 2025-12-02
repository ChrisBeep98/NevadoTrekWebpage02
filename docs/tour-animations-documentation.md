# Tour Page Animations Documentation

## Overview

This document details the animation system implemented for the Tour Page (`TourPage.html`), including all scroll-triggered animations, parallax effects, and interactive reveals using GSAP and ScrollTrigger.

## File Structure

- **HTML**: `Sections/TourPage.html`
- **JavaScript**: `js/tour-animations.js`
- **CSS**: `css/tour-animations.css`

## Dependencies

```html
<!-- GSAP Core -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>

<!-- ScrollTrigger Plugin -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js"></script>

<!-- Tour Animations Script -->
<script src="js/tour-animations.js"></script>
```

---

## Animation Functions

### 1. **Title Letter Reveal** (`initTitleLetterReveal()`)

**Purpose**: Creates a letter-by-letter reveal animation for the hero title.

**Target Element**: `.h-1`

**Functionality**:
- Splits the title text into individual letters
- Wraps each letter in a `<span class="letter">`
- Applies CSS animation with staggered delays (35ms per letter)

**CSS Animation**:
```css
.letter {
  opacity: 0;
  animation: letterReveal 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  clip-path: inset(100% 0 0% 0);
}

@keyframes letterReveal {
  to {
    opacity: 1;
    clip-path: inset(0 0 0% 0);
  }
}
```

**Performance Notes**:
- Uses CSS animations instead of JS for better performance
- Stagger delay controlled via inline `animation-delay` style

---

### 2. **Scroll Reveal** (`initScrollReveal()`)

**Purpose**: Reveals elements when they enter the viewport using Intersection Observer.

**Target Elements**:
- `.tour-subtitle`
- `.chip-tour-info-wrapper`

**Configuration**:
```javascript
{
  rootMargin: '0px 0px -10% 0px',
  threshold: 0.15
}
```

**Functionality**:
- Observes elements as they scroll into view
- Adds `.reveal` class when 15% of element is visible
- Unobserves after animation to prevent re-triggering

**Fallback**: For browsers without IntersectionObserver, uses setTimeout with delays

---

### 3. **Image Scroll Zoom** (`initImageScrollZoom()`)

**Purpose**: Expands images to full width as user scrolls.

**Target Elements**: Elements with class `.scroll-zoom-image`

**Configuration per Image**:
```javascript
const imageConfigs = {
  'main-tour-image': {
    start: 'top bottom',
    end: 'center center',
    scrub: 0.5
  },
  'fullscreen-img2': {
    start: 'top bottom',
    end: 'bottom bottom',
    scrub: 0.5
  },
  'big-image-03': {
    start: 'top bottom',
    end: 'bottom bottom',
    scrub: 0.5
  }
}
```

**Animation**:
- Animates width from initial size to `100vw`
- Scrubbed to scroll position for smooth effect
- Customizable start/end points per image

---

### 4. **Description Title Reveal** (`initDescriptionTitleReveal()`)

**Purpose**: Letter-by-letter vertical clip reveal for the "Descripción" section title.

**Target Element**: `.div-block-131 h1.h-5`

**Functionality**:
- Splits text into individual `<span class="letter">` elements
- Uses GSAP Timeline with ScrollTrigger
- Clip-path animation from bottom to top
- Combined with opacity, scale, and blur effects

**ScrollTrigger Config**:
```javascript
{
  trigger: descriptionTitle,
  start: 'top 70%',
  end: 'top 30%',
  scrub: 1.5
}
```

**Performance Optimization**:
- Uses a single ScrollTrigger for all letters
- Stagger effect (0.02s between letters) instead of individual triggers

---

### 5. **Description Text Reveal** (`initDescriptionTextReveal()`)

**Purpose**: Reveals description paragraphs with slide-up and blur effect.

**Target Elements**: `.div-block-131 p.h-5`

**Animation Properties**:
```javascript
{
  opacity: 0 → 1,
  y: 80px → 0,
  filter: 'blur(10px)' → 'blur(0px)',
  duration: 0.8s,
  ease: 'power2.in'
}
```

**ScrollTrigger**:
- Individual trigger per paragraph
- Scrubbed to scroll position
- Start: `top center`, End: `bottom center`

---

### 6. **Curtain Reveal** (`initCurtainReveals()`)

**Purpose**: Apple-style curtain reveal for images with parallax.

**Target Structure**:
```html
<div class="image-parallax-mask" id="mini-curtain-1">
  <div class="image-curtain-overlay"></div>
  <div class="parallax-wrapper">
    <img src="..." />
  </div>
</div>
```

**Dual Animation**:
1. **Curtain**: Slides up (`translateY: -100%`)
2. **Image Parallax**: Moves slower than scroll (`yPercent: -10 → 10`)

**Configurations**:
```javascript
{
  'mini-curtain-1': {
    start: 'top 75%',
    end: 'center 45%',
    scrub: 2.5
  },
  'mini-curtain-2': {
    start: 'top center',
    end: 'bottom top',
    scrub: 3.5
  }
}
```

---

### 7. **Medium Parallax** (`initMediumParallax()`)

**Purpose**: Counter-directional parallax for image and text.

**Target Elements**:
- `.parallax-image-medium` (moves down)
- `.short-message-animated-scroll` (moves up)

**Movement**:
```javascript
const imageStartY = -250; // Image starts 250px above, moves to 0
const textStartY = 350;   // Text starts 350px below, moves to 0
```

**Effect**: Creates visual depth by moving elements in opposite directions

---

### 8. **Feature List Reveal** (`initFeatureListReveal()`)

**Purpose**: Staggered reveal of feature/equipment items.

**Target Structure**:
- Container: `.div-block-40`
- Items: `.div-block-41`

**Animation**:
```javascript
{
  opacity: 0 → 1,
  y: 60px → 0,
  scale: 0.95 → 1,
  filter: 'blur(10px)' → 'blur(0px)',
  duration: 0.7s,
  stagger: 0.2s
}
```

**Trigger**: `start: 'top center'`

**Toggle Actions**: `'restart none none none'` (restarts on re-enter)

---

### 9. **FAQ Reveal** (`initFAQReveal()`)

**Purpose**: Staggered reveal of FAQ accordion items.

**Current Status**: ⚠️ **KNOWN ISSUE - NOT IMPLEMENTED**

**Problem Identified**:
- Generic class selectors (`.div-block-136`, `.accordion-item-wrapper.v2`) conflict with other page sections
- ScrollTrigger markers appear in incorrect positions
- Multiple animations trigger simultaneously

**Attempted Solutions**:
1. ✅ Created unique IDs: `#faq-item-1`, `#faq-item-2`, `#faq-item-3`, `#faq-item-4`
2. ✅ Created unique classes: `.faq-accordion-item`
3. ✅ Used `getElementById()` instead of `querySelector()`
4. ❌ Issues with CSS positioning causing marker displacement

**Recommended Solution** (To Implement Later):
```javascript
function initFAQReveal() {
  const item1 = document.getElementById('faq-item-1');
  const item2 = document.getElementById('faq-item-2');
  const item3 = document.getElementById('faq-item-3');
  const item4 = document.getElementById('faq-item-4');

  const faqItems = [item1, item2, item3, item4].filter(item => item !== null);

  faqItems.forEach((item, index) => {
    gsap.set(item, { 
      opacity: 0, 
      x: 50, 
      scale: 0.92,
      filter: 'blur(15px)'
    });

    gsap.to(item, {
      opacity: 1,
      x: 0,
      scale: 1,
      filter: 'blur(0px)',
      duration: 1,
      delay: index * 0.25,
      ease: 'power2.in',
      scrollTrigger: {
        trigger: item,
        start: 'top 85%',
        markers: false,
        once: true
      }
    });
  });
}
```

**Required HTML Structure**:
```html
<div id="faq-item-1" class="accordion-item-wrapper v2">...</div>
<div id="faq-item-2" class="accordion-item-wrapper v2">...</div>
<div id="faq-item-3" class="accordion-item-wrapper v2">...</div>
<div id="faq-item-4" class="accordion-item-wrapper v2">...</div>
```

---

## Performance Optimizations

### 1. **Reduced ScrollTrigger Instances**
- Letter animations use single timeline instead of individual ScrollTriggers
- Reduces performance overhead significantly

### 2. **Visibility Change Handling**
```javascript
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    document.body.style.animationPlayState = 'paused';
  } else {
    document.body.style.animationPlayState = 'running';
  }
});
```

### 3. **Lazy Initialization**
```javascript
setTimeout(() => {
  // Initialize all animations
}, 100);
```
Ensures styles are fully loaded before animations start

---

## ScrollTrigger Markers Guide

For debugging, enable markers in any ScrollTrigger:

```javascript
scrollTrigger: {
  trigger: element,
  start: 'top 80%',
  markers: true  // Shows green (start) and red (end) markers
}
```

**Marker Colors**:
- 🟢 **Green**: Animation start point
- 🔴 **Red**: Animation end point

---

## Common Issues & Solutions

### Issue 1: Animations Not Triggering

**Cause**: GSAP or ScrollTrigger not loaded

**Solution**: Check console for errors, verify CDN links are loaded

### Issue 2: Animations Trigger Too Early/Late

**Cause**: Incorrect `start` and `end` values

**Solution**: Adjust trigger points:
```javascript
start: 'top 80%'  // Starts when element top hits 80% down viewport
end: 'bottom 20%'  // Ends when element bottom hits 20% down viewport
```

### Issue 3: Multiple Markers in Wrong Locations

**Cause**: Class selectors matching multiple elements

**Solution**: Use unique IDs or scoped selectors:
```javascript
// ❌ Bad - matches all elements globally
document.querySelectorAll('.accordion-item-wrapper.v2')

// ✅ Good - uses unique ID
document.getElementById('faq-item-1')
```

### Issue 4: Jerky Animations

**Cause**: Too many simultaneous animations or heavy DOM manipulations

**Solution**:
- Use `will-change: transform` CSS property
- Reduce number of animated elements
- Use `gsap.set()` for initial states instead of CSS

---

## Future Enhancements

1. **FAQ Animation**: Implement unique ID-based solution
2. **Mobile Optimizations**: Reduce animation complexity on mobile devices
3. **Prefers-Reduced-Motion**: Add support for accessibility preferences
4. **Loading States**: Add skeleton screens during initial load

---

## Maintenance Notes

- All animation functions are namespaced in IIFE to avoid global scope pollution
- Each function has a fallback for missing GSAP/ScrollTrigger
- Markers should be set to `false` in production
- Test on multiple browsers and screen sizes after changes

---

## Testing Checklist

- [ ] Hero title letters animate on load
- [ ] Subtitle and chips reveal on scroll
- [ ] Images expand to full width on scroll
- [ ] Description title letters reveal with scroll
- [ ] Description text slides up and fades in
- [ ] Curtain overlays rise to reveal images
- [ ] Parallax effects work smoothly
- [ ] Feature lists stagger in correctly
- [ ] No console errors
- [ ] Animations pause when tab is hidden

---

*Last Updated: 2025-12-01*
*Maintainer: Development Team*
