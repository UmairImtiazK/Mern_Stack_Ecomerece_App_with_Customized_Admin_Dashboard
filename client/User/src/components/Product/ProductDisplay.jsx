import React, { useContext } from 'react';
import CategoryComp from '../Category/CategoryComp';
import { ShopContext } from '../../context/ProductContext';

export default function ShopCategory({product}) {
  const { allProducts } = useContext(ShopContext); // Fetch products from context
  return (
    <div className='shop--cont'>
      {allProducts.map((item, i) => {
        console.log("category:",product.category)
        if (product._id === item._id.toString()) {
          return (
            <CategoryComp
              key={i}
              id={item._id}
              name={item.name}
              image={item.image}
              new_price={item.price}
              old_price={"1000"}
            />
          );
        } else {
          return null;
        }
      })}
    </div>
  );
}
