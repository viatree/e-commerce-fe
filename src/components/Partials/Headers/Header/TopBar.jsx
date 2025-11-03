import Link from "next/link";
import { useEffect, useState, useCallback, useMemo } from "react";
import ServeLangItem from "../../../Helpers/ServeLangItem";
import Arrow from "../../../Helpers/icons/Arrow";
import Selectbox from "../../../Helpers/Selectbox";
import { hasCookie, setCookie, getCookie, deleteCookie } from "cookies-next";

/**
 * Configuration constants for Google Translate integration and language handling
 * This object contains all the configuration values used throughout the component
 */
const CONFIG = {
  GOOGLE_TRANSLATE: {
    SCRIPT_URL:
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit",
    ELEMENT_ID: "google_translate_element",
  },
  COOKIE: {
    NAME: "googtrans", // Google Translate cookie name
    PATH: "/",
    PREFIX: "/auto/", // Prefix used by Google Translate for language codes
  },
  LANGUAGES: {
    RTL: ["ar", "he"], // Languages that use right-to-left text direction
    DIRECTIONS: { LTR: "ltr", RTL: "rtl" },
  },
  RELOAD_DELAY: 2000, // Delay before reloading page after language change (ms)
};

/**
 * Phone icon component for contact information display
 * Uses SVG for crisp rendering at any size
 */
const PhoneIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="w-4 h-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
    />
  </svg>
);

/**
 * Email icon component for contact information display
 * Uses SVG for crisp rendering at any size
 */
const EmailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="w-4 h-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
    />
  </svg>
);

/**
 * Determines the text direction (LTR or RTL) based on language code
 * @param {string} langCode - The language code (e.g., 'en', 'ar', 'he')
 * @returns {string} - 'ltr' for left-to-right languages, 'rtl' for right-to-left
 */
const getDirection = (langCode) =>
  CONFIG.LANGUAGES.RTL.includes(langCode)
    ? CONFIG.LANGUAGES.DIRECTIONS.RTL
    : CONFIG.LANGUAGES.DIRECTIONS.LTR;

/**
 * Sets the document's text direction attribute
 * @param {string} langCode - The language code to determine direction
 */
const setDocumentDirection = (langCode) =>
  document.body.setAttribute("dir", getDirection(langCode));

/**
 * Determines the appropriate cookie domain based on the current hostname
 * Handles subdomains and localhost scenarios
 * @param {string} hostname - The current window hostname
 * @returns {string} - The domain to use for cookie setting
 */
const getCookieDomain = (hostname) => {
  const isSubdomain = hostname.split(".").length >= 2;
  return isSubdomain ? `.${hostname}` : hostname;
};

/**
 * Contact information display component
 * Shows phone and email with appropriate icons
 * @param {Object} contact - Object containing phone and email properties
 */
const ContactInfo = ({ contact }) => (
  <>
    {/* Phone contact information */}
    <div className="flex ltr:space-x-2 rtl:space-x-0 items-center rtl:ml-2 ltr:ml-0">
      <span className="rtl:ml-2 ltr:ml-0">
        <PhoneIcon />
      </span>
      <span className="text-xs text-qblack font-500 leading-none rtl:ml-2 ltr:ml-0">
        {contact?.phone}
      </span>
    </div>
    {/* Email contact information */}
    <div className="flex ltr:space-x-2 rtl:space-x-0 items-center">
      <span className="rtl:ml-2 ltr:ml-0">
        <EmailIcon />
      </span>
      <span className="text-xs text-qblack font-500 leading-none">
        {contact?.email}
      </span>
    </div>
  </>
);

/**
 * Currency selector dropdown component
 * Allows users to switch between different currencies
 * @param {Array} allCurrency - Array of available currencies
 * @param {Object} defaultCurrency - Currently selected currency
 * @param {Function} handler - Function to handle currency changes
 */
const CurrencySelector = ({ allCurrency, defaultCurrency, handler }) => {
  // Don't render if currency data is not available
  if (!defaultCurrency || !allCurrency) return null;

  return (
    <div className="currency-select flex space-x-1 items-center notranslate">
      <Selectbox
        action={handler}
        defaultValue={defaultCurrency.currency_code}
        className="w-fit"
        datas={allCurrency.map((item) => ({
          ...item,
          name: item.currency_code,
        }))}
      />
      <Arrow className="fill-current qblack" />
    </div>
  );
};

/**
 * Language selector dropdown component
 * Allows users to switch between different languages
 * @param {Array} languagesApi - Array of available languages from API
 * @param {Object} selectedLang - Currently selected language
 * @param {Function} onLanguageChange - Function to handle language changes
 */
const LanguageSelector = ({ languagesApi, selectedLang, onLanguageChange }) => {
  // Memoize language options to prevent unnecessary re-renders
  const languageOptions = useMemo(
    () =>
      languagesApi?.map((item) => ({ ...item, name: item.lang_name })) || [],
    [languagesApi]
  );

  return (
    <div className="language-select flex space-x-1 items-center notranslate">
      <Selectbox
        action={onLanguageChange}
        defaultValue={selectedLang?.lang_name || selectedLang?.name}
        className="w-fit"
        datas={languageOptions}
      />
      <Arrow className="fill-current qblack" />
    </div>
  );
};

/**
 * Account link component that shows different content based on authentication status
 * Shows "Account" for logged-in users, "Login" for guests
 * @param {Object} auth - Authentication object from localStorage
 */
const AccountLink = ({ auth }) => {
  const linkClass = "text-xs leading-6 text-qblack font-500 cursor-pointer";

  if (auth) {
    // User is logged in - show account link
    return (
      <Link href="/profile#dashboard" className={linkClass}>
        {ServeLangItem()?.Account}
      </Link>
    );
  }

  // User is not logged in - show login link with responsive text
  return (
    <Link href="/login">
      <span className={`${linkClass} lg:block hidden`}>
        {ServeLangItem()?.Account}
      </span>
      <span className={`${linkClass} lg:hidden block`}>
        {ServeLangItem()?.Login || "Sign In"}
      </span>
    </Link>
  );
};

/**
 * TopBar component - Main header bar containing contact info, currency/language selectors, and navigation
 * Handles Google Translate integration and language direction management
 *
 * @param {string} className - Additional CSS classes
 * @param {Object} contact - Contact information object with phone and email
 * @param {Object} topBarProps - Object containing currency data and handlers
 * @param {Array} languagesApi - Array of available languages from API
 */
export default function TopBar({
  className,
  contact,
  topBarProps,
  languagesApi,
}) {
  const { allCurrency, defaultCurrency, handler } = topBarProps;

  // State for authentication status and selected language
  const [auth, setAuth] = useState(null);
  const [selectedLang, setSelectedLang] = useState(languagesApi?.[0] || null);

  // Initialize authentication state from localStorage on component mount
  useEffect(() => {
    setAuth(JSON.parse(localStorage.getItem("auth")));
  }, []);

  /**
   * Google Translate initialization function
   * Creates and configures the Google Translate element
   */
  const googleTranslateElementInit = useCallback(() => {
    if (window.google?.translate) {
      new window.google.translate.TranslateElement(
        { pageLanguage: "auto", autoDisplay: false },
        CONFIG.GOOGLE_TRANSLATE.ELEMENT_ID
      );
    }
  }, []);

  // Load Google Translate script dynamically
  useEffect(() => {
    // Prevent duplicate script loading
    if (document.querySelector(`script[src*="translate.google.com"]`)) return;

    // Set up the global callback function
    window.googleTranslateElementInit = googleTranslateElementInit;

    // Create and append the Google Translate script
    const script = document.createElement("script");
    script.setAttribute("src", CONFIG.GOOGLE_TRANSLATE.SCRIPT_URL);
    document.body.appendChild(script);
  }, [googleTranslateElementInit]);

  // Initialize language selection and document direction
  useEffect(() => {
    if (!languagesApi?.length) return;

    if (hasCookie(CONFIG.COOKIE.NAME)) {
      // User has a language preference stored in cookies
      const languageCode = getCookie(CONFIG.COOKIE.NAME).replace(
        CONFIG.COOKIE.PREFIX,
        ""
      );
      const selectedLanguage = languagesApi.find(
        (item) => item.lang_code === languageCode
      );
      setSelectedLang(selectedLanguage);
      setDocumentDirection(languageCode);
    } else {
      // No language preference - use the first available language
      setSelectedLang(languagesApi[0]);
      setDocumentDirection(languagesApi[0].lang_code);
    }
  }, [languagesApi]);

  /**
   * Handles language change events
   * Sets cookies, updates state, and reloads the page to apply changes
   * @param {Object} selectedLanguage - The newly selected language object
   */
  const handleLanguageChange = useCallback((selectedLanguage) => {
    const { lang_code } = selectedLanguage;
    const currentDomain = window.location.hostname;
    const cookieDomain = getCookieDomain(currentDomain);

    // Set the Google Translate cookie with the new language
    setCookie(CONFIG.COOKIE.NAME, `${CONFIG.COOKIE.PREFIX}${lang_code}`, {
      path: CONFIG.COOKIE.PATH,
      domain: cookieDomain,
      secure: false,
    });

    // Handle special cases for non-localhost domains
    if (currentDomain !== "localhost") {
      // Clean up any existing cookies on the current domain
      deleteCookie(CONFIG.COOKIE.NAME, currentDomain);

      // Handle subdomain scenarios (e.g., www.example.com -> example.com)
      if (currentDomain.split(".").length === 3) {
        const dotDomain = currentDomain.split(".").slice(1, 3).join(".");
        setCookie(CONFIG.COOKIE.NAME, `${CONFIG.COOKIE.PREFIX}${lang_code}`, {
          path: CONFIG.COOKIE.PATH,
          domain: dotDomain,
          secure: false,
        });
      }
    }

    // Update selected language state
    setSelectedLang(selectedLanguage);

    // Reload page after a delay to apply language changes
    setTimeout(() => window.location.reload(), CONFIG.RELOAD_DELAY);
  }, []);

  return (
    <div
      className={`w-full bg-white h-10 border-b border-qgray-border ${
        className || ""
      }`}
    >
      <div className="container-x mx-auto h-full">
        <div className="flex justify-between items-center h-full">
          {/* Left side - Navigation links */}
          <div className="topbar-nav">
            <ul className="flex space-x-6">
              <li className="rtl:ml-6 ltr:ml-0">
                <AccountLink auth={auth} />
              </li>
              <li>
                <Link
                  href="/tracking-order"
                  className="text-xs leading-6 text-qblack font-500 cursor-pointer"
                >
                  {ServeLangItem()?.Track_Order}
                </Link>
              </li>
            </ul>
          </div>

          {/* Right side - Contact info and dropdowns (hidden on mobile) */}
          <div className="topbar-dropdowns lg:block hidden">
            <div className="flex ltr:space-x-6 rtl:-space-x-0 items-center">
              {/* Contact information (phone and email) */}
              <ContactInfo contact={contact} />

              {/* Currency selector dropdown */}
              <CurrencySelector
                allCurrency={allCurrency}
                defaultCurrency={defaultCurrency}
                handler={handler}
              />

              {/* Language selector dropdown */}
              <LanguageSelector
                languagesApi={languagesApi}
                selectedLang={selectedLang}
                onLanguageChange={handleLanguageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
