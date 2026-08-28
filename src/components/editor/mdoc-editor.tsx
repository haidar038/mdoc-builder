import { useEffect, useRef } from "react"
import type { Editor } from "@tiptap/react"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import {
  Table,
  TableCell,
  TableHeader,
  TableRow,
} from "@tiptap/extension-table"
import TaskList from "@tiptap/extension-task-list"
import TaskItem from "@tiptap/extension-task-item"
import type { JSONContent } from "@tiptap/react"
import { ImageNode } from "./image-node"
import { EditorToolbar } from "@/components/editor/editor-toolbar"
import { Spinner } from "@/components/ui/spinner"
import type { LoadRequest } from "@/lib/storage"

interface MdocEditorProps {
  initialContent?: JSONContent
  onChange: (doc: JSONContent, html: string) => void
  clearSignal?: number
  loadRequest?: LoadRequest | null
}

function createExtensions() {
  return [
    StarterKit.configure({
      heading: { levels: [1, 2, 3] },
      codeBlock: { HTMLAttributes: { class: "tiptap-codeblock" } },
    }),
    Link.configure({
      openOnClick: false,
      autolink: true,
      HTMLAttributes: { class: "tiptap-link" },
    }),
    Table.configure({ resizable: true }),
    TableRow,
    TableHeader,
    TableCell,
    TaskList,
    TaskItem.configure({ nested: true }),
    ImageNode,
  ]
}

export function MdocEditor({
  initialContent,
  onChange,
  clearSignal = 0,
  loadRequest = null,
}: MdocEditorProps) {
  const lastClear = useRef(clearSignal)
  const lastNonce = useRef<number>(loadRequest?.nonce ?? 0)

  const editor = useEditor({
    extensions: createExtensions(),
    content: initialContent,
    editorProps: {
      attributes: {
        class: "tiptap prose-content",
        spellcheck: "false",
      },
      handlePaste: (view, event) => {
        const text = event.clipboardData?.getData("text/plain")?.trim() ?? ""
        if (/^https?:\/\/\S+\.(png|jpe?g|gif|webp|avif|svg)(\?\S*)?$/i.test(text)) {
          const node = view.state.schema.nodes.image.create({ src: text })
          view.dispatch(view.state.tr.replaceSelectionWith(node))
          return true
        }
        return false
      }
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON(), editor.getHTML())
    },
  })

  useEffect(() => {
    if (!editor) return
    onChange(editor.getJSON(), editor.getHTML())
  }, [editor, onChange])

  useEffect(() => {
    if (!editor) return
    if (lastClear.current === clearSignal) return
    lastClear.current = clearSignal
    editor.commands.clearContent()
    editor.commands.focus("start")
  }, [editor, clearSignal])

  useEffect(() => {
    if (!editor) return
    if (!loadRequest) return
    if (lastNonce.current === loadRequest.nonce) return
    lastNonce.current = loadRequest.nonce
    editor.commands.setContent(loadRequest.html)
  }, [editor, loadRequest])

  return (
    <div className="flex h-full flex-col">
      {editor ? (
        <EditorToolbar editor={editor as Editor} />
      ) : (
        <div className="flex h-11 items-center border-b border-border px-3">
          <Spinner />
        </div>
      )}
      <div className="min-h-0 flex-1 overflow-auto">
        <EditorContent editor={editor} className="mdoc-editor-shell" />
      </div>
    </div>
  )
}
