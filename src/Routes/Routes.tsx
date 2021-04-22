import * as React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { getAccessToken } from "../accessToken";
import Homepage from "../Pages/Homepage";
import Login from "../Pages/Login";
import Register from "../Pages/Register";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        {/* <Redirect from="/:url*(/+)" to={pathname.slice(0, -1)} /> */}
        <Route
          path="/"
          exact
          render={() => {
            return getAccessToken().length > 0 ? (
              <Redirect to="/chat" />
            ) : (
              <Login />
            );
          }}
        />
        <Route exact path="/chat" component={Homepage} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
