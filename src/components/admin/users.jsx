import "../../css/adminuser.css";
import React, { useEffect, useState } from "react";
import findlogo from "../../assets/images/find.png";
import cancel from "../../assets/images/arrow.png";

export default function Users({ getUsers, users }) {
  const [search, setSearch] = useState("");
  const [searchopen, setSearchOpen] = useState(false);
  const [searchedUser, setSearchedUser] = useState([]);
  const [error_search, setErrorSearch] = useState(false);

  useEffect(() => {
    getUsers();
  }, []);

  const formatDate = (timestamp) => {
    return timestamp.split(" ")[0]; //split and Get only the date part
  };

  //search request
  function find() {
    if (search === "" || search === null) {
      setErrorSearch(true);
      return;
    } else {
      const send_data = {
        search: search,
      };
      const Data = JSON.stringify(send_data);

      fetch(
        "http://localhost/API/react/e-commerce-store/The-Store/backend/class/searchuser.php",
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
            setSearchedUser(result.users);
            setSearchOpen(true);
            if (error_search) {
              setErrorSearch(false);
              setSearch("");
            } else {
              setSearch("");
            }
          } else {
            console.error(`ERROR ${result.message}`);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  function closesearch() {
    setSearchOpen(false);
    setSearch("");
  }

  return (
    <>
      <h1 className="heading_h1">Users</h1>
      <div className="accesscebility">
        <div className="search_form">
          <button className="search_btn" onClick={find}>
            <img src={findlogo} width="15" alt="" />
          </button>
          <input
            type="search"
            className={`search_input ${error_search ? "active" : ""}`}
            placeholder="ID,Name,Email,Role"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>
      </div>

      {/* search user start */}
      <div className={`searched_user_container ${searchopen ? "active" : ""}`}>
        <div className="totalandback">
          <img src={cancel} alt="" width="23" onClick={closesearch} />
          <p className="total">{`Users: (${searchedUser.length})`}</p>
        </div>

        {searchedUser.map((user) => (
          <div className="search_user" key={user.id}>
            <div className="search_user-content">
              <p className="content-heading">ID</p>
              <p>{user.id}</p>
            </div>

            <div className="search_user-content">
              <p className="content-heading">Name</p>
              <p>{user.name}</p>
            </div>

            <div className="search_user-content">
              <p className="content-heading">Email</p>
              <p>{user.email}</p>
            </div>

            <div className="search_user-content">
              <p className="content-heading">Address</p>
              <p>Mission Compound No.2 Husaini Road Nawabshah.</p>
            </div>

            <div className="search_user-content">
              <p className="content-heading">Role</p>
              <p>{user.role}</p>
            </div>

            <div className="search_user-content">
              <p className="content-heading">Joined</p>
              <p>{formatDate(user.created_at)}</p>
            </div>
          </div>
        ))}
      </div>
      {/* search user end here */}

      <div className={`user-container ${searchopen ? "active" : ""}`}>
        <p className="total">{`Users: (${users.length})`}</p>
        {users.map((user) => (
          <div className="user" key={user.id}>
            <div className="user-content">
              <p className="content-heading">ID</p>
              <p>{user.id}</p>
            </div>

            <div className="user-content">
              <p className="content-heading">Name</p>
              <p>{user.name}</p>
            </div>

            <div className="user-content email">
              <p className="content-heading">Email</p>
              <p>{user.email}</p>
            </div>

            <div className="user-content address">
              <p className="content-heading">Address</p>
              <p>{user.address}</p>
            </div>

            <div className="user-content">
              <p className="content-heading">Role</p>
              <p>{user.role}</p>
            </div>

            <div className="user-content">
              <p className="content-heading">Joined</p>
              <p>{formatDate(user.created_at)}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
