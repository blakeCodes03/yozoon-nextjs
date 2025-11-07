// src/components/ui/LanguageSelector.tsx

import React, { useState, useRef } from 'react';
import { FaGlobe } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useOutsideClick } from '../../hooks/useOutsideClick'; // Reuse the custom hook

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const selectorRef = useRef<HTMLDivElement>(null);

  // Close the selector when clicking outside
  useOutsideClick(selectorRef, () => setIsOpen(false));

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'es', label: 'ES' },
    { code: 'de', label: 'DE' },
    // Add more languages as needed
  ];

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={selectorRef}>
      {/* <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center focus:outline-none"
        aria-label="Select Language"
      >
        <FaGlobe className="text-white" size={20} />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-bg1 border border-gray-200 rounded-md shadow-lg z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full text-left px-4 py-2 ${
                i18n.language === lang.code
                  ? 'bg-gray-100'
                  : 'hover:bg-gray-100'
              } text-textPrimary`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )} */}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center focus:outline-none"
        aria-label="Select Language"
      >
        <FaGlobe className="dark:text-white text-black" size={20} />
      </button>
      {isOpen && (
        <div
          id="dropdown"
          className="z-10  dark:bg-white bg-black rounded-lg shadow-sm w-16 absolute right-0 top-10"
        >
          <ul className="py-2 text-sm" aria-labelledby="dropdownDefaultButton">
            {languages.map((lang) => (
              <li>
                <a
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  // className="block px-4 py-2 hover:bg-[#FFB92D] hover:text-black hover:rounded-sm"
                  className={`block px-4 py-2 ${
                    i18n.language === lang.code
                      ? 'bg-[#FFB92D] text-black'
                      : 'hover:bg-gray-100'
                  } text-black`}
                >
                  {lang.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
