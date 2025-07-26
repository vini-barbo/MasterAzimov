"use client"

import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useI18n, type Language } from "@/lib/i18n"

const languages = [
  { code: "pt" as Language, name: "language.portuguese", flag: "🇧🇷" },
  { code: "en" as Language, name: "language.english", flag: "🇺🇸" },
]

export function LanguageSelector() {
  const { language, setLanguage, t } = useI18n()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 px-0">
          <Globe className="h-4 w-4" />
          <span className="sr-only">{t("language.changeLanguage")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`flex items-center gap-3 ${language === lang.code ? "bg-accent" : ""}`}
          >
            <span className="text-lg">{lang.flag}</span>
            <span className="flex-1">{t(lang.name)}</span>
            {language === lang.code && <span className="text-primary font-bold">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
