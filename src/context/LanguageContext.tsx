import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SupportedLanguage } from '../types';

export interface LanguageContextType {
  currentLanguage: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  setCurrentLanguage: (lang: SupportedLanguage) => void;
}

const STORAGE_KEY = 'spc_currentLanguage';
const LEGACY_STORAGE_KEY = 'sahaara_currentLanguage';

const VALID_LANGS: SupportedLanguage[] = ['en', 'ta', 'hi', 'te', 'ml', 'kn', 'ur'];

function getInitialLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') return 'en';
  try {
    const stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (VALID_LANGS.includes(parsed)) {
          return parsed as SupportedLanguage;
        }
      } catch {
        if (VALID_LANGS.includes(stored as SupportedLanguage)) {
          return stored as SupportedLanguage;
        }
      }
    }
  } catch (e) {
    // Ignore storage read error
  }
  return 'en';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguageState] = useState<SupportedLanguage>(getInitialLanguage);

  const setLanguage = (lang: SupportedLanguage) => {
    setCurrentLanguageState(lang);
  };

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentLanguage));
      localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(currentLanguage));
    } catch (e) {
      // Ignore storage write error
    }

    // Set document direction for RTL support (Urdu)
    if (typeof document !== 'undefined') {
      const isRtl = currentLanguage === 'ur';
      document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
      document.documentElement.setAttribute('lang', currentLanguage);
      if (isRtl) {
        document.body.classList.add('rtl-layout');
      } else {
        document.body.classList.remove('rtl-layout');
      }
    }
  }, [currentLanguage]);

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        setCurrentLanguage: setLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export { LanguageContext };
