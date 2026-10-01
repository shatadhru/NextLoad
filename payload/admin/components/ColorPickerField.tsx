'use client'

import React, { useState, useEffect } from 'react'
import { useField, useFormFields } from '@payloadcms/ui'
import { THEME_PRESETS, type ThemeColors } from '@/config/themePresets'
import { RotateCcw } from 'lucide-react'

const QUICK_COLORS = [
  '#ffffff',
  '#09090b',
  '#18181b',
  '#2563eb',
  '#16a34a',
  '#e11d48',
  '#ea580c',
  '#7c3aed',
  '#ca8a04',
]

export const ColorPickerField: React.FC<{
  path?: string
  name?: string
  value?: string
  setValue?: (val: string) => void
  onChange?: (val: any) => void
  field?: {
    name?: string
    label?: string | Record<string, string>
    admin?: { placeholder?: string; description?: string }
  }
  readOnly?: boolean
}> = (props) => {
  const targetPath = props.path || props.name || props.field?.name || ''
  const fieldState = useField<string>({ path: targetPath })

  const rawValue = props.value !== undefined ? props.value : fieldState?.value
  const [internalValue, setInternalValue] = useState<string>((rawValue as string) || '')

  useEffect(() => {
    setInternalValue((rawValue as string) || '')
  }, [rawValue])

  // Dynamically resolve preset color from form state
  const activePresetKey = useFormFields(([fields]) => {
    return (fields?.['themeConfig.preset']?.value as string) || 'zinc'
  })

  const preset = THEME_PRESETS[activePresetKey] || THEME_PRESETS.zinc
  const isDarkMode = targetPath.includes('darkMode')
  const colorKey = targetPath.split('.').pop() as keyof ThemeColors
  const presetHex = (isDarkMode ? preset.dark[colorKey] : preset.light[colorKey]) || ''

  const commitValue = (newVal: string) => {
    setInternalValue(newVal)
    if (fieldState?.setValue) {
      fieldState.setValue(newVal)
    } else if (props.setValue) {
      props.setValue(newVal)
    } else if (props.onChange) {
      props.onChange(newVal)
    }
  }

  const label =
    typeof props.field?.label === 'string'
      ? props.field.label
      : typeof props.field?.label === 'object'
        ? Object.values(props.field.label)[0]
        : colorKey || targetPath

  const fallbackPlaceholder =
    presetHex ||
    (props.field?.admin?.placeholder && /^#[0-9a-fA-F]{6}$/.test(props.field.admin.placeholder)
      ? props.field.admin.placeholder
      : '#18181b')

  const isValidHex = /^#[0-9a-fA-F]{6}$/i.test(internalValue)
  const displayColor = isValidHex ? internalValue : fallbackPlaceholder

  return (
    <div style={{ marginBottom: 10, width: '100%' }}>
      {/* Label bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 4,
          gap: 6,
        }}
      >
        <label
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--theme-elevation-800, #333)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          title={label}
        >
          {label}
        </label>

        {internalValue && !props.readOnly && (
          <button
            type="button"
            onClick={() => commitValue('')}
            title={`Reset to preset (${fallbackPlaceholder})`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 3,
              background: 'none',
              border: 'none',
              padding: '1px 4px',
              fontSize: 10,
              color: 'var(--theme-elevation-500, #71717a)',
              cursor: 'pointer',
              borderRadius: 4,
              flexShrink: 0,
            }}
          >
            <RotateCcw size={10} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Input row: Swatch + Text Input */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          width: '100%',
          position: 'relative',
        }}
      >
        {/* Color picker trigger input */}
        <div
          style={{
            position: 'relative',
            width: 32,
            height: 32,
            borderRadius: 6,
            border: '1px solid var(--theme-elevation-200, #cbd5e1)',
            overflow: 'hidden',
            backgroundColor: displayColor,
            flexShrink: 0,
            boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
            cursor: props.readOnly ? 'default' : 'pointer',
          }}
          title="Click to pick color"
        >
          <input
            type="color"
            value={displayColor}
            disabled={props.readOnly}
            onChange={(e) => commitValue(e.target.value)}
            onInput={(e) => commitValue(e.currentTarget.value)}
            style={{
              position: 'absolute',
              top: -8,
              left: -8,
              width: 48,
              height: 48,
              cursor: props.readOnly ? 'default' : 'pointer',
              opacity: 0,
            }}
          />
        </div>

        {/* Text input for hex code */}
        <input
          type="text"
          value={internalValue}
          readOnly={props.readOnly}
          onChange={(e) => commitValue(e.target.value)}
          placeholder={fallbackPlaceholder}
          style={{
            flex: 1,
            minWidth: 0,
            height: 32,
            padding: '0 8px',
            border: '1px solid var(--theme-elevation-200, #cbd5e1)',
            borderRadius: 6,
            fontSize: 12,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            backgroundColor: 'var(--theme-input-bg, #ffffff)',
            color: 'var(--theme-elevation-800, #18181b)',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />

        {/* Status dot / override indicator */}
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: internalValue ? '#2563eb' : 'transparent',
            border: internalValue ? 'none' : '1px solid var(--theme-elevation-300, #cbd5e1)',
            flexShrink: 0,
          }}
          title={internalValue ? `Overridden: ${internalValue}` : `Default: ${fallbackPlaceholder}`}
        />
      </div>

      {/* Quick color swatches (compact single line, wrap cleanly) */}
      {!props.readOnly && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            marginTop: 4,
            flexWrap: 'wrap',
          }}
        >
          {QUICK_COLORS.map((hex) => {
            const isSelected = (internalValue || fallbackPlaceholder).toLowerCase() === hex.toLowerCase()
            return (
              <button
                key={hex}
                type="button"
                onClick={() => commitValue(hex)}
                title={`Set to ${hex}`}
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 3,
                  backgroundColor: hex,
                  border: isSelected ? '1.5px solid #2563eb' : '1px solid rgba(0,0,0,0.15)',
                  cursor: 'pointer',
                  padding: 0,
                  outline: 'none',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  flexShrink: 0,
                }}
              />
            )
          })}
        </div>
      )}

      {props.field?.admin?.description && (
        <p
          style={{
            marginTop: 3,
            fontSize: 10,
            color: 'var(--theme-elevation-400, #a1a1aa)',
            lineHeight: 1.3,
          }}
        >
          {props.field.admin.description}
        </p>
      )}
    </div>
  )
}

export default ColorPickerField
