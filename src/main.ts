import './style.css';
import { createIcons, icons } from 'lucide';
import gsap from 'gsap';
import { ParticleScene } from './three/particles';
import { TerminalLogic } from './components/Terminal';
import { TechStackVisualizer } from './components/TechStack';
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
new TechStackVisualizer('orbit-container');
new ProjectsInteraction();
new ChatbotLogic();
