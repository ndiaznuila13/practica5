import {create } from 'zustand';    
import { persist } from 'zustand/middleware';

export const useUIStore = create(
    // persist: middleware que guarda automáticamente en localstorage
    persist(
        (set) => ({
            theme: 'light', 
            sidebarOpen: true,

            // Alternar entre tema claro y oscuro
            toggleTheme: () => set((state) => ({
                theme: state.theme === 'light' ? 'dark' : 'light'
            })),

            toggleSidebar: () => set((state) => ({
                sidebarOpen: !state.sidebarOpen
            })),

            setSidebarOpen: (open) => set({ sidebarOpen: open })
    }),
    {
        name: 'ui-preferences',  //clave en localStorage
        // solo persistir el tema, no el estado del sidebar
        partialize: (state) => ({
            theme: state.theme 
        })
    }
)
);