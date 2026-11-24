import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { type ReactNode } from "react";

type AdminRouteLockProps = {
    children: ReactNode;
}

export default function AdminRouteLock({children}: AdminRouteLockProps){
    const {session, loading, isAdmin} = useAuth();

    if (loading) {
        return <p>Page Loading!</p>
    }

    if (!session) {
        return <Navigate to = "/login" replace />;
    }

    if (!isAdmin) {
        return <Navigate to = "/dashboard" replace />;
    }

    return children;
}