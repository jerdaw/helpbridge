import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { ServiceFormData } from '@/lib/schemas';
import FormField from './FormField';

interface BasicInfoSectionProps {
    register: UseFormRegister<ServiceFormData>;
    errors: FieldErrors<ServiceFormData>;
}

export default function BasicInfoSection({ register, errors }: BasicInfoSectionProps) {
    return (
        <div className="space-y-6 rounded-lg bg-white p-6 shadow-sm dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <h3 className="text-lg font-medium leading-6 text-neutral-900 dark:text-white">Basic Information</h3>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <FormField label="Service Name" error={errors.name?.message} className="sm:col-span-2">
                    <input
                        {...register('name')}
                        type="text"
                        className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white sm:text-sm"
                    />
                </FormField>

                <FormField label="Description" error={errors.description?.message} className="sm:col-span-2">
                    <textarea
                        {...register('description')}
                        rows={4}
                        className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white sm:text-sm"
                    />
                </FormField>

                <FormField label="Category" error={errors.category?.message}>
                    <select
                        {...register('category')}
                        className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white sm:text-sm"
                    >
                        <option value="Food">Food</option>
                        <option value="Housing">Housing</option>
                        <option value="Health">Health</option>
                        <option value="Crisis">Crisis</option>
                        <option value="Community">Community</option>
                    </select>
                </FormField>
            </div>
        </div>
    );
}
