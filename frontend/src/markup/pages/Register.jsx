import { useState } from "react";
import userService from "../../services/user.service.jsx";
import { Link, useNavigate } from "react-router-dom";
import rotator from '../../assets/images/loading-spinner.gif';
import "./register.css";

function Register() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleShowPassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    const formData = {
      user_email: email,
      user_first_name: firstName,
      user_last_name: lastName,
      user_phone: phone,
      user_password: password,
      active_user: 1,
    };

    try {
      const response = await userService.createUser(formData);
      const data = await response.json();

      if (response.ok) {
        console.log("User created successfully:", data);
        setSuccess(true);
        setTimeout(() => {
          navigate("/login"); // Redirect to login page using navigate
        }, 2000); // Wait 2 seconds before redirecting
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("An error occurred during registration:", err);
      setError("An error occurred during registration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="background-image">
        {/* Background image here */}
      </div>
      <div className="register-form-wrapper">
        <div className="logo-container">
          <img src="../../../src/assets/images/the hu logo.png" alt="HUCSH Logo" />
          <h1>Welcome to HUCSH</h1>
        </div>
        <form className="register-form" onSubmit={handleSubmit}>
          {[
            { label: "First Name", value: firstName, setter: setFirstName, type: "text" },
            { label: "Last Name", value: lastName, setter: setLastName, type: "text" },
            { label: "Email", value: email, setter: setEmail, type: "email" },
            { label: "Phone Number", value: phone, setter: setPhone, type: "tel", optional: true },
          ].map((input, index) => (
            <div className="form-group" key={index}>
              <label htmlFor={input.label.toLowerCase().replace(" ", "")}>
                <strong>{input.label}:</strong>
              </label>
              <input
                type={input.type}
                id={input.label.toLowerCase().replace(" ", "")}
                value={input.value}
                onChange={(e) => input.setter(e.target.value)}
                placeholder={`Enter your ${input.label.toLowerCase()}`}
                required={!input.optional}
              />
            </div>
          ))}
          <div className="form-group password-container">
            <label htmlFor="password">
              <strong>Password:</strong>
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
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
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && (
            <div className="alert alert-success">
              Registration successful! Redirecting to login...
            </div>
          )}
          <button type="submit" disabled={isLoading}>
            {isLoading ? (
              <img src={rotator} alt="Loading..." style={{ width: "20px", height: "20px" }} />
            ) : (
              "Register"
            )}
          </button>
        </form>
        <div className="existing-account-links">
          <p>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;