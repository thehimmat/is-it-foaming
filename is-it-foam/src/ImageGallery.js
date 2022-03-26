import React, { useState, useEffect } from 'react';
import reactor from './reactorData.js';

const imageStyle = {
  maxWidth: '30%',
  padding: '1vh',
  border: 'black 2px solid'
}

const tagButton = () => {
  return (
    <button

    />
  )
}

function ImageGallery() {
  const [displayCount, setDisplayCount] = useState(6);
  const [filter, setFilter] = useState('no filter');

  const changeFilter = (e) => {
    setFilter(e.target.value);
  }

  return (
    <>
      <div onChange={changeFilter}>
        <input
          type="radio"
          value="no filter"
          name="filter"
          checked={filter === "no filter"}
        />
        no filter
        <input
          type="radio"
          value="unclassified"
          name="filter"
          checked={filter === "unclassified"}
        />
        unclassified
        <input
          type="radio"
          value="foaming"
          name="filter"
          checked={filter === "foaming"}
        />
        foaming
        <input
          type="radio"
          value="not foaming"
          name="filter"
          checked={filter === "not foaming"}
        />
        not foaming
      </div>
      {reactor.data.slice(0, displayCount).map((reactor, idx) => {
        return <img style={imageStyle} src={reactor.url} alt='reactor image' key={idx} />
      })}
    </>
  )
}

export default ImageGallery;
