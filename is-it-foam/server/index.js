const db = require('../database/index.js');
const express = require('express');
const app = express();

app.use(express.static(__dirname + '/../src'));
app.use(express.json());

async function postImage(url, time, tag, index) {
  const image = db`
    INSERT INTO reactorfoam
      (image_url, last_modified, tag, array_index)
    VALUES
      (${url}, ${time}, ${tag}, ${index});
  `
  return image;
}

// post new foaming image to DB
app.post('/foaming', function(req, res) {
  const {url, time, index, tag} = req.body;
  postImage(url, time, tag, index)
    .then(result => {
      res.status(200).send(result)
    })
    .catch(err => {
      res.status(400).send(err)
    })
});

// post new notFoaming image to DB
app.post('/notFoaming', function(req, res) {
  console.log('in server: ', req.body);
  res.send('Hello not so foamy World!')
});

// get all foaming images from DB
app.get('/foaming', function(req, res) {
  console.log(req.body);
})

// get all notFoaming images from DB
app.get('/notFoaming', function(req, res) {
  console.log(req.body);
})

const port = 3000;

app.listen(port, function() {
  console.log(`listening on port ${port}`);
});

