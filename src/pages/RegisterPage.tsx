import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod";

const registerSchema = z.object({
    username: z.string().min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
    email: z.email("Dirección de correo electrónico no válida"),
    password: z.string().min(5, "La contraseña debe tener al menos 5 caracteres"),
    confirmPassword: z.string().min(5, "La contraseña debe tener al menos 5 caracteres"),
    age: z.string().optional(),
    weight: z.string().optional(),
    height: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
})

type RegisterFormData = z.infer<typeof registerSchema>



export default function RegisterPage() {
    const navigate = useNavigate()
    const { signup, isAuthenticated, errors: authErrors, loading } = useAuth()

    const {
        register: registerSignup,
        handleSubmit: handleRegisterSubmit,
        formState: { errors: registerErrors, isSubmitting: isRegisteringSubmitting },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    })

    useEffect(() => {
        if (isAuthenticated) navigate('/workout')   
    }, [isAuthenticated, navigate])


    const onRegisterSubmit = async (data: RegisterFormData) => {
        await signup(data)
    }


    return (
        <div className="min-h-screen bg-[#98D8C8] flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-4 flex flex-col items-center">
                    <img
                        src="/Rutineitor-Frontend/grand_logo.png"
                        alt="Rutineitor Logo"
                        className="rounded-3xl"
                    />
                    <div className="text-center">
                        <CardTitle className="text-2xl font-bold">Create una Cuenta</CardTitle>
                        <CardDescription>¡Únete y comienza tu transformación!</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                {authErrors.length > 0 && (
                    <div className="bg-red-500 text-white text-center p-2 mb-4 rounded-md">
                        {authErrors.map((err, i) => (
                            <p key={i}>{err}</p>
                        ))}
                    </div>
                )}

                <form onSubmit={handleRegisterSubmit(onRegisterSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="username">Nombre de Usuario</Label>
                        <Input
                            id="username"
                            type="text"
                            {...registerSignup("username")}
                        />
                        {registerErrors.username && (
                            <p className="text-red-500 text-sm">{registerErrors.username.message}</p>
                        )}
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="tu@email.com"
                            {...registerSignup("email")}
                        />
                        {registerErrors.email && (
                            <p className="text-red-500 text-sm">{registerErrors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Contraseña</Label>
                        <Input
                            id="password"
                            type="password"
                            {...registerSignup("password")}
                        />
                        {registerErrors.password && (
                            <p className="text-red-500 text-sm">{registerErrors.password.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                        <Input
                            id="confirm-password"
                            type="password"
                            {...registerSignup("confirmPassword")}
                        />
                        {registerErrors.confirmPassword && (
                            <p className="text-red-500 text-sm">{registerErrors.confirmPassword.message}</p>
                        )}
                    </div>
                    
                    <Button type="submit" className="w-full bg-[#F8A5A5] text-white hover:bg-[#F8A5A5]/90" disabled={isRegisteringSubmitting || loading}>
                        {isRegisteringSubmitting || loading ? "Creando Cuenta Nueva..." : "Crear cuenta"}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                    {"Ya tenés una cuenta? "}
                    <Link to="/login" className="text-[#F8A5A5] hover:underline font-medium">
                        Iniciar sesión
                    </Link>
                    </p>
                </div>
                </CardContent>
            </Card>
        </div>
    )
}
