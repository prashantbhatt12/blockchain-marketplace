import React from "react";
import { NavLink } from "react-router-dom";
import classes from "./Header.module.css";
import brandImage from "../resources/app-logo.jpeg";
const Header = (props) => {
  const { account, balance, isOwner } = props;
  return (
    <nav className="navbar navbar-dark fixed-top bg-dark p-2 shadow">
      <span className="navbar-brand">
        <img src={brandImage} alt="" width="40" height="40" />
        &nbsp; UBPrep
      </span>
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
      {isOwner && (
        <NavLink
          activeClassName={classes.active}
          className={classes.headerItems}
          to="/airdrop"
        >
          Air Drop
        </NavLink>
      )}
      <ul className="navbar-nav px-3">
        <li className="nav-item text-nowrap d-sm-block">
          <small className="text-white">
            <span id="account">
              <b>Balance: {balance} PRC</b>
            </span>
          </small>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <small className="text-white">
            <span id="account">
              <b>Address:</b> {account}
            </span>
          </small>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
