// src/pages/RegisterPage.tsx
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import apiClient from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
//import { Role } from '@prisma/client'; // Assuming Role enum is accessible or redefined in frontend types
// If not directly accessible, define it manually:
// type Role = 'PARENT' | 'ORGANIZER' | 'ADMIN';

enum Role {
    PARENT = 'PARENT',
    ORGANIZER = 'ORGANIZER',
    ADMIN = 'ADMIN',
}

// Define validation schema
const registerSchema = z.object({
    firstName: z.string().min(1, { message: 'First name is required' }),
    lastName: z.string().min(1, { message: 'Last name is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    role: z.nativeEnum(Role).default(Role.PARENT), // Use nativeEnum for Prisma enums
});

// Infer type
type RegisterFormInputs = z.infer<typeof registerSchema>;

// Expected API response structure (adjust if your backend returns something different)
interface RegisterResponse {
    message: string;
    user: {
        id: number;
        email: string;
        firstName: string | null;
        lastName: string | null;
        role: Role;
    }
    // Optionally include access_token if backend logs user in immediately
    // access_token?: string;
}


const RegisterPage: React.FC = () => {
    // const setAuth = useAuthStore((state) => state.setAuth); // Use if backend logs in on register
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<RegisterFormInputs>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            role: Role.PARENT, // Default role selection
        },
    });

    const mutation = useMutation<RegisterResponse, Error, RegisterFormInputs>({
        mutationFn: (data) => apiClient.post('/auth/register', data).then(res => res.data),
        onSuccess: (data) => {
            console.log('Registration successful:', data);
            // Optional: Log the user in automatically
            // if (data.access_token && data.user) {
            //   setAuth(data.access_token, data.user);
            // }

            // Redirect to login page after successful registration
            navigate('/login', { state: { message: 'Registration successful! Please log in.' } }); // Pass success message
        },
        onError: (error: any) => {
            console.error('Registration failed:', error);
            if (error.response?.data?.message) {
                 // Handle specific messages like 'Email already exists'
                let errorMessage = error.response.data.message;
                 // If message is an array (from class-validator), join it
                 if (Array.isArray(errorMessage)) {
                     errorMessage = errorMessage.join(', ');
                 }
                setError('root.serverError', {
                    type: String(error.response.status),
                    message: errorMessage
                });
            } else {
                setError('root.serverError', {
                    type: "NetworkError",
                    message: 'An unexpected error occurred. Please try again.'
                });
            }
        },
    });

    const onSubmit: SubmitHandler<RegisterFormInputs> = (data) => {
        mutation.mutate(data);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 -mt-16">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Create Your Account</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {errors.root?.serverError && (
                        <p className="text-sm text-red-600 bg-red-100 p-2 rounded">{errors.root.serverError.message}</p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                            <input id="firstName" type="text" {...register('firstName')} className={`mt-1 block w-full input ${errors.firstName ? 'input-error' : 'input-bordered'}`} />
                            {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                            <input id="lastName" type="text" {...register('lastName')} className={`mt-1 block w-full input ${errors.lastName ? 'input-error' : 'input-bordered'}`} />
                            {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                        <input id="email" type="email" {...register('email')} className={`mt-1 block w-full input ${errors.email ? 'input-error' : 'input-bordered'}`} />
                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input id="password" type="password" {...register('password')} className={`mt-1 block w-full input ${errors.password ? 'input-error' : 'input-bordered'}`} />
                        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Register as</label>
                        <select
                            id="role"
                            {...register('role')}
                            className={`mt-1 block w-full select ${errors.role ? 'select-error' : 'select-bordered'}`}
                        >
                            <option value={Role.PARENT}>Parent</option>
                            <option value={Role.ORGANIZER}>Event Organizer</option>
                        </select>
                        {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>}
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting || mutation.isPending}
                            className="w-full btn btn-primary disabled:opacity-50"
                        >
                            {isSubmitting || mutation.isPending ? 'Registering...' : 'Register'}
                        </button>
                    </div>
                </form>
                 <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

// Helper CSS classes (add to your src/index.css or a global stylesheet if you prefer)
/*
.input { @apply px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm; }
.input-bordered { @apply border-gray-300; }
.input-error { @apply border-red-500 focus:ring-red-500 focus:border-red-500; }
.select { @apply mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md; }
.select-bordered { @apply border-gray-300; }
.select-error { @apply border-red-500 focus:ring-red-500 focus:border-red-500; }
.btn { @apply py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2; }
.btn-primary { @apply bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500; }
*/

export default RegisterPage;