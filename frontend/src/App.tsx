
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Signin from './components/Signin'
import DashBoard from './pages/Dashboard'

function App() {


  return (
    <>
      <Routes>
        <Route path='/signin' element={<Signin />} />
        <Route path='/' element={<DashBoard />} />
      </Routes>
    </>
  )
}

export default App
