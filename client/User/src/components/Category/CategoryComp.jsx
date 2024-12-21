import React, { useContext } from 'react';
import { ShopContext } from '../../context/ProductContext';
import { Link } from 'react-router-dom';
import './CategoryComp.css'; // Assuming you have a separate CSS file for styling

export default function CategoryComp(props) {
  const { addToCart } = useContext(ShopContext); // Accessing the context to add items to the cart

  return (
    <div className='product-card'>
      <Link to={`/product/${props.id}`} className='product-image-link'>
        <img className='product-image' src={props.image} alt={props.name} />
      </Link>

      <div className='product-details'>
        <h4 className='product-title'>{props.name}</h4>
        <p className='product-description'>{props.description}</p> {/* Show product description */}
        <div className='pricing'>
          <strong className='new-price'>${props.new_price}</strong>
          <strong className='old-price'>${props.old_price}</strong>
        </div>

        <button className='add-to-cart-btn' onClick={() => addToCart(props.id)}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}
