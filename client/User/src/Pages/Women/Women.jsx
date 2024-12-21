import React,{useContext} from 'react'
import BannerImg from '../../assets/Images/banner_women.png';
import {ShopContext} from '../../context/ProductContext';
import { Link } from 'react-router-dom'

export default function Women(props) {
  const {womenProducts} = useContext(ShopContext);
  return (
    <>
    <img src={BannerImg} alt="" />
    <div className='Popular--page'>
    <div className='popular--cont'>{
    womenProducts.map((data,id)=>(<div className='popular--child--cont' key={id}>
     <Link to={`/product/${data._id}`}>
      <img src={data.image} alt="" />
     </Link>
      <h4>{data.name}</h4>
        <strong className='active'>${data.price}</strong>
        <strong>1000</strong>
    </div>))}
    </div>
      
    </div>
    </>
  )
}
