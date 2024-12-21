import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import ProductDisplay from './ProductDisplay';
import { ShopContext } from '../../context/ProductContext';

export default function Product() {
  const { allProducts } = useContext(ShopContext);
  const { productId } = useParams();
  
  console.log('Product ID from URL:', productId);  // Log productId to verify it

  // Find the product based on the productId from the URL
  const product = allProducts.find((e) => e._id.toString() === productId.toString());

  
  console.log('Found product:', product);  // Log the product to verify

  return (
    <div className='productDisplayMain'>
      {product ? <ProductDisplay product={product} /> : <p>Product not found.</p>} {/* Handle case when product is not found */}
    </div>
  );
}
