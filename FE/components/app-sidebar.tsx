"use client"

import { Package, Bell, BarChart3, LogOut, Warehouse, Users, ShoppingCart, ChefHat, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useI18n } from "@/lib/i18n"
import { useAuth } from "@/lib/auth"
import { LanguageSelector } from "@/components/language-selector"

export function AppSidebar() {
  const pathname = usePathname()
  const { t } = useI18n()
  const { user, logout, isAdmin } = useAuth()

  const menuItems = [
    {
      title: t("nav.stock"),
      url: "/estoque",
      icon: Package,
      description: t("nav.stock"),
    },
    {
      title: t("nav.alerts"),
      url: "/notificacoes",
      icon: Bell,
      description: t("nav.alerts"),
    },
    {
      title: t("nav.dashboard"),
      url: "/dashboard",
      icon: BarChart3,
      description: t("nav.dashboard"),
    },
  ]

  const purchaseItems = [
    {
      title: t("nav.suppliers"),
      url: "/fornecedores",
      icon: Users,
      description: t("nav.suppliers"),
    },
    {
      title: t("nav.purchaseOrders"),
      url: "/pedidos-compra",
      icon: ShoppingCart,
      description: t("nav.purchaseOrders"),
    },
  ]

  const productionItems = [
    {
      title: t("nav.recipes"),
      url: "/receitas",
      icon: ChefHat,
      description: t("nav.recipes"),
    },
    {
      title: t("nav.production"),
      url: "/producao",
      icon: Package,
      description: t("nav.production"),
    },
  ]

  const userItems = [
    {
      title: "Meu Perfil",
      url: "/profile",
      icon: User,
      description: "Meu Perfil",
    },
    ...(isAdmin()
      ? [
          {
            title: "Gerenciar Usuários",
            url: "/users",
            icon: Users,
            description: "Gerenciar Usuários",
          },
        ]
      : []),
  ]

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-4">
          <div className="p-1 bg-primary/10 rounded-lg">
            <Warehouse className="h-6 w-6 text-primary flex-shrink-0" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-bold text-foreground truncate">{t("app.name")}</h1>
            <p className="text-xs text-muted-foreground truncate">{t("app.subtitle")}</p>
          </div>
          <LanguageSelector />
        </div>
      </SidebarHeader>

      <SidebarContent>
        {user && (
          <>
            <SidebarGroup>
              <SidebarGroupLabel>{t("section.stock")}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                        <Link href={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>{t("section.purchases")}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {purchaseItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                        <Link href={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>{t("section.production")}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {productionItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                        <Link href={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Conta</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {userItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                        <Link href={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {user ? (
              <SidebarMenuButton onClick={logout} tooltip="Sair" className="cursor-pointer">
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </SidebarMenuButton>
            ) : (
              <SidebarMenuButton asChild tooltip="Entrar">
                <Link href="/login">
                  <User className="h-4 w-4" />
                  <span>Entrar</span>
                </Link>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
