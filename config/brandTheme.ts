import fs from "fs"
import path from "path"

export interface BrandThemeConfig {
  logo: {
    light: string
    dark: string
  }
  icon: {
    light: string
    dark: string
  }
}

// Default direct Cloudinary asset URLs
export const DEFAULT_BRAND_THEME: BrandThemeConfig = {
  logo: {
    light: "https://res.cloudinary.com/dccbp4dpb/image/upload/v1789961855/nextload-media/hyraticdark_1789961852998.png",
    dark: "https://res.cloudinary.com/dccbp4dpb/image/upload/v1789887376/your-folder-name/logoicon_1789887374541.png",
  },
  icon: {
    light: "https://res.cloudinary.com/dccbp4dpb/image/upload/v1789887376/your-folder-name/logoicon_1789887374541.png",
    dark: "https://res.cloudinary.com/dccbp4dpb/image/upload/v1789887376/your-folder-name/logoicon_1789887374541.png",
  },
}

function resolveBrandTheme(): BrandThemeConfig {
  try {
    const filePath = path.resolve(process.cwd(), "config", "brand-settings.json")
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8")
      const parsed = JSON.parse(content)
      return {
        logo: {
          light: parsed.logo?.light || DEFAULT_BRAND_THEME.logo.light,
          dark: parsed.logo?.dark || DEFAULT_BRAND_THEME.logo.dark,
        },
        icon: {
          light: parsed.icon?.light || DEFAULT_BRAND_THEME.icon.light,
          dark: parsed.icon?.dark || DEFAULT_BRAND_THEME.icon.dark,
        },
      }
    }
  } catch (err) {
    // fallback gracefully
  }
  return DEFAULT_BRAND_THEME
}

export const brandThemeConfig: BrandThemeConfig = resolveBrandTheme()
