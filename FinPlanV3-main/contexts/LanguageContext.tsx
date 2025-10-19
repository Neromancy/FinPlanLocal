
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { en } from '../translations/en.ts';
import { id } from '../translations/id.ts';
import { ja } from '../translations/ja.ts';

type Language = 'en' | 'id' | 'ja';

const translations = { en, id, ja };

/**
 * A robust, defensive helper to safely retrieve a nested translation.
 * It will ONLY return a string or number. If the key path is invalid,
 * incomplete (points to an object), or not found, it will return null.
 */
const getNestedTranslation = (obj: any, keyPath: string): string | number | null => {
    const keys = keyPath.split('.');
    let result: any = obj;

    for (const key of keys) {
        if (result && typeof result === 'object' && !Array.isArray(result) && key in result) {
            result = result[key];
        } else {
            // Path is invalid or does not exist
            return null;
        }
    }

    // After traversing, ensure the final result is a primitive that can be rendered.
    if (typeof result === 'string' || typeof result === 'number') {
        return result;
    }

    // The key pointed to an object (e.g., an incomplete key), which is invalid.
    return null;
};


interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, options?: { [key: string]: string | number }) => string;
  formatCurrency: (amount: number, options?: Intl.NumberFormatOptions) => string;
  formatDate: (dateString: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = useCallback((key: string, options?: { [key: string]: string | number }): string => {
    // Attempt to get the translation from the current language
    let result = getNestedTranslation(translations[language], key);

    // Fallback to English if the translation is missing or invalid in the current language
    if (result === null) {
      result = getNestedTranslation(translations.en, key);
    }

    // If the translation is still not found or invalid after the fallback,
    // return the key itself as a safe, readable string.
    if (result === null) {
        console.warn(`[i18n] Translation not found for key: "${key}"`);
        return key;
    }

    let renderedString = String(result);

    // Replace placeholders like {{count}}
    if (options) {
      renderedString = Object.entries(options).reduce((acc, [optKey, value]) => {
        // Use a global RegExp to replace all instances of the placeholder
        return acc.replace(new RegExp(`{{${optKey}}}`, 'g'), String(value));
      }, renderedString);
    }
    
    return renderedString;
  }, [language]);

  const formatCurrency = useCallback((amount: number, options: Intl.NumberFormatOptions = {}): string => {
    const locale = language === 'id' ? 'id-ID' : language === 'ja' ? 'ja-JP' : 'en-US';
    const currency = language === 'id' ? 'IDR' : language === 'ja' ? 'JPY' : 'USD';
    const defaultOptions: Intl.NumberFormatOptions = {
        style: 'currency',
        currency,
        minimumFractionDigits: language === 'ja' ? 0 : 2,
        maximumFractionDigits: language === 'ja' ? 0 : 2,
    };
    if (language === 'id') {
      defaultOptions.minimumFractionDigits = 0;
      defaultOptions.maximumFractionDigits = 0;
    }
    return new Intl.NumberFormat(locale, {...defaultOptions, ...options}).format(amount);
  }, [language]);

  const formatDate = useCallback((dateString: string) => {
    const locale = language === 'id' ? 'id-ID' : language === 'ja' ? 'ja-JP' : 'en-US';
    const date = new Date(dateString);
     // Add timezone offset to prevent date from shifting across midnight
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(date.getTime() + userTimezoneOffset);
    return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(adjustedDate);
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage, t, formatCurrency, formatDate }), [language, setLanguage, t, formatCurrency, formatDate]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};