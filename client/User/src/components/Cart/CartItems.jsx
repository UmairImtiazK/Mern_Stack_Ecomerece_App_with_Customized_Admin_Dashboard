import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing
import { ShopContext } from "../../context/ProductContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRemove } from "@fortawesome/free-solid-svg-icons";
import Loader from "../loader/Loader"; // Import the loader component

export default function CartItems() {
  const { cartItems, removeFromCart, allProducts, clearCart } = useContext(ShopContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // State to track loading status

  // Flatten cartItems and handle undefined cases
  const items = cartItems && cartItems.length > 0
    ? cartItems.flatMap(cart => cart.items || [])
    : [];

  useEffect(() => {
    if (cartItems && allProducts) {
      setLoading(false); // Set loading to false when data is loaded
    }
  }, [cartItems, allProducts]); // Re-run when cartItems or allProducts change

  const handleOrderNow = () => {
    if (items.length === 0) {
      alert("Your cart is empty. Add items to proceed.");
      return;
    }
    navigate("/order-checkout", { state: { cartItems: items } }); // Navigate with cart data
  };

  return (
    <div className="cartMainParent">
      {loading ? (
        <Loader /> // Show loader when loading is true
      ) : (
        <div className="cartItemMain">
          <div className="cartItems">
            <div className="itemsHeading">
              <div className="group--1">
                <p>Products</p>
                <p>Title</p>
              </div>
              <div className="group--2">
                <p>Price</p>
                <p>Quantity</p>
                <p>Discount</p>
                <p>Remove</p>
              </div>
            </div>
            <p>____________________________________________________________________________________________________________________</p>

            <button onClick={clearCart}>Clear All Cart Items</button>

            {items.length > 0 ? (
              items.map(cartItem => {
                const product = allProducts.find(item => item._id === cartItem.product._id);

                if (product) {
                  return (
                    <div key={cartItem._id}>
                      <div className="itemDetail">
                        <img src={product.image} alt={product.name} />
                        <p className="title">{product.name}</p>
                        <p className="price">${product.new_price}</p>
                        <strong className="quantity">{cartItem.quantity}</strong>
                        <p className="discount">${product.old_price - product.new_price}</p>
                        <FontAwesomeIcon
                          onClick={() => removeFromCart(cartItem._id)}
                          icon={faRemove}
                        />
                      </div>
                      <p>___________________________________________________________________________________________________________</p>
                    </div>
                  );
                }

                return (
                  <div key={cartItem._id}>
                    <p>Product not found</p>
                  </div>
                );
              })
            ) : (
              <p>No items in the cart.</p>
            )}

            {/* Order Now Button */}
            <button onClick={handleOrderNow}>Order Now</button>
          </div>
        </div>
      )}
    </div>
  );
}
