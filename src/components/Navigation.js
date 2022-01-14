import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as HomeIcon } from "components/img/Icon.svg";
import { ReactComponent as UserIcon } from "components/img/user_icon.svg";

const Navigation = ({ userObj }) => (
  <nav className="nav">
    <ul className="nav__ul">
      <li>
        <Link to="/">
          <HomeIcon className="nav__homeIcon" />
        </Link>
      </li>
      <li>
        <Link className="nav__profileBtn" to="/profile">
          <UserIcon className="nav__profileIcon" />
          <span className="nav__profileInfo">
            {userObj?.displayName?.length
              ? `${userObj.displayName} 님의 Profile`
              : "Profile"}
          </span>
        </Link>
      </li>
    </ul>
  </nav>
);
export default Navigation;
