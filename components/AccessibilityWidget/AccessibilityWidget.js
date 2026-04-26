'use client';

import { useState } from 'react';
import { useAccessibility } from '../AccessibilityProvider/AccessibilityProvider';
import styles from './AccessibilityWidget.module.css';

export default function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { preferences, changeTextSize } = useAccessibility();

  return (
    <div className={styles.widgetContainer}>
      {isOpen && (
        <div className={styles.menu}>
          <div className={styles.menuHeader}>
            <h3>Accessibility</h3>
            <button className={styles.closeBtn} onClick={() => setIsOpen(false)} aria-label="Close Accessibility Menu">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div className={styles.menuContent}>
            <div className={styles.textScaleControls}>
              <span className={styles.textScaleLabel}>Text Size: {preferences.textSize}%</span>
              <div className={styles.textScaleButtons}>
                <button 
                  onClick={() => changeTextSize(-10)} 
                  disabled={preferences.textSize <= 80}
                  className={styles.scaleBtn}
                  aria-label="Decrease text size"
                >
                  <i className="fa-solid fa-minus"></i>
                </button>
                <button 
                  onClick={() => changeTextSize(10)} 
                  disabled={preferences.textSize >= 150}
                  className={styles.scaleBtn}
                  aria-label="Increase text size"
                >
                  <i className="fa-solid fa-plus"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <button
        className={styles.fab}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Accessibility Options"
      >
        <i className="fa-solid fa-universal-access"></i>
      </button>
    </div>
  );
}
