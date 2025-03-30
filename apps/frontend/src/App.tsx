import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import AddProducts from "./components/AddProducts";
import Market from "./components/Card";
import Footer from "./components/Footer";
import Home from "./components/Home";
import { LandingHero } from "./components/Landing-Hero";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import OffersPage from "./components/OffersPage";
import ProductPage from "./components/Productpage";
import Cart from "./components/Cart";
import Register from "./components/Register";
import { useAuthContext } from "./hooks/useAuthContext";
import AddForm from "./components/ui/AddForm";
import "./index.css";
import TradingInterface from "./components/Trading-interface";
import OfferWithId from "./components/OfferWithId";
import RecivedOrder from "./components/RecivedOrder";

function App() {
  const { state } = useAuthContext();

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={state.user ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={!state.user ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/register"
            element={!state.user ? <Register /> : <Navigate to="/" />}
          />
          <Route path="/my-space" element={<AddProducts />} />
          <Route path="/my-offers" element={<OffersPage />} />
          <Route path="/my-offers/:id/:price/:name" element={<OfferWithId />} />
          <Route path="/recived-orders" element={<RecivedOrder />} />

          <Route path="/market" element={<Market />} />
          <Route path="/add-item" element={<AddForm />} />
          <Route path="/market/:id" element={<ProductPage />} />
          <Route path="/mycart" element={<Cart />} />
          <Route path="/lan" element={<LandingHero />} />
          <Route path="/trading-interface" element={<TradingInterface />} />
          {/* <Route
            path="/userprofile/:id"
            element={
              state.user?.role === `${import.meta.env.VITE_ROLE}` ? (
                <UserProfile />
              ) : (
                <Navigate to="/" />
              )
            }
          /> */}
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
