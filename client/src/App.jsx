import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './screens/Home'
import Sign_up from './screens/Sign_up'
import Sign_in from './screens/Sign_in'
import ForgetPass from './screens/ForgetPass'
import Protected from './utils/Protected'
import ResetPass from './screens/ResetPass'
import ResetProtect from './utils/ResetProtect'
import EditUser from './screens/EditUser'
import Cart from './screens/Cart'
import Checkout from './screens/Checkout'
import Orders from './screens/Orders'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<Protected Component={<Sign_in />} />} />
        <Route exact path='/signup' element={<Protected Component={<Sign_up />} />} />
        <Route exact path='/home' element={<Protected Component={<Home />} />} />
        <Route exact path='/forget-password' element={<Protected Component={<ForgetPass />} />} />
        <Route exact path='/reset-password' element={<ResetProtect Component={<ResetPass />} />} />
        <Route exact path='/edit-profile' element={<Protected Component={<EditUser />} />} />
        <Route exact path='/cart' element={<Protected Component={<Cart />} />} />
        <Route exact path='/checkout' element={<Protected Component={<Checkout />} />} />
        <Route exact path='/orders' element={<Protected Component={<Orders />} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;