import { Route, Routes, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useEffect } from "react";

import AppContainer from "./components/AppContainer";
import Home from "./page/home";
import Assign from "./page/assign";
import Split from "./page/split";
import LandingPage from "./page/landing/LandingPage";

function App() {
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookie, removeCookie] = useCookies(["session"]);

  useEffect(() => {
    const userID = cookies?.userID;
    if (!userID) return;

    const userData = localStorage.getItem(userID);
    if (userID && userData) navigate("/create");
  }, [cookies?.userID, navigate]);

  return (
    <AppContainer>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create" element={<Home />} />
        <Route path="/assign" element={<Assign />} />
        <Route path="/splits/:id" element={<Split />} />
      </Routes>
    </AppContainer>
  );
}

export default App;
