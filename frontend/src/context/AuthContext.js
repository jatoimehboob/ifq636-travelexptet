import React, {
  createContext,
  useState,
  useContext,
  useEffect,
} from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  useEffect(() => {

    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

  }, []);

  const login = (userData) => {

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    if (userData.token) {

      localStorage.setItem(
        "token",
        userData.token
      );
    }

    setUser(userData);
  };

  const logout = () => {

    localStorage.removeItem("user");

    localStorage.removeItem("token");

    setUser(null);
  };

  return (

    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >

      {children}

    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);