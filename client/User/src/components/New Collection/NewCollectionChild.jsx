import React from 'react'
import { Link } from 'react-router-dom'


export default function PopularChild({all_product}) {
  return (
    all_product.map((data,id)=>(<div className='popular--child--cont' key={id}>
      <Link to={`/product/${data._id}`}>
      <img src={data.image} alt="" />
      </Link>
      <h4>{data.name}</h4>
        <strong className='active'>${data.price}</strong>
        <strong>1000</strong>
    </div>))
  )
}
