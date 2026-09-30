import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { type ReactNode } from "react";

type SessionRouteLockProps = {
    children: ReactNode;
}

/**
 * Checks if the user has a session and if so will allow them to view the contents/page 
 * placed within the session route lock, otherwise will lock the user from typing in a URL to get
 * to specific web pages which a non user shouldn't have access to
 * @param param0 children of SessionRouteLockProps (a web page being passed through)
 * @returns children - the contents of the webpage being requested
 */
export default function SessionRouteLock({children}: SessionRouteLockProps){
    const { session, loading} = useAuth();

    //
    if (loading) {
        return <p>Page Loading!</p>
    }

    if (!session) {
        return <Navigate to = "/login" replace />;
    }

    return children;
}