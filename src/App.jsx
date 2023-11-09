import { Route, Routes } from 'react-router-dom'
import Home from './page/home'
import AppContainer from './components/AppContainer'


function App() {
  return (
    <AppContainer>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:idBill" element="" />
      </Routes>
    </AppContainer>
  )
}

export default App
