import React, { useContext } from 'react';
import { ShopContext } from '../../context/ProductContext'; // Import the context
import PopularChild from './PopularChild';

export default function Popular() {
  const { popularProducts } = useContext(ShopContext); // Access the filtered products from context

  return (
    <div className='Popular--page'>
      <h1>Popular in Womens <hr /></h1>
      <div className='popular--cont'>
        <PopularChild data_product={popularProducts} /> {/* Pass the filtered products to PopularChild */}
      </div>
    </div>
  );
}
