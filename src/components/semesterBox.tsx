import { useRef, useState } from 'react';
import './semesterBox.css';

export interface ModuleSelection {
  id: string;
  title: string;
  semester: string;
}

interface ModuleItem {
  id: string;
  title: string;
  rating: number;
  resourceLink: string;
}

interface SemesterBoxProps {
  onSelectAdvice: (moduleInfo: ModuleSelection) => void;
}

type SemesterKey = 'sem1' | 'sem2';

const SEMESTER_DATA: Record<
  SemesterKey,
  {
    label: string;
    modules: ModuleItem[];
    beskriLink: string;
    beskriLabel: string;
  }
> = {
  sem1: {
    label: 'Semester 1',
    modules: [
      { id: 'analyse-1', title: 'Analyse 1', rating: 3, resourceLink: 'https://drive.google.com/drive/folders/1YLZfTyxfBblIBQ7k69Af6Dwts0OnEHZb?usp=drive_link' },
      { id: 'algebre-1', title: 'Algebre 1', rating: 3, resourceLink: 'https://drive.google.com/drive/folders/1ZG5BK70pWUl6qfXURPQ1WqcBkJhs6oOa?usp=drive_link' },
      { id: 'algorithmes-1', title: 'Algorithme 1', rating: 2, resourceLink: 'https://drive.google.com/drive/folders/1yfiUca06irA3_d6n3Owy3bxqfdPgmddM?usp=drive_link' },
      { id: 'structure-machine-1', title: 'Structure Machine 1', rating: 1, resourceLink: 'https://drive.google.com/drive/folders/1F4P59rNoEXAzJ6MuejPM6G05NKMjopFZ?usp=drive_link' },
      { id: 'mp-1', title: 'MP', rating: 2, resourceLink: 'https://drive.google.com/drive/folders/1DPDtFbmL7R952AfRNshqzWsyRg2zcwfL?usp=drive_link' },
    ],
    beskriLink: 'https://drive.google.com/drive/folders/1Pi63gTuIlYxQESDHgFNfTAiHerbb9BGs',
    beskriLabel: 'Semester 1 "Beskri"',
  },
  sem2: {
    label: 'Semester 2',
    modules: [
      { id: 'analyse-2', title: 'Analyse 2', rating: 2, resourceLink: 'https://drive.google.com/drive/folders/1g_hRGzY5xtlL3-HzdFo_aDtjARW2oau-?usp=sharing' },
      { id: 'algebre-2', title: 'Algebre 2', rating: 2, resourceLink: 'https://drive.google.com/drive/folders/10dfhpz2KNR5ruYYDCA-fqR1PQDDXZVUL?usp=drive_link' },
      { id: 'algorithmes-2', title: 'Algorithme 2', rating: 3, resourceLink: 'https://drive.google.com/drive/folders/1MzTy8iy3-JkOEHd7Jc0UxhL1JYhOIpGT?usp=drive_link' },
      { id: 'electricity', title: 'Electricity', rating: 3, resourceLink: 'https://drive.google.com/drive/folders/1QLPIXXsinYdGWMeJVSx5oWv_sdXObBP1?usp=drive_link' },
      { id: 'structure-machine-2', title: 'Structure Machine 2', rating: 2, resourceLink: 'https://drive.google.com/drive/folders/1LgZmzdhM5gZT3Dd8dhD3mJjRltJgab2O?usp=drive_link' },
      { id: 'probability-statistics', title: 'Probability and Statistics', rating: 1, resourceLink: 'https://drive.google.com/drive/folders/1h-iuK4E3doJxnIcxpJ_843F6DEEHHZqW?usp=drive_link' },
      { id: 'OPM', title: 'OPM', rating: 1, resourceLink: 'https://drive.google.com/drive/folders/1ndMzcwuaACPK8bo-b5ch9UNY7ezgfR8p?usp=drive_link' },
    ],
    beskriLink: 'https://drive.google.com/drive/folders/1P4zjst9Blz50vPODEHICZg5apYZMHfJU',
    beskriLabel: 'Semester 2 "Beskri"',
  },
};

const SEMESTER_KEYS: SemesterKey[] = ['sem1', 'sem2'];

export default function SemesterBox({ onSelectAdvice }: SemesterBoxProps) {
  const [activeSemester, setActiveSemester] = useState<SemesterKey>('sem1');
  const [slideDirection, setSlideDirection] = useState<'initial' | 'forward' | 'backward'>('initial');
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const currentSemester = SEMESTER_DATA[activeSemester];

  const selectSemester = (nextKey: SemesterKey) => {
    if (nextKey === activeSemester) return;
    const currentIndex = SEMESTER_KEYS.indexOf(activeSemester);
    const nextIndex = SEMESTER_KEYS.indexOf(nextKey);
    setSlideDirection(nextIndex > currentIndex ? 'forward' : 'backward');
    setActiveSemester(nextKey);
  };

  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | null = null;

    if (e.key === 'ArrowRight') {
      nextIndex = (index + 1) % SEMESTER_KEYS.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (index - 1 + SEMESTER_KEYS.length) % SEMESTER_KEYS.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = SEMESTER_KEYS.length - 1;
    }

    if (nextIndex !== null) {
      e.preventDefault();
      const nextKey = SEMESTER_KEYS[nextIndex];
      selectSemester(nextKey);
      tabRefs.current[nextIndex]?.focus();
    }
  };

  const panelAnimationClass =
    slideDirection === 'forward'
      ? 'panel-slide-forward'
      : slideDirection === 'backward'
        ? 'panel-slide-backward'
        : '';

  return (
    <section id="modules-section" className="main-semester-box" aria-label="Course resources by semester">
      {/* Semester Tabs */}
      <div className="semester-tablist" role="tablist" aria-label="Select semester">
        <span
          className={`semester-tab-indicator ${activeSemester === 'sem2' ? 'is-sem2' : ''}`}
          aria-hidden="true"
        />
        {SEMESTER_KEYS.map((key, index) => {
          const isSelected = activeSemester === key;
          return (
            <button
              key={key}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              type="button"
              role="tab"
              id={`tab-${key}`}
              aria-selected={isSelected}
              aria-controls={`panel-${key}`}
              tabIndex={isSelected ? 0 : -1}
              className={`semester-tab ${isSelected ? 'is-active' : ''}`}
              onClick={() => selectSemester(key)}
              onKeyDown={(e) => handleTabKeyDown(e, index)}
            >
              {SEMESTER_DATA[key].label}
            </button>
          );
        })}
      </div>

      {/* Active Semester Panel */}
      <div
        key={activeSemester}
        role="tabpanel"
        id={`panel-${activeSemester}`}
        aria-labelledby={`tab-${activeSemester}`}
        className={`semester-section-block ${panelAnimationClass}`}
      >
        <div className="semester-header-row">
          <h2 className="semester-section-title">{currentSemester.label}</h2>
          <span className="mobile-scroll-hint" aria-hidden="true">Swipe →</span>
        </div>

        <div className="modules-grid-container">
          {currentSemester.modules.map((mod) => (
            <article key={mod.id} className="module-card">
              <div>
                <div className="card-top-row">
                  <a
                    href={mod.resourceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-icon-badge"
                    title={`Open ${mod.title} Google Drive Folder`}
                    aria-label={`Open ${mod.title} Google Drive folder (opens in new tab)`}
                  >
                    <span aria-hidden="true">📁</span>
                  </a>
                </div>
                <div className="card-accent-line" aria-hidden="true"></div>
                <h3 className="module-name">{mod.title}</h3>
              </div>

              <div className="card-footer-row">
                <div className="module-rating-group">
                  <span className="rating-label">Personal difficulty level:</span>
                  <div
                    className="module-stars"
                    aria-label={`Difficulty ${mod.rating} out of 3`}
                  >
                    {'★'.repeat(Math.floor(mod.rating))}
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-advice-link"
                  onClick={() =>
                    onSelectAdvice({
                      id: mod.id,
                      title: mod.title,
                      semester: currentSemester.label,
                    })
                  }
                >
                  Advices
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="beskri-wrapper">
          <a
            href={currentSemester.beskriLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary-link"
          >
            {currentSemester.beskriLabel} <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}