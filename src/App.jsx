import "./css/App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./routes/home";
import Navbar from "./components/navbar";
import Collection from "./routes/collection";
import Admin from "./routes/admin";
import Login from "./routes/login";
import SignUp from "./routes/signup";
import ProdDetails from "./routes/proddetails";
import Cart from "./components/cart";
import Checkout from "./routes/checkout";
import Userprofile from "./routes/profile";
import Orderconfirmed from "./routes/orderconfirmed";
import AuthProvider from "./components/checkauth";
import { Helmet } from "react-helmet";

function App() {
  return (
    <>
      <Helmet>
        <title>The Store💎</title>
      </Helmet>
      <AuthProvider>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/collection/shirts" element={<Collection />} />
          <Route path="/collection/pants" element={<Collection />} />
          <Route path="/collection/jackets" element={<Collection />} />
          <Route path="/collection/watches" element={<Collection />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/product/:id" element={<ProdDetails />} />
          <Route path="/cart/:id" element={<Cart />} />
          <Route path="/checkout/:id" element={<Checkout />} />
          <Route path="/userprofile/:id" element={<Userprofile />} />
          <Route path="/confirmed" element={<Orderconfirmed />} />
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
