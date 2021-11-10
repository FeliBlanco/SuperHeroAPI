import React from "react";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

import Home from './routes/Home/index'
import Login from './routes/Login/index'

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Home} exact/>
        <Route path="/login" component={Login} exact/>
      </Switch>
    </Router>
  );
}

export default App;
