import { Route, Routes } from "react-router-dom";

import AppContainer from "./components/AppContainer";
import Home from "./page/home";
import Assign from "./page/assign";
import Split from "./page/split";
import LandingPage from "./page/landing/LandingPage";

function App() {
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
