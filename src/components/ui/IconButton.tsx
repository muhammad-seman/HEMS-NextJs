'use client'

import React from 'react'
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

type IconType = 'create' | 'edit' | 'delete' | 'view' | 'filter' | 'search' | 'check' | 'close'

interface IconButtonProps {
  icon: IconType
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  tooltip?: string
  className?: string
}

const icons = {
  create: PlusIcon,
  edit: PencilIcon,
  delete: TrashIcon,
  view: EyeIcon,
  filter: FunnelIcon,
  search: MagnifyingGlassIcon,
  check: CheckIcon,
  close: XMarkIcon,
}

const variants = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
  success: 'bg-green-600 hover:bg-green-700 text-white',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
}

const sizes = {
  sm: 'p-1.5',
  md: 'p-2',
  lg: 'p-3',
}

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
}

export default function IconButton({
  icon,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  tooltip,
  className = ''
}: IconButtonProps) {
  const IconComponent = icons[icon]

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
      className={`
        inline-flex items-center justify-center rounded-md transition-colors duration-200 
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      <IconComponent className={iconSizes[size]} />
    </button>
  )
}

// Specialized icon buttons for common use cases
export function CreateButton(props: Omit<IconButtonProps, 'icon'>) {
  return <IconButton {...props} icon="create" tooltip="Create" />
}

export function EditButton(props: Omit<IconButtonProps, 'icon'>) {
  return <IconButton {...props} icon="edit" variant="secondary" tooltip="Edit" />
}

export function DeleteButton(props: Omit<IconButtonProps, 'icon'>) {
  return <IconButton {...props} icon="delete" variant="danger" tooltip="Delete" />
}

export function ViewButton(props: Omit<IconButtonProps, 'icon'>) {
  return <IconButton {...props} icon="view" variant="secondary" tooltip="View" />
}

export function FilterButton(props: Omit<IconButtonProps, 'icon'>) {
  return <IconButton {...props} icon="filter" variant="secondary" tooltip="Filter" />
}