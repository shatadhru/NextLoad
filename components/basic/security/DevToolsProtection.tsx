'use client'

import { useEffect, useRef } from 'react'
import { authClient } from '@/payload/auth/client'
import { toast } from 'sonner'
import { useSiteSettings } from '@/components/basic/context/SiteSettingsContext'

export interface SecuritySettings {
  disableDevTools?: boolean
  disableRightClick?: boolean
  disableTextSelection?: boolean
  exemptAdmins?: boolean
  showProtectionNotice?: boolean
}

export function DevToolsProtection() {
  const { settings } = useSiteSettings()
  const security = settings?.security as SecuritySettings | undefined
  const { data: session } = authClient.useSession()
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === 'admin'
  const lastToastTime = useRef<number>(0)

  useEffect(() => {
    if (!security) return

    // If exemptAdmins is enabled and user is an authenticated admin, bypass all restrictions
    if (security.exemptAdmins !== false && isAdmin) {
      return
    }

    const showNotice = (msg: string) => {
      if (!security.showProtectionNotice) return
      const now = Date.now()
      // Rate-limit toast to once every 2.5 seconds to prevent spam
      if (now - lastToastTime.current > 2500) {
        lastToastTime.current = now
        toast.info(msg, { duration: 2000 })
      }
    }

    // 1. Text Selection Protection
    if (security.disableTextSelection) {
      document.documentElement.classList.add('select-none')
    } else {
      document.documentElement.classList.remove('select-none')
    }

    // 2. Right-Click Prevention (contextmenu)
    const handleContextMenu = (e: MouseEvent) => {
      if (!security.disableRightClick) return

      // Preserve native context menu inside editable form elements so copy/paste works
      const target = e.target as HTMLElement | null
      if (target) {
        const tagName = target.tagName?.toLowerCase()
        if (tagName === 'input' || tagName === 'textarea' || target.isContentEditable) {
          return
        }
      }

      e.preventDefault()
      showNotice('Right-click is disabled on this site.')
    }

    // 3. DevTools Keyboard Shortcuts Prevention
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!security.disableDevTools) return

      const isCtrlOrCmd = e.ctrlKey || e.metaKey

      // F12 key
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault()
        showNotice('Developer tools are disabled.')
        return
      }

      // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Cmd+Option+I (Inspect & Console)
      if (isCtrlOrCmd && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)) {
        e.preventDefault()
        showNotice('Developer tools are disabled.')
        return
      }

      // Ctrl+U / Cmd+U (View Page Source)
      if (isCtrlOrCmd && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault()
        showNotice('View source is disabled.')
        return
      }

      // Ctrl+S / Cmd+S (Save Page)
      if (isCtrlOrCmd && (e.key === 's' || e.key === 'S')) {
        e.preventDefault()
        showNotice('Saving page is disabled.')
        return
      }
    }

    if (security.disableRightClick) {
      window.addEventListener('contextmenu', handleContextMenu, { capture: true })
    }

    if (security.disableDevTools) {
      window.addEventListener('keydown', handleKeyDown, { capture: true })
    }

    return () => {
      document.documentElement.classList.remove('select-none')
      window.removeEventListener('contextmenu', handleContextMenu, { capture: true })
      window.removeEventListener('keydown', handleKeyDown, { capture: true })
    }
  }, [security, isAdmin])

  return null
}

export default DevToolsProtection
