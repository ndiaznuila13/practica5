import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
export default function Layout() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main>
                {/* Outlet: aquí se renderizan las rutas hijas (Dashboard, TaskDetails, etc.)
*/}
                <Outlet />
            </main>
        </div>
    );
}