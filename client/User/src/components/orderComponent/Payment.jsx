import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./PaymentPage.css"; // Import custom styles

const PaymentPage = () => {
  const { user } = useAuth();
  const { orderId } = useParams();
  const navigate = useNavigate(); // Hook for navigation
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/order/payment/${orderId}`, {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      })
      .then((response) => {
        setOrder(response.data.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch order details", err);
        setError("Failed to fetch order details. Please try again.");
        setIsLoading(false);
      });
  }, [orderId, user?.accessToken]);

  const handlePayment = () => {
    axios
      .post(
        "http://localhost:8000/order/payment",
        { orderId },
        {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        }
      )
      .then(() => {
        setPaymentStatus("Payment successful!");
        // Redirect to order history
        setTimeout(() => {
          navigate("/order-history");
        }, 2000); // Delay for user to see the success message
      })
      .catch(() => setPaymentStatus("Payment failed. Please try again."));
  };

  if (isLoading) {
    return <p className="loading-text">Loading order details...</p>;
  }

  if (error) {
    return <p className="error-text">{error}</p>;
  }

  if (!order || !order.items) {
    return <p className="error-text">Order not found</p>;
  }

  return (
    <div className="payment-page-container">
      <div className="payment-card">
        <h2 className="payment-title">Payment for Order #{order._id}</h2>
        <div className="order-items">
          <h3>Order Items:</h3>
          <ul>
            {order.items.map((item, index) => (
              <li key={index}>
                <span className="product-name">{item.product.name}</span> -{" "}
                <span>
                  {item.quantity} x ${item.price}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="order-total">
          <p>
            Total: <span>${order.totalAmount}</span>
          </p>
        </div>
        <button className="pay-button" onClick={handlePayment}>
          Pay Now
        </button>
        {paymentStatus && (
          <p
            className={`payment-status ${
              paymentStatus.includes("successful")
                ? "success-text"
                : "error-text"
            }`}
          >
            {paymentStatus}
          </p>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
