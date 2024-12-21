import React, { useContext, useState } from "react";
import Logo from "../assets/Images/logo.png";
import Cart from "../assets/Images/cart_icon.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ProductContext";
import { useAuth } from "../context/AuthContext"; 
export default function NavBar() {
  const [toggle, settoggle] = useState(true);
  const {calculateTotall} = useContext(ShopContext);
  const { user, logout } = useAuth(); // Use user and logout from AuthContext
  const handleonclick = () => {
    settoggle(!toggle);
  };

  const handleLogoutClick = () => {
    logout(); // Call logout from AuthContext
  };

  return (
    <div className="NavBar">
      <div className="cont--1">
        <img src={Logo} alt="" />
        <h2>SHOPPER</h2>
      </div>
      {toggle && (
        <div className="cont--2">
          <ul>
            <li className="Links">
              <Link to="/">Shop</Link>
            </li>
            <li className="Links">
              <Link to="/men">Men</Link>
            </li>
            <li className="Links">
              <Link to="/women">Women</Link>
            </li>
            <li className="Links">
              <Link to="/kids">Kids</Link>
            </li>
          </ul>
        </div>
      )}
      <div className="cont--3">
        {user ? (
          <button className="btn--auth btn--login" onClick={handleLogoutClick}>
            Logout
          </button>
        ) : (
          <Link to="/login">
            <button className="btn--auth btn--login">Login</button>
          </Link>
        )}

        <Link to='/cart'>
        <img src={Cart} alt="" />
        </Link>
        <div className="cart--icon--counter">{calculateTotall()}</div>
        <FontAwesomeIcon
          onClick={handleonclick}
          className="cheveron--icon"
          icon={!toggle ? faChevronUp : faChevronDown}
        />
      </div>
    </div>
  );
}
