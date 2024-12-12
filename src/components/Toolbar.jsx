import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

function Toolbar() {

    const { handleSubmit } = useForm()
    const { signout, user, isAuthenticated } = useAuth()
    const navigate = useNavigate()

    const onSubmit = handleSubmit(async () => {
        localStorage.clear();
        signout()
        navigate('/login')
    })

    return (
        <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
            <div className="container-fluid">
                <Link to="/workout">
                    <h1 className="navbar-brand">Rutineitor</h1>
                </Link>
                
                <Link to="/workouts-by-type">
                    <h2 className='text-lg text-gray-100 py-2 pr-2'>Filtrar Rutinas por Tipo</h2>
                </Link>

                <Link to="/workouts-by-exercise">
                    <h2 className='text-lg text-gray-100 py-2 pr-2'>Filtrar Rutinas por Ejercicio</h2>
                </Link>

                <div className="flex items-center ml-auto">
                    {isAuthenticated && (
                        <>
                            <Link to="/profile">
                                <h2 className='text-lg font-bold text-gray-600 py-2 pr-2'>{user.username}</h2>
                            </Link>
                            <form className="d-flex" onSubmit={onSubmit}>
                                <button className="btn btn-secondary my-0 my-sm-0 py-1 border-transparent text-gray-600" type="submit">
                                    <FontAwesomeIcon icon={faSignOutAlt} style={{ fontSize: '30px' }} />
                                </button>
                            </form>
                        </>
                    )}
                 </div>
            </div>
        </nav>
    )
}

export default Toolbar