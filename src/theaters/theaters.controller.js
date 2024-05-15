const service = require("./theaters.service");
const reduceProperties = require("../utils/reduce-properties");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/////////////////////////////////////////////////////////////////
// Functional middleware
/////////////////////////////////////////////////////////////////

// Provided helper function to reduce the movie data into an array inside each theater
const reduceResults = reduceProperties("theater_id", {
  movie_id: ["movies", null, "movie_id"],
  title: ["movies", null, "title"],
  rating: ["movies", null, "rating"],
  runtime_in_minutes: ["movies", null, "runtime_in_minutes"],
  description: ["movies", null, "description"],
  image_url: ["movies", null, "image_url"],
  created_at: ["movies", null, "created_at"],
  updated_at: ["movies", null, "updated_at"],
  is_showing: ["movies", null, "is_showing"],
  theater_id: ["movies", null, "theater_id"],
});

/////////////////////////////////////////////////////////////////
// Router middleware
/////////////////////////////////////////////////////////////////

// Request: GET /theaters or /movies/:movieId/theaters
async function list(req, res) {
  // Get the movieId from request parameters if it exists
  const { movieId } = req.params;
  // If movieId exists, the service call will be different
  if (movieId) {
    // Call the listTheatersPlayingMovie function in theaters.service to get a list of theaters playing the provided movieId
    const data = await service.listTheatersPlayingMovie(movieId);
    // Respond with the result
    res.json({ data });
  }
  else {
    // Call the listTheatersAndMovies function in theaters.service to get a list of all movies, theaters, and movies_theaters.is_showing data
    const results = await service.listTheatersAndMovies();
    // Call the helper reduce function to store movies objects in an array for each theater object
    const reducedResults = reduceResults(results);
    // Respond with the result
    res.json({ data: reducedResults });
  }
}

module.exports = {
  list: asyncErrorBoundary(list), // Wrap the list function call in asyncBoundaryError to catch other errors related to the promise
};