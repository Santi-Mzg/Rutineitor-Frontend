import type React from "react"
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

const recoverySchema = z.object({
  email: z.string().email("Invalid email address"),
})

type LoginFormData = z.infer<typeof loginSchema>
type RecoveryFormData = z.infer<typeof recoverySchema>



export default function LoginPage() {
    const navigate = useNavigate()
    const { signin, isAuthenticated, errors: authErrors, loading } = useAuth()
    const [isRecoveryOpen, setIsRecoveryOpen] = useState(false);

    const {
        register: registerLogin,
        handleSubmit: handleLoginSubmit,
        formState: { errors: loginErrors, isSubmitting: isLoginSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    })
    const {
        register: registerRecovery,
        handleSubmit: handleRecoverySubmit,
        formState: { errors: recoveryErrors, isSubmitting: isRecoverySubmitting },
        reset: resetRecovery,
    } = useForm<RecoveryFormData>({
        resolver: zodResolver(recoverySchema),
    });



    useEffect(() => {
        if (isAuthenticated) navigate('/workout')   
    }, [isAuthenticated, navigate])


    const onLoginSubmit = async (data: LoginFormData) => {
        await signin(data)
    }

    const onRecoverySubmit = async (data: RecoveryFormData) => {
        console.log("Enviar mail de recuperación a:", data.email);
        resetRecovery();
        setIsRecoveryOpen(false);
    };

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
                        <CardTitle className="text-2xl font-bold">¡Bienvenido de nuevo!</CardTitle>
                        <CardDescription>Inicia sesión para continuar con tus rutinas</CardDescription>
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

                <form onSubmit={handleLoginSubmit(onLoginSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="tu@email.com"
                            {...registerLogin("email")}
                        />
                        {loginErrors.email && (
                            <p className="text-red-500 text-sm">{loginErrors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Contraseña</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            {...registerLogin("password")}
                        />
                        {loginErrors.password && (
                            <p className="text-red-500 text-sm">{loginErrors.password.message}</p>
                        )}
                    </div>

                    <Dialog open={isRecoveryOpen} onOpenChange={setIsRecoveryOpen}>
                        <DialogTrigger asChild>
                            <button type="button" className="text-sm text-[#F8A5A5] hover:underline">
                            Olvidaste tu contraseña?
                            </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Recuperación de Contraseña</DialogTitle>
                                <DialogDescription>
                                    Ingresa tu dirección de correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleRecoverySubmit(onRecoverySubmit)} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="recovery-email">Email</Label>
                                    <Input
                                        id="recovery-email"
                                        type="email"
                                        placeholder="your@email.com"
                                        {...registerRecovery("email")}
                                    />
                                    {recoveryErrors.email && (
                                        <p className="text-sm text-red-500">{recoveryErrors.email.message}</p>
                                    )}
                                </div>
                                <Button type="submit" className="w-full bg-[#F8A5A5] text-white hover:bg-[#F8A5A5]/90" disabled={isRecoverySubmitting}>
                                    {isRecoverySubmitting ? "Enviando..." : "Enviar link de recuperación"}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                    <Button type="submit" className="w-full bg-[#F8A5A5] text-white hover:bg-[#F8A5A5]/90" disabled={isLoginSubmitting || loading}>
                        {isLoginSubmitting || loading ? "Iniciando sesión..." : "Ingresar"}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                    {"No tenés una cuenta? "}
                    <Link to="/register" className="text-[#F8A5A5] hover:underline font-medium">
                        Registrate
                    </Link>
                    </p>
                </div>
                </CardContent>
            </Card>
        </div>
    )
}
