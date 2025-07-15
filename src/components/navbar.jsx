import { Link } from "react-router-dom";
import "../css/navbar.css";
import menuLogo from "../assets/images/burgerlogo.png";
import arrow from "../assets/images/arrow.png";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./checkauth";

function Navbar() {
  const { isAuthenticated, profilePic, userid, check_auth } =
    useContext(AuthContext);

  const [isMenuopen, setisMenuopen] = useState(false);
  const [iscontrolOpen, setControl] = useState(false);

  const navigate = useNavigate();

  // DOM Functions ...sidebar
  function open_menu() {
    setisMenuopen(true);
  }

  function close_menu() {
    setisMenuopen(false);
  }

  function logout() {
    fetch(
      "http://localhost/API/react/e-commerce-store/The-Store/backend/class/logout.php",
      {
        method: "POST",
        credentials: "include",
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        if (result.status === "success") {
          check_auth();
          navigate("/");
        } else {
          console.log("Logout failed:", result.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function open_controls() {
    setControl((prev) => !prev); // this will toggle the class.
  }

  return (
    <>
      <div className="wrap_header">
        <header>
          <Link to="/" className="Link logo_link ">
            <p className="logo_text">The Store</p>
            {/* <img src={logo} alt="logo" className="logo" /> */}
          </Link>
          <div className="login">
            {isAuthenticated ? (
              <div className="loginwrapper">
                <div className="logintrue">
                  <img
                    src={`../../backend/uploads/profilePic/${profilePic}`}
                    alt=""
                    className="userprofile"
                    width="10"
                    onClick={open_controls}
                  />
                </div>
                <div
                  className={`user_controls ${iscontrolOpen ? "active" : ""} `}
                >
                  <ul>
                    <Link to={`/userprofile/${encodeURIComponent(userid)}`}>
                      {" "}
                      <li onClick={() => setControl((prev) => !prev)}>
                        Profile
                      </li>
                    </Link>
                    <Link to={`/cart/${encodeURIComponent(userid)}`}>
                      <li onClick={() => setControl((prev) => !prev)}>Cart</li>
                    </Link>
                    <li onClick={logout}> Log out</li>
                  </ul>
                </div>
              </div>
            ) : (
              <Link to="/login">
                <p
                  onClick={() => {
                    setControl(false);
                  }}
                  className="p_login"
                >
                  login
                </p>
              </Link>
            )}
          </div>
        </header>
      </div>

      <div className={`open_menu ${isMenuopen === true ? "active" : ""}`}>
        {/* open button */}
        <img
          src={menuLogo}
          className={`open ${isMenuopen === true ? "active" : ""}`}
          alt="open-menu"
          onClick={open_menu}
        ></img>{" "}
      </div>
      <div className={`menu ${isMenuopen === true ? "active" : ""} `}>
        {/* close button */}
        <img
          src={arrow}
          alt="arrow-back"
          className={`arrow-back ${isMenuopen === true ? "active" : ""}`}
          onClick={close_menu}
        />
        <ul>
          <li onClick={close_menu}>
            <Link to="/" className="Link">
              Shop+
            </Link>
          </li>
          <li onClick={close_menu}>
            <Link to="/collection" className="Link">
              Collection
            </Link>
          </li>
          <li onClick={close_menu}>
            <Link to="/admin" className="Link">
              Admin
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
export default Navbar;
