import { CalendarDaysIcon, ImageIcon, TagIcon } from "lucide-react"
import { useTranslation } from "react-i18next"

import type { BlogMeta } from "@/lib/types"
import { CATEGORIES, getCategoryLabel } from "@/lib/constants"
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

interface MetaFormProps {
  meta: BlogMeta
  onChange: (patch: Partial<BlogMeta>) => void
}

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

function isValidDate(value: string): boolean {
  if (!DATE_PATTERN.test(value)) return false
  const d = new Date(value)
  return !Number.isNaN(d.getTime())
}

function isValidUrl(value: string): boolean {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

export function MetaForm({ meta, onChange }: MetaFormProps) {
  const { t, i18n } = useTranslation()
  const titleEmpty = meta.title.trim() === ""
  const dateInvalid = meta.publishDate.length > 0 && !isValidDate(meta.publishDate)
  const imageInvalid = meta.featuredImage.length > 0 && !isValidUrl(meta.featuredImage)

  return (
    <div className="flex flex-col gap-5">
      <Field>
        <FieldLabel htmlFor="field-title">{t("form.titleLabel")}</FieldLabel>
        <Input
          id="field-title"
          value={meta.title}
          placeholder={t("form.titlePlaceholder")}
          onChange={(e) => onChange({ title: e.target.value })}
          aria-invalid={titleEmpty}
        />
        {titleEmpty ? (
          <p className="text-destructive text-xs">{t("form.titleRequired")}</p>
        ) : null}
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="field-date">
            <CalendarDaysIcon className="size-4 text-muted-foreground" />
            {t("form.publishDateLabel")}
          </FieldLabel>
          <Input
            id="field-date"
            type="date"
            value={meta.publishDate}
            onChange={(e) => onChange({ publishDate: e.target.value })}
            aria-invalid={dateInvalid}
          />
          {dateInvalid ? (
            <p className="text-destructive text-xs">{t("form.dateInvalid")}</p>
          ) : null}
        </Field>

        <Field>
          <FieldLabel htmlFor="field-category">
            <TagIcon className="size-4 text-muted-foreground" />
            {t("form.categoryLabel")}
          </FieldLabel>
          <Select
            value={meta.category}
            onValueChange={(value) => onChange({ category: value })}
          >
            <SelectTrigger id="field-category" className="w-full">
              <SelectValue placeholder={t("form.categoryPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {getCategoryLabel(category.value, i18n.language)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="field-image">
          <ImageIcon className="size-4 text-muted-foreground" />
          {t("form.featuredImageLabel")}
        </FieldLabel>
        <Input
          id="field-image"
          value={meta.featuredImage}
          placeholder={t("form.featuredImagePlaceholder")}
          onChange={(e) => onChange({ featuredImage: e.target.value })}
          aria-invalid={imageInvalid}
        />
        {imageInvalid ? (
          <p className="text-destructive text-xs">
            {t("form.featuredImageInvalid")}
          </p>
        ) : null}
        {meta.featuredImage && !imageInvalid ? (
          <div className="mt-2 overflow-hidden rounded-md border border-border">
            <img
              src={meta.featuredImage}
              alt={t("form.featuredImagePreviewAlt")}
              className="aspect-video w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none"
              }}
            />
          </div>
        ) : null}
      </Field>

      <Field>
        <FieldLabel htmlFor="field-description">
          {t("form.descriptionLabel")}
        </FieldLabel>
        <Textarea
          id="field-description"
          value={meta.description}
          placeholder={t("form.descriptionPlaceholder")}
          rows={3}
          onChange={(e) => onChange({ description: e.target.value })}
        />
        <FieldDescription>{t("form.descriptionHint")}</FieldDescription>
      </Field>

      <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-3">
        <div className="flex flex-col gap-0.5">
          <FieldTitle>{t("form.featuredTitle")}</FieldTitle>
          <FieldDescription className="text-xs">
            {t("form.featuredDescription")}
          </FieldDescription>
        </div>
        <Switch
          checked={meta.featured}
          onCheckedChange={(checked) => onChange({ featured: checked })}
          aria-label={t("form.featuredAria")}
        />
      </div>
    </div>
  )
}
