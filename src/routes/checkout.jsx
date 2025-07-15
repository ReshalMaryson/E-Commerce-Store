import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import "../css/checkout.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import cartimg from "../assets/images/cartblack.png";
import { AuthContext } from "../components/checkauth";

export default function Checkout() {
  const { isAuthenticated } = useContext(AuthContext);

  const [user, setuser] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  // DOM
  const [iscardopen, setcadopen] = useState(false);
  const [iscod, setiscod] = useState(false);
  const [iscard, setiscard] = useState(false);
  const [isbilladd_open, setBil_addopen] = useState(false);
  const [sendingorder, setsendingorder] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  //cart details
  const [totalprice, settotalprice] = useState(null);
  const [cart, setcart] = useState([]);

  // user info
  const [fname, setfname] = useState("");
  const [lname, setlname] = useState("");
  const [email, setemail] = useState("");
  const [adrress, setaddress] = useState("");
  const [city, setcity] = useState("");
  const [phone, setphone] = useState("");
  const [country, setcountry] = useState("pakistan");
  const [postalcode, setpostalcode] = useState("");

  // payment details
  const [paymehtod, setpaymethod] = useState("");
  const [cardtype, setcardtype] = useState("");
  const [billing_add, setBillingAdd] = useState("");

  // summary.
  const [shippingfee, setshippingfee] = useState(null); // from getcart()
  const [subtotal, setsubtotal] = useState(null);

  // complete order.
  useEffect(() => {
    getcheckoutuser();
    getcart();
  }, []);

  useEffect(() => {
    if (totalprice < 3000) {
      setsubtotal(totalprice + shippingfee);
    } else {
      setsubtotal(totalprice);
    }
  }, [shippingfee]);

  //search request
  function getcheckoutuser() {
    const send_data = {
      search: id,
    };
    const Data = JSON.stringify(send_data);

    fetch(
      "http://localhost/API/react/e-commerce-store/The-Store/backend/class/getprofileuser.php",
      {
        method: "POST",
        body: Data,
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
          setuser(result.users);
          setfname(result.users.name);
          setaddress(result.users.address);
          setphone(result.users.phone_number);
          setemail(result.users.email);
        } else {
          console.error(`ERROR ${result.message}`);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

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
          setcart(result.data);
          settotalprice(result.totalprice);
          if (result.totalprice > 3000) {
            setshippingfee(0);
          } else {
            setshippingfee(200);
          }
        } else {
          console.error(result.message);
        }
      })
      .catch((error) => {
        console.error(`ERROR : ${error}`);
      });
  }

  //order.
  function sendorder() {
    if (
      fname === "" ||
      email === "" ||
      country === "" ||
      adrress === "" ||
      city === "" ||
      phone === "" ||
      paymehtod === ""
    ) {
      setCheckoutError("please fill all the fields.");
      setTimeout(() => {
        setCheckoutError("");
      }, 3000);
      return;
    }
    if (cart.length < 1) {
      setCheckoutError("Your Cart is Empty.");
      setTimeout(() => {
        setCheckoutError("");
      }, 3000);
      return;
    }
    setsendingorder(true);
    const orderData = {
      userid: id,
      fname: fname,
      lname: lname,
      email: email,
      phone: phone,
      country: country,
      address: adrress,
      city: city,
      postalcode: postalcode,
      paymentMethod: paymehtod,
      cardType: cardtype ? cardtype : null,
      shippingFee: shippingfee,
      subtotal: subtotal,
      total: totalprice,
      orderItems: cart,
    };

    fetch(
      "http://localhost/API/react/e-commerce-store/The-Store/backend/class/checkout.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          clearcart();
          setsendingorder(false);
          navigate("/confirmed");
        }
      })
      .catch((error) => console.error("Error:", error));
  }

  //clear cart
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
          return true;
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
      <div className="check_container">
        <div className="cartdetails">
          {cart.length != 0 ? (
            <div>
              {" "}
              <div className="cartdetails_total cart_totalwrap">
                <p className="cartdetails_totalheading">Total</p>
                <p>Rs.{!totalprice ? 0 : totalprice}</p>
              </div>
              <div className="cartdetails_totalitems cart_totalitemswrap">
                <p className="cartdetails_totalitemheading">
                  Item<span className="span">(s)</span>
                </p>
                <p>{cart.length}</p>
              </div>
              <Link
                className="seecartlink"
                to={`/cart/${encodeURIComponent(id)}`}
              >
                <div className="seecart">
                  <img src={cartimg} width="25" alt="" />
                </div>
              </Link>{" "}
            </div>
          ) : (
            <div className="emptycart">
              {" "}
              <p style={{ textAlign: "center" }}>Your Cart is Empty ☹</p>
              <Link to="/collection" className="link_emptycart">
                <button className="emptycart_btn">Shop</button>
              </Link>
            </div>
          )}
        </div>
        <div className="checkout_info">
          <div className="personal_info">
            <p className="delivery_heading">Delivery</p>
            <div className="delivery_info country">
              <label>Country/Region*</label>
              <select
                onChange={(e) => {
                  setcountry(e.target.value);
                }}
              >
                <option value="pakistan">Pakistan</option>
                <option value="dubai">Dubai</option>
                <option value="india">India</option>
              </select>
            </div>
            <div className="info infofname">
              <label>First Name*</label>
              <input
                required
                type="text"
                className=""
                value={fname}
                onChange={(e) => {
                  setfname(e.target.value);
                }}
              />
            </div>
            <div className="info infolname">
              <label>Last Name*</label>
              <input
                type="text"
                className=""
                value={lname}
                onChange={(e) => {
                  setlname(e.target.value);
                }}
              />
            </div>
            <div className="info infoemail">
              <label>Email*</label>
              <input
                required
                type="email"
                className=""
                value={email}
                onChange={(e) => {
                  setemail(e.target.value);
                }}
              />
            </div>
            <div className="info infoaddress">
              <label>Address*</label>
              <input
                required
                type="text"
                className=""
                value={adrress}
                onChange={(e) => {
                  setaddress(e.target.value);
                }}
              />
            </div>

            <div className="info infocity">
              <label>City*</label>
              <input
                type="text"
                value={city}
                onChange={(e) => {
                  setcity(e.target.value);
                }}
              />
            </div>

            <div className="info infoapostalcode">
              <label>
                Postal code <span>(optional)</span>
              </label>
              <input
                type="text"
                className=""
                value={postalcode}
                onChange={(e) => {
                  setpostalcode(e.target.value);
                }}
              />
            </div>

            <div className="info infophone">
              <label>Phone*</label>
              <input
                type="number"
                className=""
                value={phone}
                onChange={(e) => {
                  setphone(e.target.value);
                }}
              />
            </div>
          </div>
          <p className="paymehtod_heading">Payment*</p>
          <div className="paymentmethod">
            <div className="paymentcod">
              <label
                onClick={() => {
                  setpaymethod("COD");
                  setiscod(true);
                  setiscard(false);
                  setcadopen(false);
                  setBil_addopen(false);
                  setcardtype("");
                }}
                className={`COD ${iscod ? "active" : ""}`}
              >
                COD
              </label>
            </div>
            <div className={`paymentnow ${iscardopen ? "active" : ""}`}>
              <label
                onClick={() => {
                  setpaymethod("card");
                  setcadopen((prev) => !prev);
                  setiscod(false);
                  setiscard(true);
                  setBil_addopen((prev) => !prev);
                }}
                className={`CARD ${iscard ? "active" : ""}`}
              >
                Card
              </label>
              <select
                onChange={(e) => {
                  setcardtype(e.target.value);
                }}
              >
                <option value="none">select</option>
                <option value="visa">Visa</option>
                <option value="mastercard">Master Card</option>
                <option value="unionpay">Unionpay</option>
              </select>
            </div>
          </div>

          <div className={`billingaddress ${isbilladd_open ? "active" : ""}`}>
            <p className="bill_Add_heading">Billing Address*</p>
            <input
              type="text"
              value={billing_add}
              onChange={(e) => setBillingAdd(e.target.value)}
            />
          </div>
          <p className="summary_heading">Order Summary</p>
          <div className="summary">
            <div className="cartdetails_total">
              <p className="cartdetails_totalheading">total</p>
              <p>{!totalprice ? 0 : totalprice}</p>
            </div>

            <div className="cartdetails_total">
              <p className="cartdetails_totalheading">Shipping </p>
              {/* <p>{totalprice > 0 ? `${shippingfee}` : 0}</p> */}
              <p>{shippingfee}</p>
            </div>

            <div className="cartdetails_total subtotal">
              <p className="cartdetails_totalheading ">Subtotal </p>
              <p>{totalprice > 0 ? `Rs.${subtotal}` : 0} </p>
            </div>
            <p style={{ fontSize: "0.6rem" }}>
              *shippingFee included for order under Rs.3000
            </p>
          </div>

          <div className="completeorder">
            <div className="checkout_error">
              <p style={{ fontSize: "0.8rem", color: "red" }}>
                {checkoutError}
              </p>
            </div>
            {!sendingorder ? (
              cart.length > 0 ? (
                <button onClick={sendorder}>Complete Order</button>
              ) : (
                <button style={{ display: "none" }}>Complete Order</button>
              )
            ) : (
              <button>Please wait...</button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
