const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/////////////////////////////////////////////////////////////////
// Validation middleware
/////////////////////////////////////////////////////////////////

// Verify that a review in the database has an id that matches reviewId in the request parameter
async function reviewExists(req, res, next) {
  // Get the reviewId from request parameters
  const { reviewId } = req.params;
  // Query the database for a review with an ID that matches the reviewId param
  const review = await service.read(reviewId);
  if (review) {
    // Store the matching review object in res.locals to use in later functions in the route chain
    res.locals.review = review;
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

// Request: GET /movies/:movieId/reviews
async function list(req, res) {
  // Get movie_id from the request
  const { movieId } = req.params;
  // Call the list function in reviews.service
  const data = await service.list(movieId);
  // Respond with the result
  res.json({ data });
}

// Request: PUT /reviews/:reviewId
async function update(req, res, next) {
  // Get the review_id from res.locals
  const reviewId = res.locals.review.review_id;
  // Store the new data and the matching review_id to pass to the database call
  const updatedReview = {
    ...res.locals.review,
    ...req.body.data,
    review_id: reviewId,
  };

  // Call the update function in reviews.service and pass it the new data
  await service.update(updatedReview);
  // Get the updated review
  const review = await service.read(reviewId);
  // Get the critic to add to the review response
  const criticEntry = await service.getCritic(reviewId);
  // Merge critic information into the critic object
  review.critic = criticEntry;
  // Respond with the updated review
  res.json({ data: review });
}

// Request: DELETE /orders/:orderId
async function destroy(req, res) {
  // Get review_id from res.locals
  const reviewId = res.locals.review.review_id;
  // Call the delete function in reviews.service
  await service.delete(reviewId);
  // send a response with no message
  res.sendStatus(204);
}

// Export route middleware for the router to call
module.exports = {
  list,
  update: [
    asyncErrorBoundary(reviewExists), // Wrap functions involving a promise asyncBoundaryError to catch promise errors
    asyncErrorBoundary(update),
  ],
  delete: [
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(destroy),
  ],
};