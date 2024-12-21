import React,{useContext} from 'react'
import NewCollectionChild from './NewCollectionChild';
import {ShopContext} from '../../context/ProductContext';


export default function Popular() {
    
  const {allProducts} = useContext(ShopContext);
  return (
    <div className='newCollections--page'>
      <h1>New Collections <hr /></h1>
      <div className='popular--cont NewCollectionComp'>
        <NewCollectionChild all_product={allProducts} />
      </div>
    </div>
  )
}
