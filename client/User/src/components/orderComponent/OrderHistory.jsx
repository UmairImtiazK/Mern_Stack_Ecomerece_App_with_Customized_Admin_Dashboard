import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import "./OrderHistoryPage.css"; // Import the custom CSS

const OrderHistoryPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch orders for the logged-in user
    axios
      .get("http://localhost:8000/order/user-orders", {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      })
      .then((response) => {
        setOrders(response.data.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch orders", err);
        setIsLoading(false);
      });
  }, [user.accessToken]);

  return (
    <div className="order-history-page">
      <h2>Your Order History</h2>
      {isLoading ? (
        <p className="loading-text">Loading your orders...</p>
      ) : orders.length > 0 ? (
        <ul>
          {orders.map((order) => (
            <li key={order._id}>
              <p>Order #{order._id} - Status: {order.status}</p>
              <p>Total: ${order.totalAmount}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty-text">No orders found.</p>
      )}
    </div>
  );
};

export default OrderHistoryPage;
