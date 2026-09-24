"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  ChevronsUpDownIcon,
  CheckIcon,
  PlusIcon,
  MoreHorizontalIcon,
  UserIcon,
  CreditCardIcon,
  BellIcon,
  LogOutIcon,
  DatabaseIcon,
  ExternalLinkIcon,
  ShieldCheckIcon,
} from "lucide-react"

import { sidebarConfig, type Workspace } from "@/config/sidebar"
import { authClient } from "@/payload/auth/client"
import { Logo } from "@/components/ui/Logo"
import { SiteConfig } from "@/config/site"

function BrandMark({ className, isCollapsed }: { className?: string; isCollapsed?: boolean }) {
  return (
    <div className={cn("flex items-center px-2 py-1", isCollapsed && "justify-center px-0", className)}>
      <Logo href="/dashboard" variant={isCollapsed ? "icon" : "full"} size="md" />
    </div>
  )
}

function WorkspaceSwitcher({
  workspace,
  onSelect,
  isCollapsed,
}: {
  workspace: Workspace
  onSelect: (workspace: Workspace) => void
  isCollapsed: boolean
}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className={cn(
                  "aria-expanded:bg-sidebar-accent aria-expanded:text-sidebar-accent-foreground",
                  isCollapsed && "justify-center p-0 size-9"
                )}
              />
            }
          >
            <BrandMark />
            {!isCollapsed && (
              <>
                <span className="grid min-w-0 flex-1 text-left leading-tight">
                  <span className="truncate text-sm font-semibold">
                    {workspace.name}
                  </span>
                  <span className="text-sidebar-foreground/70 truncate text-xs">
                    {workspace.plan} plan
                  </span>
                </span>
                <ChevronsUpDownIcon className="ml-auto opacity-60 size-4 shrink-0" aria-hidden="true" />
              </>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent side={isCollapsed ? "right" : "bottom"} align="start">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
              {sidebarConfig.workspaces.map((item) => (
                <DropdownMenuItem key={item.id} onClick={() => onSelect(item)}>
                  <Avatar size="sm">
                    <AvatarImage src={item.avatar} alt="" />
                    <AvatarFallback>{item.initials}</AvatarFallback>
                  </Avatar>
                  <span className="truncate">{item.name}</span>
                  {item.id === workspace.id ? (
                    <CheckIcon className="ml-auto size-3.5" aria-hidden="true" />
                  ) : null}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <PlusIcon aria-hidden="true" />
                New workspace
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

function UserNav({
  isCollapsed,
  unreadCount = 0,
}: {
  isCollapsed: boolean
  unreadCount?: number
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      {!isCollapsed && <SidebarGroupLabel>Menu</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu className={cn(isCollapsed && "items-center gap-1.5")}>
          {sidebarConfig.userNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            const isNotifications = item.id === "notifications"
            const itemBadge = isNotifications
              ? unreadCount > 0
                ? unreadCount > 99
                  ? "99+"
                  : unreadCount
                : null
              : item.badge

            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  render={<Link href={item.href} />}
                  isActive={isActive}
                  tooltip={item.label}
                  className={cn(isCollapsed && "justify-center px-0 size-9 relative")}
                >
                  <Icon className="size-4 shrink-0" aria-hidden="true" />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                  {!isCollapsed && itemBadge ? (
                    <SidebarMenuBadge
                      className={cn(
                        isNotifications &&
                          "bg-rose-500/15 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 font-semibold"
                      )}
                    >
                      {itemBadge}
                    </SidebarMenuBadge>
                  ) : null}

                  {/* Subtle notification dot when sidebar is in collapsed icon mode */}
                  {isCollapsed && isNotifications && unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex size-2 rounded-full bg-rose-500 animate-in zoom-in" />
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

function AdminNav({ isCollapsed }: { isCollapsed: boolean }) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      {!isCollapsed ? (
        <SidebarGroupLabel className="text-teal-600 font-semibold flex items-center gap-1.5">
          <ShieldCheckIcon className="size-3.5" />
          <span>Admin Portal</span>
        </SidebarGroupLabel>
      ) : (
        <SidebarSeparator className="my-1 mx-0" />
      )}
      <SidebarGroupContent>
        <SidebarMenu className={cn(isCollapsed && "items-center gap-1.5")}>
          {sidebarConfig.adminNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  render={<Link href={item.href} />}
                  isActive={isActive}
                  tooltip={item.label}
                  className={cn(isCollapsed && "justify-center px-0 size-9")}
                >
                  <Icon className="size-4 shrink-0" aria-hidden="true" />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                  {!isCollapsed && item.badge ? (
                    <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                  ) : null}
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

function QuickLinksNav({ isAdmin, isCollapsed }: { isAdmin: boolean; isCollapsed: boolean }) {
  const links = sidebarConfig.quickLinks.filter((item) => !item.adminOnly || isAdmin)

  return (
    <SidebarGroup>
      {!isCollapsed ? (
        <>
          <SidebarGroupLabel>Quick Links</SidebarGroupLabel>
          <SidebarGroupAction type="button" aria-label="Add project">
            <PlusIcon aria-hidden="true" />
            <span className="sr-only">Add link</span>
          </SidebarGroupAction>
        </>
      ) : (
        <SidebarSeparator className="my-1 mx-0" />
      )}
      <SidebarGroupContent>
        <SidebarMenu className={cn(isCollapsed && "items-center gap-1.5")}>
          {links.map((project) => {
            const Icon = project.icon || DatabaseIcon
            return (
              <SidebarMenuItem key={project.id}>
                <SidebarMenuButton
                  render={<Link href={project.href} />}
                  tooltip={project.name}
                  className={cn(isCollapsed && "justify-center px-0 size-9")}
                >
                  <Icon className="size-4 shrink-0" aria-hidden="true" />
                  {!isCollapsed && <span className="truncate">{project.name}</span>}
                </SidebarMenuButton>
                {!isCollapsed && (
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <SidebarMenuAction
                          showOnHover
                          aria-label={`Actions for ${project.name}`}
                        />
                      }
                    >
                      <MoreHorizontalIcon aria-hidden="true" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="start">
                      <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => window.open(project.href, "_blank")}>
                          <ExternalLinkIcon aria-hidden="true" />
                          Open in new tab
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

function AccountMenu({ isAdmin, isCollapsed }: { isAdmin: boolean; isCollapsed: boolean }) {
  const { data: session } = authClient.useSession()
  const router = useRouter()

  const userName = session?.user?.name || `${SiteConfig.site.name} User`
  const userEmail = session?.user?.email || "user@nextload.dev"
  const userImage = session?.user?.image || "https://github.com/shadcn.png"
  const userInitials =
    userName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "NL"

  const handleSignOut = async () => {
    await authClient.signOut()
    router.push("/auth/login")
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className={cn(
                  "aria-expanded:bg-sidebar-accent aria-expanded:text-sidebar-accent-foreground",
                  isCollapsed && "justify-center p-0 size-9"
                )}
              />
            }
          >
            <Avatar className="size-8">
              <AvatarImage src={userImage} alt={userName} />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <>
                <span className="grid min-w-0 flex-1 text-left leading-tight">
                  <span className="truncate text-sm font-medium flex items-center gap-1.5">
                    {userName}
                    {isAdmin ? (
                      <span className="rounded bg-teal-500/10 px-1 py-0.2 text-[10px] font-semibold text-teal-600">
                        Admin
                      </span>
                    ) : null}
                  </span>
                  <span className="text-sidebar-foreground/70 truncate text-xs">
                    {userEmail}
                  </span>
                </span>
                <MoreHorizontalIcon className="ml-auto opacity-60 size-4 shrink-0" aria-hidden="true" />
              </>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent side={isCollapsed ? "right" : "top"} align={isCollapsed ? "end" : "start"}>
            <DropdownMenuGroup>
              <DropdownMenuLabel>{userName}</DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
                <UserIcon aria-hidden="true" />
                Profile & Settings
              </DropdownMenuItem>
              {isAdmin ? (
                <DropdownMenuItem onClick={() => router.push("/admin")}>
                  <CreditCardIcon aria-hidden="true" />
                  Payload CMS Studio
                </DropdownMenuItem>
              ) : null}
              <DropdownMenuItem onClick={() => router.push("/dashboard/notifications")}>
                <BellIcon aria-hidden="true" />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOutIcon aria-hidden="true" />
                Log out
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export function AppSidebar({
  selectedWorkspace,
  onSelectWorkspace,
  unreadCount = 0,
}: {
  selectedWorkspace?: Workspace
  onSelectWorkspace?: (workspace: Workspace) => void
  unreadCount?: number
}) {
  const [workspace, setWorkspace] = useState<Workspace>(
    selectedWorkspace || sidebarConfig.workspaces[0]
  )
  const { data: session } = authClient.useSession()
  const { state, isMobile } = useSidebar()
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === "admin"
  const isCollapsed = state === "collapsed" && !isMobile

  const handleSelect = (ws: Workspace) => {
    setWorkspace(ws)
    onSelectWorkspace?.(ws)
  }

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <BrandMark isCollapsed={isCollapsed} />
      </SidebarHeader>

      <SidebarContent role="navigation" aria-label="Main Navigation">
        <UserNav isCollapsed={isCollapsed} unreadCount={unreadCount} />
        {isAdmin ? <AdminNav isCollapsed={isCollapsed} /> : null}
        <QuickLinksNav isAdmin={isAdmin} isCollapsed={isCollapsed} />
      </SidebarContent>

      <SidebarFooter>
        <SidebarSeparator className="mx-0" />
        <AccountMenu isAdmin={isAdmin} isCollapsed={isCollapsed} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

export default AppSidebar
