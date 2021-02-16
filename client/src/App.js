import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Home from "./views/home";
import Main from "./views/main";
import Result from "./views/result";
import "./App.css";

const App = () => {
  return (
    <div className="app">
      <Switch>
        <Route path="/home" component={Home} />
        <Route path="/main" component={Main} />
        <Route path="/result" component={Result} />
        <Route path="*" render={() => <Redirect to="/home" />} />
      </Switch>
    </div>
  );
};

export default App;
