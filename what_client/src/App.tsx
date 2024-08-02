import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/shared/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { useAuth } from "./context/authContext";
import { useEffect } from "react";

function App() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user && location.pathname !== "/login") {
      navigate("/login");
    }
  }, [location.pathname, navigate, user]);


  return (
    <>
      {location.pathname !== "/login" && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
