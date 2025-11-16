import React, { memo, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import type { ParamDesc } from '@/types/device'

type SupportedType = 'string' | 'number' | 'int' | 'boolean'

interface SmartInputProps<T> {
  param: ParamDesc
  value?: T
  onChange?: (name: string, value: T) => void
  className?: string
  placeholder?: string
  disabled?: boolean
  /** Optional custom render override for a given type */
  renderers?: Partial<Record<SupportedType, React.ReactNode>>
}

/**
 * A flexible input component compatible with Shadcn UI
 */
export const SmartInput = memo(function SmartInput<T>({
  param,
  value,
  onChange,
  className,
  placeholder,
  disabled,
  renderers,
}: SmartInputProps<T>) {
  // If custom renderer is provided for this type, use it directly
  if (renderers?.[param.type]) return <>{renderers[param.type]}</>

  const handleStringChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(param.name, e.target.value as unknown as T)
  }, [onChange, param.name])

  const handleNumberChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    if (v === '') {
      onChange?.(param.name, undefined as unknown as T)
      return
    }
    const parsed = param.type === 'int' ? parseInt(v, 10) : parseFloat(v)
    onChange?.(param.name, (Number.isNaN(parsed) ? undefined : parsed) as unknown as T)
  }, [onChange, param.name, param.type])

  // Default renderer per supported type
  switch (param.type) {
    case 'string':
      return (
        <Input
          placeholder={placeholder}
          value={String(value ?? '')}
          disabled={disabled ?? false}
          onChange={handleStringChange}
        />
      )

    case 'int':
    case 'number':
      return (
        <Input
          type="number"
          inputMode="decimal"
          placeholder={placeholder}
          value={value as number}
          className={className}
          disabled={disabled ?? false}
          onChange={handleNumberChange}
        />
      )

    case 'boolean':
      return (
        <Switch
          checked={Boolean(value)}
          disabled={disabled ?? false}
          onCheckedChange={(checked) => onChange?.(param.name, (checked as unknown) as T)}
        />
      )

    default:
      return null
  }
})
