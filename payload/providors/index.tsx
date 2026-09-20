'use client'

import React, { ReactNode } from 'react'
import { Toaster } from "@/components/ui/toast"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "next-themes"

function Providor({children}:{children : ReactNode}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <Toaster />
      <TooltipProvider>{children}</TooltipProvider>
    </ThemeProvider>
  )
}

export default Providor
