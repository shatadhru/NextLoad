"use client";

import React, { ReactNode } from "react";
import { Toaster } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { EcommerceProvider } from "@payloadcms/plugin-ecommerce/client/react";
import { CurrencyNextLoad } from "@/config/Currency";

import { CartProvider } from "@/components/basic/cart";
import { ThemeInjector } from "@/components/basic/theme/ThemeInjector";
import { DevToolsProtection } from "@/components/basic/security/DevToolsProtection";
import { SiteSettingsProvider } from "@/components/basic/context/SiteSettingsContext";

function Providor({ children }: { children: ReactNode }) {
  return (
    <EcommerceProvider
      enableVariants={false}
      customersSlug="users"
      syncLocalStorage={{
        key: "nextload_cart",
      }}
      currenciesConfig={{
        supportedCurrencies: [...CurrencyNextLoad],
        defaultCurrency: CurrencyNextLoad[0].code,
      }}
      api={{
        apiRoute: "/api",
        cartsFetchQuery: {
          depth: 2,
        },
      }}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <SiteSettingsProvider>
          <ThemeInjector />
          <DevToolsProtection />
          <Toaster />
          <TooltipProvider>
            <CartProvider>{children}</CartProvider>
          </TooltipProvider>
        </SiteSettingsProvider>
      </ThemeProvider>
    </EcommerceProvider>
  );
}

export default Providor;
