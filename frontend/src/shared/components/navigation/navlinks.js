import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import "./navlinks.css";
import { AuthContext } from "../../context/auth-context";

function NavLinks(props) {
  const auth = useContext(AuthContext); //global scope elements

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact>
          ALL THEATRES
        </NavLink>
      </li>
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/${auth.userId}/tickets`}>MY TICKETS</NavLink>
        </li>
      )}
      {auth.isLoggedIn && auth.role === "admin" && (
        <li>
          <NavLink to="/newHall">NEW HALL</NavLink>
        </li>
      )}

      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">AUTHENTICATE</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button onClick={auth.logout}>LOGOUT</button>
        </li>
      )}
    </ul>
  );
}

export default NavLinks;
