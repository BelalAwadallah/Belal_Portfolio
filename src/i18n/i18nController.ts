import { translations } from './translations';
import Typed from 'typed.js';

export class I18nController {
  private currentLang: 'en' | 'ar' = 'en';

  constructor() {
    this.init();
  }

  private init() {
    // Check local storage for saved language
    const savedLang = localStorage.getItem('lang') as 'en' | 'ar';
    if (savedLang && (savedLang === 'en' || savedLang === 'ar')) {
      this.currentLang = savedLang;
    }

    this.applyLanguage(this.currentLang);
    this.setupToggleListener();
  }

  private setupToggleListener() {
    const toggleBtn = document.getElementById('lang-toggle');
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
      this.currentLang = this.currentLang === 'en' ? 'ar' : 'en';
      localStorage.setItem('lang', this.currentLang);
      this.applyLanguage(this.currentLang);
    });
  }

  private applyLanguage(lang: 'en' | 'ar') {
    const htmlEl = document.documentElement;
    htmlEl.lang = lang;
    htmlEl.dir = lang === 'ar' ? 'rtl' : 'ltr';

    // Update the toggle button text
    const langLabel = document.getElementById('lang-label');
    if (langLabel) {
      langLabel.textContent = lang === 'en' ? 'AR' : 'EN';
    }

    // Update regular elements with data-i18n attributes
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        const keys = key.split('.');
        let translation: any = translations[lang];
        for (const k of keys) {
          if (translation[k] !== undefined) {
            translation = translation[k];
          } else {
            translation = key; // Fallback
            break;
          }
        }
        
        // If the translation contains HTML (like <span class='...'>) use innerHTML
        if (typeof translation === 'string') {
          if (translation.includes('<span')) {
            el.innerHTML = translation;
          } else {
            el.textContent = translation;
          }
        }
      }
    });

    // Update placeholder texts
    const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
    placeholderElements.forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key) {
        const keys = key.split('.');
        let translation: any = translations[lang];
        for (const k of keys) {
          if (translation[k] !== undefined) {
            translation = translation[k];
          } else {
            translation = key;
            break;
          }
        }
        if (typeof translation === 'string') {
          (el as HTMLInputElement).placeholder = translation;
        }
      }
    });

    // Re-initialize dynamic components that need correct language format (like Typed.js)
    this.updateTypedJs(lang);
  }

  private typedInstance: any = null;

  private updateTypedJs(lang: 'en' | 'ar') {
    // Destroy the existing typed instance if it exists
    if (this.typedInstance) {
      this.typedInstance.destroy();
    }
    
    // Create new Typed instance
    this.typedInstance = new Typed('#typed-element', {
      strings: lang === 'en' 
          ? ['Frontend Engineer', 'Full Stack Developer', 'Angular Specialist', 'Creative Coder']
          : ['مهندس واجهات أمامية', 'مطور شامل (Full Stack)', 'متخصص في Angular', 'مبرمج مبدع'],
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 1500,
      loop: true,
      cursorChar: '_'
    });
  }
}
