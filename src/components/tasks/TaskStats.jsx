import { useMemo } from 'react';
import { useTaskStore } from '../../store/taskStore';
import { useUIStore } from '../../store/uiStore';
import { isOverdue } from '../../utils/dateHelpers';

export default function TaskStats() {
    const { tasks } = useTaskStore();
    const { theme } = useUIStore();
    const isDark = theme === 'dark';

    const stats = useMemo(() => {
        const total = tasks.length;
        const completed = tasks.filter((t) => t.completed).length;
        const pending = total - completed;
        const overdue = tasks.filter((t) => isOverdue(t.dueDate, t.completed)).length;
        const completion = total === 0 ? 0 : Math.round((completed / total) * 100);
        return { total, completed, pending, overdue, completion };
    }, [tasks]);

    const cardClass = `flex flex-col gap-1 rounded-lg border shadow-md p-4 transition-colors ${
        isDark ? 'bg-gray-900 border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-800'
    }`;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <StatCard label="Total" value={stats.total} className={cardClass} />
            <StatCard label="Completadas" value={stats.completed} className={cardClass} />
            <StatCard label="Pendientes" value={stats.pending} className={cardClass} />
            <StatCard label="Vencidas" value={stats.overdue} className={cardClass} />
            <StatCard label="Completitud" value={`${stats.completion}%`} className={cardClass} />
        </div>
    );
}

function StatCard({ label, value, className }) {
    return (
        <div className={className}>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-300">{label}</span>
            <span className="text-2xl font-bold">{value}</span>
        </div>
    );
}
