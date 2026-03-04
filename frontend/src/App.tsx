
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Signin from './components/Signin'
import DashBoard from './pages/Dashboard'
import SalesBill from './components/SalesBill'
import Temp from './pages/Temp'


function App() {


  return (
    <>
      <Routes>
        <Route path='/signin' element={<Signin />} />
        <Route path='/' element={<DashBoard />} />
        <Route path='/bill' element={<SalesBill />} />
        <Route path='/temp' element={<Temp />} />
      </Routes>
    </>
  )
}

export default App
