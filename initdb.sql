DROP DATABASE IF EXISTS isitfoaming;
CREATE DATABASE isitfoaming;

DROP TABLE IF EXISTS reactorfoam;
CREATE TABLE reactorfoam (
  reactor_id SERIAL PRIMARY KEY,
  image_url VARCHAR(255),
  last_modified DATE,
  tag VARCHAR(16),
  array_index smallint
);

