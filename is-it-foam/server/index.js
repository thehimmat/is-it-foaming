const express = require('express');
const app = express();

app.use(express.static(__dirname + '/../src'));
app.use(express.json());

// post new foaming image to DB
app.post('/foaming', function(req, res) {
  console.log(req.body);
  res.send('Hello foamy World!')
});

// post new notFoaming image to DB
app.post('/notFoaming', function(req, res) {
  console.log(req.body);
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

