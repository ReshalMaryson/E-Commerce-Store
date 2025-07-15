import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/signup.css";
export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ProfilePic, setProfilePic] = useState("");

  function signup(e) {
    e.preventDefault();
    const formData = new FormData();
    if (name === "" || email === "" || password === "") {
      alert("Please Provide all the Fields");
      return;
    } else {
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("profilepic", ProfilePic);
    }
    fetch(
      "http://localhost/API/react/e-commerce-store/The-Store/backend/class/createuser.php",
      {
        method: "POST",
        body: formData,
      }
    )
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(
            errorData?.message || `HTTP Error! status: ${response.status}`
          );
          return;
        } else {
          return response.json();
        }
      })
      .then((data) => {
        if (data.status === "success") {
          alert("Signed In Successfully.");
          setProfilePic(null);
          setName("");
          setEmail("");
          setPassword("");
          window.location.href = "/login";
          return;
        } else {
          console.error(data.message);
          return;
        }
      })
      .catch((error) => {
        console.error("ERROR SIGNING UP: ".error);
        alert(error.message);
        return;
      });
  }
  return (
    <>
      <div className="signup-container">
        <form className="signup-form">
          <h2>Sign-Up</h2>
          <div className="input-group">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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

          {/* <div className="input-group">
            <label className="label_dp">Profile Pic</label>
            <input
              className="input_dp"
              type="file"
              accept=".jpg, .jpeg, .png"
              onChange={(e) => {
                setProfilePic(e.target.files[0]);
              }}
            />
          </div> */}
          <button type="button" className="btn" onClick={signup}>
            Sign-Up
          </button>
          <div className="log-in">
            <p>
              Already Have an Account?
              <Link to="/login" className="link-login">
                Log-In.
              </Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}

// 123reshal
//123lazmi
