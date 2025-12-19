/**
 * Index Page Footer Loader
 * Loads external HTML components into placeholders for the root index.html
 * (Uses direct paths since index.html is at root level)
 */

document.addEventListener("DOMContentLoaded", () => {
  loadComponent("footer-placeholder", "components/footer.html");
});

async function loadComponent(elementId, componentPath) {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const response = await fetch(componentPath);
    if (!response.ok) {
      throw new Error(`Failed to load component: ${response.statusText}`);
    }
    const html = await response.text();
    
    // Fix relative paths in the loaded HTML (for links that point to Sections/)
    const fixedHtml = html
      .replace('href="../index.html"', 'href="index.html"')
      .replace('href="ToursPage.html"', 'href="Sections/ToursPage.html"')
      .replace('href="Gallery.html"', 'href="Sections/Gallery.html"');
    
    element.innerHTML = fixedHtml;

    // AGGRESSIVE FALLBACK: Force visibility of all footer elements immediately
    // The reveal animation in footer-overrides.css sets opacity: 0 for animation
    // If GSAP doesn't run or trigger doesn't fire, they stay hidden
    setTimeout(() => {
      // Force visibility on all hidden elements
      const footer = document.getElementById('footer-placeholder');
      if (footer) {
        // Top row items
        footer.querySelectorAll('.footer_top-row > *').forEach(el => {
          el.style.opacity = '1';
        });
        // Bottom row items
        footer.querySelectorAll('.footer_bottom-row > *').forEach(el => {
          el.style.opacity = '1';
        });
        // Giant text
        const giantText = footer.querySelector('.footer_giant-text');
        if (giantText) {
          giantText.style.opacity = '1';
        }
        // All links
        footer.querySelectorAll('.footer_link-premium').forEach(el => {
          el.style.opacity = '1';
        });
        // Any remaining hidden elements
        footer.querySelectorAll('[style*="opacity: 0"]').forEach(el => {
          el.style.opacity = '1';
        });
      }
    }, 300);
    
    // Dispatch event to notify that component is loaded
    const event = new CustomEvent('componentLoaded', { 
      detail: { id: elementId, path: componentPath } 
    });
    window.dispatchEvent(event);

    // Trigger i18n for the newly loaded content
    if (window.NT_I18N && window.NT_I18N.apply) {
      window.NT_I18N.apply();
    }

  } catch (error) {
    console.error("Error loading component:", error);
  }
}
