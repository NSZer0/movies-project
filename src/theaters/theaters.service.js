const knex = require("../db/connection");

// Return a list of all theaters
function listTheaters() {
  return knex("theaters") // Access theaters table
    .select("*"); // Return all fields
}

function listTheatersAndMovies() {
  return knex("theaters as t") // Access theaters table
    .select("m.*", "t.*", "mt.is_showing") // Return all fields from movies table and theaters table
    .join("movies_theaters as mt", "t.theater_id", "mt.theater_id") // Join movies_theaters table by matching theater_id
    .join("movies as m", "mt.movie_id", "m.movie_id"); // Join movies table by matching movie_id
    // .where("mt.is_showing", true); // Only return records where is_showing is true
    // .distinct(); // Use distinct to avoid duplicate records from multiple theaters for each movie
}

function listTheatersPlayingMovie(movieId) {
  return knex("movies_theaters as mt") // Access movies_theaters table
    .select("mt.*", "t.*") // Return all fields from both tables
    .join("theaters as t", "mt.theater_id", "t.theater_id") // Join theaters table by matching theater_id
    .where("mt.movie_id", movieId) // Only return records matching movieId
    .distinct(); // Use distinct to avoid duplicate records from multiple theaters for each movie
}

module.exports = {
  listTheaters,
  listTheatersAndMovies,
  listTheatersPlayingMovie,
};