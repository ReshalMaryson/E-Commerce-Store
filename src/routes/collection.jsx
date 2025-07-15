import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../css/collection.css";
import ProdCard from "../components/collection/productCard";
import filterimg from "../assets/images/filter.png";
import arrow from "../assets/images/arrow.png";

export default function Collection() {
  //location for homepage category.
  const location = useLocation();
  //navigation
  const navigate = useNavigate();

  //main products variable
  const [products, setProduct] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 2;
  const [totalPages, setTotalPages] = useState(null);

  //filter vaiables
  const [isfilteropen, setfilteropen] = useState(false);
  const [filtercategoryopen, setfiltercategory] = useState(false);
  const [filterpriceopen, setfilterprice] = useState(false);

  //error message
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(false);

  //search variable.
  const [searchquery, setSearchquery] = useState("");
  const [searchqueryresult, setSearchQueryResult] = useState([]);
  const [issearchopen, setSearchopen] = useState(false);

  //price search varible.
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);

  // getting all products.
  useEffect(() => {
    getProducts(page);
  }, [page]);

  // getting products by category from home page.
  // route "/collection/shirt
  useEffect(() => {
    if (location.state?.category === "shirt") {
      findshirts();
    }
  }, [location.state]);

  // route "/collection/pants
  useEffect(() => {
    if (location.state?.category === "pants") {
      findpants();
    }
  }, [location.state]);

  // route "/collection/jacket
  useEffect(() => {
    if (location.state?.category === "jacket") {
      findjacket();
    }
  }, [location.state]);

  // route "/collection/watch
  useEffect(() => {
    if (location.state?.category === "watch") {
      findwatch();
    }
  }, [location.state]);

  // requests
  // get products
  function getProducts(pagenumber) {
    fetch(
      `http://localhost/API/react/e-commerce-store/The-Store/backend/class/getprod_limit.php?limit=${limit}&page=${pagenumber}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP Error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((result) => {
        if (result.status === "success") {
          setProduct((prev) => [...prev, ...result.data]);
          setTotalPages(result.total_pages);
        } else {
          console.error(result.message);
        }
      })
      .catch((error) => {
        console.error(`ERROR : ${error}`);
      });
  }

  //pagination function
  function loadMore() {
    if (page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
    }
  }

  // search product
  function find() {
    if (searchquery === "" || searchquery === null) {
      setErrorMessage("Empty Field");
      setError(true);
      return;
    } else {
      const send_data = {
        search: searchquery,
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
            setSearchquery("");
            setSearchQueryResult(result.products);
            setSearchopen(true);
            setfilteropen(false);
            if (error) {
              setError(false);
            }
          } else {
            console.error(`ERROR ${result.message}`);
            setError(true);
            setErrorMessage(result.message);
          }
        })
        .catch((error) => {
          setError(true);
          setErrorMessage("Product not found.");
          console.error(error);
        });
    }
  }

  // for individual category search like shirt , pant , jacket, watch.
  function findpants() {
    const send_data = {
      search: "pants",
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
          setSearchquery("");
          setSearchQueryResult(result.products);
          setSearchopen(true);
          setfilteropen(false);
          if (error) {
            setError(false);
          }
        } else {
          console.error(`ERROR ${result.message}`);
          setError(true);
          setErrorMessage(result.message);
        }
      })
      .catch((error) => {
        setError(true);
        setErrorMessage("Product not found.");
        console.error(error);
      });
  }
  function findjacket() {
    const send_data = {
      search: "jacket",
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
          setSearchquery("");
          setSearchQueryResult(result.products);
          setSearchopen(true);
          setfilteropen(false);
          if (error) {
            setError(false);
          }
        } else {
          console.error(`ERROR ${result.message}`);
          setError(true);
          setErrorMessage(result.message);
        }
      })
      .catch((error) => {
        setError(true);
        setErrorMessage("Product not found.");
        console.error(error);
      });
  }
  function findwatch() {
    const send_data = {
      search: "watch",
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
          setSearchquery("");
          setSearchQueryResult(result.products);
          setSearchopen(true);
          setfilteropen(false);
          if (error) {
            setError(false);
          }
        } else {
          console.error(`ERROR ${result.message}`);
          setError(true);
          setErrorMessage(result.message);
        }
      })
      .catch((error) => {
        setError(true);
        setErrorMessage("Product not found.");
        console.error(error);
      });
  }
  function findshirts() {
    const send_data = {
      search: "shirt",
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
          setSearchquery("");
          setSearchQueryResult(result.products);
          setSearchopen(true);
          setfilteropen(false);
          if (error) {
            setError(false);
          }
        } else {
          console.error(`ERROR ${result.message}`);
          setError(true);
          setErrorMessage(result.message);
        }
      })
      .catch((error) => {
        setError(true);
        setErrorMessage("Product not found.");
        console.error(error);
      });
  }

  //filter by price
  function findbyprice() {
    const send_data = {
      min: min,
      max: max,
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
          setSearchquery("");
          setSearchQueryResult(result.products);
          setSearchopen(true);
          setfilteropen(false);
          setMin(0);
          setMax(0);
          if (error) {
            setError(false);
          }
        } else {
          console.error(`ERROR ${result.message}`);
          setError(true);
          setErrorMessage(result.message);
        }
      })
      .catch((error) => {
        setError(true);
        setErrorMessage("Product not found.");
        console.error(error);
      });
  }

  // for DOM manupliation
  function openfilter() {
    setfilteropen((prev) => !prev);
    setError(false);
    setfiltercategory(false);
    setfilterprice(false);
  }
  function openfiltercategory() {
    setfiltercategory((prev) => !prev);
  }
  function openfilterprice() {
    setfilterprice((prev) => !prev);
  }

  function clearsearch() {
    setSearchopen(false);
    navigate("/collection");
  }

  return (
    <>
      <h2 className="h1_head">Collection</h2>
      <div className="filter">
        <img
          className="filterimg"
          src={filterimg}
          alt=""
          onClick={openfilter}
          style={{ cursor: "pointer" }}
        />
      </div>
      <div className={`filterbox ${isfilteropen ? "active" : ""}`}>
        <p className="filter_heading">Filter</p>
        <div className="filtersearch">
          <button className="filter_btnsearch" onClick={find}>
            search
          </button>
          <input
            type="search"
            placeholder="Category,Name"
            className="filter_inputsearch"
            value={searchquery}
            onChange={(e) => {
              setSearchquery(e.target.value);
            }}
          />
        </div>
        <p className={`searcherror ${error ? "active" : ""}`}>{errorMessage}</p>

        <div
          className={`filter_category ${filtercategoryopen ? "active" : ""}`}
        >
          <span
            className={`filter_category_heading ${
              filtercategoryopen ? "active" : ""
            }`}
            onClick={openfiltercategory}
          >
            Category +
          </span>
          <ul>
            <li onClick={findshirts} style={{ cursor: "pointer" }}>
              -Shirts
            </li>
            <li onClick={findpants} style={{ cursor: "pointer" }}>
              -Pants
            </li>
            <li onClick={findjacket} style={{ cursor: "pointer" }}>
              -Jackets
            </li>
            <li onClick={findwatch} style={{ cursor: "pointer" }}>
              -Watches
            </li>
          </ul>
        </div>

        <div className={`filter_price ${filterpriceopen ? "active" : ""}`}>
          <span
            className={`filter_price_heading ${
              filterpriceopen ? "active" : ""
            }`}
            onClick={openfilterprice}
          >
            Price +
          </span>
          <div className="pricefilter">
            <div className="min">
              <label style={{ color: "white" }}>Min:</label>
              <input
                type="number"
                placeholder="Min"
                value={min}
                onChange={(e) => {
                  setMin(e.target.value);
                }}
              />
            </div>
            <div className="max">
              <input
                type="number"
                placeholder="Max"
                value={max}
                onChange={(e) => {
                  setMax(e.target.value);
                }}
              />
              <label style={{ color: "white" }}>:Max</label>
            </div>
          </div>
          <div className="btnpricebtn">
            <button className="filter_pricebtn" onClick={findbyprice}>
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* searchproduct starts here */}
      <div className={`wrappersearch ${issearchopen ? "active" : ""}`}>
        <div className="clearsearch">
          <img
            src={arrow}
            alt=""
            onClick={clearsearch}
            style={{ cursor: "pointer" }}
          />
        </div>
        <div className="searchcollection_container">
          {searchqueryresult.map((prod) => (
            <div key={prod.id}>
              <ProdCard
                id={prod.id}
                name={prod.name}
                price={prod.price}
                image={prod.image}
              />
            </div>
          ))}
        </div>
        {/* {page < totalPages && (
          <button onClick={loadMore} className="btn_loadmore">
            Show More
          </button>
        )} */}
      </div>
      {/* search product end here */}
      <div className={`collection_container ${issearchopen ? "active" : ""}`}>
        {products.map((prod) => (
          <div key={prod.id}>
            <ProdCard
              id={prod.id}
              name={prod.name}
              price={prod.price}
              image={prod.image}
              stock={prod.stock}
            />
          </div>
        ))}
      </div>
      <div className="loadmore">
        {page < totalPages && (
          <button onClick={loadMore} className="btn_loadmore">
            Show More
          </button>
        )}
      </div>
    </>
  );
}
