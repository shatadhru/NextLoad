'use client'

import React, { useState } from 'react'
import { useFormFields } from '@payloadcms/ui'
import { THEME_PRESETS, RADIUS_PRESETS, type ThemeColors } from '@/config/themePresets'
import { Sun, Moon, Palette } from 'lucide-react'

export function ThemeLivePreview() {
  const [previewMode, setPreviewMode] = useState<'light' | 'dark'>('light')

  const formData = useFormFields(([fields]) => {
    return {
      enabled: fields?.['themeConfig.themeEnabled']?.value !== false,
      preset: (fields?.['themeConfig.preset']?.value as string) || 'zinc',
      radius: (fields?.['themeConfig.radius']?.value as string) || 'default',
      lightBackground: fields?.['themeConfig.lightMode.background']?.value as string | undefined,
      lightForeground: fields?.['themeConfig.lightMode.foreground']?.value as string | undefined,
      lightPrimary: fields?.['themeConfig.lightMode.primary']?.value as string | undefined,
      lightPrimaryFg: fields?.['themeConfig.lightMode.primaryForeground']?.value as string | undefined,
      lightSecondary: fields?.['themeConfig.lightMode.secondary']?.value as string | undefined,
      lightCard: fields?.['themeConfig.lightMode.card']?.value as string | undefined,
      lightBorder: fields?.['themeConfig.lightMode.border']?.value as string | undefined,
      darkBackground: fields?.['themeConfig.darkMode.background']?.value as string | undefined,
      darkForeground: fields?.['themeConfig.darkMode.foreground']?.value as string | undefined,
      darkPrimary: fields?.['themeConfig.darkMode.primary']?.value as string | undefined,
      darkPrimaryFg: fields?.['themeConfig.darkMode.primaryForeground']?.value as string | undefined,
      darkSecondary: fields?.['themeConfig.darkMode.secondary']?.value as string | undefined,
      darkCard: fields?.['themeConfig.darkMode.card']?.value as string | undefined,
      darkBorder: fields?.['themeConfig.darkMode.border']?.value as string | undefined,
    }
  })

  const presetName = formData?.preset || 'zinc'
  const presetConfig = THEME_PRESETS[presetName] || THEME_PRESETS.zinc

  const baseColors = previewMode === 'light' ? presetConfig.light : presetConfig.dark

  // Merge preset colors with any custom overrides
  const bg = (previewMode === 'light' ? formData?.lightBackground : formData?.darkBackground) || baseColors.background
  const fg = (previewMode === 'light' ? formData?.lightForeground : formData?.darkForeground) || baseColors.foreground
  const primary = (previewMode === 'light' ? formData?.lightPrimary : formData?.darkPrimary) || baseColors.primary
  const primaryFg = (previewMode === 'light' ? formData?.lightPrimaryFg : formData?.darkPrimaryFg) || baseColors.primaryForeground
  const secondary = (previewMode === 'light' ? formData?.lightSecondary : formData?.darkSecondary) || baseColors.secondary
  const card = (previewMode === 'light' ? formData?.lightCard : formData?.darkCard) || baseColors.card
  const border = (previewMode === 'light' ? formData?.lightBorder : formData?.darkBorder) || baseColors.border

  const rawRadius = formData?.radius || 'default'
  const radiusValue = RADIUS_PRESETS[rawRadius] || '0.625rem'

  return (
    <div
      style={{
        margin: '10px 0 16px',
        padding: '12px',
        borderRadius: '10px',
        border: '1px solid var(--theme-elevation-150, #e2e8f0)',
        backgroundColor: 'var(--theme-elevation-50, #f8fafc)',
      }}
    >
      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: '10px',
          paddingBottom: '8px',
          borderBottom: '1px solid var(--theme-elevation-150, #e2e8f0)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <Palette size={15} style={{ color: '#2563eb' }} />
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--theme-elevation-900, #0f172a)' }}>
            Theme Sandbox Preview
          </span>
          <span
            style={{
              fontSize: '10px',
              padding: '1px 6px',
              borderRadius: '999px',
              backgroundColor: formData?.enabled ? 'rgba(37, 99, 235, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: formData?.enabled ? '#2563eb' : '#ef4444',
              fontWeight: 600,
            }}
          >
            {formData?.enabled ? `Preset: ${presetConfig.label}` : 'Disabled'}
          </span>
        </div>

        {/* Light / Dark Mode Toggle */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'var(--theme-elevation-150, #e2e8f0)',
            borderRadius: '6px',
            padding: '2px',
          }}
        >
          <button
            type="button"
            onClick={() => setPreviewMode('light')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 8px',
              fontSize: '10px',
              fontWeight: 600,
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: previewMode === 'light' ? '#ffffff' : 'transparent',
              color: previewMode === 'light' ? '#0f172a' : '#64748b',
              boxShadow: previewMode === 'light' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
            }}
          >
            <Sun size={11} />
            <span>Light</span>
          </button>
          <button
            type="button"
            onClick={() => setPreviewMode('dark')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 8px',
              fontSize: '10px',
              fontWeight: 600,
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: previewMode === 'dark' ? '#0f172a' : 'transparent',
              color: previewMode === 'dark' ? '#ffffff' : '#64748b',
              boxShadow: previewMode === 'dark' ? '0 1px 2px rgba(0,0,0,0.2)' : 'none',
            }}
          >
            <Moon size={11} />
            <span>Dark</span>
          </button>
        </div>
      </div>

      {/* Live rendered sandbox */}
      <div
        style={{
          backgroundColor: bg,
          color: fg,
          borderRadius: radiusValue,
          border: `1px solid ${border}`,
          padding: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          transition: 'all 0.15s ease',
        }}
      >
        {/* Mock App Navbar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '10px',
            paddingBottom: '8px',
            borderBottom: `1px solid ${border}`,
            flexWrap: 'wrap',
            gap: '6px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: `calc(${radiusValue} * 0.7)`,
                backgroundColor: primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: primaryFg,
                fontWeight: 'bold',
                fontSize: 10,
              }}
            >
              N
            </div>
            <span style={{ fontWeight: 700, fontSize: '11px', letterSpacing: '-0.01em' }}>NEXT LOAD</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                fontSize: '9px',
                padding: '2px 6px',
                borderRadius: `calc(${radiusValue} * 0.6)`,
                backgroundColor: secondary,
                fontWeight: 500,
              }}
            >
              r: {rawRadius}
            </span>
            <button
              type="button"
              style={{
                padding: '3px 8px',
                borderRadius: radiusValue,
                backgroundColor: primary,
                color: primaryFg,
                border: 'none',
                fontWeight: 600,
                fontSize: '10px',
                cursor: 'pointer',
              }}
            >
              Button
            </button>
          </div>
        </div>

        {/* Mock UI Elements Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '8px',
          }}
        >
          {/* Card 1: Buttons */}
          <div
            style={{
              backgroundColor: card,
              borderRadius: radiusValue,
              border: `1px solid ${border}`,
              padding: '8px 10px',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 700, marginBottom: '6px' }}>Buttons</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              <button
                type="button"
                style={{
                  padding: '4px 8px',
                  borderRadius: radiusValue,
                  backgroundColor: primary,
                  color: primaryFg,
                  border: 'none',
                  fontSize: '10px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Primary
              </button>
              <button
                type="button"
                style={{
                  padding: '4px 8px',
                  borderRadius: radiusValue,
                  backgroundColor: secondary,
                  color: fg,
                  border: 'none',
                  fontSize: '10px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Secondary
              </button>
              <button
                type="button"
                style={{
                  padding: '4px 8px',
                  borderRadius: radiusValue,
                  backgroundColor: 'transparent',
                  color: fg,
                  border: `1px solid ${border}`,
                  fontSize: '10px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Outline
              </button>
            </div>
          </div>

          {/* Card 2: Badges */}
          <div
            style={{
              backgroundColor: card,
              borderRadius: radiusValue,
              border: `1px solid ${border}`,
              padding: '8px 10px',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 700, marginBottom: '6px' }}>Badges</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center' }}>
              <span
                style={{
                  padding: '2px 6px',
                  borderRadius: '999px',
                  backgroundColor: primary,
                  color: primaryFg,
                  fontSize: '9px',
                  fontWeight: 700,
                }}
              >
                Primary
              </span>
              <span
                style={{
                  padding: '2px 6px',
                  borderRadius: '999px',
                  backgroundColor: secondary,
                  color: fg,
                  fontSize: '9px',
                  fontWeight: 600,
                }}
              >
                Secondary
              </span>
              <span
                style={{
                  padding: '2px 6px',
                  borderRadius: '999px',
                  border: `1px solid ${primary}`,
                  color: primary,
                  fontSize: '9px',
                  fontWeight: 600,
                }}
              >
                Accent
              </span>
            </div>
          </div>
        </div>

        {/* Color Palette Indicators */}
        <div
          style={{
            marginTop: '8px',
            paddingTop: '6px',
            borderTop: `1px solid ${border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '6px',
            fontSize: '10px',
            opacity: 0.8,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Swatches:</span>
            <div style={{ display: 'flex', gap: 3 }}>
              <div style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: primary }} title={`Primary: ${primary}`} />
              <div style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: bg, border: '1px solid #999' }} title={`Background: ${bg}`} />
              <div style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: secondary }} title={`Secondary: ${secondary}`} />
              <div style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: border }} title={`Border: ${border}`} />
            </div>
          </div>
          <span>{previewMode.toUpperCase()} | {radiusValue}</span>
        </div>
      </div>
    </div>
  )
}

export default ThemeLivePreview
