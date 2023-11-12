import { Route, Routes } from 'react-router-dom'
import Home from './page/home'
import AppContainer from './components/AppContainer'
import Assign from './page/assign'


function App() {
  return (
    <AppContainer>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:idBill" element={<Assign />} />
        <Route path="/:ownerID" element="" />
      </Routes>
    </AppContainer>
  )
}

export default App
