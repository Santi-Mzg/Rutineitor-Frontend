import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoadingOverlay from "./components/ui/loading-overlay";
import { useAuth } from "./context/AuthContext";

export default function Layout() {
  const { loading } = useAuth()
   
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="relative flex-1">
        <LoadingOverlay
          isLoading={loading}
          message="Cargando..."
          size="lg"
          variant="overlay"
        />
        <Outlet />
      </div>
    </div>
  )
}