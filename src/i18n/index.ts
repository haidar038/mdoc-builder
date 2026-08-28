import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import en from "./locales/en.json"
import id from "./locales/id.json"

export const supportedLngs = ["en", "id"] as const
export type SupportedLng = (typeof supportedLngs)[number]

export const LOCALE_STORAGE_KEY = "mdoc-builder:locale:v1"
export const DEFAULT_LNG: SupportedLng = "en"

function detectInitialLng(): SupportedLng {
  if (typeof window === "undefined") return DEFAULT_LNG

  try {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY)
    if (stored === "en" || stored === "id") return stored
  } catch {
    /* localStorage unavailable */
  }

  const nav = window.navigator?.language?.toLowerCase() ?? ""
  if (nav.startsWith("id")) return "id"
  return DEFAULT_LNG
}

const initialLng = detectInitialLng()

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    id: { translation: id },
  },
  lng: initialLng,
  fallbackLng: DEFAULT_LNG,
  supportedLngs: [...supportedLngs],
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
  returnNull: false,
})

if (typeof document !== "undefined") {
  document.documentElement.lang = i18n.language
}

i18n.on("languageChanged", (lng) => {
  if (typeof document !== "undefined") {
    document.documentElement.lang = lng
  }
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, lng)
    } catch {
      /* ignore quota / privacy errors */
    }
  }
})

export default i18n
