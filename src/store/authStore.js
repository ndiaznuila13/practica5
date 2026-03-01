import {create} from 'zustand';
import {auth} from '../services/firebase';
import {onAuthStateChanged} from 'firebase/auth';

export const useAuthStore = create((set) => ({
    // estado inicial
    user: null,
    loading: true, //true mientras verificamos si hay sesion activa

    setUser: (user) => set({user, loading: false}),
    
    // Limpliar usuario al cerrar sesion
    clearUser: () => set({user: null, loading: false}),

    // Escuchar cambios en la autenticacion de firebase
    initializeAuth: () => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                set({
                    user: {
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName
                    },
                    loading: false
                });
            } else {
                set({user: null, loading: false});
        }
    });
}
}));