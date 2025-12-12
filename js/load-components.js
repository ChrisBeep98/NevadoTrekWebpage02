/**
 * Component Loader
 * Loads external HTML components into placeholders
 */

document.addEventListener("DOMContentLoaded", () => {
  loadComponent("footer-placeholder", "../components/footer.html");
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
    element.innerHTML = html;

    // Initialize animations if GSAP is available (since footer has data-w-id)
    // Note: Webflow interactions might need to be re-initialized or we can just use GSAP to set opacity to 1
    // to avoid invisible elements if interactions fail to load.
    
    setTimeout(() => {
        // Simple fallback to ensure visibility if Webflow doesn't pick it up
        const hiddenElements = element.querySelectorAll('[style*="opacity: 0"]');
        hiddenElements.forEach(el => {
            el.style.opacity = '1';
        });
    }, 500);
    
    // Dispatch event to notify that component is loaded
    const event = new CustomEvent('componentLoaded', { 
      detail: { id: elementId, path: componentPath } 
    });
    window.dispatchEvent(event);

  } catch (error) {
    console.error("Error loading component:", error);
  }
}
