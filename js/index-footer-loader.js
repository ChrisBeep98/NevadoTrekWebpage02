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

  // Set initial state to prevent layout shift
  element.style.opacity = "0";
  element.style.transition = "opacity 0.5s ease-in-out";

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

    // Immediately fix any elements Webflow might have set to opacity 0
    const fixOpacity = () => {
        const hiddenElements = element.querySelectorAll('[style*="opacity: 0"], [data-w-id]');
        hiddenElements.forEach(el => {
            if (el.style.opacity === "0") {
                el.style.opacity = "1";
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

  } catch (error) {
    console.error("Error loading component:", error);
    element.style.opacity = "1";
  }
}
