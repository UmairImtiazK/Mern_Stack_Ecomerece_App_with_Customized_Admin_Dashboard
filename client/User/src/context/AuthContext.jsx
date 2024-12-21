import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Check localStorage on initial load to see if there's an existing user
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // Save user data in localStorage when user is set
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const signup = async (formData) => {
    try {
      console.log("FormData:", Array.from(formData.entries())); // Debug FormData
  
      const response = await axios.post("http://localhost:8000/user/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const newUser = { username: formData.get("username"), email: formData.get("email") };
      setUser(newUser);
      return response.data;
    } catch (error) {
      console.error("Signup error:", error);
      throw error.response?.data || "Signup failed!";
    }
  };

  const login = async (username, password) => {
    try {
      console.log('username: ', username, 'password: ', password);
      const response = await axios.post("http://localhost:8000/user/login", {
        username,
        password,
      });
      const userId = response.data.data.user._id;
      const { accessToken, refreshToken } = response.data.data;
      console.log('access token:', accessToken);
      const userData = { username, userId, accessToken, refreshToken };
      setUser(userData);
      console.log("user response data: ", response.data.data);
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error.response?.data || "Login failed!";
    }
  };

  const logout = () => {
    setUser(null); // This will trigger the removal from localStorage as well
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
