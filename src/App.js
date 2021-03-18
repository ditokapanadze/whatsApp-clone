import React, { useState, useEffect } from 'react'
import {useStateValue} from './StateProvider'
import './App.css';
import Chat from './Chat';
import Sidebar from './Sidebar';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Login from './Login';
import axios from 'axios'
import firebase from "firebase"
import {auth} from './firebase'
import { actionTypes } from './reducer'
import Picker from 'emoji-picker-react';


function App() {
  const [{user}, dispatch] = useStateValue()


  
useEffect(() => {
    auth.onAuthStateChanged(user =>{
      if(user){
        dispatch({
          type: actionTypes.SET_USER,
          user: user,
        })
      }
    })
}, [])

  return (
    <div className="app">
    
        {!user? (
          <Login/>
        ) : (
          <div className="app_body">
              <Router>
         <Sidebar/>
          <Switch>
            <Route path="/rooms/:roomId">
              <Chat/>
            </Route>
            <Route path="/">
              <Chat/>
            </Route>
            </Switch>
        </Router>
      
       </div>
        )}
   
    </div>
  );
}

export default App;
