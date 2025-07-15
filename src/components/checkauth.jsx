import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [userid, setUser_id] = useState(null);
  const [user_name, setUser_name] = useState(null);

  function check_auth() {
    fetch(
      "http://localhost/API/react/e-commerce-store/The-Store/backend/class/checkAuth.php",
      {
        method: "POST",
        credentials: "include",
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        if (result.status === "authenticated") {
          setIsAuthenticated(true);
          setProfilePic(result.profile_pic);
          setUser_id(result.userid);
          setUser_name(result.user);
        } else {
          setIsAuthenticated(false);
          setProfilePic("");
        }
      })
      .catch((error) => {
        setIsAuthenticated(false);
      });
  }
  useEffect(() => {
    check_auth();
  }, []);

  return (
    <>
      <AuthContext.Provider
        value={{
          isAuthenticated,
          profilePic,
          setProfilePic,
          userid,
          user_name,
          check_auth,
        }}
      >
        {children}
      </AuthContext.Provider>
    </>
    // this component is wrapped around all the components in app.jsx.
    // children is being used as a placeholder for the components on which AuthContext is wrapped.
  );
}
