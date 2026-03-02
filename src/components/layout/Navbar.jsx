import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { logoutUser } from '../../services/authService';

export default function Navbar() {
    const { user, clearUser } = useAuthStore();
    const { theme, toggleTheme } = useUIStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        const result = await logoutUser();
        if (result.success) {
            clearUser();
            navigate('/login');
        }
    };

    const isDark = theme === 'dark';

    return (
        <nav className={`shadow-md transition-colors duration-300 ${isDark ? 'bg-gray-900 border-b border-gray-700' : 'bg-white'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link
                            to="/dashboard"
                            className={`text-2xl font-bold transition-colors ${isDark ? 'text-blue-400' : 'text-blue-600'}`}
                        >
                            Task Manager Pro
                        </Link>
                    </div>

                    {/* Controles de la derecha */}
                    <div className="flex items-center gap-3">
                        <span className={`text-sm font-medium transition-colors ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            {user?.displayName || user?.email}
                        </span>

                        {/* Botón de tema oscuro/claro */}
                        <button
                            type="button"
                            onClick={toggleTheme}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors border ${
                                isDark
                                    ? 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700'
                                    : 'bg-gray-200 text-gray-800 border-gray-300 hover:bg-gray-300'
                            }`}
                        >
                            {isDark ? 'Modo claro' : 'Modo oscuro'}
                        </button>

                        <button
                            onClick={handleLogout}
                            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                                isDark
                                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                            }`}
                        >
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}