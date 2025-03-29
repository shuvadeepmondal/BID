import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./index.css";
import "./App.css";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Register from "./components/Register";
import AddProducts from "./components/AddProducts";
import { useAuthContext } from "./hooks/useAuthContext";


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
