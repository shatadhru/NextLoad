"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SiteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { CldImage } from "next-cloudinary";
import {
  isCloudinarySrc,
  extractCloudinarySecureUrl,
} from "@/components/ui/SafeCldImage";
import { Skeleton } from "@/components/ui/skeleton";

export interface LogoProps {
  /** Visual variant */
  variant?: "full" | "icon";
  /** Preset size */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Explicit theme override or auto (follows dark/light mode) */
  theme?: "auto" | "light" | "dark";
  /** Optional destination link (wraps logo in Next.js Link) */
  href?: string;
  /** Additional CSS class for the root container */
  className?: string;
  /** Additional CSS class for the badge or image */
  badgeClassName?: string;
  /** Custom site name override for accessibility aria-label */
  siteName?: string;
  /** Custom logo badge text override (e.g. 'NL') */
  logoText?: string;
}

let cachedSettings: {
  siteName: string;
  logoText: string;
  logoUrl: string | null;
  logoDarkUrl: string | null;
} | null = null;

export function Logo({
  variant = "full",
  size = "md",
  theme = "auto",
  href,
  className,
  badgeClassName,
  siteName: customSiteName,
  logoText: customLogoText,
}: LogoProps) {
  const [settings, setSettings] = useState(
    cachedSettings || {
      siteName: customSiteName || SiteConfig.site.name,
      logoText: customLogoText || SiteConfig.site.logoText,
      logoUrl: null,
      logoDarkUrl: null,
    },
  );
  const [isLoading, setIsLoading] = useState(!cachedSettings);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!cachedSettings) {
      fetch("/api/site-settings")
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            const light =
              extractCloudinarySecureUrl(data.logo) ||
              extractCloudinarySecureUrl(data.logoUrl);
            const dark =
              extractCloudinarySecureUrl(data.logoDark) ||
              extractCloudinarySecureUrl(data.logoDarkUrl);

            const newSettings = {
              siteName: data.siteName || SiteConfig.site.name,
              logoText: data.logoText || SiteConfig.site.logoText,
              logoUrl: light || null,
              logoDarkUrl: dark || null,
            };
            cachedSettings = newSettings;
            setSettings(newSettings);
          }
        })
        .catch((err) =>
          console.warn("Failed to fetch site settings for Logo:", err),
        )
        .finally(() => setIsLoading(false));
    }
  }, []);

  const siteName = customSiteName || settings.siteName || SiteConfig.site.name;
  const logoText =
    customLogoText || settings.logoText || SiteConfig.site.logoText;
  const hasUploadedLogo = Boolean(settings.logoUrl || settings.logoDarkUrl);

  // Dimensions per size
  const sizeMap = {
    xs: {
      skeleton: "h-6 w-16 rounded-md",
      iconSkeleton: "size-6 rounded-md",
      shimmer: "h-6 w-16 rounded-md",
      badge: "size-6 text-[10px] rounded-md",
      img: "h-6 max-w-[90px]",
    },
    sm: {
      skeleton: "h-7 w-20 rounded-lg",
      iconSkeleton: "size-7 rounded-lg",
      shimmer: "h-7 w-20 rounded-lg",
      badge: "size-7 text-xs rounded-lg",
      img: "h-7 max-w-[110px]",
    },
    md: {
      skeleton: "h-8 w-24 rounded-lg",
      iconSkeleton: "size-8 rounded-lg",
      shimmer: "h-8 w-24 rounded-lg",
      badge: "size-8 text-xs rounded-lg",
      img: "h-8 max-w-[140px]",
    },
    lg: {
      skeleton: "h-10 w-32 rounded-xl",
      iconSkeleton: "size-10 rounded-xl",
      shimmer: "h-10 w-32 rounded-xl",
      badge: "size-10 text-sm rounded-xl",
      img: "h-10 max-w-[180px]",
    },
    xl: {
      skeleton: "h-12 w-40 rounded-2xl",
      iconSkeleton: "size-12 rounded-2xl",
      shimmer: "h-12 w-40 rounded-2xl",
      badge: "size-12 text-base rounded-2xl",
      img: "h-12 max-w-[220px]",
    },
  }[size];

  // Render Skeleton effect while loading
  if (isLoading) {
    const skeletonContent = (
      <Skeleton
        className={cn(
          "shrink-0",
          variant === "icon" ? sizeMap.iconSkeleton : sizeMap.skeleton,
          badgeClassName,
          className,
        )}
      />
    );

    if (href) {
      return <div className="inline-flex items-center">{skeletonContent}</div>;
    }
    return skeletonContent;
  }

  // Render the logo itself (pure logo, no external text)
  const renderLogo = () => {
    if (variant === "icon") {
      return (
        <span
          aria-hidden="true"
          className={cn(
            "bg-gradient-to-br from-teal-600 via-teal-500 to-sky-600 text-white flex shrink-0 items-center justify-center font-extrabold tracking-wider shadow-sm select-none transition-transform duration-200",
            sizeMap.badge,
            badgeClassName,
          )}
        >
          {logoText}
        </span>
      );
    }

    if (hasUploadedLogo && !imageError) {
      const lightSrc = settings.logoUrl || settings.logoDarkUrl || "";
      const darkSrc = settings.logoDarkUrl || settings.logoUrl || "";
      const isLightValid = isCloudinarySrc(lightSrc);
      const isDarkValid = isCloudinarySrc(darkSrc);

      if (theme === "light" && isLightValid) {
        return (
          <CldImage
            width="240"
            height="60"
            src={lightSrc}
            sizes="(max-width: 768px) 140px, 200px"
            alt={siteName}
            className={cn(
              "object-contain shrink-0",
              sizeMap.img,
              badgeClassName,
            )}
            onError={() => setImageError(true)}
          />
        );
      }

      if (theme === "dark" && isDarkValid) {
        return (
          <CldImage
            width="240"
            height="60"
            src={darkSrc}
            sizes="(max-width: 768px) 140px, 200px"
            alt={siteName}
            className={cn(
              "object-contain shrink-0",
              sizeMap.img,
              badgeClassName,
            )}
            onError={() => setImageError(true)}
          />
        );
      }

      if (isLightValid || isDarkValid) {
        // Auto mode: show light logo in light mode and dark logo in dark mode
        return (
          <span className="relative shrink-0 flex items-center">
            {/* Light Mode Variant */}
            {isLightValid && (
              <CldImage
                width="240"
                height="60"
                src={lightSrc}
                sizes="(max-width: 768px) 140px, 200px"
                alt={siteName}
                className={cn(
                  "object-contain dark:hidden block",
                  sizeMap.img,
                  badgeClassName,
                )}
                onError={() => setImageError(true)}
              />
            )}
            {/* Dark Mode Variant */}
            {isDarkValid && (
              <CldImage
                width="240"
                height="60"
                src={darkSrc}
                sizes="(max-width: 768px) 140px, 200px"
                alt={siteName}
                className={cn(
                  "object-contain dark:block hidden",
                  sizeMap.img,
                  badgeClassName,
                )}
                onError={() => setImageError(true)}
              />
            )}
          </span>
        );
      }
    }

    // Default NextLoad Gradient Badge Fallback (only the logo, no external text)
    return (
      <span
        aria-hidden="true"
        className={cn(
          "bg-gradient-to-br from-teal-600 via-teal-500 to-sky-600 text-white flex shrink-0 items-center justify-center font-extrabold tracking-wider shadow-sm select-none transition-transform duration-200",
          sizeMap.badge,
          badgeClassName,
        )}
      >
        {logoText}
      </span>
    );
  };

  const content = (
    <div className={cn("inline-flex items-center shrink-0", className)}>
      {renderLogo()}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        aria-label={siteName}
        className="inline-flex items-center hover:opacity-90 transition-opacity focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
      >
        {content}
      </Link>
    );
  }

  return content;
}

export default Logo;
