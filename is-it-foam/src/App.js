import React from 'react';
import ImageGallery from './ImageGallery.js';
import './App.css';
import reactor from './reactorData.js';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        Is It Foaming or Not?
      </header>
      <p className="App-intro">
        This application allows you to view images of reactors and mark them as foaming or not foaming. Please scroll through the images below and mark them appropriately. If you would like to only see images with certain tags (or absence thereof), you can use the filter function.

        Thank you for using this application!
      </p>
      <ImageGallery />
    </div>
  );
}

export default App;
