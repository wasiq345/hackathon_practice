import { createContext, useContext, useEffect, useState } from "react";

import { api } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("campus_user");

        return savedUser ? JSON.parse(savedUser) : null;
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem("campus_user", JSON.stringify(user));
        } else {
            localStorage.removeItem("campus_user");
        }
    }, [user]);

    const login = async (email, password) => {
        // Temporary frontend authentication.
        // we have to Replace this with your FastAPI login endpoint later.

        const isStaff = email.toLowerCase().includes("staff");

        const loggedInUser = await api.login({ email, password, isStaff });

        setUser(loggedInUser);

        return loggedInUser;
    };

    const register = async (name, email, password) => {
        const newUser = await api.register({ name, email, password });

        setUser(newUser);

        return newUser;
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
