import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './ImageGallery.css';
import reactor from './reactorData.js';

const imageDivStyle = {
  border: 'black 1px solid',
  margin: '5px',
  display: 'grid'
}
const imageStyle = {
  maxWidth: '90%',
  padding: '1vh',
}

function ImageGallery() {
  const [displayCount, setDisplayCount] = useState(12);
  const [filter, setFilter] = useState('no filter');
  const [foamingList, setFoamingList] = useState([]);
  const [notFoamingList, setNotFoamingList] = useState([]);

  const ref = useRef();

  useEffect(() => {
    axios({
      url: '/foaming'
    })
      .then(imageList => {
        setFoamingList(imageList)
      })
      .catch(err => {
        console.error(err)
      })

    axios({
      url: '/notFoaming'
    })
      .then(imageList => {
        setNotFoamingList(imageList)
      })
      .catch(err => {
        console.error(err)
      })
  })

  const gridItems = ['item1', 'item2', 'item3'];

  const parsePhotoDate = (photoURL) => {
    return photoURL.slice(74, 84);
  }

  const parsePhotoTime = (photoURL) => {
    return photoURL.slice(89, 96);
  }

  const tagButton = (label, params) => {
    return (
      <button onClick={() => {
          params.tag = label;
          console.log('perform ' + label + ' axios request with ', params)
          axios({
            method: 'POST',
            url: '/' + label,
            data: params,
          })
            .then(() => {
              console.log('successfully tagged image as ' + label)
            })
            .catch(err => {
              console.error(err);
            })
        }}
      >
        {label}
      </button>
    )
  }

  const changeFilter = (e) => {
    setFilter(e.target.value);
  }

  const onScroll = () => {
    if (ref.current) {
      const { scrollTop, scrollHeight, clientHeight } = ref.current;
      if (scrollTop + clientHeight === scrollHeight) {
        setDisplayCount(displayCount + 3);
      }
    }
  }

  const filteredImages = (filter) => {
    if (filter === 'no filter') {
      return (
        reactor.data.slice(0, displayCount).map((reactor, idx) => {
          const params = {
            url: reactor.url,
            time: new Date(),
            index: idx,
          }
          return <div className={gridItems[idx%3]} style={imageDivStyle}>
            <img style={imageStyle} src={reactor.url} alt='reactor' key={idx} />
            <p style={{fontSize: '10px', margin: '0px'}}>
              image taken on {parsePhotoDate(reactor.url)}
              at {parsePhotoTime(reactor.url)}
            </p>
            <p>
              Mark image as: {tagButton('foaming', params)} {tagButton('notFoaming', params)}
            </p>
          </div>
        })
      )
    } else if (filter === 'foaming') {
      return (
        foamingList.slice(0, displayCount).map((reactor, idx) => {
          return <div className={gridItems[idx%3]} style={imageDivStyle}>
            <img style={imageStyle} src={reactor.url} alt='reactor' key={idx} />
            <p style={{fontSize: '10px', margin: '0px'}}>
              image taken on {parsePhotoDate(reactor.url)}
              at {parsePhotoTime(reactor.url)}
            </p>
            <p>
              Image marked as <b>FOAMY</b>
            </p>
          </div>
        })
      )
    } else if (filter === 'notFoaming') {
      return (
        notFoamingList.slice(0, displayCount).map((reactor, idx) => {
          return <div className={gridItems[idx%3]} style={imageDivStyle}>
            <img style={imageStyle} src={reactor.url} alt='reactor' key={idx} />
            <p style={{fontSize: '10px', margin: '0px'}}>
              image taken on {parsePhotoDate(reactor.url)}
              at {parsePhotoTime(reactor.url)}
            </p>
            <p>
              Image marked as <b>FOAMY</b>
            </p>
          </div>
        })
      )
    }
  }

  return (
    <>
      <div onChange={changeFilter}>
        Select a filter:
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
          value="notFoaming"
          name="filter"
          checked={filter === "notFoaming"}
        />
        not foaming
      </div>
      <div
        className="grid-container"
        onScroll={onScroll}
        ref={ref}
        style={{ height: "75vh", overflowY: "auto" }}
      >
        {reactor.data.slice(0, displayCount).map((reactor, idx) => {
          const params = {
            url: reactor.url,
            time: new Date(),
            index: idx,
          }
          return <div className={gridItems[idx%3]} style={imageDivStyle}>
            <img style={imageStyle} src={reactor.url} alt='reactor' key={idx} />
            <p style={{fontSize: '10px', margin: '0px'}}>
              image taken on {parsePhotoDate(reactor.url)}
              at {parsePhotoTime(reactor.url)}
            </p>
            <p>
              Mark image as: {tagButton('foaming', params)} {tagButton('notFoaming', params)}
            </p>
          </div>
        })}
      </div>
    </>
  )
}

export default ImageGallery;
