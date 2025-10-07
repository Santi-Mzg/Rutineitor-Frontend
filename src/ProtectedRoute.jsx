import { useAuth } from "./context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
    const { loading, isAuthenticated } = useAuth()

    if (!loading && !isAuthenticated)
        return <Navigate to='/login' replace />

    return <Outlet />
}