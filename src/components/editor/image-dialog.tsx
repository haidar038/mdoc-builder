import { useState } from "react"
import type { Editor } from "@tiptap/react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface ImageDialogProps {
  editor: Editor
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ImageDialog({ editor, open, onOpenChange }: ImageDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <ImageDialogForm
          editor={editor}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

interface ImageDialogFormProps {
  editor: Editor
  onClose: () => void
}

function ImageDialogForm({ editor, onClose }: ImageDialogFormProps) {
  const { t } = useTranslation()
  const [src, setSrc] = useState("")
  const [alt, setAlt] = useState("")

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const trimmedSrc = src.trim()
    if (!trimmedSrc) return
    editor.chain().focus().setImage({ src: trimmedSrc, alt: alt.trim() }).run()
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <DialogHeader>
        <DialogTitle>{t("editor.imageDialog.title")}</DialogTitle>
        <DialogDescription>
          {t("editor.imageDialog.description")}
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-4">
        <Field>
          <FieldLabel htmlFor="image-src">
            {t("editor.imageDialog.srcLabel")}
          </FieldLabel>
          <Input
            id="image-src"
            type="url"
            inputMode="url"
            autoComplete="off"
            value={src}
            placeholder={t("editor.imageDialog.srcPlaceholder")}
            onChange={(e) => setSrc(e.target.value)}
            autoFocus
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="image-alt">
            {t("editor.imageDialog.altLabel")}
          </FieldLabel>
          <Input
            id="image-alt"
            value={alt}
            placeholder={t("editor.imageDialog.altPlaceholder")}
            onChange={(e) => setAlt(e.target.value)}
          />
        </Field>
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">
            {t("editor.imageDialog.cancel")}
          </Button>
        </DialogClose>
        <Button type="submit" disabled={!src.trim()}>
          {t("editor.imageDialog.insert")}
        </Button>
      </DialogFooter>
    </form>
  )
}
