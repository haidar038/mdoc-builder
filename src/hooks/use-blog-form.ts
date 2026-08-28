import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { JSONContent } from "@tiptap/react"

import type { BlogMeta, GenerateMode } from "@/lib/types"
import { DEFAULT_META } from "@/lib/constants"
import { clearDraft, loadDraft, saveDraft } from "@/lib/storage"
import type { Draft, LoadRequest } from "@/lib/storage"
import { buildMdoc } from "@/lib/frontmatter"
import { serializeToMarkdown } from "@/lib/markdown"

const EMPTY_DOC: JSONContent = { type: "doc", content: [{ type: "paragraph" }] }
const AUTOSAVE_DEBOUNCE_MS = 400

function initialDraft(): Draft {
  const stored = loadDraft()
  if (!stored) return { meta: DEFAULT_META, content: EMPTY_DOC }
  return {
    meta: { ...DEFAULT_META, ...stored.meta },
    content: stored.content,
  }
}

export interface UseBlogForm {
  meta: BlogMeta
  content: JSONContent
  html: string
  mode: GenerateMode
  markdown: string
  output: string
  isStale: boolean
  loadRequest: LoadRequest | null
  updateMeta: (patch: Partial<BlogMeta>) => void
  setContent: (doc: JSONContent, html: string) => void
  setMode: (mode: GenerateMode) => void
  generate: () => void
  reset: () => void
  load: (meta: BlogMeta, html: string) => void
}

export function useBlogForm(): UseBlogForm {
  const [draft, setDraft] = useState<Draft>(initialDraft)
  const [html, setHtml] = useState<string>("")
  const [mode, setMode] = useState<GenerateMode>("realtime")
  const [snapshot, setSnapshot] = useState<string>(() => buildMdoc(DEFAULT_META, ""))
  const [loadRequest, setLoadRequest] = useState<LoadRequest | null>(null)
  const loadNonce = useRef(0)

  const { meta, content } = draft

  const markdown = useMemo(() => serializeToMarkdown(content), [content])
  const live = useMemo(() => buildMdoc(meta, markdown), [meta, markdown])

  const output = mode === "realtime" ? live : snapshot
  const isStale = mode === "manual" && live !== snapshot

  useEffect(() => {
    const timer = setTimeout(() => {
      saveDraft({ meta, content })
    }, AUTOSAVE_DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [meta, content])

  const updateMeta = useCallback((patch: Partial<BlogMeta>) => {
    setDraft((prev) => ({ ...prev, meta: { ...prev.meta, ...patch } }))
  }, [])

  const handleContentChange = useCallback((doc: JSONContent, nextHtml: string) => {
    setDraft((prev) => ({ ...prev, content: doc }))
    setHtml(nextHtml)
  }, [])

  const generate = useCallback(() => {
    setSnapshot(live)
  }, [live])

  const reset = useCallback(() => {
    clearDraft()
    setDraft({ meta: DEFAULT_META, content: EMPTY_DOC })
    setHtml("")
  }, [])

  const load = useCallback((nextMeta: BlogMeta, nextHtml: string) => {
    loadNonce.current += 1
    setDraft((prev) => ({ ...prev, meta: { ...DEFAULT_META, ...nextMeta } }))
    setHtml(nextHtml)
    setLoadRequest({ html: nextHtml, nonce: loadNonce.current })
  }, [])

  return {
    meta,
    content,
    html,
    mode,
    markdown,
    output,
    isStale,
    loadRequest,
    updateMeta,
    setContent: handleContentChange,
    setMode,
    generate,
    reset,
    load,
  }
}
