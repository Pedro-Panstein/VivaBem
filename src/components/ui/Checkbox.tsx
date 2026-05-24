import React from 'react'
import { Check } from 'lucide-react'

interface CheckboxProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  className?: string
  id?: string
}

export function Checkbox({ checked, onCheckedChange, disabled = false, className = '', id }: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      data-state={checked ? 'checked' : 'unchecked'}
      disabled={disabled}
      className={`checkbox ${className}`}
      id={id}
      onClick={() => !disabled && onCheckedChange(!checked)}
    >
      {checked && (
        <span className="checkbox-indicator">
          <Check size={12} />
        </span>
      )}
    </button>
  )
}
