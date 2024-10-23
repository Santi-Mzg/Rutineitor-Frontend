import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';


export default function RegisterPage() {

    const { register, handleSubmit, formState: { errors } } = useForm()
    const { signup, isAuthenticated, errors: registerErrors } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (isAuthenticated) navigate('/workout')
    }, [isAuthenticated])

    const onSubmit = handleSubmit(async (values) => {
        signup(values)
    })

    return (
        <div className='flex h-screen items-center justify-center'>
            <div className='bg-zinc-800 max-w-md p-10 rounded-md'>
                {registerErrors.map((error, i) => (
                    <div className='bg-red-500 p-2 text-white text-center my-2' key={i}>
                        {error}
                    </div>
                ))}
                <h1 className='text-2xl font-bold text-white text-center'>Registrarse</h1>

                <form onSubmit={onSubmit}>
                    <input
                        type='text'
                        {...register('username', { required: true })}
                        className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
                        placeholder='Nombre de Usuario' />
                    {errors.username && <p className='text-red-500'>Ingrese un nombre de usuario</p>}

                    <input type='email'
                        {...register('email', { required: true })}
                        className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
                        placeholder='Email' />
                    {errors.email && <p className='text-red-500'>Ingrese un email</p>}

                    <input
                        type='password'
                        {...register('password', { required: true })}
                        className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
                        placeholder='Contraseña' />
                    {errors.password && <p className='text-red-500'>Ingrese una contraseña</p>}

                    <button type='submit'>
                        Crear cuenta
                    </button>
                </form>

                <p className='flex gap-x-2 justify-center'>
                    ¿Ya tienes una cuenta?
                    <Link to="/login" className='text-sky-500'>Inicia sesión</Link>
                </p>
            </div>
        </div>

    );
};
