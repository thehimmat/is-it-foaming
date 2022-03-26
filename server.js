const express = require('express');
const cors = require('cors');
// const path = require('path');
const db = require('./database.js');

const app = express();
app.use(cors());

app.set("port", process.env.PORT || 3001);
// app.use(express.static(__dirname + '/../src'));
// app.use(express.json());

async function postImage(url, time, tag, index) {
  const image = db`
    INSERT INTO reactorfoam
      (image_url, last_modified, tag, array_index)
    VALUES
      (${url}, ${time}, ${tag}, ${index});
  `
  return image;
}

async function getImages(tag) {
  const imageList = db`
    SELECT * FROM reactorfoam
    WHERE tag = ${tag};
  `
  return imageList;
}

// post new foaming image to DB
app.post('/foaming', function(req, res) {
  console.log('receiving foaming POST request')
  const {url, time, index, tag} = req.body;
  postImage(url, time, tag, index)
    .then(image => {
      res.status(200).send(image)
    })
    .catch(err => {
      res.status(400).send(err)
    })
});

// post new notFoaming image to DB
app.post('/notFoaming', function(req, res) {
  console.log('receiving NOT foaming POST request')
  const {url, time, index, tag} = req.body;
  postImage(url, time, tag, index)
    .then(image => {
      res.status(200).send(image)
    })
    .catch(err => {
      res.status(400).send(err)
    })
});

// get all foaming images from DB
app.get('/foaming', function(req, res) {
  getImages('foaming')
    .then(imageList => {
      console.log('server side list of foaming images: ', imageList)
      res.status(200).send(imageList);
    })
    .catch(err => {
      res.status(400).send(err)
    })
})

// get all notFoaming images from DB
app.get('/notFoaming', function(req, res) {
  getImages('notFoaming')
    .then(imageList => {
      console.log('server side list of not foaming images: ', imageList)
      res.status(200).send(imageList);
    })
    .catch(err => {
      res.status(400).send(err)
    })
})

const port = 3001;

app.listen(port, function() {
  console.log(`listening on port ${port}`);
});

