const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/////////////////////////////////////////////////////////////////
// Validation middleware
/////////////////////////////////////////////////////////////////

// Verify that a movie in the database has an id that matches movieId in the request parameter
async function movieExists(req, res, next) {
  // Get the movieId from request parameters
  const { movieId } = req.params;
  // Query the database for a movie with an ID that matches the movieId param
  const movie = await service.read(movieId);
  if (movie) {
    // Store the matching movie object in res.locals to use in later functions in the route chain
    res.locals.movie = movie;
    // Go to the next function in the chain
    return next();
  }

  // No matching movie was found, return an error
  next({
    status: 404,
    message: "Review cannot be found.",
  });
}

/////////////////////////////////////////////////////////////////
// Router middleware
/////////////////////////////////////////////////////////////////

// Request: GET /movies?is_showing=<bool>
async function list(req, res) {
  // Check if the query parameter is_showing is provided and set to true
  const bIsShowing = req.query.is_showing === "true";
  // Call the list function in movies.service
  const data = await service.list(bIsShowing);
  // Respond with the result
  res.json({ data });
}

// Request: GET /movies/:movieId
function read(req, res) {
  // Respond with the movie object stored in res.locals
  res.json({ data: res.locals.movie });
};

module.exports = {
  list: asyncErrorBoundary(list), // Wrap the list function call in asyncBoundaryError to catch other errors related to the promise
  read: [movieExists, asyncErrorBoundary(read)],
  movieExists, // Exported for use with merged routes in movies.router
};