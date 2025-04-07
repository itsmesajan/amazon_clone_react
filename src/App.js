import React, {useEffect, useState} from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './Home';
import Header from './Header';
import CheckOut from './CheckOut';
import Login from './Login';
import Payment from './Payment';
import {auth} from "./firebase";
import { useStateValue } from './StateProvider';
import { loadStripe } from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";

const promise = loadStripe(
  "pk_test_51RApFW2NbvDb7AjtAWttpX8mhDtMByTKy81X27b5Zkz5phVEdcsUNWd1yVbJZjMH7HytCGmqGk0VUl7PmaiP5UqF00SmmLmieQ"
);


function App() {
  const [{},dispatch]=useStateValue();

  useEffect(()=>{
    //will only run once when the app component loads...

    auth.onAuthStateChanged((authUser) => {
      console.log("THE USER IS >>> ", authUser);
      if(authUser){
        dispatch({
          type: 'SET_USER',
          user: authUser
        })
      }else{
        dispatch({
          type: 'SET_USER',
          user: null
        })
      }
    })
  },[])

  return (
    // BEM
    <Router>
    <div className="App">
     <Routes>
      <Route path="/Orders"  
        element={
          <>
          <Header/>
          </>
        }>
        </Route>


      <Route path="/login" element={<Login/>}>
      </Route>

        <Route path="/CheckOut"  
        element={
          <>
          <Header/>
          <CheckOut/>
          </>
        }>
        </Route>

        <Route path="/payment"  
        element={
        <>
        <Header/>
        <Elements stripe = {promise}>
          <Payment/> 
        </Elements>
        </>
        }>
          
        </Route>
        <Route exact path="/"  element={ <>
        <Header/>
        <Home/>
        </>}>
        </Route>
      </Routes>
    </div>
    </Router>
  );
}

export default App;
