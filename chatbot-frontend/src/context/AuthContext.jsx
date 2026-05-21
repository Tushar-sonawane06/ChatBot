import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchUser = async() => {

            try {

                const response = await fetch(
                    "http://localhost:8000/auth/me",
                    {
                        credentials: "include"
                    }
                );

                const data = await response.json();

                setUser(data.user);

                console.log("logged in")
            } catch(err) {

                console.log(err);

            } finally {

                setLoading(false);

            }

        };

        fetchUser();

    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );

};

export const useAuth = () => useContext(AuthContext);