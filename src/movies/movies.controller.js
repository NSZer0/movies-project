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
    message: `Movie does not exist: ${movieId}.`,
  });
}

/////////////////////////////////////////////////////////////////
// Router middleware
/////////////////////////////////////////////////////////////////

// Request: GET /movies?is_showing=<bool>
async function list(req, res) {
  const bIsShowing = req.query.is_showing === "true";
  const data = await service.list(bIsShowing);
  res.json({ data });
}

// Request: GET /movies/:movieId
function read(req, res) {
  // Respond with the movie object stored in res.locals
  res.json({ data: res.locals.movie });
};

module.exports = {
  list: asyncErrorBoundary(list),
  read: [movieExists, asyncErrorBoundary(read)], // Run validation checks before calling update
};