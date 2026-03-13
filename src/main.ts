import './style.css';
import { createIcons, icons } from 'lucide';
import gsap from 'gsap';
import { ParticleScene } from './three/particles';
import { TerminalLogic } from './components/Terminal';
import { ProjectsInteraction, ChatbotLogic } from './components/Projects';
import { I18nController } from './i18n/i18nController';

// 1. Initialize Icons
createIcons({ icons });

// Initialize Internationalization (i18n)
new I18nController();

// 2. State
let isDark = true;

// 3. Theme Toggle
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

themeToggleBtn?.addEventListener('click', () => {
    isDark = !isDark;
    const htmlObj = document.documentElement;
    if (isDark) {
        htmlObj.classList.add('dark');
        themeIcon?.setAttribute('data-lucide', 'sun');
    } else {
        htmlObj.classList.remove('dark');
        themeIcon?.setAttribute('data-lucide', 'moon');
    }
    themeIcon?.classList.add('text-iconColor');
    createIcons({ icons }); // Re-render icon
    
    // Dispatch event to update particles
    const event = new CustomEvent('themeToggled', { detail: isDark });
    document.dispatchEvent(event);
});

// 4. Initialize ThreeJS particles
new ParticleScene('webgl-container');

// 5. Loading Animation & Intro Sequence
window.addEventListener('load', () => {
    const tl = gsap.timeline();

    // Loader fade out
    tl.to('#loader', {
        opacity: 0,
        duration: 1,
        delay: 0.5,
        onComplete: () => {
            const loader = document.getElementById('loader');
            if (loader) loader.style.display = 'none';
        }
    })
    // Navbar drop in
    .fromTo('#navbar', 
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=0.2"
    )
    // Hero content slide up and fade in
    .to('.hero-content', {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out"
    }, "-=0.4");
});



// 7. Custom Cursor Logic (Desktop only)
const cursor = document.getElementById('custom-cursor');
if (cursor && window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('scale-150', 'border-neonCyan'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('scale-150', 'border-neonCyan'));
    });
}

// 8. Initialize Components
new TerminalLogic();
new ProjectsInteraction();
new ChatbotLogic();

// 9. Scroll Reveals (Professional subtle fades)
const initScrollReveals = () => {
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        section.classList.add('reveal-on-scroll');
        observer.observe(section);
    });
};

initScrollReveals();

// 10. Contact Form Logic
const contactForm = document.getElementById('contact-form') as HTMLFormElement;
contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalContent = btn?.innerHTML;
    
    if (btn) {
        btn.innerHTML = '<i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i> Sending...';
        createIcons({ icons });
        btn.setAttribute('disabled', 'true');
    }

    // Simulate API call
    setTimeout(() => {
        if (btn) {
            btn.innerHTML = '<i data-lucide="check-circle" class="w-5 h-5"></i> Message Sent!';
            btn.classList.remove('bg-electricBlue');
            btn.classList.add('bg-green-600');
            createIcons({ icons });
        }
        
        contactForm.reset();
        
        setTimeout(() => {
            if (btn) {
                btn.innerHTML = originalContent || "Send Message";
                btn.classList.add('bg-electricBlue');
                btn.classList.remove('bg-green-600');
                btn.removeAttribute('disabled');
                createIcons({ icons });
            }
        }, 3000);
    }, 1500);
});

// --- 11. Navbar Logic ---

const navbar = document.getElementById('navbar');
const scrollProgress = document.getElementById('scroll-progress');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileMenuClose = document.getElementById('mobile-menu-close');
const mobileMenuCloseBtn = document.getElementById('mobile-menu-close-btn');
const navLinks = document.querySelectorAll('.nav-link');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
const sections = document.querySelectorAll('section[id]');

let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    // 1. Smart Navbar (Show/Hide/Shrink)
    if (currentScrollY > 50) {
        navbar?.classList.add('navbar-shrink');
    } else {
        navbar?.classList.remove('navbar-shrink');
    }

    if (currentScrollY > lastScrollY && currentScrollY > 200) {
        navbar?.classList.add('navbar-hidden');
    } else {
        navbar?.classList.remove('navbar-hidden');
    }
    lastScrollY = currentScrollY;

    // 2. Scroll Progress
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (currentScrollY / totalHeight) * 100;
    if (scrollProgress) {
        scrollProgress.style.width = `${progress}%`;
    }

    // 3. Active Section Highlighting
    let currentSectionId = "";
    sections.forEach(section => {
        const sectionTop = (section as HTMLElement).offsetTop;
        if (currentScrollY >= sectionTop - 150) {
            currentSectionId = section.getAttribute('id') || "";
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
            link.classList.add('active');
        }
    });
});

// 4. Mobile Menu Toggle
const toggleMobileMenu = (isOpen: boolean) => {
    if (isOpen) {
        mobileMenu?.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        mobileMenu?.classList.remove('active');
        document.body.style.overflow = '';
    }
    // Refresh icons in case they were added dynamically
    createIcons({ icons });
};

mobileMenuToggle?.addEventListener('click', () => toggleMobileMenu(true));
mobileMenuClose?.addEventListener('click', () => toggleMobileMenu(false));
mobileMenuCloseBtn?.addEventListener('click', () => toggleMobileMenu(false));

mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => toggleMobileMenu(false));
});
