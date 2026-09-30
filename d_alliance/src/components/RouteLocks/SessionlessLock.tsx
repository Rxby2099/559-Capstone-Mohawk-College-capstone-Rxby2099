import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { type ReactNode } from "react";

type SessionlessRouteLockProps = {
    children: ReactNode;
}

/**
 * Checks if the user has a session and if so will allow them to view the contents/page 
 * placed within the sessionless Route lock, otherwise will lock the user from typing in a URL to get
 * to specific web pages which a user shouldn't have access to like the login page
 * @param param0 children of SessionlessRouteLockProps (a web page being passed through)
 * @returns children - the contents of the webpage being requested
 */
export default function SessionlessRouteLock({children}: SessionlessRouteLockProps){
    const { session, loading} = useAuth();

    // If in loading state just display a loading message
    if (loading) {
        return <p>Page Loading!</p>
    }

    // If theres an active session and they try to get to a page like login, send them to the dashboard
    if (session) {
        return <Navigate to = "/dashboard" replace />;
    }

    return children;
}