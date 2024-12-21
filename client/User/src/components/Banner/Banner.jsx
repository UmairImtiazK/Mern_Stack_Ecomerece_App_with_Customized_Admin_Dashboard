import React from 'react'

export default function Banner({ExcuisveImg}) {
  return (
    <div className="Hero--Component Banner">
      <div className="cont--1">
        <h1>
          New
          <br />
          Colletions  <br />
         For You
        </h1>
        <button className="btn">Check Now</button>
      </div>
      <div className="cont--2">
        <img src={ExcuisveImg} alt="" />
      </div>
    </div>
  )
}
