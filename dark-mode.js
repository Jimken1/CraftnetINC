/**
 * Brilliant Dark Mode Toggle for Craftiva
 * Handles dark mode state, persistence, and smooth transitions
 */

class DarkModeManager {
    constructor() {
        this.storageKey = 'craftiva-dark-mode';
        this.init();
    }

    init() {
        const path = window.location.pathname;
        const isHomepage = path === '/' || path.endsWith('index.html') || path === '';

        if (!isHomepage) {
            document.documentElement.classList.remove('dark');
            return;
        }

        // Check for saved preference or default to system preference
        const savedPreference = localStorage.getItem(this.storageKey);
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedPreference === null) {
            // No saved preference, use system preference
            this.setDarkMode(prefersDark);
        } else {
            // Use saved preference
            this.setDarkMode(savedPreference === 'true');
        }

        // Create and inject toggle button
        this.createToggleButton();
        
        // Listen for system preference changes (only if no manual preference is set)
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (localStorage.getItem(this.storageKey) === null) {
                this.setDarkMode(e.matches);
            }
        });
    }

    createToggleButton() {
        const path = window.location.pathname;
        const isHomepage = path === '/' || path.endsWith('index.html') || path === '';
        if (!isHomepage) return;

        const existingToggles = document.querySelectorAll('.dark-mode-toggle');
        if (existingToggles.length > 0) {
            existingToggles.forEach((toggle) => {
                toggle.setAttribute('aria-label', 'Toggle dark mode');
                toggle.setAttribute('title', 'Toggle dark mode');
                toggle.addEventListener('click', () => this.toggle(toggle));
            });
            this.updateIcon();
            return;
        }

        const actionsContainer = document.querySelector('.header-actions');
        if (!actionsContainer || !document.body) return;

        const toggle = document.createElement('button');
        toggle.id = 'dark-mode-toggle';
        toggle.className = 'dark-mode-toggle';
        toggle.setAttribute('aria-label', 'Toggle dark mode');
        toggle.setAttribute('title', 'Toggle dark mode');
        toggle.innerHTML = this.getIcon();
        toggle.addEventListener('click', () => this.toggle(toggle));
        actionsContainer.appendChild(toggle);
    }

    getIcon() {
        const isDark = document.documentElement.classList.contains('dark');
        if (isDark) {
            // Moon icon for dark mode (clicking will switch to light)
            return `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            `;
        } else {
            // Sun icon for light mode (clicking will switch to dark)
            return `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            `;
        }
    }

    updateIcon() {
        const toggles = document.querySelectorAll('.dark-mode-toggle');
        toggles.forEach((toggle) => {
            toggle.innerHTML = this.getIcon();
        });
    }

    setDarkMode(enabled) {
        if (enabled) {
            document.documentElement.classList.add('dark');
            localStorage.setItem(this.storageKey, 'true');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem(this.storageKey, 'false');
        }
        this.updateIcon();
    }

    toggle(sourceToggle) {
        const isDark = document.documentElement.classList.contains('dark');
        this.setDarkMode(!isDark);
        
        // Add a subtle animation effect
        if (sourceToggle) {
            sourceToggle.style.transform = 'scale(0.9)';
            setTimeout(() => {
                sourceToggle.style.transform = '';
            }, 150);
        }
    }

    isDarkMode() {
        return document.documentElement.classList.contains('dark');
    }
}

// Initialize dark mode when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.darkMode = new DarkModeManager();
    });
} else {
    window.darkMode = new DarkModeManager();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DarkModeManager;
}

