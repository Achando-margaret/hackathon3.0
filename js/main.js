// Main JavaScript functionality

// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');
const userMenu = document.querySelector('.user-menu');
const userDropdown = document.querySelector('.user-dropdown');
const logoutBtn = document.getElementById('logoutBtn');
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');

// Theme Management
let currentTheme = localStorage.getItem('theme') || 'light';

// Sidebar Management
let sidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';

// Initialize theme
function initTheme() {
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon();
  console.log('Theme initialized:', currentTheme);
}

// Initialize sidebar
function initSidebar() {
  if (sidebarCollapsed) {
    sidebar.classList.add('collapsed');
  }
}

// Toggle sidebar
function toggleSidebar() {
  sidebarCollapsed = !sidebarCollapsed;
  sidebar.classList.toggle('collapsed', sidebarCollapsed);
  localStorage.setItem('sidebarCollapsed', sidebarCollapsed);
}

// Toggle theme
function toggleTheme() {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  localStorage.setItem('theme', currentTheme);
  updateThemeIcon();
  console.log('Theme changed to:', currentTheme);
}

// Update theme icon
function updateThemeIcon() {
  const themeIcon = themeToggle.querySelector('.theme-icon');
  themeIcon.textContent = currentTheme === 'light' ? '🌙' : '☀️';
}

// Navigation Management
function initNavigation() {
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetPage = link.getAttribute('data-page');
      showPage(targetPage);
      updateActiveNavLink(link);
    });
  });
}

// Show specific page
function showPage(pageId) {
  pages.forEach(page => {
    page.classList.remove('active');
  });
  
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.add('active');
    
    // Trigger page-specific animations
    triggerPageAnimations(targetPage);
  }
}

// Update active navigation link
function updateActiveNavLink(activeLink) {
  navLinks.forEach(link => {
    link.classList.remove('active');
  });
  activeLink.classList.add('active');
}

// Trigger page animations
function triggerPageAnimations(page) {
  const animatedElements = page.querySelectorAll('.fade-in, .bounce-in, .slide-up');
  animatedElements.forEach((element, index) => {
    setTimeout(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, index * 100);
  });
}

// User Menu Management
function initUserMenu() {
  userMenu.addEventListener('click', (e) => {
    e.stopPropagation();
    userDropdown.classList.toggle('active');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', () => {
    userDropdown.classList.remove('active');
  });
}

// Authentication Management
function initAuth() {
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (!isLoggedIn) {
    showLoginModal();
  }

  // Logout functionality
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    logout();
  });
}

// Show login modal
function showLoginModal() {
  const loginModal = document.getElementById('loginModal');
  loginModal.classList.add('active');
}

// Hide login modal
function hideLoginModal() {
  const loginModal = document.getElementById('loginModal');
  loginModal.classList.remove('active');
}

// Show signup modal
function showSignupModal() {
  const signupModal = document.getElementById('signupModal');
  signupModal.classList.add('active');
  hideLoginModal();
}

// Hide signup modal
function hideSignupModal() {
  const signupModal = document.getElementById('signupModal');
  signupModal.classList.remove('active');
}

// Show forgot password modal
function showForgotModal() {
  const forgotModal = document.getElementById('forgotModal');
  forgotModal.classList.add('active');
  hideLoginModal();
}

// Hide forgot password modal
function hideForgotModal() {
  const forgotModal = document.getElementById('forgotModal');
  forgotModal.classList.remove('active');
}

// Login functionality
function login(email, password) {
  // Simulate login process
  setTimeout(() => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', email);
    hideLoginModal();
    showNotification('Welcome back! 🌸', 'success');
  }, 1000);
}

// Signup functionality
function signup(name, email, password) {
  // Simulate signup process
  setTimeout(() => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userName', name);
    hideSignupModal();
    showNotification('Account created successfully! 🌷', 'success');
  }, 1000);
}

// Forgot password functionality
function forgotPassword(email) {
  // Simulate password reset
  setTimeout(() => {
    hideForgotModal();
    showNotification('Password reset link sent to your email! 🌼', 'success');
  }, 1000);
}

// Logout functionality
function logout() {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userName');
  showLoginModal();
  showNotification('Logged out successfully! 👋', 'info');
}

// Notification system
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-message">${message}</span>
      <button class="notification-close">&times;</button>
    </div>
  `;

  // Add notification styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--white);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-lg);
    padding: var(--space-4);
    z-index: 3000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 300px;
  `;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);

  // Auto remove after 5 seconds
  setTimeout(() => {
    removeNotification(notification);
  }, 5000);

  // Close button functionality
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.addEventListener('click', () => {
    removeNotification(notification);
  });
}

// Remove notification
function removeNotification(notification) {
  notification.style.transform = 'translateX(100%)';
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 300);
}

// Modal Management
function initModals() {
  // Login modal
  const loginModal = document.getElementById('loginModal');
  const closeLoginModal = document.getElementById('closeLoginModal');
  const showSignupModalBtn = document.getElementById('showSignupModal');
  const showForgotModalBtn = document.getElementById('showForgotModal');

  closeLoginModal.addEventListener('click', hideLoginModal);
  showSignupModalBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showSignupModal();
  });
  showForgotModalBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showForgotModal();
  });

  // Signup modal
  const signupModal = document.getElementById('signupModal');
  const closeSignupModal = document.getElementById('closeSignupModal');
  const showLoginModalBtn = document.getElementById('showLoginModal');

  closeSignupModal.addEventListener('click', hideSignupModal);
  showLoginModalBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showLoginModal();
    hideSignupModal();
  });

  // Forgot password modal
  const forgotModal = document.getElementById('forgotModal');
  const closeForgotModal = document.getElementById('closeForgotModal');
  const showLoginModalFromForgot = document.getElementById('showLoginModalFromForgot');

  closeForgotModal.addEventListener('click', hideForgotModal);
  showLoginModalFromForgot.addEventListener('click', (e) => {
    e.preventDefault();
    showLoginModal();
    hideForgotModal();
  });

  // Close modals when clicking outside
  [loginModal, signupModal, forgotModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });
}

// Form Management
function initForms() {
  // Login form
  const loginForm = document.getElementById('loginForm');
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (email && password) {
      login(email, password);
    } else {
      showNotification('Please fill in all fields! ⚠️', 'error');
    }
  });

  // Signup form
  const signupForm = document.getElementById('signupForm');
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    if (name && email && password) {
      signup(name, email, password);
    } else {
      showNotification('Please fill in all fields! ⚠️', 'error');
    }
  });

  // Forgot password form
  const forgotForm = document.getElementById('forgotForm');
  forgotForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('forgotEmail').value;
    
    if (email) {
      forgotPassword(email);
    } else {
      showNotification('Please enter your email! ⚠️', 'error');
    }
  });
}

// Quick Actions
function initQuickActions() {
  // Upgrade button
  const upgradeBtn = document.querySelector('.upgrade-btn');
  if (upgradeBtn) {
    upgradeBtn.addEventListener('click', () => {
      showPage('payment');
      showNotification('Redirecting to payment page... 💳', 'info');
    });
  }

  // Tile buttons
  const tileBtns = document.querySelectorAll('.tile-btn');
  tileBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      showPage('ai-assistant');
      showNotification('Starting AI chat... 🤖', 'info');
    });
  });
}

// Theme Toggle
function initThemeToggle() {
  themeToggle.addEventListener('click', toggleTheme);
}

// Sidebar Toggle
function initSidebarToggle() {
  sidebarToggle.addEventListener('click', toggleSidebar);
}

// Initialize everything
function init() {
  initTheme();
  initSidebar();
  initNavigation();
  initUserMenu();
  initAuth();
  initModals();
  initForms();
  initQuickActions();
  initThemeToggle();
  initSidebarToggle();
  
  // Show dashboard by default
  showPage('dashboard');
  
  console.log('🌸 Study Assistant initialized successfully!');
}

// Start the application
document.addEventListener('DOMContentLoaded', init);

// Export functions for other modules
window.StudyAssistant = {
  showPage,
  showNotification,
  login,
  signup,
  logout
};
