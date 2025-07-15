import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../css/login.css";
import { AuthContext } from "../components/checkauth";

export default function Login() {
  const { check_auth } = useContext(AuthContext);
  const navigate = useNavigate();

  //input fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //error and success messages.
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  //log in request.
  function LoginUser(e) {
    e.preventDefault();
    // Clear previous errors
    setErrorMessage("");
    setSuccessMessage("");

    const obj_data = {
      email: email,
      password: password,
    };
    const data_send = JSON.stringify(obj_data);
    fetch(
      "http://localhost/API/react/e-commerce-store/The-Store/backend/class/userlogin.php",
      {
        method: "POST",
        body: data_send,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    )
      .then((response) =>
        response
          .json()
          .then((data) => ({ status: response.status, body: data }))
      )
      .then(({ status }) => {
        if (status === 200) {
          check_auth();
          setPassword("");
          setEmail("");
          navigate("/");
        } else if (status === 400) {
          setErrorMessage("Fields missing. Please fill all fields.");
        } else if (status === 409) {
          setErrorMessage("Incorrect password or Email. Try again.");
        } else if (status === 404) {
          setErrorMessage("User not found. Please sign up.");
        } else if (status === 500) {
          setErrorMessage(" Please Login Later.");
          console.log("INTERNAL ERROR OCCUERED.");
        } else {
          setErrorMessage("Unexpected error. Please try again.");
        }
      })
      .catch(() => {
        setErrorMessage(
          "Network error. Please check your connection. Or Try Again Later."
        );
      });
  }

  return (
    <>
      <div className="login-container">
        <form className="login-form">
          <h2>Login</h2>
          {/* same thing different method to render */}
          {errorMessage ? (
            <p
              style={{ color: "red", textAlign: "center", fontSize: "0.8rem" }}
            >
              {errorMessage}
            </p>
          ) : (
            ""
          )}
          {successMessage && (
            <p
              style={{
                color: "black",
                textAlign: "center",
                fontSize: "0.8rem",
              }}
            >
              {successMessage}
            </p>
          )}
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="button" className="btn" onClick={LoginUser}>
            Login
          </button>
          <div className="sign-up">
            <p>
              Don't Have an Account?{" "}
              <Link to="/signup" className="link-create">
                Create Account.
              </Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}
