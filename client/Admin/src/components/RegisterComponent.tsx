// *********************
// Role of the component: Register component that displays the registration form with email, password, and confirm password fields and buttons for registration with Google and GitHub
// Name of the component: RegisterComponent.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <RegisterComponent />
// Input parameters: no input parameters
// Output: RegisterComponent component that contains input fields for email, password, and confirm password, and buttons for registration with Google and GitHub
// *********************

import { FaReact } from "react-icons/fa6";
import { FaGoogle } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa6";
import  axios  from "axios";
import {
  InputWithLabel,
  SimpleInput,
  ThirdPartyAuthButton
} from "../components";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import { useState } from "react";

const RegisterComponent = () => {
  const [username, setUsername] = useState(""); // Start with empty username
  const [email, setEmail] = useState(""); // Start with empty email
  const [password, setPassword] = useState(""); // Start with empty password
  const [avatar, setAvatar] = useState(null); // State for avatar
  const [error, setError] = useState({}); // Change to an object for multiple error messages
  const [loading, setLoading] = useState(false);

  const signup = async (formData) => {
    try {
      console.log("FormData:", Array.from(formData.entries())); // Debug FormData

      const response = await axios.post(
        "http://localhost:8000/admin/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Signup error:", error);
      throw error.response?.data || "Signup failed!";
    }
  };

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setAvatar(null); // Reset avatar
    setError({});
  };

  // Focus on the username input field when the component mounts
  const handleSubmit = async (e) => {
    console.log("in handlesubmit");
    e.preventDefault();
    setError({}); // Reset errors

    let RegexName = /^[A-Za-z]+$/;
    let RegexEmail = /^\S+@\S+\.\S+$/; // Fix the email regex
    let RegexPassword = /^\S+$/;

    let validation = {};

    if (!username.trim()) {
      validation.username = "User Name is required";
    } else if (!username.match(RegexName)) {
      validation.username = "Invalid name entered";
    }

    if (!email.trim()) {
      validation.email = "Email is required";
    } else if (!email.match(RegexEmail)) {
      validation.email = "Invalid email entered";
    }
    if (!avatar) {
      validation.avatar = "Avatar is required";
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

        const formData = new FormData();
        formData.append("username", username);
        formData.append("email", email);
        formData.append("password", password);
        if (avatar) {
          formData.append("avatar", avatar);
        }

        await signup(formData);
        alert("Signup successful");

        resetForm();
      }
    } catch (err) {
      setError({ general: err.message || "An error occurred" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[500px] h-[800px] dark:bg-gray-900 bg-white flex flex-col justify-between items-center py-10 max-sm:w-[400px] max-[420px]:w-[320px] max-sm:h-[750px]">
      <div className="flex flex-col items-center gap-10">
        <FaReact className="text-5xl dark:text-whiteSecondary text-blackPrimary hover:rotate-180 hover:duration-1000 hover:ease-in-out cursor-pointer max-sm:text-4xl" />
        <h2 className="text-2xl dark:text-whiteSecondary text-blackPrimary font-medium max-sm:text-xl">
          Register on the dashboard!
        </h2>
        <div className="flex gap-5">
          <ThirdPartyAuthButton>
            {" "}
            <FaGoogle className="text-2xl max-sm:text-xl" />
          </ThirdPartyAuthButton>
          <ThirdPartyAuthButton>
            <FaGithub className="text-2xl max-sm:text-xl" />
          </ThirdPartyAuthButton>
        </div>

        <p className="dark:text-gray-400 text-gray-700 text-xl max-sm:text-base">
          OR
        </p>

        <div className="w-full flex flex-col gap-5">
          <InputWithLabel label="Username">
            <SimpleInput
              type="text"
              placeholder="Enter a username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </InputWithLabel>

          <InputWithLabel label="Email">
            <SimpleInput
              type="email"
              placeholder="Enter a email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          <input
            type="file"
            onChange={(e) => setAvatar(e.target.files[0])}
            className="inputBox"
            accept="image/*" // Only allow image files
            required
          />
        </div>

        <Link
          onClick={handleSubmit}
          to="/login"
          className={`dark:bg-whiteSecondary bg-blackPrimary w-full py-full text-lg dark:hover:bg-white hover:bg-gray-800 bg-blackPrimary duration-200 flex items-center justify-center gap-x-2`}
        >
          <span className="dark:text-blackPrimary text-whiteSecondary font-semibold">
            Register now
          </span>
        </Link>
        <p className="dark:text-gray-400 text-gray-700 text-base cursor-pointer transition-colors flex gap-1 items-center max-sm:text-sm">
          Have an account?{" "}
          <Link
            to="/login"
            className="dark:text-whiteSecondary text-blackPrimary hover:text-black flex gap-1 items-center dark:hover:text-white max-sm:text-sm hover:underline"
          >
            Login <FaArrowRight className="mt-[2px]" />
          </Link>
        </p>
      </div>
    </div>
  );
};
export default RegisterComponent;
