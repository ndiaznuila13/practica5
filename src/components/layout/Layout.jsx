import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { useUIStore } from '../../store/uiStore';

export default function Layout() {
    const { theme } = useUIStore();
    const isDark = theme === 'dark';

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <Navbar />
            <main>
                <Outlet />
            </main>
        </div>
    );
}