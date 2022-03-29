const express = require('express');
const cors = require('cors');
const db = require('./database.js');

const app = express();
app.use(cors());

app.set("port", process.env.PORT || 3001);

async function postImage(url, time, tag, index) {
  console.log(`received query to post a new image`)
  const image = await db`
    INSERT INTO reactorfoam
      (image_url, last_modified, tag, array_index)
    VALUES
      (${url}, ${time}, ${tag}, ${index});
  `
  console.log(`with this query: ${image}`)
  return image;
}

async function getImages(tag) {
  console.log(`received query to get all ${tag} images`)
  const imageList = await db`
    SELECT * FROM reactorfoam
    WHERE tag = ${tag};
  `
  console.log(`with this query: ${imageList}`)
  return imageList;
}

// post new foaming image to DB
app.post('/foaming', function(req, res) {
  const {url, time, index, tag} = req.query;
  postImage(url, time, tag, index)
    .then(image => {
      res.status(200).send(image)
    })
    .catch(err => {
      console.error('Error with POST request for foaming image')
      res.status(400).send(err)
    })
});

// post new notFoaming image to DB
app.post('/notFoaming', function(req, res) {
  const {url, time, index, tag} = req.query;
  postImage(url, time, tag, index)
    .then(image => {
      res.status(200).send(image)
    })
    .catch(err => {
      console.error('Error with POST request for notFoaming image')
      res.status(400).send(err)
    })
});

// get already tagged foaming images from DB
app.get('/foaming', function(req, res) {
  console.log('recieving GET request for foaming images...')
  getImages('foaming')
    .then(imageList => {
      res.status(200).send(imageList);
    })
    .catch(err => {
      console.error('Error with GET request for foaming images')
      res.status(400).send(err)
    })
})

// get already tagged notFoaming images from DB
app.get('/notFoaming', function(req, res) {
  console.log('recieving GET request for notFoaming images...')
  getImages('notFoaming')
    .then(imageList => {
      res.status(200).send(imageList);
    })
    .catch(err => {
      console.error('Error with GET request for notFoaming images')
      res.status(400).send(err)
    })
})

const port = 3001;

app.listen(port, function() {
  console.log(`listening on port ${port}`);
});

