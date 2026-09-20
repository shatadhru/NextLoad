"use client"

import React from "react"
import { Logo, LogoProps } from "./Logo"

export type BrandLogoProps = LogoProps

/**
 * BrandLogo component (alias to Logo for backward compatibility)
 */
export function BrandLogo(props: BrandLogoProps) {
  return <Logo {...props} />
}

export { Logo }
export default BrandLogo
