import { CheckIcon, LanguagesIcon } from "lucide-react"
import { useTranslation } from "react-i18next"

import type { SupportedLng } from "@/i18n"
import { supportedLngs } from "@/i18n"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const LANG_LABELS: Record<SupportedLng, string> = {
  en: "English",
  id: "Bahasa Indonesia",
}

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation()
  const current = (i18n.language as SupportedLng) ?? "en"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t("header.switcherAria")}
        >
          <LanguagesIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        {supportedLngs.map((lng) => {
          const isActive = current === lng
          return (
            <DropdownMenuItem
              key={lng}
              onClick={() => {
                void i18n.changeLanguage(lng)
              }}
              aria-label={LANG_LABELS[lng]}
            >
              <span className="flex-1">{LANG_LABELS[lng]}</span>
              {isActive ? <CheckIcon className="size-4" /> : null}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
