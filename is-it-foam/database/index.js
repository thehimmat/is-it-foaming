import postgres from 'postgres';

const db = postgres({
  user: 'himmat',
  password: 'magicalfoamygoatblue',
  database: 'isitfoaming'
})

db.connect();

module.exports = db;

