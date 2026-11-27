import { useEffect, useRef, useState } from 'react';
import SemesterBox, { type ModuleSelection } from './semesterBox';
import { advicesDatabase } from '../advicesData';
import './container.css';

const THEME_STORAGE_KEY = 'l1-cs-theme';

function getInitialTheme(): boolean {
  if (typeof document !== 'undefined') {
    const attr = document.documentElement.getAttribute('data-theme');
    if (attr === 'dark') return true;
    if (attr === 'light') return false;
  }
  return false;
}

export default function Container() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(getInitialTheme);
  const [selectedModule, setSelectedModule] = useState<ModuleSelection | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const lastTriggerRef = useRef<HTMLElement | null>(null);

  const activeAdvice = selectedModule
    ? advicesDatabase[selectedModule.id] ?? {
        title: selectedModule.title,
        semester: selectedModule.semester,
        difficulty: '',
        overviewParagraph:
          'Personal advice for this module is coming soon. Meanwhile, open the module Drive folder above to access all available Cours, TD, and TP resources.',
      }
    : null;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const applyTheme = (nextDark: boolean) => {
    setIsDarkMode(nextDark);
    const nextTheme = nextDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', nextTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // Ignore storage errors in restricted browsing contexts
    }
  };

  const handleToggleTheme = () => {
    applyTheme(!isDarkMode);
  };

  const handleOpenAdvice = (moduleInfo: ModuleSelection) => {
    lastTriggerRef.current = document.activeElement as HTMLElement | null;
    setSelectedModule(moduleInfo);
  };

  const handleCloseAdvice = () => {
    setSelectedModule(null);
  };

  useEffect(() => {
    if (!selectedModule) {
      lastTriggerRef.current?.focus();
      return;
    }

    closeButtonRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedModule(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedModule]);

  const handleScrollToModules = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById('modules-section');
    if (!target) return;
    e.preventDefault();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <>
      {/* Fixed stacked background layers for smooth opacity crossfade */}
      <div className="theme-bg-layers" aria-hidden="true">
        <div className="theme-bg-layer theme-bg-light" />
        <div className="theme-bg-layer theme-bg-dark" />
      </div>

      <div className={`app-outer-wrapper ${isDarkMode ? 'dark-purple-mode' : 'light-mode'}`}>
        {/* Top Bar with Brand & Dark Mode Toggle Button */}
        <header className="app-top-bar">
          <span className="app-main-title">L1 CS Resources</span>
          <button
            type="button"
            className="btn-theme-toggle"
            onClick={handleToggleTheme}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-pressed={isDarkMode}
          >
            <span className="theme-icon-stack" aria-hidden="true">
              <span className="theme-icon theme-icon-sun">☀️</span>
              <span className="theme-icon theme-icon-moon">🌙</span>
            </span>
          </button>
        </header>

        {/* Lightweight Mobile-First Hero Section */}
        <section className="hero-section" aria-labelledby="hero-heading">
          <div className="hero-content">
            <span className="hero-eyebrow">1st Year Computer Science</span>
            <h1 id="hero-heading" className="hero-title">
              Your L1 CS study hub, organized{' '}
              <span style={{ whiteSpace: 'nowrap' }}>by semester.</span>
            </h1>
            <p className="hero-description">
              Browse free resources, module summaries, personal advice, and curated Google Drive links sorted cleanly by semester and module.
            </p>
            <a
              href="#modules-section"
              className="hero-cta-btn"
              onClick={handleScrollToModules}
            >
              Browse Modules <span aria-hidden="true">↓</span>
            </a>
          </div>
        </section>

        {/* Main Content Area */}
        <div className="app-content-container">
          <SemesterBox onSelectAdvice={handleOpenAdvice} />
        </div>

        {/* Footer / Contact Section */}
        <footer className="app-footer">
          <p>
            Built with <span aria-hidden="true">💜</span> by <strong>Abderrahmane Mitiche</strong>
          </p>
          <p className="footer-contact">
            Contact:{' '}
            <a href="mailto:sir.mitichedev@gmail.com">
              email <span aria-hidden="true">📬</span>
            </a>
          </p>
          <a
            href="https://t.me/sir_Mitiche"
            target="_blank"
            rel="noopener noreferrer"
            className="telegram-link-btn"
            title="Contact me on Telegram"
          >
            <span className="telegram-icon">Telegram ➤</span>
          </a>
          <p dir="rtl" lang="ar">
            ادعولنا برك🙏
          </p>
        </footer>

        {/* Accessible Advice Modal Popup */}
        {activeAdvice && (
          <div
            className="advice-modal-backdrop"
            onClick={handleCloseAdvice}
            role="presentation"
          >
            <div
              className="advice-modal-content"
              role="dialog"
              aria-modal="true"
              aria-labelledby="advice-modal-title"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="advice-semester-badge">{activeAdvice.semester}</span>
              <h2 id="advice-modal-title">{activeAdvice.title}</h2>
              <p className="advice-big-paragraph">{activeAdvice.overviewParagraph}</p>
              <div className="advice-modal-actions">
                <button
                  ref={closeButtonRef}
                  type="button"
                  className="btn-close-modal"
                  onClick={handleCloseAdvice}
                >
                  Close ✕
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
