import Swal from 'sweetalert2'

interface ConfirmOptions {
  title: string
  text?: string
  confirmButtonText?: string
  cancelButtonText?: string
  icon?: 'warning' | 'error' | 'success' | 'info' | 'question'
}

interface SuccessOptions {
  title: string
  text?: string
  timer?: number
}

interface ErrorOptions {
  title: string
  text?: string
}

// Modern confirmation alert
export const confirmAlert = async (options: ConfirmOptions): Promise<boolean> => {
  const result = await Swal.fire({
    title: options.title,
    text: options.text,
    icon: options.icon || 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: options.confirmButtonText || 'Yes, proceed',
    cancelButtonText: options.cancelButtonText || 'Cancel',
    reverseButtons: true,
    focusCancel: true,
  })
  
  return result.isConfirmed
}

// Success notification
export const successAlert = (options: SuccessOptions) => {
  return Swal.fire({
    title: options.title,
    text: options.text,
    icon: 'success',
    timer: options.timer || 3000,
    showConfirmButton: false,
    toast: true,
    position: 'top-end'
  })
}

// Error notification
export const errorAlert = (options: ErrorOptions) => {
  return Swal.fire({
    title: options.title,
    text: options.text,
    icon: 'error',
    confirmButtonColor: '#3085d6',
  })
}

// Delete confirmation (specialized)
export const confirmDelete = async (itemName: string = 'this item'): Promise<boolean> => {
  return confirmAlert({
    title: 'Are you sure?',
    text: `You won't be able to recover ${itemName} after deletion.`,
    icon: 'warning',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  })
}

// Role assignment confirmation
export const confirmRoleChange = async (action: 'assign' | 'remove', roleName: string, userName: string): Promise<boolean> => {
  return confirmAlert({
    title: `${action === 'assign' ? 'Assign' : 'Remove'} Role`,
    text: `${action === 'assign' ? 'Assign' : 'Remove'} "${roleName}" role ${action === 'assign' ? 'to' : 'from'} ${userName}?`,
    icon: 'question',
    confirmButtonText: action === 'assign' ? 'Assign Role' : 'Remove Role',
  })
}