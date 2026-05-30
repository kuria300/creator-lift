import {useState } from "react"
import './App.css'
import { Routes, Route } from "react-router-dom"
import { Login } from "./components/Login"
import { Home } from "./components/Home"
import Signin from "./components/Signin"
import ChooseRole from "./components/ChooseRole"
import Dashboard from "./components/Dashboard"
import Deals from "./components/Deals"
import Offers from "./components/Offers"

function App() {  
 
  return (
    <>
   <Routes>
     <Route path="/" element={<Home />}/>
     <Route path="/Login" element={<Login />}/>
     <Route path="/Signin/:role" element={<Signin />}/>
     <Route path="/choose-role" element={<ChooseRole />}/>
     <Route path="/dashboard" element={<Dashboard />}/>
     <Route path="/deal" element={<Deals />}/>
     <Route path="/offer" element={<Offers />}/>
   </Routes>

    </>
  )
}

export default App
