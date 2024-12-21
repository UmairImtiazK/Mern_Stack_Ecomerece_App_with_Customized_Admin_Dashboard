// 
import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";

const CheckoutForm = ({ order }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    setIsProcessing(true);
    const { error, paymentIntent } = await stripe.confirmCardPayment(order.clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (error) {
      console.error("Payment failed", error);
      alert("Payment failed: " + error.message);
      setIsProcessing(false);
    } else if (paymentIntent.status === "succeeded") {
      // Confirm payment in the backend
      axios
        .post("http://localhost:8000/order/payment/confirm", { orderId: order._id }, {
          headers: {
            Authorization: `Bearer ${order.user.accessToken}`,
          },
        })
        .then((response) => {
          alert("Payment successful!");
          setIsProcessing(false);
        })
        .catch((err) => {
          console.error("Payment confirmation failed", err);
          alert("Something went wrong.");
          setIsProcessing(false);
        });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={isProcessing || !stripe}>
        {isProcessing ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

export default CheckoutForm;
