import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { ServiceFormData } from '@/lib/schemas';
import FormField from './FormField';

interface ContactSectionProps {
    register: UseFormRegister<ServiceFormData>;
    errors: FieldErrors<ServiceFormData>;
}

export default function ContactSection({ register, errors }: ContactSectionProps) {
    return (
        <div className="space-y-6 rounded-lg bg-white p-6 shadow-sm dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <h3 className="text-lg font-medium leading-6 text-neutral-900 dark:text-white">Contact & Location</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <FormField label="Address" error={errors.address?.message} className="sm:col-span-2">
                    <input
                        {...register('address')}
                        type="text"
                        className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white sm:text-sm"
                        placeholder="123 Main St, Kingston, ON"
                    />
                </FormField>

                <FormField label="Phone" error={errors.phone?.message}>
                    <input
                        {...register('phone')}
                        type="tel"
                        className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white sm:text-sm"
                    />
                </FormField>

                <FormField label="Email" error={errors.email?.message}>
                    <input
                        {...register('email')}
                        type="email"
                        className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white sm:text-sm"
                    />
                </FormField>

                <FormField label="Website URL" error={errors.url?.message} className="sm:col-span-2">
                    <input
                        {...register('url')}
                        type="url"
                        className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white sm:text-sm"
                        placeholder="https://"
                    />
                </FormField>
            </div>
        </div>
    );
}
