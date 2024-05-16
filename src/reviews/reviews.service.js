const knex = require("../db/connection");

function read(review_id) {
  return knex("reviews")
    .select("*")
    .where({ review_id })
    .first();
}

async function list(movie_id) {
  const results = await knex("reviews")
    .select("*")
    .where({ movie_id });

  // Get the critic entry
  for (result in results) {
    // Get the review entry in the current interation
    const entry = results[result];
    // Get the critic info for the current iteration
    const criticEntry = await knex("critics as c")
      .select("c.*")
      .join("reviews as r", "c.critic_id", "r.critic_id")
      .where("r.movie_id", movie_id)
      .first();

    // Merge critic information into the critic object
    entry.critic = criticEntry;
  }
  
  return results;
}

// Update a record in the reviews table with the provided data
function update(updatedReview) {
  return knex("reviews")
    .where({ review_id: updatedReview.review_id })
    .update(updatedReview, "*");
}

// Return a record from the critics table matching reviewId
function getCritic(reviewId) {
  return knex("critics as c")
    .select("c.*")
    .join("reviews as r", "c.critic_id", "r.critic_id")
    .where("r.review_id", reviewId)
    .first();
}

// Delete a record from the reviews table matching review_id
function destroy(review_id) {
  return knex("reviews").where({ review_id }).del();
}

module.exports = {
  read,
  list,
  update,
  getCritic,
  delete: destroy,
};