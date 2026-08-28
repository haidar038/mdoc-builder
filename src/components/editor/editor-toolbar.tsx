import { useState } from "react"
import type { Editor } from "@tiptap/react"
import {
  BoldIcon,
  CheckSquareIcon,
  CodeIcon,
  CodeXmlIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ImageIcon,
  ItalicIcon,
  Link2Icon,
  ListIcon,
  ListOrderedIcon,
  MinusIcon,
  QuoteIcon,
  Redo2Icon,
  StrikethroughIcon,
  TableIcon,
  Undo2Icon,
} from "lucide-react"
import { useTranslation } from "react-i18next"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ImageDialog } from "@/components/editor/image-dialog"

interface ToolbarButtonProps {
  editor: Editor
  active?: boolean
  disabled?: boolean
  onClick: () => void
  label: string
  children: React.ReactNode
}

function ToolbarButton({
  editor,
  active,
  disabled,
  onClick,
  label,
  children,
}: ToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          disabled={disabled || !editor.isEditable}
          aria-pressed={active}
          aria-label={label}
          onClick={onClick}
          className={cn(active && "bg-muted text-foreground")}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

function promptLink(editor: Editor, t: (key: string) => string) {
  if (editor.isActive("link")) {
    editor.chain().focus().unsetLink().run()
    return
  }

  const previous = editor.getAttributes("link").href as string | undefined
  const url = window.prompt(
    t("editor.toolbar.linkPrompt"),
    previous ?? t("editor.toolbar.linkPromptDefault"),
  )
  if (url === null) return
  if (url === "") {
    editor.chain().focus().extendMarkRange("link").unsetLink().run()
    return
  }
  editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
}

interface EditorToolbarProps {
  editor: Editor
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const { t } = useTranslation()
  const [imageOpen, setImageOpen] = useState(false)

  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border p-1.5">
        <ToolbarButton
          editor={editor}
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          label={t("editor.toolbar.bold")}
        >
          <BoldIcon />
        </ToolbarButton>
        <ToolbarButton
          editor={editor}
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          label={t("editor.toolbar.italic")}
        >
          <ItalicIcon />
        </ToolbarButton>
        <ToolbarButton
          editor={editor}
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          label={t("editor.toolbar.strike")}
        >
          <StrikethroughIcon />
        </ToolbarButton>
        <ToolbarButton
          editor={editor}
          active={editor.isActive("link")}
          onClick={() => promptLink(editor, t)}
          label={t("editor.toolbar.link")}
        >
          <Link2Icon />
        </ToolbarButton>

        <Separator orientation="vertical" className="mx-1 h-5" />

        <ToolbarButton
          editor={editor}
          active={editor.isActive("heading", { level: 1 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          label={t("editor.toolbar.h1")}
        >
          <Heading1Icon />
        </ToolbarButton>
        <ToolbarButton
          editor={editor}
          active={editor.isActive("heading", { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          label={t("editor.toolbar.h2")}
        >
          <Heading2Icon />
        </ToolbarButton>
        <ToolbarButton
          editor={editor}
          active={editor.isActive("heading", { level: 3 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          label={t("editor.toolbar.h3")}
        >
          <Heading3Icon />
        </ToolbarButton>

        <Separator orientation="vertical" className="mx-1 h-5" />

        <ToolbarButton
          editor={editor}
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          label={t("editor.toolbar.bulletList")}
        >
          <ListIcon />
        </ToolbarButton>
        <ToolbarButton
          editor={editor}
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          label={t("editor.toolbar.orderedList")}
        >
          <ListOrderedIcon />
        </ToolbarButton>
        <ToolbarButton
          editor={editor}
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          label={t("editor.toolbar.blockquote")}
        >
          <QuoteIcon />
        </ToolbarButton>
        <ToolbarButton
          editor={editor}
          active={editor.isActive("code")}
          onClick={() => editor.chain().focus().toggleCode().run()}
          label={t("editor.toolbar.inlineCode")}
        >
          <CodeIcon />
        </ToolbarButton>
        <ToolbarButton
          editor={editor}
          active={editor.isActive("codeBlock")}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          label={t("editor.toolbar.codeBlock")}
        >
          <CodeXmlIcon />
        </ToolbarButton>
        <ToolbarButton
          editor={editor}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          label={t("editor.toolbar.horizontalRule")}
        >
          <MinusIcon />
        </ToolbarButton>

        <ToolbarButton
          editor={editor}
          onClick={() => setImageOpen(true)}
          label={t("editor.toolbar.image")}
        >
          <ImageIcon />
        </ToolbarButton>

        <Separator orientation="vertical" className="mx-1 h-5" />

        <ToolbarButton
          editor={editor}
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
          label={t("editor.toolbar.table")}
        >
          <TableIcon />
        </ToolbarButton>
        <ToolbarButton
          editor={editor}
          active={editor.isActive("taskList")}
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          label={t("editor.toolbar.taskList")}
        >
          <CheckSquareIcon />
        </ToolbarButton>

        <Separator orientation="vertical" className="mx-1 h-5" />

        <ToolbarButton
          editor={editor}
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
          label={t("editor.toolbar.undo")}
        >
          <Undo2Icon />
        </ToolbarButton>
        <ToolbarButton
          editor={editor}
          disabled={!editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
          label={t("editor.toolbar.redo")}
        >
          <Redo2Icon />
        </ToolbarButton>
      </div>
      <ImageDialog
        editor={editor}
        open={imageOpen}
        onOpenChange={setImageOpen}
      />
    </TooltipProvider>
  )
}
