import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  options: SelectOption[]
  value?: string
  placeholder?: string
  onChange?: (value: string) => void
  className?: string
  disabled?: boolean
}

export function Select({
  options,
  value,
  placeholder = 'Selecione...',
  onChange,
  className = '',
  disabled = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((opt) => opt.value === value)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        className="select-trigger"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <span data-placeholder={!selectedOption}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          style={{
            transition: 'transform 0.2s',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      {isOpen && (
        <div className="select-content" style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px' }}>
          <div className="select-viewport">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                className="select-item"
                onClick={() => {
                  onChange?.(option.value)
                  setIsOpen(false)
                }}
              >
                <span className="select-item-indicator">
                  {value === option.value && <Check size={14} />}
                </span>
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
