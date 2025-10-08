import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { Button } from "./ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet"
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function Navbar() {
  const { handleSubmit } = useForm()
  const { signout, user, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const onSubmit = handleSubmit(async () => {
    localStorage.clear();
    signout()
    setIsOpen(false); 
    navigate('/login')
  })

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#7AC7B5] shadow-md">
      <div className="flex justify-between items-center px-4 w-full">
        {/* Desktop Navigation */}
        <Link
          to="/workout"
          className='mr-2 flex items-center'
        >
          <img
              src="/Rutineitor-Frontend/grand_logo_sm.png"
              alt="Rutineitor Logo"
              className="rounded-2xl"
          />
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm">
          {isAuthenticated && (
            <>
              <Link
                to="/profile"
                className="text-white hover:text-gray-300 transition-colors"
              >
                Mi Perfil
              </Link>
              <Link
                to="/workouts-by-type"
                className="text-white hover:text-gray-300 transition-colors"
              >
                Rutinas por Tipo
              </Link>
              <Link
                to="/workouts-by-exercise"
                className="text-white hover:text-gray-100 transition-colors"
              >
                Rutinas por Ejercicio
              </Link>
              {user?.isTrainer && (
                <Link
                  to="/users"
                  className="text-white hover:text-gray-100 transition-colors"
                >
                  Usuarios
                </Link>
              )}
            </>
          )}
        </div>

        {/* Right side - User section */}
        <div className="ml-auto flex items-center gap-2 px-3 py-3">
          <h2
            className="text-white font-bold hover:text-gray-100 transition-colors"
          >
            {user ? user.username : ""}
          </h2>

          <form className="hidden md:flex" onSubmit={onSubmit}>
            <Button className="btn btn-secondary my-0 my-sm-0 py-1 border-transparent bg-transparent text-[#f3969a]" type="submit">
                <FontAwesomeIcon icon={faSignOutAlt} style={{ fontSize: '30px' }} />
            </Button>
          </form>
        </div>

        {/* Mobile Menu */}
        {isAuthenticated && ( 
          <>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="lg"
                  className="md:hidden text-white hover:bg-[#7AC7B5] px-2 py-2 mr-0"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[240px] bg-[#98D8C8]">
                <SheetHeader>
                  <SheetTitle className="text-white">{user ? user.username : "Usuario"}</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 py-4">
                  <Link
                    to="/profile"
                    className="text-white hover:text-gray-100 transition-colors"
                  >
                    Mi Perfil
                  </Link>
                  <Link
                    to="/workouts-by-type"
                    className="text-white hover:text-gray-100 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Rutinas por Tipo
                  </Link>
                  <Link
                    to="/workouts-by-exercise"
                    className="text-white hover:text-gray-100 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Rutinas por Ejercicio
                  </Link>
                  {user?.isTrainer && (
                      <Link
                        to="/users"
                        className="text-white hover:text-gray-100 transition-colors"
                      >
                        Usuarios
                      </Link>
                  )}
                  <form className="d-flex" onSubmit={onSubmit}>
                    <Button className="btn btn-secondary my-0 my-sm-0 py-1 bg-transparent border-transparent text-[#f3969a]" type="submit">
                      <FontAwesomeIcon icon={faSignOutAlt} style={{ fontSize: '30px' }} />
                    </Button>
                  </form>
                </div>
              </SheetContent>
            </Sheet>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
