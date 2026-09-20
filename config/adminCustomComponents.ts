/**
 * Configuration for Custom Payload CMS Admin Views & Components.
 * 
 * To add a new custom page/component to the Payload CMS Admin Panel:
 * 1. Add an entry to the `customAdminViews` array below.
 * 2. Specify `id`, `title`, `path`, `icon`, and `componentPath`.
 * 3. Run `pnpm generate:importmap` (or let it auto-generate).
 * 
 * The system will automatically:
 * - Register the view route in Payload CMS (`admin.components.views`).
 * - Add a navigation link with the chosen icon and badge to the Admin Sidebar (`admin.components.afterNavLinks`).
 */

export interface CustomAdminViewConfig {
  /** Unique identifier for the view */
  id: string
  /** Human-readable title displayed in the Admin Sidebar and Page Header */
  title: string
  /** The URL path inside the admin panel (e.g., '/analytics' -> accessible at '/admin/analytics') */
  path: `/${string}`
  /** 
   * Component path relative to baseDir (payload folder).
   * Format: './admin/views/YourComponent#ExportName'
   */
  componentPath: string
  /** 
   * Name of the Lucide icon to display in the Admin Sidebar.
   * Examples: 'BarChart3', 'Mail', 'HardDrive', 'Activity', 'Shield', 'Settings', 'Database', 'Users', 'Sparkles'
   */
  icon?: string
  /** Optional badge text displayed next to the link (e.g., 'Live', 'Pro', 'New') */
  badge?: string
  /** Optional subtitle or description displayed on the page */
  description?: string
  /** Optional group heading in the sidebar (default: 'Custom Tools') */
  group?: string
  /** Exact route matching (default: true) */
  exact?: boolean
}

export const customAdminViews: CustomAdminViewConfig[] = [
 
  {
    id: "notifications",
    title: "Notification Broadcast",
    path: "/notifications",
    componentPath: "./admin/views/NotificationBroadcastView#NotificationBroadcastView",
    icon: "Bell",
    badge: "Broadcast",
    description: "Send alerts, emails, and announcements to specific users, custom groups, or broadcast to everyone.",
    group: "Custom Tools",
    exact: true,
  },
]

/**
 * Generate Payload CMS GlobalConfigs so that each custom component
 * is automatically registered in the Payload Admin Sidebar.
 */
export function generateAdminGlobals() {
  return customAdminViews.map((view) => ({
    slug: view.id,
    label: view.title,
    admin: {
      group: view.group || "Custom Tools",
      components: {
        views: {
          edit: {
            default: {
              Component: view.componentPath,
            },
          },
        },
      },
    },
    fields: [],
  }))
}

/**
 * Map icon names to Lucide kebab-case names for payload-theme
 */
export function generateThemeNavIcons(): Record<string, string> {
  const icons: Record<string, string> = {
    users: "users",
    media: "image",
    "site-settings": "settings",
  }

  customAdminViews.forEach((view) => {
    if (view.icon) {
      const kebab = view.icon
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
        .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
        .toLowerCase()
      icons[view.id] = kebab
    }
  })

  // Ensure explicit overrides for any special Lucide icon names
  icons["notifications"] = "bell"

  return icons
}
