import { useAuth } from "./context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import LoadingOverlay from "./components/ui/loading-overlay";

export default function ProtectedRoute() {
    const { loading, isAuthenticated } = useAuth()

    if (loading)
        return 
            <LoadingOverlay
                isLoading={loading}
                message="Cargando..."
                size="lg"
                variant="overlay"
            />
    if (!loading && !isAuthenticated)
        return <Navigate to='/login' replace />

    return <Outlet />
}