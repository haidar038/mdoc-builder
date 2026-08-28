import { useMemo, useState } from "react"
import {
  CheckIcon,
  CopyIcon,
  DownloadIcon,
  EyeIcon,
  FileTextIcon,
} from "lucide-react"
import { useTranslation } from "react-i18next"

import type { BlogMeta } from "@/lib/types"
import { buildFileName, getContentStats } from "@/lib/frontmatter"
import { getCategoryLabel } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

interface OutputPanelProps {
  output: string
  markdown: string
  html: string
  meta: BlogMeta
}

export function OutputPanel({ output, markdown, html, meta }: OutputPanelProps) {
  const { t, i18n } = useTranslation()
  const [copied, setCopied] = useState(false)
  const stats = useMemo(() => getContentStats(markdown), [markdown])
  const fileName = useMemo(() => buildFileName(meta), [meta])
  const titleEmpty = !meta.title.trim()

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      toast.success(t("output.copySuccess"))
      setTimeout(() => setCopied(false), 1800)
    } catch {
      toast.error(t("output.copyError"))
    }
  }

  function handleDownload() {
    if (titleEmpty) {
      toast.error(t("output.downloadTitleEmpty"))
      return
    }
    const blob = new Blob([output], { type: "text/markdown;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = fileName
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)
    toast.success(t("output.downloadSuccess", { fileName }))
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 border-b border-border p-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate font-mono text-xs text-muted-foreground">
            {fileName}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopy}
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
            {copied ? t("output.copyButtonCopied") : t("output.copyButton")}
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleDownload}
            disabled={titleEmpty}
            aria-label={t("output.downloadTitleEmpty")}
          >
            <DownloadIcon />
            {t("output.downloadButton")}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="source" className="flex min-h-0 flex-1 flex-col gap-0">
        <div className="flex items-center justify-between gap-2 px-3 pt-3">
          <TabsList>
            <TabsTrigger value="source">
              <FileTextIcon />
              {t("output.tabSource")}
            </TabsTrigger>
            <TabsTrigger value="preview">
              <EyeIcon />
              {t("output.tabPreview")}
            </TabsTrigger>
          </TabsList>
          <Badge variant="secondary">
            {getCategoryLabel(meta.category, i18n.language)}
          </Badge>
        </div>

        <TabsContent
          value="source"
          className="min-h-0 flex-1 overflow-hidden"
        >
          <ScrollArea className="h-full">
            <pre
              className={cn(
                "m-0 whitespace-pre-wrap wrap-break-words p-4 font-mono text-xs leading-relaxed text-foreground/90"
              )}
            >
              {output || t("output.emptyState")}
            </pre>
          </ScrollArea>
        </TabsContent>

        <TabsContent
          value="preview"
          className="min-h-0 flex-1 overflow-hidden"
        >
          <ScrollArea className="h-full">
            {html ? (
              <div
                className="prose-content p-4"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            ) : (
              <p className="p-4 text-sm text-muted-foreground">
                {t("output.emptyPreview")}
              </p>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-between gap-3 border-t border-border px-3 py-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <span>{t("output.statsWords", { count: stats.words })}</span>
          <span>
            {t("output.statsCharacters", { count: stats.characters })}
          </span>
          <span>
            {t("output.statsReadingTime", { count: stats.readingTime })}
          </span>
        </div>
        <span className="font-mono">{t("output.extBadge")}</span>
      </div>
    </div>
  )
}
