import type { Access } from "payload"

/**
 * Access control helper: Grants access only to users with the 'admin' role.
 */
export const adminOnly: Access = ({ req }) => {
  if (!req.user) return false
  return (req.user as { role?: string })?.role === "admin"
}

export default adminOnly