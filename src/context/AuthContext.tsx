import { getCurrentUser } from "@/lib/Appwrite/api";
import { IContextType, IUser } from "@/types";
import { Navigate, useNavigate } from "react-router-dom";
import { createContext, useContext, useEffect, useState } from "react";

export const INITIAL_USER = {
    id: '',
    name: '',
    username: '',
    email: '',
    imageUrl: '',
    bio: '',
};

export const INITIAL_STATE = {
    user: INITIAL_USER,
    isLoading: false,
    isAuthenticated: false,
    setUser: () => { },
    setIsAuthenticated: () => { },
    checkAuthUser: async () => false as boolean,
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<IUser>(INITIAL_USER);
    const [isLoading, setIsLoading] = useState<boolean>(true);  // Start with loading
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const navigate = useNavigate();

    const checkAuthUser = async () => {
        try {
            const currentAccount = await getCurrentUser();
            if (currentAccount) {
                setUser({
                    id: currentAccount.$id,
                    name: currentAccount.name,
                    username: currentAccount.username,
                    email: currentAccount.email,
                    imageUrl: currentAccount.imageUrl,
                    bio: currentAccount.bio,
                });
                setIsAuthenticated(true);
                return true;
            } else {
                setIsAuthenticated(false);
                return false;
            }
        } catch (error) {
            console.log("Error checking auth:", error);
            setIsAuthenticated(false);
            return false;
        } finally {
            setIsLoading(false);  // Set loading to false after the check
        }
    };

    // useEffect(() => {
    //     checkAuthUser();
    //     // const checkAuth = async () => {
    //     //     const isAuthenticated = await checkAuthUser();
    //     //     if (!isAuthenticated) {
    //     //         navigate("/sign-in");
    //     //     }
    //     // };

    //     // // Only call checkAuth once when the component mounts
    //     // checkAuth();
    // }, [navigate]);

    const value = {
        user,
        setUser,
        isLoading,
        setIsLoading,
        isAuthenticated,
        setIsAuthenticated,
        checkAuthUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {isLoading ? children : <p>Loading...</p>} {/* Optionally show a loader */}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export const useUserContext = () => useContext(AuthContext);
