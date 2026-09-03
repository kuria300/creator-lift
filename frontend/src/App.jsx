import {useState } from "react"
import './App.css'
import { Routes, Route } from "react-router-dom"
import { Login } from "../src/pages/login/Login"
import { Home } from "./components/Home"
import Signin from '../src/pages/signin/Signin'
import ChooseRole from "../src/pages/roles/ChooseRole"
import Dashboard from "./pages/dashboard/Dashboard"
import Deals from "../src/pages/deals/Deals"
import Offers from "../src/pages/offers/Offers"
import Message from "../src/pages/messages/Message"
import Support from "../src/pages/support/Support"
import Settings from "./pages/settings/Settings" 
import AppLayout from "./AppLayout"
import ProtectedRoute from "./ProtectedRoute"
import Brands from "./pages/brands/Brands"
import Payments from "./pages/Payments/Payments"

function App() {  
 
  return (
    <>
   <Routes>
     <Route path="/" element={<Home />}/>
     <Route path="/Login" element={<Login />}/>
     <Route path="/Signin/:role" element={<Signin />}/>
     <Route path="/choose-role" element={<ChooseRole />}/>

     
    <Route element={<ProtectedRoute Roles={["creator", "brand"]} />}>
      <Route element={<AppLayout />}>
      <Route path="/dashboard" element={<Dashboard />}/>
      <Route path="/deal" element={<Deals />}/>
      <Route path="/offer" element={<Offers />}/>
      <Route path="/message" element={<Message />}/>
      <Route path="/support" element={<Support />}/>
      <Route path="/settings" element={<Settings />}/>
      <Route path='/browse' element={<Brands />}/>
      <Route path='/payments' element={<Payments />}/>
      </Route>
    </Route>

    
    
    <Route path="*" element={<h1 className="text-center text-2xl font-bold mt-20">404 Not Found</h1>}/>
   </Routes>

    </>
  )
}

export default App
