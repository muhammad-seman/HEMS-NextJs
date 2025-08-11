import { create } from 'zustand'

interface SidebarStore {
  isOpen: boolean
  isMobile: boolean
  toggle: () => void
  setOpen: (isOpen: boolean) => void
  setMobile: (isMobile: boolean) => void
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  isOpen: false, // Default to collapsed on desktop, closed on mobile
  isMobile: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  setOpen: (isOpen: boolean) => set({ isOpen }),
  setMobile: (isMobile: boolean) => set({ isMobile }),
}))