import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";

import { AuthContextType, FormData, User } from "@/types";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext({} as AuthContextType);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const navigate = useNavigate();

  const login = async (formData: FormData) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/login/",
        formData,
      );
      
      const userInfo = {
        accessToken: response.data.access,
        refreshToken: response.data.refresh,
        username: response.data.username,
        email: response.data.email,
      };

      localStorage.setItem("userInfo", JSON.stringify(userInfo));

      setUser(userInfo);
      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const logout = async () => {
    const user = JSON.parse(localStorage.getItem("userInfo") || "{}");
    try {
      await axios.post(
        "http://localhost:8000/api/logout/",
        { refresh_token: user.refreshToken },
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        },
      );
      localStorage.removeItem("userInfo");
      setUser(null);
      navigate("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const info = JSON.parse(userInfo);
      setUser(info);
      navigate("/");
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { useAuth, AuthProvider };
