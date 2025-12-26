// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav__toggle');
const navList = document.querySelector('.nav__list');

if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
        const isOpen = navList.classList.toggle('nav__list--open');
        navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                navList.classList.remove('nav__list--open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });
}

// Hero Slider
class HeroSlider {
    constructor() {
        this.slides = document.querySelectorAll('.hero__slide');
        this.dots = document.querySelectorAll('.hero__dot');
        this.prevBtn = document.querySelector('.hero__control--prev');
        this.nextBtn = document.querySelector('.hero__control--next');
        this.currentSlide = 0;
        this.autoSlideInterval = null;
        
        this.init();
    }

    init() {
        if (this.slides.length === 0) return;

        // Event listeners for controls
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // Event listeners for dots
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });

        // Auto-slide
        this.startAutoSlide();
        
        // Pause on hover
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.addEventListener('mouseenter', () => this.stopAutoSlide());
            hero.addEventListener('mouseleave', () => this.startAutoSlide());
        }
    }

    goToSlide(index) {
        // Remove active class from current slide and dot
        this.slides[this.currentSlide].classList.remove('hero__slide--active');
        this.dots[this.currentSlide].classList.remove('hero__dot--active');

        // Update current slide
        this.currentSlide = index;

        // Add active class to new slide and dot
        this.slides[this.currentSlide].classList.add('hero__slide--active');
        this.dots[this.currentSlide].classList.add('hero__dot--active');
    }

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }

    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prevIndex);
    }

    startAutoSlide() {
        this.stopAutoSlide(); // Clear any existing interval
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, 5000); // Change slide every 5 seconds
    }

    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }
}

// Lazy Loading Images
const lazyLoadImages = () => {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without IntersectionObserver
        images.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    }
};

// Smooth Scroll for Anchor Links
const smoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#home') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
};

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize slider
    new HeroSlider();
    
    // Initialize lazy loading
    lazyLoadImages();
    
    // Initialize smooth scroll
    smoothScroll();
    
    // Add loaded class to body for animations
    document.body.classList.add('loaded');
});

// Map Preview Button Handler
const mapButton = document.querySelector('.btn--map');
if (mapButton) {
    mapButton.addEventListener('click', () => {
        // In a real application, this would open a modal or navigate to a map page
        alert('Карта площадок будет открыта в полном размере. В реальном приложении здесь будет модальное окно или отдельная страница с интерактивной картой.');
    });
}

// Countdown Timer
class CountdownTimer {
    constructor() {
        // Дата начала фестиваля: 15 сентября 2026, 10:00
        this.festivalDate = new Date('2026-09-15T10:00:00').getTime();
        this.daysEl = document.getElementById('days');
        this.hoursEl = document.getElementById('hours');
        this.minutesEl = document.getElementById('minutes');
        this.secondsEl = document.getElementById('seconds');
        
        if (this.daysEl && this.hoursEl && this.minutesEl && this.secondsEl) {
            this.updateTimer();
            setInterval(() => this.updateTimer(), 1000);
        }
    }
    
    updateTimer() {
        const now = new Date().getTime();
        const distance = this.festivalDate - now;
        
        if (distance < 0) {
            // Фестиваль уже начался
            this.daysEl.textContent = '00';
            this.hoursEl.textContent = '00';
            this.minutesEl.textContent = '00';
            this.secondsEl.textContent = '00';
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        this.daysEl.textContent = String(days).padStart(2, '0');
        this.hoursEl.textContent = String(hours).padStart(2, '0');
        this.minutesEl.textContent = String(minutes).padStart(2, '0');
        this.secondsEl.textContent = String(seconds).padStart(2, '0');
    }
}

// Initialize countdown timer when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new CountdownTimer();
});

