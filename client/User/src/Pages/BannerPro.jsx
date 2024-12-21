import React from 'react'

export default function Banner(props) {
  return (
    <div className="Hero--Component Banner">
      <div className="cont--1">
        <h1>
          Flat 50%
            <br /> OFF
         For You <br /> 
         12 hours 12 minutes
        </h1>
        <button className="btn">Explore Now</button>
      </div>
      <div className="cont--2">
        <img src={props.banner} alt="" />
      </div>
    </div>
  )
}
