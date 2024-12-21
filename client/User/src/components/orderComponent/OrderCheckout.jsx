import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import "./OrderCheckout.css";

export default function OrderCheckout() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Retrieve cart items from state
  const cartItems = location.state?.cartItems || [];

  const createOrder = () => {
    if (!user) {
      alert("You need to be logged in to place an order.");
      return;
    }

    if (!address.trim()) {
      alert("Address is required!");
      return;
    }

    const items = cartItems.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price, // Ensure price is included here
    }));

    setIsLoading(true);
    axios
      .post("http://localhost:8000/order/create", { items, address }, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      })
      .then(response => {
        setIsLoading(false);
        console.log("order id: ",response.data.data._id)
        // Redirect to payment page with orderId
        navigate(`/payment/${response.data.data._id}`);
      })
      .catch(err => {
        setIsLoading(false);
        console.error("Failed to place order", err);
        alert("Something went wrong while placing the order.");
      });
  };

  return (
    <div className="order-checkout-container">
      <h2 className="order-checkout-title">Order Checkout</h2>

      <div className="order-checkout-items">
        {cartItems.length > 0 ? (
          <ul className="cart-item-list">
            {cartItems.map((item, index) => (
              <li key={index} className="cart-item">
                <div className="item-details">
                  <span className="item-name">{item.product.name}</span>
                  <span className="item-quantity">{item.quantity} x</span>
                  <span className="item-price">${item.product.new_price}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-cart-message">Your cart is empty.</p>
        )}
      </div>

      <div className="order-address-section">
        <textarea
          className="address-input"
          placeholder="Enter delivery address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        ></textarea>
      </div>

      <button
        className={`order-button ${isLoading ? "loading" : ""}`}
        onClick={createOrder}
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Place Order"}
      </button>
    </div>
  );
}
