import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { type Session, type User } from "@supabase/supabase-js";
import supabase from "@/lib/supabase-frontend";

/**
 * The context object hodling the session data we are checking such as the session itself, which user
 * which user is logged in, and whether or not we are in a state of loading
 */
type AuthContextType = {
    session: Session | null;
    user: User | null;
    loading: boolean;
}

// The default values of the context until AuthProvider mounts and supplies it with data
const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    loading: true
});

/**
 * Wraps the contents within app and provides a live authentication state
 * to every component nested within with data on the session, current user, and the loading state.
 * 
 * This is to track the state of whether a user is logged in or out in 
 * order to handle session properly in real time. 
 * 
 * @param children The components within the AuthProvider which includes
 * all of the webpages in the application including browser router and all the routes
 * @returns The children wrapped in AuthContext.Provier so that they can
 * read session, user, and loading data from useAuth().
 */
export function AuthProvider({children}: { children: ReactNode}){
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: {session} }) => {
            setSession(session);
            setLoading(false);
        });
        
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => listener.subscription.unsubscribe();
    }, []);
    
    const  value: AuthContextType = {
        session,
        user: session?.user ?? null,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * A hook used the access the shared auth state containing data on 
 * the current session, logged in user, and loading state,
 *  from anything nested within AuthProvider.
 * 
 * @returns the values for the current session, user, and loading state 
 * from AuthContext
 */
export function useAuth() {
    return useContext(AuthContext);
}