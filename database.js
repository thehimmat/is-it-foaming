const postgres = require('postgres');

const db = postgres({
  user: 'root',
  password: '',
  database: 'isitfoaming'
})

module.exports = db;

