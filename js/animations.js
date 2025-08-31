// Animation utilities and effects

class AnimationManager {
  constructor() {
    this.observers = new Map();
    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.setupScrollAnimations();
    this.setupHoverEffects();
    this.setupPageTransitions();
  }

  setupIntersectionObserver() {
    // Create intersection observer for scroll animations
    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.triggerAnimation(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // Observe all elements with animation classes
    const animatedElements = document.querySelectorAll('.fade-in, .bounce-in, .slide-up, .slide-in-left, .slide-in-right');
    animatedElements.forEach(element => {
      this.intersectionObserver.observe(element);
    });
  }

  triggerAnimation(element) {
    const delay = element.getAttribute('data-delay') || 0;
    
    setTimeout(() => {
      element.classList.add('animate-in');
      element.style.opacity = '1';
      element.style.transform = 'translateY(0) translateX(0) scale(1)';
    }, delay);
  }

  setupScrollAnimations() {
    // Parallax effect for hero sections
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.parallax');
      
      parallaxElements.forEach(element => {
        const speed = element.getAttribute('data-speed') || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    });
  }

  setupHoverEffects() {
    // Enhanced hover effects for cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        this.animateCardHover(card, true);
      });
      
      card.addEventListener('mouseleave', () => {
        this.animateCardHover(card, false);
      });
    });

    // Button hover effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
      button.addEventListener('mouseenter', () => {
        this.animateButtonHover(button, true);
      });
      
      button.addEventListener('mouseleave', () => {
        this.animateButtonHover(button, false);
      });
    });
  }

  animateCardHover(card, isHovering) {
    if (isHovering) {
      card.style.transform = 'translateY(-8px) scale(1.02)';
      card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
    } else {
      card.style.transform = 'translateY(0) scale(1)';
      card.style.boxShadow = 'var(--shadow-md)';
    }
  }

  animateButtonHover(button, isHovering) {
    if (isHovering) {
      button.style.transform = 'translateY(-2px) scale(1.05)';
    } else {
      button.style.transform = 'translateY(0) scale(1)';
    }
  }

  setupPageTransitions() {
    // Smooth page transitions
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.animatePageTransition(link);
      });
    });
  }

  animatePageTransition(link) {
    const currentPage = document.querySelector('.page.active');
    const targetPageId = link.getAttribute('data-page');
    const targetPage = document.getElementById(targetPageId);
    
    if (currentPage && targetPage && currentPage !== targetPage) {
      // Fade out current page
      currentPage.style.opacity = '0';
      currentPage.style.transform = 'translateX(-20px)';
      
      setTimeout(() => {
        currentPage.classList.remove('active');
        targetPage.classList.add('active');
        
        // Fade in target page
        targetPage.style.opacity = '0';
        targetPage.style.transform = 'translateX(20px)';
        
        setTimeout(() => {
          targetPage.style.opacity = '1';
          targetPage.style.transform = 'translateX(0)';
        }, 50);
      }, 300);
    }
  }

  // Utility methods for custom animations
  fadeIn(element, duration = 300) {
    element.style.opacity = '0';
    element.style.transition = `opacity ${duration}ms ease`;
    
    setTimeout(() => {
      element.style.opacity = '1';
    }, 10);
  }

  fadeOut(element, duration = 300) {
    element.style.transition = `opacity ${duration}ms ease`;
    element.style.opacity = '0';
    
    setTimeout(() => {
      element.style.display = 'none';
    }, duration);
  }

  slideIn(element, direction = 'up', duration = 300) {
    const directions = {
      up: 'translateY(30px)',
      down: 'translateY(-30px)',
      left: 'translateX(30px)',
      right: 'translateX(-30px)'
    };
    
    element.style.transform = directions[direction];
    element.style.opacity = '0';
    element.style.transition = `all ${duration}ms ease`;
    
    setTimeout(() => {
      element.style.transform = 'translate(0, 0)';
      element.style.opacity = '1';
    }, 10);
  }

  bounce(element, intensity = 0.3) {
    element.style.animation = `bounce 0.6s ease`;
    
    setTimeout(() => {
      element.style.animation = '';
    }, 600);
  }

  shake(element) {
    element.style.animation = `shake 0.5s ease-in-out`;
    
    setTimeout(() => {
      element.style.animation = '';
    }, 500);
  }

  pulse(element, count = 3) {
    let currentCount = 0;
    const pulseInterval = setInterval(() => {
      element.style.transform = 'scale(1.1)';
      setTimeout(() => {
        element.style.transform = 'scale(1)';
        currentCount++;
        if (currentCount >= count) {
          clearInterval(pulseInterval);
        }
      }, 150);
    }, 300);
  }

  // Loading animations
  showLoading(element, text = 'Loading...') {
    const loadingElement = document.createElement('div');
    loadingElement.className = 'loading-overlay';
    loadingElement.innerHTML = `
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <p class="loading-text">${text}</p>
      </div>
    `;
    
    loadingElement.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      border-radius: var(--radius-2xl);
    `;
    
    element.style.position = 'relative';
    element.appendChild(loadingElement);
    
    return loadingElement;
  }

  hideLoading(loadingElement) {
    if (loadingElement && loadingElement.parentNode) {
      loadingElement.parentNode.removeChild(loadingElement);
    }
  }

  // Progress bar animation
  animateProgressBar(progressBar, targetValue, duration = 1000) {
    const startValue = 0;
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const currentValue = startValue + (targetValue - startValue) * this.easeOutCubic(progress);
      progressBar.style.width = `${currentValue}%`;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }

  // Easing functions
  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  // Stagger animation for lists
  staggerAnimation(elements, delay = 100) {
    elements.forEach((element, index) => {
      setTimeout(() => {
        this.slideIn(element, 'up', 300);
      }, index * delay);
    });
  }

  // Typewriter effect
  typewriter(element, text, speed = 50) {
    element.textContent = '';
    let i = 0;
    
    const type = () => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    };
    
    type();
  }

  // Floating animation for decorative elements
  createFloatingAnimation(element) {
    element.style.animation = 'float 3s ease-in-out infinite';
  }

  // Sparkle effect
  createSparkleEffect(container) {
    const sparkles = ['✨', '⭐', '💫', '🌟'];
    
    for (let i = 0; i < 5; i++) {
      const sparkle = document.createElement('div');
      sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
      sparkle.style.cssText = `
        position: absolute;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        font-size: ${Math.random() * 20 + 10}px;
        animation: sparkle 2s ease-in-out infinite;
        animation-delay: ${Math.random() * 2}s;
        pointer-events: none;
      `;
      
      container.appendChild(sparkle);
      
      setTimeout(() => {
        if (sparkle.parentNode) {
          sparkle.parentNode.removeChild(sparkle);
        }
      }, 4000);
    }
  }
}

// Initialize animation manager
let animationManager;

document.addEventListener('DOMContentLoaded', () => {
  animationManager = new AnimationManager();
  
  // Add initial animations to elements
  const initialElements = document.querySelectorAll('.fade-in, .bounce-in, .slide-up');
  initialElements.forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      animationManager.triggerAnimation(element);
    }, index * 100);
  });
});

// Export for global use
window.AnimationManager = AnimationManager;
window.animations = animationManager;
