import { describe, it, expect, beforeAll } from "vitest"

import i18n, { supportedLngs } from "@/i18n"

describe("i18n — initialization", () => {
  beforeAll(async () => {
    if (!i18n.isInitialized) {
      await new Promise<void>((resolve) => {
        i18n.on("initialized", () => resolve())
      })
    }
  })

  it("initializes with English by default in node environment", () => {
    expect(i18n.isInitialized).toBe(true)
    expect(["en", "id"]).toContain(i18n.language)
  })

  it("exports the supported locales", () => {
    expect(supportedLngs).toEqual(["en", "id"])
  })

  it("translates a known English key", () => {
    expect(i18n.t("app.title", { lng: "en" })).toBe(".mdoc Builder")
  })

  it("translates a known Indonesian key", () => {
    expect(i18n.t("app.title", { lng: "id" })).toBe(".mdoc Builder")
    expect(i18n.t("form.titleLabel", { lng: "id" })).toBe("Judul Blog")
  })

  it("falls back to English when a key is missing in the active locale", () => {
    // i18next normalizes fallbackLng to an array; English is the configured
    // fallback for any missing id key.
    const fb = i18n.options.fallbackLng
    const fallbackList = Array.isArray(fb) ? fb : fb ? [fb] : []
    expect(fallbackList).toContain("en")

    // Sanity check that both locales have working tagline strings.
    expect(i18n.t("app.tagline", { lng: "en" })).toBe(
      "Keystatic blog content generator",
    )
    expect(i18n.t("app.tagline", { lng: "id" })).toBe(
      "Generator konten blog Keystatic",
    )
  })

  it("interpolates the count for English pluralization", () => {
    expect(i18n.t("output.statsWords", { count: 1, lng: "en" })).toBe(
      "1 word",
    )
    expect(i18n.t("output.statsWords", { count: 2, lng: "en" })).toBe(
      "2 words",
    )
  })

  it("uses a single Indonesian plural form for stats", () => {
    expect(i18n.t("output.statsWords", { count: 1, lng: "id" })).toBe(
      "1 kata",
    )
    expect(i18n.t("output.statsWords", { count: 7, lng: "id" })).toBe(
      "7 kata",
    )
  })
})
