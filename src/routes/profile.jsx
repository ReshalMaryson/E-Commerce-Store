import { useParams } from "react-router-dom";
import "../css/userprofile.css";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/checkauth";

export default function Userprofile() {
  const { check_auth, profilePic, setProfilePic } = useContext(AuthContext);

  const navigate = useNavigate();
  const { id } = useParams(); // getting id sent from navbar as url paremeter.

  // server data varibale
  const [user, setuser] = useState(null);

  // update info varibale
  const [user_id, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  // const [profilepic, setProfilepic] = useState("");
  const [joined, setJoined] = useState("");
  const [newprofilepic, setNewProfilepic] = useState(null);

  // DOM Manipulation
  const [isupdateopen, setUpdateopen] = useState(false);
  const [isprofilecompleted, setprofilecompleted] = useState(true);

  //get user info on mount
  useEffect(() => {
    getuser();
  }, []);

  useEffect(() => {
    if (!newprofilepic) {
      return;
    } else {
      chnagedp();
    }
  }, [newprofilepic]);

  //get user request
  function getuser() {
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
        if (result.status === "success" && result.users) {
          setuser(result.users);
          setId(result.users.id);
          setName(result.users.name);
          setEmail(result.users.email);
          setAddress(result.users.address);
          setCountry(result.users.country);
          setProfilePic(result.users.profile_pic);
          setPhone(result.users.phone_number);
          setJoined(result.users.created_at);
        } else {
          console.error(`ERROR ${result.message}`);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  //update req.
  function updateuser() {
    const send_data = {
      id: user_id,
      name: name,
      email: email,
      phone: phone,
      address: address,
      country: country,
    };
    const Data = JSON.stringify(send_data);

    fetch(
      "http://localhost/API/react/e-commerce-store/The-Store/backend/class/updateuser.php",
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
          setUpdateopen(false);
          getuser();
        } else {
          console.error(`ERROR ${result.message}`);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // update new profile pic
  function chnagedp() {
    const formData = new FormData();
    formData.append("image", newprofilepic);
    formData.append("id", id);

    fetch(
      "http://localhost/API/react/e-commerce-store/The-Store/backend/class/updateuser.php",
      {
        method: "POST",
        body: formData,
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
          getuser();
        } else {
          console.error(`ERROR ${result.message}`);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // deleteAccount
  function deleteacc() {
    const send_data = {
      id: id,
    };
    const Data = JSON.stringify(send_data);

    fetch(
      "http://localhost/API/react/e-commerce-store/The-Store/backend/class/deleteuseraccount.php",
      {
        method: "DELETE",
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
          navigate("/");
          window.location.reload();
        } else {
          console.error(`ERROR ${result.message}`);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // DOM Manipulation functions
  function triggerdpinput() {
    document.getElementById("updatedp_input").click();
  }
  function openupdate() {
    setUpdateopen(true);
  }
  function closeupdate() {
    setUpdateopen(false);
  }
  const formatDate = (timestamp) => {
    return timestamp.split(" ")[0];
  };
  return (
    <>
      {user ? (
        <div>
          <div className={`profile_container ${isupdateopen ? "active" : ""}`}>
            <div className="uesr_dp">
              <img
                src={`../../backend/uploads/profilePic/${profilePic}`}
                alt=""
              />
              <p className="edit_dp" onClick={triggerdpinput}>
                🖍
              </p>
              <input
                type="file"
                hidden
                accept=".jpg,.jpeg,.png"
                id="updatedp_input"
                onChange={(e) => {
                  setNewProfilepic(e.target.files[0]);
                }}
              />
            </div>
            <p
              className={`profile_status ${isprofilecompleted ? "" : "active"}`}
            >
              profile not completed.
            </p>
            {/* user info section */}
            <div className="user_info">
              <div className="profilecontent">
                <div className="profileitem">
                  <p className="profile_infoheading">ID</p>
                  <p className="value">{user_id}</p>
                </div>
                <div className="profileitem">
                  <p className="profile_infoheading">Name</p>
                  <p className="value">{name}</p>
                </div>
                <div className="profileitem email_p">
                  <p className="profile_infoheading">Email</p>
                  <p className="value">{email}</p>
                </div>
                <div className="profileitem">
                  <p className="profile_infoheading">Contact#</p>
                  <p className="value">{phone}</p>
                </div>
                <div className="profileitem">
                  <p className="profile_infoheading">Address</p>
                  <p className="value">{address}</p>
                </div>
                <div className="profileitem">
                  <p className="profile_infoheading">Country</p>
                  <p className="value"> {country}</p>
                </div>
                <div className="profileitem">
                  <p className="profile_infoheading">Joined</p>
                  <p className="value">{formatDate(joined)}</p>
                </div>
              </div>

              <div className="profile_controls">
                <button className="profile_update" onClick={openupdate}>
                  Edit 🖍
                </button>
                <button className="profile_delete" onClick={deleteacc}>
                  Delete Account
                </button>
              </div>
            </div>
          </div>
          {/* update section */}
          <div className={`updateuserinfo ${isupdateopen ? "active" : ""}`}>
            <p className="updateheading">Edit Info</p>
            <div className="user_info">
              <div className="profilecontent">
                <div className="profileitem">
                  <p className="profile_infoheading">Name</p>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                </div>
                <div className="profileitem email_p">
                  <p className="profile_infoheading">Email</p>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </div>
                <div className="profileitem">
                  <p className="profile_infoheading">Contact#</p>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                    }}
                  />
                </div>
                <div className="profileitem">
                  <p
                    className="profile_infoheading"
                    style={{ marginTop: "5px" }}
                  >
                    Address
                  </p>
                  <textarea
                    className="update_textarea"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                    }}
                  ></textarea>
                </div>
                <div className="profileitem">
                  <p className="profile_infoheading">Country</p>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => {
                      setCountry(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="profile_controls">
                <button className="profile_update" onClick={updateuser}>
                  Update
                </button>
                <button className="profile_delete" onClick={closeupdate}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <h3 style={{ textAlign: "center" }}>Loading....</h3>
      )}
    </>
  );
}
