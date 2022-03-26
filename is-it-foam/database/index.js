const postgres = require('postgres');

const db = postgres({
  user: 'himmat',
  password: 'magicalfoamygoatblue',
  database: 'isitfoaming'
})

module.exports = db;

