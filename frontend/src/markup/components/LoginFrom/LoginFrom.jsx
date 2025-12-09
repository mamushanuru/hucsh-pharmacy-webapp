import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../Contexts/AuthContext"; 
import "bootstrap/dist/css/bootstrap.min.css";
import "./loginform.css";

function LoginForm() {
  const { setIsLogged, setEmployee, setUser } = useAuth(); // Use the updated AuthContext
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Reset errors
    setEmailError("");
    setPasswordError("");
    setServerError("");

    // Client-side validation
    let valid = true;
    const emailRegex = /^\S+@\S+\.\S+$/;

    if (!email) {
      setEmailError("Please enter your email address.");
      valid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Invalid email format.");
      valid = false;
    }

    if (!password || password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      valid = false;
    }

    if (!valid) {
      return;
    }

    setIsLoading(true);

    try {
      // Try logging in as a user
      const userResponse = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const userData = await userResponse.json();

      if (userData.status === "success") {
        console.log("User logged in successfully:", userData);
        localStorage.setItem("user_token", userData.data.user_token);
        setIsLogged(true);
        setUser({
          user_first_name: userData.data.user_first_name,
          user_id: userData.data.user_id,
        });
        navigate("/");
        return;
      }

      // Try logging in as an employee
      const employeeResponse = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/api/employee/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const employeeData = await employeeResponse.json();

      if (employeeData.status === "success") {
        console.log("Employee logged in successfully:", employeeData);
        localStorage.setItem("employee_token", employeeData.data.employee_token);
        setIsLogged(true);
        setEmployee({
          employee_first_name: employeeData.data.employee_first_name,
          employee_id: employeeData.data.employee_id,
        });
        navigate("/");
        return;
      }

      // If neither user nor employee login succeeds
      setServerError("Invalid email or password.");
    } catch (err) {
      console.error("Login error:", err);
      setServerError("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="background-image"></div>
      <div className="login-form-wrapper">
        <div className="logo-container">
          <img
            src="../../../src/assets/images/the hu logo.png"
            alt="HUCSH Logo"
          />
          <h1>Welcome to HUCSH</h1>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">
              <strong>Email:</strong>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && (
              <div className="validation-error" role="alert">
                {emailError}
              </div>
            )}
          </div>

          <div className="form-group password-container">
            <label htmlFor="password">
              <strong>Password:</strong>
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <img
              src={
                showPassword
                  ? "../../../src/assets/styles/svgs/duotone-eye-open-svgrepo-com.svg"
                  : "../../../src/assets/styles/svgs/eye-closed-svgrepo-com (1).svg"
              }
              alt={showPassword ? "Hide Password" : "Show Password"}
              onClick={handleShowPassword}
              style={{ cursor: "pointer" }}
            />
            {passwordError && (
              <div className="validation-error" role="alert">
                {passwordError}
              </div>
            )}
          </div>

          <div className="form-group col-md-12">
            <button
              className="theme-btn btn-style-one"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>

          {serverError && (
            <div className="validation-error" role="alert">
              {serverError}
            </div>
          )}
        </form>

        <div className="existing-account-links">
          <p>
            Do not have an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;