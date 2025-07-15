import "../css/admin.css";
import React, { useState, useContext } from "react";
import Users from "../components/admin/users";
import Products from "../components/admin/products";
import AddProducts from "../components/admin/addProducts";
import Sales from "../components/admin/sales";
import { AuthContext } from "../components/checkauth";

export default function Admin() {
  const { isAuthenticated, user_name, check_auth } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  //sending to the other component.
  const [product, setProduct] = useState([]);
  const [users, setUSers] = useState([]);

  const [selectAddProducts, setSelectAddProducts] = useState(false);
  const [selectProducts, setSelectProducts] = useState(false);
  const [selectUsers, setSelectUsers] = useState(false);
  const [selectSales, setSales] = useState(false);

  //error and success messages.
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  function login(e) {
    e.preventDefault();

    if (username === "" || password === "") {
      setErrorMessage("Fields missing. Please fill all fields.");
    } else {
      // Clear previous errors
      setErrorMessage("");
      setSuccessMessage("");

      const obj_data = {
        username: username,
        password: password,
      };

      const data_send = JSON.stringify(obj_data);
      fetch(
        "http://localhost/API/react/e-commerce-store/The-Store/backend/class/adminlogin.php",
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
        .then(({ status, body }) => {
          console.log(body);
          if (status === 200) {
            check_auth();
            setPassword("");
          } else if (status === 400) {
            setErrorMessage("Incorrect password or username.");
          } else if (status === 409) {
            setErrorMessage("Incorrect password or username.");
          } else if (status === 404) {
            setErrorMessage("Admin not found.");
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
  }

  function toggle_Addproducts() {
    setSelectAddProducts(true);
    setSelectProducts(false);
    setSelectUsers(false);
    setSales(false);
  }

  function toggle_showproducts() {
    setSelectAddProducts(false);
    setSelectProducts(true);
    setSelectUsers(false);
    setSales(false);
  }

  function toggle_showusers() {
    setSelectUsers(true);
    setSelectAddProducts(false);
    setSelectProducts(false);
    setSales(false);
  }
  function toggle_showsales() {
    setSales(true);
    setSelectUsers(false);
    setSelectAddProducts(false);
    setSelectProducts(false);
  }

  function getProducts() {
    fetch(
      "http://localhost/API/react/e-commerce-store/The-Store/backend/class/admingetproduct.php"
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP Error! status:${response.status}`);
        } else {
          return response.json();
        }
      })
      .then((result) => {
        if (result.status === "success") {
          setProduct(result.data);
        } else {
          console.error(result.message);
        }
      })
      .catch((error) => {
        console.error(`ERROR : ${error}`);
      });
  }

  function getUsers() {
    fetch(
      "http://localhost/API/react/e-commerce-store/The-Store/backend/class/admingetuser.php"
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP Error! status:${response.status}`);
        } else {
          return response.json();
        }
      })
      .then((result) => {
        if (result.status === "success") {
          setUSers(result.data);
        } else {
          console.error(result.message);
        }
      })
      .catch((error) => {
        console.error(`ERROR : ${error}`);
      });
  }

  return (
    <>
      {user_name != "admin" ? (
        <div className="admin-login">
          <h2 className="heading">Log In As Admin</h2>

          <form>
            {/* same thing different method to render */}
            {errorMessage ? (
              <p
                style={{
                  color: "red",
                  textAlign: "center",
                  fontSize: "0.8rem",
                }}
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
            <div>
              <label htmlFor="username">Username </label>
              <input
                type="text"
                name="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
            </div>
            <br />
            <div>
              <label htmlFor="password">Password </label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <br />
            </div>
            <button type="button" className="btn_login btn" onClick={login}>
              LOG - IN
            </button>
          </form>
        </div>
      ) : (
        <div className="admin-page">
          <h1 className="heading">Admin Panel</h1>
          <div className="controls">
            <button className="btn_addProduct btn" onClick={toggle_Addproducts}>
              Add Product
            </button>
            <button
              className="btn_show_products btn "
              onClick={toggle_showproducts}
            >
              Products
            </button>
            <button className="btn_show_users btn" onClick={toggle_showusers}>
              Users
            </button>
            <button
              type="button"
              className="btn-logout btn"
              onClick={toggle_showsales}
            >
              Sales
            </button>
          </div>

          <div className="selected_control">
            <div className={`show_users ${selectUsers ? "active" : ""}`}>
              <Users getUsers={getUsers} users={users} />
            </div>
            <div className={`show_products ${selectProducts ? "active" : ""}`}>
              <Products GetProducts={getProducts} product={product} />
            </div>
            <div
              className={`add_products ${selectAddProducts ? "active" : ""}`}
            >
              <AddProducts GetProducts={getProducts} />
            </div>
            <div className={`show_sales ${selectSales ? "active" : ""}`}>
              <Sales />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
