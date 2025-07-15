import React, { useState } from "react";

import "../../css/addproduct.css";
export default function AddProducts({ GetProducts }) {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productimage, setProductImage] = useState(null);
  const [stock, setStock] = useState(0);
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("");

  function add() {
    const formData = new FormData();
    if (
      productName === "" ||
      productDescription === "" ||
      !productimage ||
      stock === 0 ||
      price === 0 ||
      category === ""
    ) {
      alert("Please Provide all the Fields");
      return;
    } else {
      formData.append("name", productName);
      formData.append("description", productDescription);
      formData.append("stock", stock);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("image", productimage);
    }

    fetch(
      "http://localhost/API/react/e-commerce-store/The-Store/backend/class/addproduct.php",
      {
        method: "POST",
        body: formData, // This sends it as multipart/form-data
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP Error! status:${response.status}`);
        } else {
          return response.json();
        }
      })
      .then((data) => {
        if (data.status === "success") {
          alert("Product Added.");
          GetProducts();
          setProductImage(null);
          setProductName("");
          setProductDescription("");
          setStock("");
          setPrice("");
          setCategory("");
          setProductImage(null);
        } else {
          console.error(result.message);
        }
      })
      .catch((error) => {
        console.error("ERROR ADDING PRODUCT: ".error);
      });
  }

  return (
    <>
      <div className="addproductBox">
        <h1>-Add Products-</h1>
        <form>
          <div>
            <label htmlFor="productpic">Product Picture </label>
            <input
              type="file"
              name="productpic"
              accept=".jpg , .png , .jpeg"
              className="product_pic"
              onChange={(e) => {
                setProductImage(e.target.files[0]);
              }}
            />
          </div>
          <div>
            <label htmlFor="productname">Product Name </label>
            <input
              type="text"
              name="productname"
              className="product_name"
              value={productName}
              onChange={(e) => {
                setProductName(e.target.value);
              }}
            />
          </div>

          <div>
            <label htmlFor="productdescription">Description</label>
            <textarea
              type="text"
              name="productdescription"
              className="product_description"
              value={productDescription}
              onChange={(e) => {
                setProductDescription(e.target.value);
              }}
            />
          </div>

          <div>
            <label htmlFor="productstock">Stock/quantity</label>
            <input
              type="number"
              name="productstock"
              className="product_stock"
              value={stock}
              onChange={(e) => {
                setStock(e.target.value);
              }}
            />
          </div>

          <div>
            <label htmlFor="productprice">Price</label>
            <input
              type="number"
              name="productprice"
              className="product_price"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
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
                setCategory(e.target.value);
              }}
            >
              <option value="none">Select</option>
              <option value="Pant">Pants</option>
              <option value="Shirt">Shirt</option>
              <option value="Watch">Watch</option>
              <option value="Jacket">Jacket</option>
            </select>
          </div>

          <div>
            <button type="button" className="btn_add" onClick={add}>
              Add
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
