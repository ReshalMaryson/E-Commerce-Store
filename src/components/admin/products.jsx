import React, { use, useEffect, useState } from "react";
import "../../css/adminproduct.css";
import findlogo from "../../assets/images/find.png";
import cancel from "../../assets/images/arrow.png";

export default function Products({ GetProducts, product }) {
  const [update_open, setopenUpdate] = useState(false);
  const [searchopen, setSearchOpen] = useState(false);
  const [searchProd, setSearchprod] = useState("");
  const [error_search, setErrorSearch] = useState(false);
  const [errMessage, setErrMessage] = useState("");

  const [searchedProd, setSearchedProd] = useState([]);

  const [name, setName] = useState("");
  const [description, setdescription] = useState("");
  const [category, setcategory] = useState("");
  const [Price, setprice] = useState(0);
  const [Stock, setstock] = useState(0);
  const [p_id, setid] = useState(0);

  useEffect(() => {
    GetProducts();
  }, []);

  //open update box
  function openUpdate(id, name, description, price, stock, category) {
    // alert(id + name + description + stock + price + category);
    setopenUpdate(true);
    setid(id);
    setName(name);
    setdescription(description);
    setprice(price);
    setstock(stock);
    setcategory(category);
  }

  //close update box.
  function close_update() {
    setopenUpdate(false);
    setid(0);
    setName("");
    setdescription("");
    setprice("");
    setstock("");
    setcategory("");
  }

  //update request
  function Update() {
    const send_data = {
      id: p_id,
      p_name: name,
      p_description: description,
      p_price: Price,
      p_stock: Stock,
      p_category: category,
    };
    const Data = JSON.stringify(send_data);

    fetch(
      "http://localhost/API/react/e-commerce-store/The-Store/backend/class/updateproduct.php",
      {
        method: "PUT",
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
          close_update();
          if (searchopen) {
            setSearchOpen(false);
            GetProducts();
          } else {
            GetProducts();
          }
        } else {
          console.error(`ERROR ${result.message}`);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  //delete
  function Delete(id) {
    const send_id = {
      id: id,
    };

    const ID = JSON.stringify(send_id);
    fetch(
      "http://localhost/API/react/e-commerce-store/The-Store/backend/class/deleteproduct.php",
      {
        method: "DELETE",
        body: ID,
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
          if (searchopen) {
            setSearchOpen(false);
            GetProducts();
          } else {
            GetProducts();
          }
        } else {
          console.error(`ERROR ${result.message}`);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  //search request
  function find() {
    if (searchProd === "" || searchProd === null) {
      setErrorSearch(true);
      return;
    } else {
      const send_data = {
        search: searchProd,
      };
      const Data = JSON.stringify(send_data);

      fetch(
        "http://localhost/API/react/e-commerce-store/The-Store/backend/class/searchprod.php",
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
            setSearchedProd(result.products);
            setErrMessage("");
            setSearchOpen(true);
            if (error_search) {
              setErrorSearch(false);
              setSearchprod("");
            } else {
              setSearchprod("");
            }
          } else {
            console.error(`ERROR ${result.message}`);
            setErrMessage(result.message);
          }
        })
        .catch((error) => {
          setErrMessage("Product Not Found");
          console.error(error);
        });
    }
  }

  function closesearch() {
    setSearchOpen(false);
    setSearchprod("");
    setErrMessage("");
  }
  return (
    <>
      <h1 className="heading_h1">Products</h1>
      <div className="accesscebility">
        <div className="search_form">
          <button className="search_btn" onClick={find}>
            <img src={findlogo} width="15" alt="" />
          </button>
          <input
            type="search"
            className={`search_input ${error_search ? "active" : ""}`}
            placeholder="ID,Name,Category"
            value={searchProd}
            onChange={(e) => {
              setSearchprod(e.target.value);
            }}
          />
        </div>
      </div>
      <p style={{ color: "red", fontSize: "0.7rem", marginLeft: "20px" }}>
        {errMessage}
      </p>
      {/* search content start */}
      <div className={`searched_prod_container ${searchopen ? "active" : ""}`}>
        <div className="totalandback">
          <img src={cancel} alt="" width="23" onClick={closesearch} />
          <p className="total">{`found: (${searchedProd.length})`}</p>
        </div>
        {searchedProd.map((item) => (
          <div key={item.id} className="product">
            <div
              className="image"
              style={{
                backgroundImage: `url(../../../backend/uploads/product/${item.image})`,
              }}
            >
              <p> {item.id}</p>
              <img
                src={`../../../backend/uploads/product/${item.image}`}
                alt={item.name}
                width="100"
                className="img"
              />
            </div>
            <div className="details">
              <div className="detail_wrap">
                <span>NAME: </span>
                <p>{item.name}</p>
                <span>DESCRIPTION: </span>
                <p className="desc">{item.description}</p>
                <span>PRICE(RS): </span>
                <p>{item.price}</p>
                <span>STOCK: </span>
                <p>{item.stock}</p>
                <span>CATEGORY: </span>
                <p>{item.category}</p>
              </div>
              <div className="action_btn">
                <button
                  className="btn "
                  type="button"
                  onClick={() => {
                    Delete(item.id);
                  }}
                >
                  Delete
                </button>
                <button
                  className="btn"
                  type="button"
                  onClick={() => {
                    openUpdate(
                      item.id,
                      item.name,
                      item.description,
                      item.price,
                      item.stock,
                      item.category
                    );
                  }}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* search content end */}

      <div className={`poduct_content ${searchopen ? "active" : ""}`}>
        <div className="products">
          <div className="total">
            <p>Products :</p>
            <p>{`(${product.length})`}</p>
          </div>
          {product.map((item) => (
            <div key={item.id} className="product">
              <div className="image">
                <p> {item.id}</p>
                <img
                  src={`../../../backend/uploads/product/${item.image}`}
                  alt={item.name}
                  width="100"
                  className="img"
                />
              </div>
              <div className="details">
                <div className="detail_wrap">
                  <div className="detail_item">
                    <span>NAME: </span>
                    <p>{item.name}</p>
                  </div>
                  <div className="detail_item">
                    <span>DESCRIPTION: </span>
                    <p className="desc">{item.description}</p>
                  </div>
                  <div className="detail_item">
                    <span>PRICE(RS): </span>
                    <p>{item.price}</p>
                  </div>
                  <div className="detail_item">
                    <span>STOCK: </span>
                    <p>{item.stock}</p>
                  </div>
                  <div className="detail_item">
                    <span>CATEGORY: </span>
                    <p>{item.category}</p>
                  </div>
                </div>
                <div className="action_btn">
                  <button
                    className="btn "
                    type="button"
                    onClick={() => {
                      Delete(item.id);
                    }}
                  >
                    Delete
                  </button>
                  <button
                    className="btn"
                    type="button"
                    onClick={() => {
                      openUpdate(
                        item.id,
                        item.name,
                        item.description,
                        item.price,
                        item.stock,
                        item.category
                      );
                    }}
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* //update */}

      <div className={`update_box ${update_open ? "active" : ""}`}>
        <h1>update Details</h1>

        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            value={description}
            onChange={(e) => {
              setdescription(e.target.value);
            }}
          ></textarea>
        </div>

        <div>
          <label htmlFor="price">Price</label>
          <input
            type="number"
            name="price"
            value={Price}
            onChange={(e) => {
              setprice(e.target.value);
            }}
          />
        </div>

        <div>
          <label htmlFor="stock">Stock</label>
          <input
            type="number"
            name="stock"
            value={Stock}
            onChange={(e) => {
              setstock(e.target.value);
            }}
          />
        </div>
        <div>
          <label htmlFor="productcategory">Category</label>
          <select
            name="productcategory"
            id=""
            value={category}
            onChange={(e) => {
              setcategory(e.target.value);
            }}
          >
            <option value="none">Select</option>
            <option value="Pant">Pants</option>
            <option value="Shirt">Shirt</option>
            <option value="Watch">Watch</option>
            <option value="Jacket">Jacket</option>
          </select>
        </div>
        <div className="update_control">
          <button type="button" className="cancel_btnn" onClick={close_update}>
            Cancel
          </button>
          <button type="button" className="update_btnn" onClick={Update}>
            Update Product
          </button>
        </div>
      </div>
    </>
  );
}
