import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

export const ShopContext = createContext(null);

export default function ShopCategoryComp(props) {
  const [cartItems, setCartItems] = useState({});
  const [popularProducts, setPopularProducts] = useState([]); // State for storing popular products
  const [allProducts, setAllProducts] = useState([]); // State for storing all products
  const { user } = useAuth();
  const [mensProducts, setMensProducts] = useState([]);
  const [womenProducts, setWomenProducts] = useState([]);
  const [kidsProducts, setKidsProducts] = useState([]);

  // Fetch popular products from backend on initial load
  useEffect(() => {
    axios
      .get("http://localhost:8000/product/all") // Adjust the URL based on your API endpoint
      .then((response) => {
        // Check if response.data contains the structure { data: products, message: "some message" }
        if (response.data && Array.isArray(response.data.data)) {
          const popular = response.data.data.filter(
            (product) => product.category === "popular"
          );
          setPopularProducts(popular); // Filter products by category 'popular'
        } else {
          console.error(
            "Data format error: response.data.data is not an array"
          );
        }
      })
      .catch((err) => console.error("Failed to fetch products", err));
  }, []);


  useEffect(() => {
    axios
      .get("http://localhost:8000/product/all") // Adjust the URL based on your API endpoint
      .then((response) => {
        // Check if response.data contains the structure { data: products, message: "some message" }
        if (response.data && Array.isArray(response.data.data)) {
          const mens = response.data.data.filter(
            (product) => product.category === "men"
          );
          setMensProducts(mens); // Filter products by category 'popular'
        } else {
          console.error(
            "Data format error: response.data.data is not an array"
          );
        }
      })
      .catch((err) => console.error("Failed to fetch products", err));
  }, []);


useEffect(() => {
    axios
      .get("http://localhost:8000/product/all") // Adjust the URL based on your API endpoint
      .then((response) => {
        // Check if response.data contains the structure { data: products, message: "some message" }
        if (response.data && Array.isArray(response.data.data)) {
          const women = response.data.data.filter(
            (product) => product.category === "women"
          );
          setWomenProducts(women); // Filter products by category 'popular'
        } else {
          console.error(
            "Data format error: response.data.data is not an array"
          );
        }
      })
      .catch((err) => console.error("Failed to fetch products", err));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8000/product/all") // Adjust the URL based on your API endpoint
      .then((response) => {
        // Check if response.data contains the structure { data: products, message: "some message" }
        if (response.data && Array.isArray(response.data.data)) {
          const kids = response.data.data.filter(
            (product) => product.category === "kids"
          );
          setKidsProducts(kids); // Filter products by category 'popular'
        } else {
          console.error(
            "Data format error: response.data.data is not an array"
          );
        }
      })
      .catch((err) => console.error("Failed to fetch products", err));
  }, []);

  // Fetch all products from the backend and store them
  useEffect(() => {
    axios
      .get("http://localhost:8000/product/all") // Adjust the URL based on your API endpoint
      .then((response) => {
        // Assuming response.data contains the structure { data: products, message: "some message" }
        if (response.data && Array.isArray(response.data.data)) {
          setAllProducts(response.data.data);
          console.log("all products:",response.data.data); // Set all products from response
        } else {
          console.error(
            "Data format error: response.data.data is not an array"
          );
        }
      })
      .catch((err) => console.error("Failed to fetch all products", err));
  }, []);


  const fetchCart = () => {
    if (user) {
      axios.get("http://localhost:8000/cart/all", {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        })
        .then((response) => {
          console.log("respnonse data is: ",response.data)
          setCartItems(response.data.data); // Set cart data
        })
        .catch((err) => console.error("Failed to fetch cart", err));
    }
  };

  // Fetch cart data on user login
  useEffect(() => {
    if (user) {
      fetchCart(); // Fetch cart when user logs in
    }
  }, [user]);


  // Function to add item to the cart
  const addToCart = (itemId) => {
    if (!user) {
      alert("You need to be logged in to add items to your cart.");
      return; // User is not logged in, do not add to cart
    }

    console.log("user: ", user, "item id: ", itemId);
    console.log("token: ", user);
    const quantity = 1;
    axios
      .post(
        "http://localhost:8000/cart/add-item",
        {
          itemId,
          quantity: 1, // or use a dynamic quantity value
        },
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`, // Pass token for backend user extraction
          },
        }
      )
      .then((response) => {
        console.log("respone data:", response.data.data);
        console.log("respone:", response);
        setCartItems(response.data.data);
        fetchCart(); // Re-fetch the updated cart after adding the item
        alert("item added to cart successfully!!");
      })
      .catch((err) => console.error("Failed to add item to cart", err));
  };

  // Function to remove item from the cart
  const removeFromCart = (itemId) => {
  console.log("Access token for removing cart:", user.accessToken);

  // Ensure the itemId is passed correctly as part of the body
  axios
    .delete(
      "http://localhost:8000/cart/remove-item", 
      {
        data: { itemId },  // Correctly pass the data in the request body
        headers: {
          Authorization: `Bearer ${user.accessToken}`, // Pass token for backend user extraction
        },
      }
    )
    .then((response) => {
      // Update cart items with the response data
      fetchCart(); // Re-fetch the updated cart after adding the item
      setCartItems(response.data.data);  // Assuming response contains { data: updatedCart }
      // Show success message after item is removed
      alert("Item removed from cart!");
    })
    .catch((error) => {
      // Handle errors if any
      console.error("There was an error removing the item from the cart:", error);
      alert("An error occurred while removing the item. Please try again.");
    });
};


  // Function to clear the cart
  const clearCart = () => {
    axios
      .delete("/api/cart/clear")
      .then(() =>{ setCartItems({})
      fetchCart(); // Re-fetch the updated cart after adding the item
  }
    )
      .catch((err) => console.error("Failed to clear cart", err));
  };

  // Calculate total quantity in the cart
  const calculateTotall = () => {
    if (!Array.isArray(cartItems)) {
      return 0;
    }
  
    console.log("cart items: ", cartItems);
  
    return cartItems
      .flatMap(cartItem => cartItem.items) // Flatten all items into a single array
      .reduce((total, item) => {
        const validQty = Number(item.quantity);
        return !isNaN(validQty) ? total + validQty : total;
      }, 0);
  };
  

  // Provide context values
  const contextValue = {
    calculateTotall,
    popularProducts, // Provide filtered popular products
    allProducts, // Provide all products
    mensProducts,
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    womenProducts,
    kidsProducts,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
}
