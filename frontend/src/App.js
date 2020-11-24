import React, { useContext, useState, useCallback, useEffect } from "react";
import {
  Switch,
  BrowserRouter as Router,
  Route,
  useParams,
  Redirect,
} from "react-router-dom";

import MainNavigation from "./shared/components/navigation/mainNavigation";
import Auth from "./users/pages/auth";
import AllTheatres from "./theatres/pages/alltheatres";
import SingleTheatre from "./theatres/pages/single-theatre";
import NewHall from "./theatres/pages/newHall";
import MyTickets from "./theatres/pages/my-tickets";

import { AuthContext } from "./shared/context/auth-context";

let logoutTimer;

function App() {
  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState(false);
  const [role, setRole] = useState(false);
  const [expirationDate, setExpirationDate] = useState();

  const login = useCallback((uid, token, role, expiratonDate) => {
    setToken(token);
    setUserId(uid);
    setRole(role);
    const tokenExpirationDate =
      expiratonDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token: token,
        role: role,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setExpirationDate(null);
    setUserId(null);
    setRole(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    if (token && expirationDate) {
      const remainingTime = expirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, role, expirationDate]);

  useEffect(() => {
    const storageData = JSON.parse(localStorage.getItem("userData"));
    if (
      storageData &&
      storageData.token &&
      new Date(storageData.expiration) > new Date()
    ) {
      login(
        storageData.userId,
        storageData.token,
        storageData.role,
        new Date(storageData.expiration)
      );
    }
  }, [login]);

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact={true}>
          <AllTheatres />
        </Route>

        <Route path="/open/:hallId" exact>
          <SingleTheatre />
        </Route>

        <Route path="/:uid/tickets" exact>
          <MyTickets />
        </Route>

        <Route path="/newHall" exact>
          <NewHall />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact={true}>
          <AllTheatres />
        </Route>
        <Route path="/open/:hallId" exact>
          <SingleTheatre />
        </Route>
        {/* <Route path="/" exact={true}>
          <Theatres />
        </Route> */}
        {/* /* <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route> */}
        <Route path="/auth" exact>
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        role: role,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
