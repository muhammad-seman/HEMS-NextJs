'use client'

import React from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

interface AccordionProps {
  title: string
  children: React.ReactNode
  isOpen?: boolean
  onToggle?: () => void
  className?: string
}

export default function Accordion({ 
  title, 
  children, 
  isOpen = false, 
  onToggle,
  className = ''
}: AccordionProps) {
  const [isExpanded, setIsExpanded] = React.useState(isOpen)

  const handleToggle = () => {
    if (onToggle) {
      onToggle()
    } else {
      setIsExpanded(!isExpanded)
    }
  }

  const currentState = onToggle ? isOpen : isExpanded

  return (
    <div className={`border border-gray-200 rounded-lg ${className}`}>
      <button
        onClick={handleToggle}
        className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset transition-colors duration-200 flex items-center justify-between rounded-t-lg"
      >
        <span className="font-medium text-gray-900">{title}</span>
        <ChevronDownIcon
          className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
            currentState ? 'rotate-180' : ''
          }`}
        />
      </button>
      
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          currentState ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
          {children}
        </div>
      </div>
    </div>
  )
}

interface AccordionGroupProps {
  children: React.ReactNode
  allowMultiple?: boolean
  className?: string
}

export function AccordionGroup({ 
  children, 
  allowMultiple = false,
  className = ''
}: AccordionGroupProps) {
  const [openIndexes, setOpenIndexes] = React.useState<Set<number>>(new Set())

  const handleToggle = (index: number) => {
    const newOpenIndexes = new Set(openIndexes)
    
    if (newOpenIndexes.has(index)) {
      newOpenIndexes.delete(index)
    } else {
      if (!allowMultiple) {
        newOpenIndexes.clear()
      }
      newOpenIndexes.add(index)
    }
    
    setOpenIndexes(newOpenIndexes)
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child) && child.type === Accordion) {
          return React.cloneElement(child as React.ReactElement<AccordionProps>, {
            isOpen: openIndexes.has(index),
            onToggle: () => handleToggle(index)
          })
        }
        return child
      })}
    </div>
  )
}