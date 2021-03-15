import React, { useState } from 'react'

import './App.css';
import Chat from './Chat';
import Sidebar from './Sidebar';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function App() {
  const [user, setUser] = useState(null)
  
  return (
    <div className="app">
    
        {!user? (
          <h1>LOG IN</h1>
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
