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
  const [taggedIndices, setTaggedIndices] = useState([]);

  const ref = useRef();

  const parseTaggedIndices = (array) => {
    if (array.length) {
      for (const i of array) {
        setTaggedIndices([i.array_index].concat(taggedIndices))
        console.log('new array: ', taggedIndices)
      }
      // sort indicex in array for faster filtering
      const sorted = taggedIndices.sort((a, b) => a - b)
      console.log('sorted tagged indices!', sorted)
      setTaggedIndices(sorted)
    }
  }

  const handleFoamingListChange = (array) => {
    setFoamingList(array)
    parseTaggedIndices(array)
    console.log('finished parsing tagged indices: ', taggedIndices);
  }

  const handleNotFoamingListChange = (array) => {
    setNotFoamingList(array)
    parseTaggedIndices(array)
    console.log('finished parsing tagged indices: ', taggedIndices);
  }

  useEffect(() => {
    axios('http://localhost:3001/foaming')
      .then(imageList => {
        console.log('foaming results: ', imageList.data)
        handleFoamingListChange(imageList.data)
      })
      .catch(err => {
        console.error(err)
      })

    axios('http://localhost:3001/notFoaming')
      .then(imageList => {
        console.log('not foaming results: ', imageList.data)
        handleNotFoamingListChange(imageList.data)
      })
      .catch(err => {
        console.error(err)
      })
  }, [])

  const gridItems = ['item1', 'item2', 'item3'];

  const parsePhotoDate = (photoURL) => {
    return photoURL.slice(74, 84);
  }

  const parsePhotoTime = (photoURL) => {
    return photoURL.slice(88, 96);
  }

  const tagButton = (label, params) => {
    return (
      <button onClick={() => {
          params.tag = label;
          console.log('perform ' + label + ' axios request with ', params)
          axios({
            method: 'POST',
            url: 'http://localhost:3001/' + label,
            data: params,
          })
            .then(result => {
              console.log(result + ' successfully tagged image as ' + label)
              label === 'foaming'
              ? setFoamingList([...foamingList, result])
              : setNotFoamingList([...notFoamingList, result])
            })
            .catch(err => {
              console.error('from button: ', err);
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
          return <div className={gridItems[idx%3]} style={imageDivStyle} key={'nd'+idx}>
            <img style={imageStyle} src={reactor.url} alt='reactor' key={'ni'+idx} />
            <p style={{fontSize: '10px', margin: '0px'}} key={'np'+idx}>
              image taken on {parsePhotoDate(reactor.url)}
              at {parsePhotoTime(reactor.url)}
            </p>
            <p key={'npp'+idx}>
              Mark image as: {tagButton('foaming', params)} {tagButton('notFoaming', params)}
            </p>
          </div>
        })
      )
    } else if (filter === 'foaming') {
      return (
        foamingList.slice(0, displayCount).map((reactor, idx) => {
          return <div className={gridItems[idx%3]} style={imageDivStyle} key={'fd'+idx}>
            <img style={imageStyle} src={reactor.image_url} alt='reactor' key={'fi'+idx} />
            <p style={{fontSize: '10px', margin: '0px'}} key={'fp'+idx}>
              image taken on {parsePhotoDate(reactor.image_url)}
              at {parsePhotoTime(reactor.image_url)}
            </p>
            <p style={{color: 'red'}} key={'fpp'+idx}>
              Image marked as <b key={'fb'+idx}>FOAMY</b>
            </p>
          </div>
        })
      )
    } else if (filter === 'notFoaming') {
      return (
        notFoamingList.slice(0, displayCount).map((reactor, idx) => {
          return <div className={gridItems[idx%3]} style={imageDivStyle} key={'nfd'+idx}>
            <img style={imageStyle} src={reactor.image_url} alt='reactor' key={'nfi'+idx} />
            <p style={{fontSize: '10px', margin: '0px'}} key={'nfp'+idx}>
              image taken on {parsePhotoDate(reactor.image_url)}
              at {parsePhotoTime(reactor.image_url)}
            </p>
            <p style={{color: 'green'}} key={'nfpp'+idx}>
              Image marked as <b key={'nfb'+idx}>NOT FOAMY</b>
            </p>
          </div>
        })
      )
    } else {
      console.log('filtering only unclassified images', taggedIndices)
      return (
        reactor.data.slice(0, displayCount)
          .filter((reactor, idx) => {
            console.log(!taggedIndices.includes(idx), idx)
            return !taggedIndices.includes(idx)
          })
          .map((reactor, idx) => {
          const params = {
            url: reactor.url,
            time: new Date(),
            index: idx,
          }
          return <div className={gridItems[idx%3]} style={imageDivStyle} key={idx}>
            <img style={imageStyle} src={reactor.url} alt='reactor' key={reactor.url.slice(88, 90)} />
            <p style={{fontSize: '10px', margin: '0px'}} key={reactor.url.slice(91, 93)}>
              image taken on {parsePhotoDate(reactor.url)}
              at {parsePhotoTime(reactor.url)}
            </p>
            <p key={reactor.url.slice(94, 96)}>
              Mark image as: {tagButton('foaming', params)} {tagButton('notFoaming', params)}
            </p>
          </div>
        })
      )
    }
  }

  return (
    <>
      <div>
        Select a filter:
        <input
          type="radio"
          value="no filter"
          name="filter"
          checked={filter === "no filter"}
          onChange={changeFilter}
        />
        no filter
        <input
          type="radio"
          value="unclassified"
          name="filter"
          checked={filter === "unclassified"}
          onChange={changeFilter}
        />
        unclassified
        <input
          type="radio"
          value="foaming"
          name="filter"
          checked={filter === "foaming"}
          onChange={changeFilter}
        />
        foaming
        <input
          type="radio"
          value="notFoaming"
          name="filter"
          checked={filter === "notFoaming"}
          onChange={changeFilter}
        />
        not foaming
      </div>
      <div
        className="grid-container"
        onScroll={onScroll}
        ref={ref}
        style={{ height: "75vh", overflowY: "auto" }}
      >
        {filteredImages(filter)}
      </div>
    </>
  )
}

export default ImageGallery;
