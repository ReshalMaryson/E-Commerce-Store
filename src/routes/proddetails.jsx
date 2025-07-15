import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import cart_image from "../assets/images/cart.png";
import "../css/proddetails.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/checkauth";

export default function ProdDetails() {
  const { isAuthenticated, userid } = useContext(AuthContext);

  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams(); // product id
  const [product, setProduct] = useState(null);
  const [prod_price, setProdPrice] = useState(null);
  // const get_id = id;
  const [cart_name, setCartname] = useState(null);
  useEffect(() => {
    getprod();
  }, []);

  function increaseCount() {
    setQuantity((prev) => prev + 1);
    setProdPrice((prev) => prev + prev);
  }

  function decreaseCount() {
    setQuantity((prev) => {
      if (prev > 1) {
        setProdPrice((prevPrice) => {
          return prevPrice - product.price === 0
            ? product.price
            : prevPrice - product.price;
        });
        return prev - 1;
      } else {
        return 1;
      }
    });
  }

  // product request.
  function getprod() {
    const obj_id = {
      id: id,
    };

    const send = JSON.stringify(obj_id);

    fetch(
      "http://localhost/API/react/e-commerce-store/The-Store/backend/class/proddetail.php",
      {
        method: "POST",
        body: send,
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
          setProduct(result.data);
          setCartname(result.data.name);
          setProdPrice(result.data.price);
        } else {
          console.error(result.message);
        }
      })
      .catch((error) => {
        console.error(`ERROR : ${error}`);
      });
  }

  function addtocart() {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    } else {
      const send_data = {
        prod_id: id,
        user_id: userid,
        prod_name: product.name,
        prod_price: product.price,
        quantity: quantity,
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
      <div>
        {product ? (
          <>
            <div className="container">
              <div className="p_image">
                <img
                  src={`../../backend/uploads/product/${product.image}`}
                  alt=""
                />
              </div>

              <div className="p_info">
                <div className="info_name">
                  <p className="info_value"> {product.name}</p>
                </div>
                <div className="info_desc">
                  <p className="info_value"> {product.description}</p>
                </div>
                <div className="info_price">
                  <p className="info_value" style={{ fontSize: "1.2rem" }}>
                    <span style={{ fontSize: "0.8rem" }}>Rs.</span>
                    {prod_price}
                  </p>

                  <div className="quantity">
                    {product.stock > 0 ? (
                      <div className="counter">
                        <span onClick={increaseCount}>+</span>
                        <p>{quantity}</p>
                        <span onClick={decreaseCount}>-</span>
                      </div>
                    ) : (
                      <div className="counter" style={{ display: "none" }}>
                        <span onClick={increaseCount}>+</span>
                        <p>{quantity}</p>
                        <span onClick={decreaseCount}>-</span>
                      </div>
                    )}
                  </div>
                </div>

                {product.stock > 0 ? (
                  <div className="info_stock">
                    <p className="info_heading">In stock</p>
                  </div>
                ) : (
                  <div className="info_stock">
                    <p className="info_heading" style={{ color: "red" }}>
                      Out Of Stock
                    </p>
                  </div>
                )}
              </div>
            </div>
            {product.stock > 0 ? (
              <div className="buttons">
                <div className="img_cart" onClick={addtocart}>
                  <p>Add</p> <img src={cart_image} alt="" />
                </div>
              </div>
            ) : (
              <div className="buttons" style={{ display: "none" }}>
                <div className="img_cart" onClick={addtocart}>
                  <p>Add</p> <img src={cart_image} alt="" />
                </div>
              </div>
            )}{" "}
          </>
        ) : (
          <h3 style={{ textAlign: "center" }}>LOADING.....!</h3>
        )}
      </div>
    </>
  );
}
