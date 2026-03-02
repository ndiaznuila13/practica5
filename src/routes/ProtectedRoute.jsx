import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";

export default function ProtectedRoute({ children }) {
    const {user, loading } = useAuthStore();

    // Mostrar spinner mientras Firebase verifica la sesión
    if (loading) {
        return <LoadingSpinner />;
    }

    // Si no hay usuario autenticado, redirigir a login
    // replace: evita que puedan volver con el boton atras
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // usuario autenticado: mostrar el contenido protegido
    return children;
}