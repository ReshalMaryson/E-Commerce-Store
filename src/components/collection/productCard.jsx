import "../../css/productcard.css";
import cart from "../../assets/images/cart.png";
import { Link } from "react-router-dom";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../checkauth";

export default function ProdCard({ id, name, price, image, stock }) {
  const { isAuthenticated, userid } = useContext(AuthContext);
  const navigate = useNavigate();

  function addtocart() {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      const send_data = {
        prod_id: id,
        user_id: userid,
        prod_name: name,
        prod_price: price,
        quantity: 1,
      };
      const data = JSON.stringify(send_data);

      fetch(
        "http://localhost/API/react/e-commerce-store/The-Store/backend/class/addtocart.php",
        {
          method: "POST",
          body: data,
          headers: { "Content-Type": "application/json" },
        }
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
          } else {
            console.error(result.message);
          }
        })
        .catch((error) => {
          console.error(`ERROR : ${error}`);
        });
    }
  }
  return (
    <>
      <div className="productcard">
        <Link className="LINK" to={`/product/${encodeURIComponent(id)}`}>
          <div className="prod_image">
            <img
              src={`../../../backend/uploads/product/${image}`}
              alt=""
              className="prod_img"
            />
          </div>
          <div className="prod_details">
            <p className="p_name">{name}.</p>
            <p className="p_price">Rs.{price}</p>
          </div>
        </Link>
        {stock === 0 ? (
          <div className="cart">
            <button className="addtocart">
              <p>Out Of Stock</p>
            </button>
          </div>
        ) : (
          <div className="cart" onClick={addtocart}>
            <button className="addtocart">
              <p>Add</p> <img src={cart} width="15" alt="" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// onClick={addcart(id, name, price)}
