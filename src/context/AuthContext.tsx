import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { registerRequest, loginRequest, logoutRequest, modifyRequest, verifyTokenRequest } from '../api/auth.js';
import { UserSigninPayloadType, UserSignupPayloadType, UserType } from '../lib/definitions.js';

interface AuthContextType {
    signup: (user: UserSignupPayloadType) => Promise<void>;
    signin: (user: UserSigninPayloadType) => Promise<void>;
    signout: () => Promise<void>;
    modify: (user: UserType) => Promise<void>;
    loading: boolean;
    user: UserType | null;
        isAuthenticated: boolean;
    errors: string[];
    }
interface AuthProviderProps {
    children: ReactNode;
}


export const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error("useAuth must be used within an AuthProvider")
    return context
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<UserType | null>(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [errors, setErrors] = useState<string[]>([])
    const [loading, setLoading] = useState(true)

    const signup = async (user: UserSignupPayloadType) => {
        try {
            const res = await registerRequest(user)
            setUser(res.data)
            setIsAuthenticated(true)

        } catch (error: any) {
            if (Array.isArray(error.response.data))
                setErrors(error.response.data)
            else
                setErrors([error.response.data.message])
            console.log(errors)
        }
    }

    const signin = async (user: UserSigninPayloadType) => {
        try {
            const res = await loginRequest(user)
            console.log("res.data "+JSON.stringify(res.data))
            setUser(res.data)
            setIsAuthenticated(true)

        } catch (error: any) {
            if (Array.isArray(error.response.data)){
                setErrors(error.response.data)
            }
            else{
                setErrors([error.response.data.message])
            }
            console.log(errors)
        }
    }

    const signout = async () => {
        try {
            await logoutRequest()
            setUser(null)
            setIsAuthenticated(false)

        } catch (error: any) {
            if (Array.isArray(error.response.data)){
                setErrors(error.response.data)
            }
            else{
                setErrors([error.response.data.message])
            }
            console.log(errors)
        }
    }

    const modify = async (user: UserType) => {
        try {
            console.log(JSON.stringify(user))
            const res = await modifyRequest(user)
            setUser(res.data)
        } catch (error: any) {
            if (Array.isArray(error.response.data)){
                setErrors(error.response.data)
            }
            else{
                setErrors([error.response.data.message])
            }
            console.log(errors)
        }
    }

    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => {
                setErrors([])
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [errors])

    useEffect(() => {
        async function checkLogin() {
            try {
                const res = await verifyTokenRequest()
                if (!res.data) {
                    setIsAuthenticated(false)
                    setLoading(false)
                    return
                }

                setIsAuthenticated(true)
                setUser(res.data)
                setLoading(false)
            } catch (error) {
                setIsAuthenticated(false)
                setUser(null)
                setLoading(false)
            }
        }
        checkLogin()
    }, [])

    return (
        <AuthContext.Provider
            value={{
                signup,
                signin,
                signout,
                modify,
                loading,
                user,
                isAuthenticated,
                errors
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}