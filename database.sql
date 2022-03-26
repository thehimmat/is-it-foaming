CREATE DATABASE isitfoaming;

CREATE TABLE reactorfoam (
  reactor_id SERIAL PRIMARY KEY,
  image_url VARCHAR(255),
  last_modified DATE,
  tag VARCHAR(16),
  array_index smallint
);

COPY reactorfoam (image_url, last_modified) FROM '/Users/himmat/takehome-challenges/culture-biosciences/is-it-foam/database/reactor-data.txt';

