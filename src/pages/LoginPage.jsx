import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';

export default function LoginPage() {

    const { register, handleSubmit, formState: { errors } } = useForm()
    const { signin, isAuthenticated, errors: loginErrors } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (isAuthenticated) navigate('/workout')
    }, [isAuthenticated])

    const onSubmit = handleSubmit(data => {
        signin(data)
    })

    return (
        <div className='flex h-screen items-center justify-center'>
            <div className='bg-zinc-800 max-w-md w-full p-10 rounded-md'>
                {loginErrors.map((error, i) => (
                    <div className='bg-red-500 p-2 text-white text-center my-2' key={i}>
                        {error}
                    </div>
                ))}
                <h1 className='text-2xl font-bold text-white text-center'>Iniciar sesión</h1>
                <form onSubmit={onSubmit}>
                    <input type='text'
                        {...register('username', { required: true })}
                        className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
                        placeholder='Nombre de usuario' />
                    {errors.username && <p className='text-red-500'>Ingrese un nombre de usuario</p>}

                    <input
                        type='password'
                        {...register('password', { required: true })}
                        className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
                        placeholder='Contraseña' />
                    {errors.password && <p className='text-red-500'>Ingrese una contraseña</p>}

                    <button type='submit'>
                        Ingresar
                    </button>
                </form>

                <p className='flex gap-x-2 justify-center'>
                    ¿No tienes una cuenta? <Link to="/register" className='text-sky-500'>Registrate</Link>
                </p>
            </div>
        </div>
    );
};
