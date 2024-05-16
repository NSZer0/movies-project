const knex = require("../db/connection");

function list(bIsShowing) {
  const query = knex("movies as m") // Access movies table
    .select("m.*"); // Only return data from the movies table
  // If bIsShowing is true add a condition to the query
  if (bIsShowing) {
    query.join("movies_theaters as mt", "m.movie_id", "mt.movie_id") // is_showing is in movies_theaters, join the tables
      .where("mt.is_showing", true)
      .distinct(); // Use distinct to avoid multiple entries cause by multiple theater_id values for each movie
  }
    
  return query;
}

function read(movie_id) {
  return knex("movies") // Access movies table
    .select("*") // Return all fields
    .where({ movie_id })
    .first(); // Only return the record with matching movie_id
}

module.exports = {
  list,
  read,
};