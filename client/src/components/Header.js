import React from "react";
import { NavLink } from "react-router-dom";
import classes from "./Header.module.css";
const Header = ({ account }) => {
  return (
    <nav className="navbar navbar-dark fixed-top bg-dark p-2 shadow">
      <span className="navbar-brand col-sm-3 col-md-2 mr-0">UBPrep</span>
      <NavLink
        exact
        activeClassName={classes.active}
        className={classes.headerItems}
        to="/"
      >
        Home
      </NavLink>
      <NavLink
        activeClassName={classes.active}
        className={classes.headerItems}
        to="/courses"
      >
        Courses
      </NavLink>
      <NavLink
        activeClassName={classes.active}
        className={classes.headerItems}
        to="/addCourse"
      >
        Add Course
      </NavLink>
      <ul className="navbar-nav px-3">
        <li className="nav-item text-nowrap d-sm-block">
          <small className="text-white">
            <span id="account">My a/c address: {account}</span>
          </small>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
