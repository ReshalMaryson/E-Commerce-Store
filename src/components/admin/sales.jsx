import "../../css/sales.css";
import arrow from "../../assets/images/arrow.png";
import React, { useState, useEffect, useRef } from "react";

export default function Sales() {
  const [openOrder, setOpenOrder] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [error_search, setError_search] = useState(""); // empty search error
  const [searching, setsearching] = useState(true);
  const [findOrder, setfindOrder] = useState(""); // search input.

  //server response
  const [orders, setOrders] = useState([]);
  const [searched_orders, setSearched_Orders] = useState("");

  useEffect(() => {
    getsales();
  }, []);

  function getsales() {
    fetch(
      "http://localhost/API/react/e-commerce-store/The-Store/backend/class/sales.php",
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "success") {
          setOrders(result.data);
        } else {
          console.log("failed to fetch orders");
        }
      })
      .catch((error) => console.error("Error fetching orders:", error));
  }
  function find_order() {
    if (findOrder === "") {
      setError_search("please enter a value.");
      return;
    }
    const o_id = {
      orderID: findOrder,
    };
    const data = JSON.stringify(o_id);
    fetch(
      "http://localhost/API/react/e-commerce-store/The-Store/backend/class/sales.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: data,
      }
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "success") {
          setError_search("");
          setfindOrder("");
          setSearched_Orders(result.data);
          show_search();
          setsearching(false);
          return;
        } else if (result.status === "error") {
          // console.log("failed to fetch orders");
          show_search();
          setError_search("Order not found");
          return;
        }
      })
      .catch((error) => console.error("Error fetching orders:", error));
  }
  function open_details(orderId) {
    setOpenOrder((prev) => (prev === orderId ? null : orderId));
  }

  const formatDate = (timestamp) => {
    return timestamp.split(" ")[0];
  };

  function show_search() {
    setShowSearch(true);
  }
  function close_search() {
    setError_search("");
    setfindOrder("");
    setShowSearch(false);
    setsearching(true);
  }

  return (
    <>
      <h2 className="main_heading">Sales</h2>
      {/* sales filter by id */}
      <div className="filter_sales">
        <div className="search_query">
          <button
            onClick={() => {
              find_order();
            }}
            className="order_search"
          >
            find🔎
          </button>
          <input
            type="number"
            placeholder="Order ID"
            id="date"
            name="date"
            value={findOrder}
            onChange={(e) => {
              setfindOrder(e.target.value);
            }}
          />
          <p style={{ color: "red", fontSize: "0.7rem" }}> {error_search}</p>
        </div>
        <div>
          {searching ? (
            <p style={{ fontSize: "0.8rem" }}> orders: ({orders.length})</p>
          ) : (
            <p style={{}}></p>
          )}
        </div>
      </div>

      {/* all sales */}
      <div className="wrap_sale">
        {orders.map((order) => (
          <div
            key={order.order_id}
            className={`sales_container  ${
              openOrder === order.order_id ? "active" : ""
            }  ${showSearch ? "hide" : ""}`}
            onClick={() => open_details(order.order_id)}
          >
            <div className="sale">
              <div className="sale_item">
                <p className="saleitem_heading">Order-ID</p>
                <p className="saleitem_value">{order.order_id}</p>
              </div>

              <div className="sale_item">
                <p className="saleitem_heading">User-ID</p>
                <p className="saleitem_value">{order.user_id}</p>
              </div>

              <div className="sale_item">
                <p className="saleitem_heading">Total</p>
                <p className="saleitem_value">{order.subtotal}</p>
              </div>

              <div className="sale_item">
                <p className="saleitem_heading">Order Date</p>
                <p className="saleitem_value">{formatDate(order.created_at)}</p>
              </div>
            </div>

            <p className="sales_headings">Customer</p>
            <div className="details">
              <div className="sale_item">
                <p className="saleitem_heading">Name</p>
                <p className="saleitem_value">{order.customer}</p>
              </div>

              <div className="sale_item">
                <p className="saleitem_heading">Phone</p>
                <p className="saleitem_value">{order.phone}</p>
              </div>

              <div className="sale_item email">
                <p className="saleitem_heading">Email</p>
                <p className="saleitem_value">{order.email}</p>
              </div>

              <div className="sale_item address">
                <p className="saleitem_heading">Address</p>
                <p className="saleitem_value">{order.address}</p>
              </div>
            </div>

            <p className="sales_headings">Payment</p>
            <div className="pay_method">
              <div className="sale_item">
                <p className="saleitem_heading">Pay-Method</p>
                <p className="saleitem_value">{order.payment_method}</p>
              </div>
              <div className="sale_item">
                <p className="saleitem_heading">Card-Type</p>
                <p className="saleitem_value">{order.card_type}</p>
              </div>
              <div className="sale_item">
                <p className="saleitem_heading">Subtotal</p>
                <p className="saleitem_value">{order.subtotal}</p>
              </div>
              <div className="sale_item">
                <p className="saleitem_heading">Shipping Fee</p>
                <p className="saleitem_value">{order.shipping_fee}</p>
              </div>
            </div>

            <p className="sales_headings">
              Products{" "}
              <span
                style={{
                  fontSize: "0.6rem",
                  color: "white",
                  marginLeft: "3px",
                  fontWeight: "500",
                }}
              >
                {`(${order.products.length})`}
              </span>
            </p>
            {order.products.map((prod) => (
              <div className="saleproducts_wrap" key={prod.product_id}>
                <div className="sales_products">
                  <div className="sale_item">
                    <p className="saleitem_heading">Product</p>
                    <p className="saleitem_value">{prod.product_name}</p>
                  </div>

                  <div className="sale_item">
                    <p className="saleitem_heading">Price</p>
                    <p className="saleitem_value">{prod.price}</p>
                  </div>
                  <div className="sale_item">
                    <p className="saleitem_heading">Quantity</p>
                    <p className="saleitem_value">{prod.quantity}</p>
                  </div>

                  <div className="sale_item">
                    <p className="saleitem_heading">ItemSubtotal</p>
                    <p className="saleitem_value">
                      {prod.price * prod.quantity}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* search data. */}

      <div className={`search_orders${showSearch ? "active" : ""}`}>
        <div className="search_backarrow" onClick={close_search}>
          <img src={arrow} alt="" />
        </div>

        {!searching ? (
          <div
            className={`sales_container ${
              openOrder === searched_orders.order_id ? "active" : ""
            }`}
            onClick={() => open_details(searched_orders.order_id)}
          >
            <div className="sale">
              <div className="sale_item">
                <p className="saleitem_heading">Order-ID</p>
                <p className="saleitem_value">{searched_orders.order_id}</p>
              </div>

              <div className="sale_item">
                <p className="saleitem_heading">User-ID</p>
                <p className="saleitem_value">{searched_orders.user_id}</p>
              </div>

              <div className="sale_item">
                <p className="saleitem_heading">Total</p>
                <p className="saleitem_value">{searched_orders.subtotal}</p>
              </div>

              <div className="sale_item">
                <p className="saleitem_heading">Order Date</p>
                <p className="saleitem_value">
                  {formatDate(searched_orders.created_at)}
                </p>
              </div>
            </div>

            <p className="sales_headings">Customer</p>
            <div className="details">
              <div className="sale_item">
                <p className="saleitem_heading">Name</p>
                <p className="saleitem_value">{searched_orders.customer}</p>
              </div>

              <div className="sale_item">
                <p className="saleitem_heading">Phone</p>
                <p className="saleitem_value">{searched_orders.phone}</p>
              </div>

              <div className="sale_item email">
                <p className="saleitem_heading">Email</p>
                <p className="saleitem_value">{searched_orders.email}</p>
              </div>

              <div className="sale_item address">
                <p className="saleitem_heading">Address</p>
                <p className="saleitem_value">{searched_orders.address}</p>
              </div>
            </div>

            <p className="sales_headings">Payment</p>
            <div className="pay_method">
              <div className="sale_item">
                <p className="saleitem_heading">Pay-Method</p>
                <p className="saleitem_value">
                  {searched_orders.payment_method}
                </p>
              </div>
              <div className="sale_item">
                <p className="saleitem_heading">Card-Type</p>
                <p className="saleitem_value">{searched_orders.card_type}</p>
              </div>
              <div className="sale_item">
                <p className="saleitem_heading">Subtotal</p>
                <p className="saleitem_value">{searched_orders.subtotal}</p>
              </div>
              <div className="sale_item">
                <p className="saleitem_heading">Shipping Fee</p>
                <p className="saleitem_value">{searched_orders.shipping_fee}</p>
              </div>
            </div>

            <p className="sales_headings">
              Products
              <span
                style={{
                  fontSize: "0.6rem",
                  color: "white",
                  marginLeft: "3px",
                  fontWeight: "500",
                }}
              >
                {`(${searched_orders.products.length})`}
              </span>
            </p>
            {searched_orders.products.map((prod) => (
              <div className="saleproducts_wrap" key={prod.product_id}>
                <div className="sales_products">
                  <div className="sale_item">
                    <p className="saleitem_heading">Product</p>
                    <p className="saleitem_value">{prod.product_name}</p>
                  </div>

                  <div className="sale_item">
                    <p className="saleitem_heading">Price</p>
                    <p className="saleitem_value">{prod.price}</p>
                  </div>
                  <div className="sale_item">
                    <p className="saleitem_heading">Quantity</p>
                    <p className="saleitem_value">{prod.quantity}</p>
                  </div>

                  <div className="sale_item">
                    <p className="saleitem_heading">ItemSubtotal</p>
                    <p className="saleitem_value">
                      {prod.price * prod.quantity}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <p style={{ textAlign: "center", fontSize: "0.8rem" }}>
              searching....
            </p>
          </div>
        )}
      </div>
    </>
  );
}
