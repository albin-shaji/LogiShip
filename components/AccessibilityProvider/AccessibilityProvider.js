'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const AccessibilityContext = createContext();

export const useAccessibility = () => useContext(AccessibilityContext);

export default function AccessibilityProvider({ children }) {
  const [preferences, setPreferences] = useState({
    textSize: 100, // percentage
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedPrefs = localStorage.getItem('accessibilityPrefs');
    if (savedPrefs) {
      try {
        const parsed = JSON.parse(savedPrefs);
        // Ensure legacy prefs are cleared or handled properly
        setPreferences({
          textSize: parsed.textSize || 100,
        });
      } catch (e) {
        console.error('Failed to parse accessibility preferences', e);
      }
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('accessibilityPrefs', JSON.stringify(preferences));

    // Cleanup any old legacy classes just in case
    document.body.classList.remove('a11y-high-contrast', 'a11y-large-text', 'a11y-reduce-motion');

    // Scale root font-size based on percentage
    document.documentElement.style.fontSize = `${preferences.textSize}%`;
  }, [preferences, mounted]);

  const changeTextSize = (amount) => {
    setPreferences((prev) => ({
      ...prev,
      textSize: Math.max(80, Math.min(150, prev.textSize + amount)),
    }));
  };

  return (
    <AccessibilityContext.Provider value={{ preferences, changeTextSize }}>
      {children}
    </AccessibilityContext.Provider>
  );
}
