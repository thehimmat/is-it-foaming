import React from 'react';
import ImageGallery from './ImageGallery.js';
import culture from './culture.jpg';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="App-grid-container">
        <img src={culture} alt="culture" className="App-culture"/>
        <header className="App-header">
          Is It Foaming?
        </header>
        <a className="App-button" href='https://github.com/thehimmat/is-it-foaming' target="_blank" rel="noreferrer">
          GitHub repo for this app
        </a>
      </div>
      <br/>
      <p className="App-intro">
        This application allows you to view images of reactors and mark them as foaming or not foaming.
      </p>
      <ImageGallery />
    </div>
  );
}

export default App;
