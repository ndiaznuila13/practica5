import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";

import Layout from "../components/layout/Layout";
import Login from "../pages/auth/login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import TaskDetails from "../pages/dashboard/TaskDetails";
import ProtectedRoute from "./ProtectedRoute";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function AppRouter() {
    const {initializeAuth, loading} = useAuthStore();

    // inicializar listener de autenticación al montar
    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    // Mostrar spinner mientras se verifica la sesión
    if (loading) {
        return <LoadingSpinner />;
    }
    return (
        <BrowserRouter>
            <Routes>
                {/* Ruta raiz redirige a dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* Rutas públicas */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Rutas protegidas con Layout compartido*/}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                >
                    {/* Rutas hijas que comparten el layout (Navbar) */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/task/:id" element={<TaskDetails />} />
                </Route>

                {/* Ruta 404: cualquier ruta no definida vuelve a dashboard */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </BrowserRouter>        
    );
}