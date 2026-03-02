import { Link } from 'react-router-dom';
import { updateTask, deleteTask } from '../../services/taskService';
import { CATEGORIES } from '../../utils/constants';
import { getDueDateLabel, isOverdue } from '../../utils/dateHelpers';
import { useTaskStore } from '../../store/taskStore';

export default function TaskCard({ task }) {
    const updateTaskInStore = useTaskStore((state) => state.updateTask);
    const deleteTaskFromStore = useTaskStore((state) => state.deleteTask);

    const category = CATEGORIES.find((c) => c.id === task.category);
    const categoryColor = category?.color || 'gray';
    const categoryClasses = `bg-${categoryColor}-100 text-${categoryColor}-800`;

    const overdue = isOverdue(task.dueDate, task.completed);
    const dueDateLabel = getDueDateLabel(task.dueDate);
    const cardClasses = `card hover:shadow-lg transition-shadow cursor-pointer ${
        task.completed ? 'opacity-60' : ''
    } ${overdue ? 'border border-red-200' : ''}`.trim();

    const handleToggleComplete = async (e) => {
        e.preventDefault();
        const newStatus = !task.completed;
        const result = await updateTask(task.id, { completed: newStatus });

        if (result.success) {
            updateTaskInStore(task.id, { completed: newStatus });
        } else {
            window.alert('No se pudo actualizar la tarea');
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        const confirmed = window.confirm('¿Seguro que deseas eliminar esta tarea?');
        if (!confirmed) return;

        const result = await deleteTask(task.id);
        if (result.success) {
            deleteTaskFromStore(task.id);
        } else {
            window.alert('No se pudo eliminar la tarea');
        }
    };

    return (
        <Link to={`/tasks/${task.id}`} className="block">
            <div className={cardClasses}>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800">{task.title}</h3>
                        {task.description && (
                            <p className="text-gray-600 mt-2">{task.description}</p>
                        )}
                    </div>
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            task.completed
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                        }`}
                    >
                        {task.completed ? 'Completada' : 'Pendiente'}
                    </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-4 text-sm">
                    {category && (
                        <span className={`px-3 py-1 rounded-full font-medium ${categoryClasses}`}>
                            {category.label}
                        </span>
                    )}
                    <span className={`font-medium ${overdue ? 'text-red-600' : 'text-gray-600'}`}>
                        {dueDateLabel ? `Vence: ${dueDateLabel}` : 'Sin fecha de vencimiento'}
                    </span>
                </div>

                <div className="flex flex-wrap gap-3 mt-6">
                    <button
                        type="button"
                        onClick={handleToggleComplete}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        {task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </Link>
    );
}
