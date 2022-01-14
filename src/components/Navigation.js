import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as HomeIcon } from "components/Icon.svg";

const Navigation = ({ userObj }) => (
  <nav className="nav">
    <ul className="">
      <li>
        <Link to="/">
          <HomeIcon className="nav__homeBtn" />
        </Link>
      </li>
      <li className="nav__profileBtn">
        <Link to="/profile">
          {userObj?.displayName?.length
            ? `${userObj.displayName}님의 Profile`
            : "Profile"}
        </Link>
      </li>
    </ul>
  </nav>
);
export default Navigation;
