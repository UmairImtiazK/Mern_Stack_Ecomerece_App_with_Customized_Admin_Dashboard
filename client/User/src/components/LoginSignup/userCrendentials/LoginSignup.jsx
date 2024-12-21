import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaMailBulk, FaLock, FaUser } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext.jsx";
import Loader from "../../loader/Loader.jsx"; // Import loader
import "./styles.css";

function LoginSignup() {
  const [action, setAction] = useState("Login"); // Default to Login
  const [username, setUsername] = useState(""); // Start with empty username
  const [email, setEmail] = useState(""); // Start with empty email
  const [password, setPassword] = useState(""); // Start with empty password
  const [avatar, setAvatar] = useState(null); // State for avatar
  const [error, setError] = useState({}); // Change to an object for multiple error messages
  const [loading, setLoading] = useState(false); // Loading state
  const { signup, login } = useAuth();
  const navigate = useNavigate();
  const usernameRef = useRef(null); // Ref for focusing the input
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (e) => {
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

    if (action === "SignUp") {
      if (!email.trim()) {
        validation.email = "Email is required";
      } else if (!email.match(RegexEmail)) {
        validation.email = "Invalid email entered";
      }
      if (!avatar) {
        validation.avatar = "Avatar is required";
      }
    }

    if (!password.trim()) {
      validation.password = "Password is required";
    } else if (!RegexPassword.test(password)) {
      validation.password = "Invalid password entered";
    }

    setError(validation);

    if (Object.keys(validation).length > 0) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true); // Show loader when processing
      if (action === "SignUp") {
        const formData = new FormData();
        formData.append("username", username);
        formData.append("email", email);
        formData.append("password", password);
        if (avatar) {
          formData.append("avatar", avatar);
        }

        await signup(formData);
        setLoading(false);
        alert("Signup successful");
        setAction("Login");
      } else {
        await login(username, password);
        setLoading(false);
        alert("Login successful");
        navigate("/home");
      }
      resetForm();
    } catch (err) {
      setError({ general: err.message || "An error occurred" });
    } finally {
      setLoading(false); // Hide loader after processing
    }
  };

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setEmail(action === "SignUp" ? "" : email); // Reset email only for signup
    setAvatar(null); // Reset avatar
    setError({});
  };

  if (!isOpen) return null;

  return (
    <div className="login_parent">
    <div className="login-signup-container">
      {loading && <div className="overlay-loader"><Loader /></div>} {/* Loader overlay */}

      <form className="topCont" onSubmit={handleSubmit}>
        <div className="btn_cont">
          <button className="btn_close" onClick={handleClose}>
            &times;
          </button>
        </div>
        <div className="HeadingCont">
          <h1>
            {action} <hr />
          </h1>
        </div>
        <div className="inputfieldCont">
          <div className="inputCont">
            <FaUser />
            <input
              ref={usernameRef} // Attach ref for focusing
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              type="text"
              required // Make it required
            />
          </div>
          {error.username && <span className="errorShow">{error.username}</span>}{" "}
          {/* Show username error */}
          {action === "SignUp" && (
            <div className="inputCont">
              <FaMailBulk />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                type="email"
                required // Make it required
              />
            </div>
          )}
          {error.email && <span className="errorShow">{error.email}</span>}{" "}
          {/* Show email error */}
          <div className="inputCont">
            <FaLock />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              required // Make it required
            />
          </div>
          {error.password && <span className="errorShow">{error.password}</span>}{" "}
          {/* Show password error */}
          {action === "SignUp" && (
            <div className="inputCont">
              <input
                type="file"
                onChange={(e) => setAvatar(e.target.files[0])}
                className="inputBox"
                accept="image/*" // Only allow image files
                required // Make it required
              />
            </div>
          )}
          {error.avatar && <span className="errorShow">{error.avatar}</span>}{" "}
          {/* Show avatar error */}
        </div>
        <div className="btnCont">
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Processing..." : action}
          </button>

          <button
            type="button"
            className="btn"
            onClick={() => setAction(action === "SignUp" ? "Login" : "SignUp")}
          >
            Switch to {action === "SignUp" ? "Login" : "SignUp"}
          </button>
        </div>
      </form>
    </div>
    </div>
  );
}

export default LoginSignup;
