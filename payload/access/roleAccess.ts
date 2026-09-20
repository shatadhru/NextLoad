import type { Access } from "payload"

/**
 * Access control helper: Grants access to any authenticated user.
 */
export const authenticatedOnly: Access = ({ req }) => {
  return Boolean(req.user)
}

/**
 * Access control helper: Grants access to users having one of the specified roles.
 * @param allowedRoles Array of role names permitted (e.g. ['admin', 'manager'])
 */
export const roleAccess = (allowedRoles: string[]): Access => {
  return ({ req }) => {
    if (!req.user) return false
    const userRole = (req.user as { role?: string })?.role || "user"
    return allowedRoles.includes(userRole)
  }
}

export default roleAccess