import { useState } from "react"
import { marked } from "marked"
import { useTranslation } from "react-i18next"
import { useBlogForm } from "@/hooks/use-blog-form"
import { AppHeader } from "@/components/app-header"
import { MetaForm } from "@/components/form/meta-form"
import { MdocEditor } from "@/components/editor/mdoc-editor"
import { OutputPanel } from "@/components/output/output-panel"
import { ThemeProvider } from "@/components/theme/theme-provider"
import { useIsMobile } from "@/hooks/use-mobile"
import { parseMdoc } from "@/lib/mdoc-parser"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"

marked.setOptions({ gfm: true, breaks: false })

function App() {
  const { t } = useTranslation()
  const form = useBlogForm()
  const isMobile = useIsMobile()
  const [clearSignal, setClearSignal] = useState(0)

  function handleReset() {
    form.reset()
    setClearSignal((value) => value + 1)
  }

  async function handleImport(file: File) {
    try {
      const raw = await file.text()
      const { meta, markdown } = parseMdoc(raw)
      const html = marked.parse(markdown) as string
      form.load(meta, html)
      toast.success(t("import.success"))
    } catch {
      toast.error(t("import.error"))
    }
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex h-screen flex-col">
        <AppHeader
          mode={form.mode}
          isStale={form.isStale}
          onModeChange={form.setMode}
          onGenerate={form.generate}
          onReset={handleReset}
          onImport={handleImport}
        />

        <main className="min-h-0 flex-1">
          <ResizablePanelGroup
            orientation={isMobile ? "vertical" : "horizontal"}
            className="h-full"
          >
            <ResizablePanel defaultSize={55} minSize={30}>
              <ScrollArea className="h-full">
                <div className="mx-auto flex max-w-3xl flex-col gap-4 p-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("app.metadataCard.title")}</CardTitle>
                      <CardDescription>
                        {t("app.metadataCard.description")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <MetaForm meta={form.meta} onChange={form.updateMeta} />
                    </CardContent>
                  </Card>

                  <Card className="overflow-hidden">
                    <CardHeader>
                      <CardTitle>{t("app.contentCard.title")}</CardTitle>
                      <CardDescription>
                        {t("app.contentCard.description")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-0">
                      <div className="h-136 border-t border-border">
                        <MdocEditor
                          initialContent={form.content}
                          onChange={form.setContent}
                          clearSignal={clearSignal}
                          loadRequest={form.loadRequest}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={45} minSize={30}>
              <OutputPanel
                output={form.output}
                markdown={form.markdown}
                html={form.html}
                meta={form.meta}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </main>
      </div>
      <Toaster position="bottom-right" richColors />
    </ThemeProvider>
  )
}

export default App
