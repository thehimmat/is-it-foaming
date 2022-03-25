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

  return (
    <>
      {reactor.data.slice(0, displayCount).map((reactor, idx) => {
        return <img style={imageStyle} src={reactor.url} alt='reactor image' key={idx} />
      })}
    </>
  )
}

export default ImageGallery;
