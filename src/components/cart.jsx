import "../css/cart.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import deleteicon from "../assets/images/cart.png";

export default function Cart() {
  const [cartItem, setCartitem] = useState([]);
  const [totalprice, setTotalprice] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    getcart();
  }, []);

  function getcart() {
    const send_data = {
      id: id,
    };
    const data = JSON.stringify(send_data);
    fetch(
      "http://localhost/API/react/e-commerce-store/The-Store/backend/class/getcart.php",
      {
        method: "POST",
        body: data,
        headers: { "Content-Type": "applicatio/json" },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("HTTP ERROR! " + response.status);
        } else {
          return response.json();
        }
      })
      .then((result) => {
        if (result.status === "success") {
          setCartitem(result.data);
          setTotalprice(result.totalprice);
        } else {
          console.error(result.message);
        }
      })
      .catch((error) => {
        console.error(`ERROR : ${error}`);
      });
  }

  function clearcart() {
    const send_data = {
      user_id: id,
    };

    const data = JSON.stringify(send_data);
    fetch(
      "http://localhost/API/react/e-commerce-store/The-Store/backend/class/clearcart.php",
      {
        method: "DELETE",
        body: data,
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("HTTP ERROR! " + response.status);
        } else {
          return response.json();
        }
      })
      .then((result) => {
        if (result.status === "success") {
          setCartitem([]);
          setTotalprice(0);
          setTimeout(() => getcart(), 150);
        } else {
          console.error(result.message);
          getcart();
        }
      })
      .catch((error) => {
        console.error(`ERROR : ${error}`);
        getcart();
      });
  }

  function deletecartitem(cartid) {
    const send_data = {
      cart_id: cartid,
      user_id: id,
    };

    const data = JSON.stringify(send_data);
    fetch(
      "http://localhost/API/react/e-commerce-store/The-Store/backend/class/clearcart.php",
      {
        method: "DELETE",
        body: data,
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 404) {
          return [];
        }
        throw new Error(`HTTP Error! Status: ${response.status}`);
      })
      .then((result) => {
        if (result.status === "success") {
          getcart();
        } else {
          console.error(result.message);
          getcart();
        }
      })
      .catch((error) => {
        console.error(`ERROR : ${error}`);
        getcart();
      });
  }
  return (
    <>
      <div className="cartContainer">
        <div className="cart_heading">Cart</div>

        <div className="clearcart">
          <button onClick={clearcart}>
            <p>Clear</p> <img src={deleteicon} alt="" className="delete_img" />
          </button>
        </div>
        <div className="contentwrapper">
          {cartItem.length > 0 && id ? (
            cartItem.map((item) => (
              <div className="cart_content" key={item.id}>
                <div className="cart_item">
                  <p className="cart_heading_name content_heading">Name</p>
                  <p className="cart_item_name">{item.prod_name}.</p>
                </div>

                <div className="cart_item">
                  <p className="cart_heading_quantity content_heading"> Qty.</p>
                  <p className="cart_item_name" style={{ textAlign: "center" }}>
                    {item.quantity}
                  </p>
                </div>

                <div className="cart_item">
                  <p className="cart_heading_price content_heading">Price</p>
                  <p className="cart_item_price">{item.prod_price}</p>
                </div>

                <div className="cart_item cancle">
                  <p
                    onClick={() => {
                      deletecartitem(item.id);
                    }}
                  >
                    ❌
                  </p>
                </div>
              </div>
            ))
          ) : (
            <h4 style={{ textAlign: "center" }}> Your Cart Is Empty</h4>
          )}
        </div>

        <div className="cart_footer">
          <div className="cart_info">
            <div className="totalqty">
              <p style={{ textDecoration: "underline" }}>Total Item</p>
              <p>{cartItem.length}</p>
            </div>

            <div className="totalprice">
              <p style={{ textDecoration: "underline" }}>Total</p>
              <div className="total_wrapper">
                <p>{totalprice}</p>
                <span
                  style={{
                    fontSize: "0.6rem",
                    color: "white",
                    marginLeft: "4px",
                  }}
                  className="rs"
                >
                  Rs
                </span>
              </div>
            </div>
          </div>
          <div className="cart_button">
            <Link to={`/checkout/${encodeURIComponent(id)}`}>
              <button>check out</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
