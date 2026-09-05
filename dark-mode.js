/**
 * Craftnet theme manager.
 * Applies the saved theme before the page paints, then owns the toggle UI.
 */

class DarkModeManager {
    constructor() {
        this.storageKey = 'craftiva-dark-mode';
        this.init();
    }

    init() {
        const savedPreference = localStorage.getItem(this.storageKey);
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.applyTheme(savedPreference === null ? prefersDark : savedPreference === 'true');
        this.bindToggleEvents();

        const setupControls = () => {
            this.createToggleButton();
            this.updateIcon();
        };
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupControls, { once: true });
        } else {
            setupControls();
        }

        // Listen for system preference changes (only if no manual preference is set)
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (localStorage.getItem(this.storageKey) === null) {
                this.applyTheme(e.matches);
                this.updateIcon();
            }
        });
    }

    bindToggleEvents() {
        if (this.toggleEventsBound) return;
        this.toggleEventsBound = true;
        document.addEventListener('click', (event) => {
            const toggle = event.target.closest('.dark-mode-toggle');
            if (toggle) this.toggle(toggle);
        });
    }

    createToggleButton() {
        const dashboardNav = document.querySelector('#main-nav');
        if (dashboardNav && dashboardNav.children.length > 0) {
            this.ensureDashboardToggle(dashboardNav);
            return;
        }

        const existingToggles = document.querySelectorAll('.dark-mode-toggle');
        if (existingToggles.length > 0) {
            existingToggles.forEach((toggle) => {
                toggle.type = 'button';
            });
            this.updateIcon();
            return;
        }

        const actionsContainer = document.querySelector('.header-actions');
        if (!actionsContainer || !document.body) return;

        const toggle = document.createElement('button');
        toggle.id = 'dark-mode-toggle';
        toggle.className = 'dark-mode-toggle';
        toggle.type = 'button';
        actionsContainer.appendChild(toggle);
        this.updateIcon();
    }

    ensureDashboardToggle(nav) {
        if (!nav || nav.querySelector('.dashboard-dark-mode-toggle')) return;

        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'nav-link dashboard-dark-mode-toggle dark-mode-toggle';
        toggle.title = 'Switch theme';
        nav.appendChild(toggle);
        this.updateIcon();
    }

    getIcon(darkState = this.isDarkMode()) {
        const isDark = darkState;
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
            const isDark = this.isDarkMode();
            toggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
            toggle.setAttribute('aria-pressed', String(isDark));
            if (toggle.classList.contains('dashboard-dark-mode-toggle')) {
                toggle.innerHTML = `
                    <span class="dashboard-dark-mode-copy">
                        <span class="dashboard-dark-mode-icon" aria-hidden="true">${isDark ? this.getIcon(true) : this.getIcon(false)}</span>
                        <span class="dashboard-dark-mode-label">${isDark ? 'Dark' : 'Light'}</span>
                    </span>
                    <span class="dashboard-dark-mode-switch" aria-hidden="true">
                        <span class="dashboard-dark-mode-icon dashboard-dark-mode-icon-sun">${this.getIcon(false)}</span>
                        <span class="dashboard-dark-mode-thumb">
                        </span>
                        <span class="dashboard-dark-mode-icon dashboard-dark-mode-icon-moon">${this.getIcon(true)}</span>
                    </span>
                `;
            } else {
                toggle.innerHTML = this.getIcon();
            }
        });
    }

    setDarkMode(enabled) {
        this.applyTheme(enabled);
        localStorage.setItem(this.storageKey, String(enabled));
        this.updateIcon();
    }

    applyTheme(enabled) {
        document.documentElement.classList.toggle('dark', enabled);
        document.documentElement.style.colorScheme = enabled ? 'dark' : 'light';
    }

    toggle(sourceToggle) {
        const isDark = document.documentElement.classList.contains('dark');
        this.setDarkMode(!isDark);
        
    }

    isDarkMode() {
        return document.documentElement.classList.contains('dark');
    }
}

// Construct immediately so the saved theme is applied before the first paint.
window.darkMode = new DarkModeManager();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DarkModeManager;
}

