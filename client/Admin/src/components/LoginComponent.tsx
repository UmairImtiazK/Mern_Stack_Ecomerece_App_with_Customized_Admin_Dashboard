import { FaReact } from "react-icons/fa6";
import { FaGoogle } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa6";
import {
  InputWithLabel,
  SimpleInput,
  ThirdPartyAuthButton,
} from "../components";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { FaArrowRight } from "react-icons/fa6";
import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser, setError } from "../hooks/AuthSlice"; // Path to your authSlice

const LoginComponent = () => {
  const [username, setUsername] = useState(""); // Start with empty username
  const [password, setPassword] = useState(""); // Start with empty password
  const [error, setError] = useState({}); // Change to an object for multiple error messages
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate

  const login = async (username, password) => {
    try {
      const response = await axios.post("http://localhost:8000/admin/login", {
        username,
        password,
      });
      const userData = response.data; // Extract user data from response
      dispatch(setUser(userData)); // Save user in Redux and cookies
      console.log("Login successful:", userData);
      return true;
    } catch (error) {
      const errorMessage = error.response?.data || "Login failed!";
      console.error("Login error:", errorMessage);
      dispatch(setError(errorMessage)); // Save error in Redux
      return false;
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({}); // Reset errors
    console.log("In login submit");
    let RegexName = /^[A-Za-z]+$/;
    let RegexPassword = /^\S+$/;

    let validation = {};

    if (!username.trim()) {
      validation.username = "User Name is required";
    } else if (!username.match(RegexName)) {
      validation.username = "Invalid name entered";
    }

    if (!password.trim()) {
      validation.password = "Password is required";
    } else if (!RegexPassword.test(password)) {
      validation.password = "Invalid password entered";
    }

    setError(validation);

    if (Object.keys(validation).length > 0) {
      setError(validation);
      setLoading(false);
      return;
    }

    try {
      if (Object.keys(validation).length === 0) {
        setLoading(true);
        await login(username, password);
        alert("Login successful");
        resetForm();
        navigate("/dashboard"); // Redirect to the dashboard after login
      }
    } catch (err) {
      setError({ general: err.message || "An error occurred" });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setPassword("");
    setUsername("");
    setError({});
  };

  return (
    <div className="w-[500px] h-[750px] dark:bg-gray-900 bg-white flex flex-col justify-between items-center py-10 max-sm:w-[400px] max-[420px]:w-[320px] max-sm:h-[750px]">
      <div className="flex flex-col items-center gap-10">
        <FaReact className="text-5xl dark:text-whiteSecondary text-blackPrimary hover:rotate-180 hover:duration-1000 hover:ease-in-out cursor-pointer max-sm:text-4xl" />
        <h2 className="text-2xl dark:text-whiteSecondary text-blackPrimary font-medium max-sm:text-xl">
          Welcome to the dashboard!
        </h2>
        <div className="flex gap-5">
          <ThirdPartyAuthButton>
            <FaGoogle className="text-2xl max-sm:text-xl" />
          </ThirdPartyAuthButton>
          <ThirdPartyAuthButton>
            <FaGithub className="text-2xl max-sm:text-xl" />
          </ThirdPartyAuthButton>
        </div>

        <p className="dark:text-gray-400 text-gray-700 text-xl max-sm:text-base">OR</p>

        <div className="w-full flex flex-col gap-5">
          <InputWithLabel label="Username">
            <SimpleInput
              type="text"
              placeholder="Enter a Username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </InputWithLabel>

          <InputWithLabel label="Password">
            <SimpleInput
              type="password"
              placeholder="Enter a password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </InputWithLabel>
        </div>
        <p className="dark:text-gray-400 text-gray-700 text-base dark:hover:text-gray-300 hover:text-gray-600 cursor-pointer transition-colors max-sm:text-sm">
          Forgot password?
        </p>
        <button
          onClick={handleSubmit}
          className={`dark:bg-whiteSecondary bg-blackPrimary w-full py-2 text-lg dark:hover:bg-white hover:bg-gray-800 duration-200 flex items-center justify-center gap-x-2`}
        >
          <span className="dark:text-blackPrimary text-whiteSecondary font-semibold">
            Login
          </span>
        </button>
        <p className="dark:text-gray-400 text-gray-700 text-base cursor-pointer transition-colors flex gap-1 items-center max-sm:text-sm">
          Not registered yet?{" "}
          <Link
            to="/register"
            className="dark:text-whiteSecondary text-blackPrimary hover:text-black flex gap-1 items-center dark:hover:text-white max-sm:text-sm hover:underline"
          >
            Register <FaArrowRight className="mt-[2px]" />
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginComponent;
