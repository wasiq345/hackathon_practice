import { createContext, useContext, useEffect, useState } from "react";

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
        // Replace this with your FastAPI login endpoint later.

        const isStaff = email.toLowerCase().includes("staff");

        const loggedInUser = {
            id: isStaff ? 2 : 1,
            name: isStaff ? "Daria Staff" : "Ali Khan",
            email,
            role: isStaff ? "staff" : "student",
        };

        setUser(loggedInUser);

        return loggedInUser;
    };

    const register = async (name, email, password) => {
        const newUser = {
            id: Date.now(),
            name,
            email,
            role: "student",
        };

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
