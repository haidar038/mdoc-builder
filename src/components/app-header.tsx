import { useRef } from "react"
import {
  RefreshCwIcon,
  Trash2Icon,
  UploadIcon,
  WandSparklesIcon,
  ZapIcon,
} from "lucide-react"
import { useTranslation } from "react-i18next"

import type { GenerateMode } from "@/lib/types"
import { cn } from "@/lib/utils"
import { LanguageSwitcher } from "@/components/i18n/language-switcher"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ModeToggle } from "@/components/theme/mode-toggle"

interface AppHeaderProps {
  mode: GenerateMode
  isStale: boolean
  onModeChange: (mode: GenerateMode) => void
  onGenerate: () => void
  onReset: () => void
  onImport: (file: File) => void
}

export function AppHeader({
  mode,
  isStale,
  onModeChange,
  onGenerate,
  onReset,
  onImport,
}: AppHeaderProps) {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) onImport(file)
    e.target.value = ""
  }

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card/50 px-4 py-3 backdrop-blur">
      <div className="flex items-center gap-2.5">
        {/* <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        </div> */}
        <img src="/img/logo-2.svg" alt={t("app.title")} className="size-9" />
        <div className="flex flex-col leading-tight">
          <h1 className="font-heading text-base font-semibold">
            {t("app.title")}
          </h1>
          <p className="text-xs text-muted-foreground">{t("app.tagline")}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept=".mdoc,.md,text/markdown"
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadIcon />
          {t("header.import")}
        </Button>

        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          spacing={0}
          value={mode}
          onValueChange={(value) => {
            if (value) onModeChange(value as GenerateMode)
          }}
        >
          <ToggleGroupItem value="realtime" aria-label={t("header.modeRealtimeAria")}>
            <ZapIcon />
            <span className="hidden sm:inline">{t("header.modeRealtime")}</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="manual" aria-label={t("header.modeManualAria")}>
            <WandSparklesIcon />
            <span className="hidden sm:inline">{t("header.modeManual")}</span>
          </ToggleGroupItem>
        </ToggleGroup>

        <Button
          type="button"
          size="sm"
          variant={mode === "manual" ? "default" : "outline"}
          disabled={mode === "manual" && !isStale}
          onClick={onGenerate}
          className={cn(mode === "manual" && isStale && "ring-2 ring-primary/30")}
        >
          <RefreshCwIcon className={cn(isStale && "animate-spin-slow")} />
          {t("header.generate")}
        </Button>

        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          aria-label={t("header.resetAria")}
          onClick={onReset}
        >
          <Trash2Icon />
        </Button>

        <LanguageSwitcher />
        <ModeToggle />
      </div>
    </header>
  )
}
