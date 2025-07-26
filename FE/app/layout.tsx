import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Toaster } from "@/components/ui/toaster"
import { I18nProvider } from "@/lib/i18n"
import { AuthProvider } from "@/lib/auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sistema de Gerenciamento de Estoque",
  description: "Controle seu estoque em tempo real com alertas inteligentes",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <I18nProvider>
          <AuthProvider>
            <SidebarProvider>
              <AppSidebar />
              <main className="flex-1 overflow-auto">{children}</main>
              <Toaster />
            </SidebarProvider>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  )
}
