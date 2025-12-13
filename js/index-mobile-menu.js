/**
 * MOBILE MENU LOGIC FOR INDEX PAGE
 * Handles opening/closing of the mobile menu overlay
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
});

function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle-exclusion'); // The hamburger in index navbar
  const menu = document.getElementById('mobile-menu');
  const closeBtn = document.getElementById('mobile-menu-close');
  
  if (!toggle || !menu) {
    console.warn('Mobile menu elements not found');
    return;
  }
  
  const links = menu.querySelectorAll('.mobile-nav-link');
  
  // Open menu on hamburger click
  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    menu.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  });
  
  // Close menu function
  const closeMenu = () => {
    menu.classList.remove('active');
    document.body.style.overflow = ''; // Restore scroll
  };
  
  // Close on X button click
  if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu);
  }
  
  // Close on link click (for smooth navigation)
  links.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
  
  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('active')) {
      closeMenu();
    }
  });
}
