/**
 * Component Loader
 * Loads external HTML components into placeholders
 */

document.addEventListener("DOMContentLoaded", () => {
  // Determine prefix based on current path
  const isSection = window.location.pathname.includes('/Sections/');
  const prefix = isSection ? '../' : './';
  
  loadComponent("footer-placeholder", prefix + "components/footer.html");
  loadComponent("ntm-menu", prefix + "components/mobile-menu.html");
});

async function loadComponent(elementId, componentPath) {
  const element = document.getElementById(elementId);
  if (!element) return;

  // Set initial state to prevent layout shift
  element.style.opacity = "0";
  element.style.transition = "opacity 0.5s ease-in-out";

  try {
    const response = await fetch(componentPath);
    if (!response.ok) {
      throw new Error(`Failed to load component: ${response.statusText}`);
    }
    const html = await response.text();
    element.innerHTML = html;

    // Immediately fix any elements Webflow might have set to opacity 0
    const fixOpacity = () => {
        const hiddenElements = element.querySelectorAll('[style*="opacity: 0"], [data-w-id]');
        hiddenElements.forEach(el => {
            if (el.style.opacity === "0") {
                el.style.opacity = "1";
            }
            // Remove potential transform filters that Webflow might stuck on
            if (el.style.transform === "translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)") {
                // Keep it, it's neutral
            }
        });
        element.style.opacity = "1";
        element.classList.add("is-loaded");
    };

    // Run fix immediately and once more after a short delay for safety
    fixOpacity();
    setTimeout(fixOpacity, 100);
    
    // Dispatch event to notify that component is loaded
    const event = new CustomEvent('componentLoaded', { 
      detail: { id: elementId, path: componentPath } 
    });
    window.dispatchEvent(event);

    // Trigger i18n for the newly loaded content
    if (window.NT_I18N && window.NT_I18N.apply) {
        window.NT_I18N.apply();
    }

    // Special handling for Mobile Menu initialization
    if (elementId === 'ntm-menu') {
        const isSection = window.location.pathname.includes('/Sections/');
        const prefix = isSection ? '../' : './';
        
        // Correct paths for internal links
        element.querySelectorAll('.ntm-nav-link').forEach(link => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('#')) {
                const cleanHref = href.replace(/^(\.\.\/|\.\/)/, '');
                link.setAttribute('href', prefix + cleanHref);
            }
        });

        if (window.initMobileMenu) {
            window.initMobileMenu();
        }
    }

  } catch (error) {
    console.error("Error loading component:", error);
    element.style.opacity = "1"; // Show whatever we have on error
  }
}
