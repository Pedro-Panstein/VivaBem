import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface AccordionProps {
  children: React.ReactNode
  className?: string
}

export function Accordion({ children, className = '' }: AccordionProps) {
  return <div className={className}>{children}</div>
}

interface AccordionItemProps {
  children: React.ReactNode
  className?: string
}

export function AccordionItem({ children, className = '' }: AccordionItemProps) {
  return <div className={`accordion-item ${className}`}>{children}</div>
}

interface AccordionTriggerProps {
  children: React.ReactNode
  isOpen: boolean
  onClick: () => void
  className?: string
}

export function AccordionTrigger({ children, isOpen, onClick, className = '' }: AccordionTriggerProps) {
  return (
    <button
      type="button"
      className={`accordion-trigger ${className}`}
      data-state={isOpen ? 'open' : 'closed'}
      onClick={onClick}
    >
      {children}
      <ChevronDown size={16} />
    </button>
  )
}

interface AccordionContentProps {
  children: React.ReactNode
  isOpen: boolean
  className?: string
}

export function AccordionContent({ children, isOpen, className = '' }: AccordionContentProps) {
  return (
    <div
      className={`accordion-content ${className}`}
      data-state={isOpen ? 'open' : 'closed'}
    >
      {isOpen && children}
    </div>
  )
}

// Controlled Accordion Item component
interface ControlledAccordionItemProps {
  title: React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
}

export function ControlledAccordionItem({ title, children, defaultOpen = false }: ControlledAccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  
  return (
    <AccordionItem>
      <AccordionTrigger isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}>
        {title}
      </AccordionTrigger>
      <AccordionContent isOpen={isOpen}>
        {children}
      </AccordionContent>
    </AccordionItem>
  )
}
