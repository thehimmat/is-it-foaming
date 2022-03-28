import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './ImageGallery.css';
import reactor from './reactorData.js';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

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
      const output = [];
      for (const i of array) {
        output.push(i.array_index)
      }
      const sorted = output.concat(taggedIndices).sort((a, b) => a - b)
      setTaggedIndices(() => {
        return [...sorted];
      })
    }
  }

  const handleFoamingListChange = (array) => {
    setFoamingList(array)
    parseTaggedIndices(array)
  }

  const handleNotFoamingListChange = (array) => {
    setNotFoamingList(array)
    parseTaggedIndices(array)
  }

  useEffect(() => {
    axios('http://localhost:3001/foaming')
      .then(imageList => {
        handleFoamingListChange(imageList.data)
      })
      .catch(err => {
        console.error(err)
      })

    axios('http://localhost:3001/notFoaming')
      .then(imageList => {
        handleNotFoamingListChange(imageList.data)
      })
      .catch(err => {
        console.error(err)
      })
  }, [])

  const gridItems = ['item1', 'item2', 'item3'];

  const parsePhotoDate = (imageURL) => {
    return imageURL.slice(74, 84) || 'date error';
  }

  const parsePhotoTime = (imageURL) => {
    return imageURL.slice(88, 96) || 'time error';
  }

  const tagButton = (label, params) => {
    return (
      <button onClick={() => {
          params.tag = label;
          axios({
            method: 'POST',
            url: 'http://localhost:3001/' + label,
            data: { ...params },
            params: params,
          })
            .then(result => {
              if (filter === 'unclassified') setFilter(label);
              const transform = {
                image_url: JSON.parse(result.config.data).url,
                tag: JSON.parse(result.config.data).tag,
                last_modified: JSON.parse(result.config.data).time,
                array_index: JSON.parse(result.config.data).index,
              }
              label === 'foaming'
              ? setFoamingList(prev => [...prev, transform])
              : setNotFoamingList(prev => [...prev, transform])
            })
            .catch(err => {
              console.error('from button: ', err);
            })
        }}
      >
        {label === 'foaming' ? label : 'not foaming'}
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

  const foamImageBox = (reactor, idx) => {
    return (
      <div className={gridItems[idx%3]} style={imageDivStyle} key={'fd'+idx}>
        <img style={imageStyle} src={reactor.image_url} alt='reactor' key={'fi'+idx} />
        <p style={{fontSize: '10px', margin: '0px'}} key={'fp'+idx}>
          image taken on {parsePhotoDate(reactor.image_url)} at {parsePhotoTime(reactor.image_url)}
        </p>
        <p style={{color: 'red'}} key={'fpp'+idx}>
          Image marked as <br/>
          <b key={'fb'+idx}>FOAMY</b><br/>
          {dayjs(reactor.last_modified).fromNow()}
        </p>
      </div>
    )
  }

  const notFoamImageBox = (reactor, idx) => {
    return (
      <div className={gridItems[idx%3]} style={imageDivStyle} key={'nfd'+idx}>
        <img style={imageStyle} src={reactor.image_url} alt='reactor' key={'nfi'+idx} />
        <p style={{fontSize: '10px', margin: '0px'}} key={'nfp'+idx}>
          image taken on {parsePhotoDate(reactor.image_url)} at {parsePhotoTime(reactor.image_url)}
        </p>
        <p style={{color: 'green'}} key={'nfpp'+idx}>
          Image marked as<br/>
          <b key={'nfb'+idx}>NOT FOAMY</b><br/>
          {dayjs(reactor.last_modified).fromNow()}
        </p>
      </div>
    )
  }

  const unclassifiedImageBox = (reactor, idx) => {
    const params = {
      url: reactor.url,
      time: new Date(),
      index: idx,
    }
    return (
      <div className={gridItems[idx%3]} style={imageDivStyle} key={'nd'+idx}>
        <img style={imageStyle} src={reactor.url} alt='reactor' key={'ni'+idx} />
        <p style={{fontSize: '10px', margin: '0px'}} key={'np'+idx}>
          image taken on {parsePhotoDate(reactor.url)} at {parsePhotoTime(reactor.url)}
        </p>
        <p key={'npp'+idx}>
          <b key={'npp'+idx}>UNCLASSIFIED</b><br/>
          Mark image as:<br/>
          {tagButton('foaming', params)} {tagButton('notFoaming', params)}
        </p>
      </div>
    )
  }

  const filteredImages = (filter) => {
    if (filter === 'no filter' && (foamingList[0] || notFoamingList[0])) {
      let pointer = 0;
      let foamPointer = 0;
      let notFoamPointer = 0;
      const coallatedImages = [];
      while ((foamingList[foamPointer] || notFoamingList[notFoamPointer]) || pointer <= 2100) {
        if (foamingList[foamPointer] && pointer > foamingList[foamPointer].array_index) { //check if pointer got ahead of foamPointer
          foamPointer++;
        } else if (notFoamingList[notFoamPointer] && pointer > notFoamingList[notFoamPointer].array_index) { //check if pointer got ahead of notFoamPointer
          notFoamPointer++;
        } else if (foamingList[foamPointer] && foamingList[foamPointer].array_index === pointer) { //if current image is tagged and foaming
          coallatedImages.push(foamingList[foamPointer++]);
          pointer++;
        } else if (notFoamingList[notFoamPointer] && notFoamingList[notFoamPointer].array_index === pointer) { //if current image is tagged and not foaming
          coallatedImages.push(notFoamingList[notFoamPointer++]);
          pointer++;
        } else { // if current image isn't tagged, push original
          coallatedImages.push(reactor.data[pointer++])
        }
      }
      return (
        coallatedImages.slice(0, displayCount).map((reactor, idx) => {
          if (reactor.tag === 'foaming') {
            return foamImageBox(reactor, idx);
          } else if (reactor.tag === 'notFoaming') {
            return notFoamImageBox(reactor, idx);
          } else {
            return unclassifiedImageBox(reactor, idx);
            }
        })
      )
    } else if (filter === 'foaming') {
      return !foamingList.length
        ? <p style={{fontSize: '30px'}}>There are no images tagged as <b style={{color: 'red'}}>FOAMY</b> yet.</p>
        : (
        foamingList.slice(0, displayCount).map((reactor, idx) => {
          return foamImageBox(reactor, idx);
        })
      )
    } else if (filter === 'notFoaming') {
      return  !notFoamingList.length
      ? <p style={{fontSize: '30px'}}>There are no images tagged as <b style={{color: 'green'}}> NOT FOAMY</b> yet.</p>
      : (
        notFoamingList.slice(0, displayCount).map((reactor, idx) => {
          return notFoamImageBox(reactor, idx);
        })
      )
    } else {
      let pointer = 0; // for filtering out tagged images
      return (
        reactor.data.slice(0, displayCount)
          .filter((reactor, idx) => {
            return taggedIndices[pointer++] !== idx ? true : false;
          })
          .map((reactor, idx) => {
            return unclassifiedImageBox(reactor, idx);
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
