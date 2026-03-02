import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { createTask, updateTask } from '../../services/taskService';
import { toast } from 'react-hot-toast';
import { CATEGORIES, PRIORITIES } from '../../utils/constants';

export default function TaskForm({ onClose, taskToEdit = null }) {
    const user = useAuthStore((state) => state.user);
    const { theme } = useUIStore();
    const isDark = theme === 'dark';
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isEditing = !!taskToEdit;

    const defaultValues = taskToEdit ? {
        title: taskToEdit.title,
        description: taskToEdit.description || '',
        category: taskToEdit.category,
        priority: taskToEdit.priority,
        dueDate: taskToEdit.dueDate
            ? taskToEdit.dueDate.toISOString().split('T')[0]
            : ''
    } : {
        title: '',
        description: '',
        category: 'other',
        priority: 'medium',
        dueDate: ''
    };

    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues });

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');
        const taskData = {
            title: data.title,
            description: data.description,
            category: data.category,
            priority: data.priority,
            dueDate: data.dueDate ? new Date(data.dueDate) : null
        };
        const result = isEditing
            ? await updateTask(taskToEdit.id, taskData)
            : await createTask(user.uid, taskData);

        if (result.success) {
            toast.success(isEditing ? 'Tarea actualizada' : 'Tarea creada');
            onClose();
        } else {
            const message = isEditing ? 'Error al actualizar la tarea' : 'Error al crear la tarea';
            setError(message);
            toast.error(message);
        }
        setLoading(false);
    };

    const inputClass = `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors duration-300 ${
        isDark
            ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400'
            : 'bg-white border-gray-300 text-gray-800'
    }`;

    const labelClass = `block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`;

    return (
        <div className={`rounded-lg shadow-md p-6 transition-colors duration-300 ${isDark ? 'bg-gray-900 border border-gray-700' : 'bg-white'}`}>
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h3 className={`text-xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
                    {isEditing ? 'Editar Tarea' : 'Nueva Tarea'}
                </h3>
                <button
                    onClick={onClose}
                    className={`text-2xl leading-none transition-colors ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    &times;
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Título */}
                <div>
                    <label className={labelClass}>Título *</label>
                    <input
                        type="text"
                        className={inputClass}
                        placeholder="Ej: Completar informe mensual"
                        {...register('title', {
                            required: 'El título es obligatorio',
                            minLength: { value: 3, message: 'Mínimo 3 caracteres' }
                        })}
                    />
                    {errors.title && (
                        <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                    )}
                </div>

                {/* Descripción */}
                <div>
                    <label className={labelClass}>Descripción</label>
                    <textarea
                        className={inputClass}
                        rows="3"
                        placeholder="Descripción detallada de la tarea..."
                        {...register('description')}
                    />
                </div>

                {/* Grid: Categoría, Prioridad, Fecha */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className={labelClass}>Categoría *</label>
                        <select className={inputClass} {...register('category', { required: true })}>
                            {CATEGORIES.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>Prioridad *</label>
                        <select className={inputClass} {...register('priority', { required: true })}>
                            {PRIORITIES.map((priority) => (
                                <option key={priority.id} value={priority.id}>{priority.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>Fecha de vencimiento</label>
                        <input
                            type="date"
                            className={inputClass}
                            {...register('dueDate')}
                        />
                    </div>
                </div>

                {/* Botones */}
                <div className="flex gap-3 justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                            isDark
                                ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                        }`}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary disabled:opacity-50"
                    >
                        {loading
                            ? (isEditing ? 'Actualizando...' : 'Guardando...')
                            : (isEditing ? 'Actualizar' : 'Crear Tarea')
                        }
                    </button>
                </div>
            </form>
        </div>
    );
}