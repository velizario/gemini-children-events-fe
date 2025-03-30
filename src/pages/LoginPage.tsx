// src/pages/LoginPage.tsx
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import apiClient from '../services/api';
import { useAuthStore } from '../stores/authStore';
import { useNavigate, Link } from 'react-router-dom'; // Import Link

// Define validation schema with Zod
const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

// Infer type from schema
type LoginFormInputs = z.infer<typeof loginSchema>;

// Define the expected API response structure
interface LoginResponse {
   access_token: string;
   user: {
      id: number;
      email: string;
      firstName: string | null;
      lastName: string | null;
      role: 'PARENT' | 'ORGANIZER' | 'ADMIN';
   }
}


const LoginPage: React.FC = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }, // Use isSubmitting from react-hook-form
    setError,
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation<LoginResponse, Error, LoginFormInputs>({ // Explicit types
    mutationFn: (data) => apiClient.post('/auth/login', data).then(res => res.data),
    onSuccess: (data) => {
      console.log('Login successful:', data);
      setAuth(data.access_token, data.user); // Save token and user info to store
      // Redirect based on role or to a default dashboard/home
      if (data.user.role === 'ORGANIZER') {
         navigate('/dashboard');
      } else {
         navigate('/events'); // Or '/' for parents
      }
    },
    onError: (error: any) => { // Handle specific errors
       console.error('Login failed:', error);
       // Check if it's an Axios error with response data
       if (error.response && error.response.data && error.response.data.message) {
          // Display server-side validation error (e.g., "Invalid credentials")
          setError('root.serverError', { // Attach error to a general 'root' or specific field
             type: String(error.response.status),
             message: error.response.data.message || 'Login failed. Please check your credentials.'
          });
       } else {
           // Generic error message
           setError('root.serverError', {
             type: "NetworkError",
             message: 'An unexpected error occurred. Please try again.'
           });
       }
     },
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    mutation.mutate(data); // Trigger the mutation
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 -mt-16"> {/* Adjust mt if needed */}
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Login to Your Account</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Display general server errors */}
          {errors.root?.serverError && (
            <p className="text-sm text-red-600 bg-red-100 p-2 rounded">{errors.root.serverError.message}</p>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register('email')}
              className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register('password')}
              className={`mt-1 block w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting || mutation.isPending} // Disable while submitting
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isSubmitting || mutation.isPending ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                Register here
            </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;