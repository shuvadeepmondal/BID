import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import AddProducts from "./components/AddProducts";
import Market from "./components/Card";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import OffersPage from "./components/OffersPage";
import ProductPage from "./components/Productpage";
import Register from "./components/Register";
import { useAuthContext } from "./hooks/useAuthContext";
import "./index.css";

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

          <Route path="/market/:id" element={<ProductPage />} />

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
