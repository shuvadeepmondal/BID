import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./index.css";
import "./App.css";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Market from "./components/Card"
import Register from "./components/Register";
import { useAuthContext } from "./hooks/useAuthContext";
import AddProducts from "./components/AddProducts";
import OffersPage from "./components/OffersPage";
import ProductPage from "./components/Productpage";

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

          <Route path="/market" element={<Market />} />

          <Route path="/product" element={<ProductPage />} />

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
