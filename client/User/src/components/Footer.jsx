import React from "react";
import logo from "../assets/Images/logo_big.png";
export default function Footer() {
  return (
    <div className="footer--Component">
      <div className="cont--1">
        <h1>Get Exclusive offers on your Email</h1>
        <p>Suscribe to over Newsletter and Stay updated</p>
        <div className="inputBox">
          <input placeholder="Your email id" type="text" />
          <button className="btn">Suscribe</button>
        </div>
      </div>
      <div className="cont--2">
        <div>
          <img src={logo} alt="" />
          <h1>SHOPPER</h1>
        </div>
        <ul>
          <li>Contact <hr /></li>
          <li>Compnay<hr /></li>
          <li>About<hr /></li>
          <li>Offices<hr /></li>
          <li>Products<hr /></li>
        </ul>
        <p>&copy; 2024 All Right Reserved</p>
      </div>
    </div>
  );
}
