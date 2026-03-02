import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useTaskStore } from '../../store/taskStore';
import { useUIStore } from '../../store/uiStore';
import { useTasks } from '../../hooks/useTasks';
import TaskFilters from '../../components/tasks/TaskFilters';
import TaskList from '../../components/tasks/TaskList';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function Dashboard() {
    const [searchTerm, setSearchTerm] = useState('');
    const user = useAuthStore((state) => state.user);
    const { tasks, currentFilter, currentCategory, loading } = useTaskStore();
    const { theme } = useUIStore();
    const isDark = theme === 'dark';

    useTasks();

    const filteredTasks = tasks.filter((task) => {
        if (currentFilter === 'completed' && !task.completed) return false;
        if (currentFilter === 'pending' && task.completed) return false;
        if (currentCategory !== 'all' && task.category !== currentCategory) return false;
        return true;
    });

    const searchFilteredTasks = filteredTasks.filter((task) => {
        const term = searchTerm.toLowerCase();
        return (
            task.title.toLowerCase().includes(term) ||
            (task.description?.toLowerCase() || '').includes(term)
        );
    });

    if (loading) return <LoadingSpinner />;

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="mb-8">
                <h1 className={`text-3xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
                    Bienvenido, {user?.displayName || 'Usuario'}
                </h1>
                <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Tienes {tasks.filter(t => !t.completed).length} tareas pendientes
                </p>
            </div>
            <div className="mb-6">
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                    Buscar tareas
                </label>
                <input
                    type="text"
                    className={`input-field ${isDark ? 'bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400' : ''}`}
                    placeholder="Busca por título o descripción"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <TaskFilters />
            <TaskList tasks={searchFilteredTasks} />
        </div>
    );
}