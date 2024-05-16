const knex = require("../db/connection");

function read(review_id) {
  return knex("reviews") // Access reviews table
    .select("*") // Return all fields
    .where({ review_id }) 
    .first(); // Only return the record with matching review_id
}

async function list(movie_id) {
  const results = await knex("reviews") // Access reviews table
    .select("*") // Return all fields
    .where({ movie_id }); // Only return records with matching movie_id

  // Get the critic entry for each review
  for (result in results) {
    // Get the review entry in the current interation
    const entry = results[result];
    // Get the critic info for the current iteration
    const criticEntry = await knex("critics as c") // Access critics table
      .select("c.*") // Return all fields from the critics table
      .join("reviews as r", "c.critic_id", "r.critic_id") // Join reviews table by matching critic_id
      .where("r.movie_id", movie_id)
      .first(); // Only return the record with matching movie_id

    // Merge critic information into the critic object
    entry.critic = criticEntry;
  }
  
  return results;
}

// Update a record in the reviews table with the provided data
function update(updatedReview) {
  return knex("reviews") // Access reviews table
    .where({ review_id: updatedReview.review_id })
    .update(updatedReview, "*"); // Update the record with the matching review_id
}

// Return a record from the critics table matching reviewId
function getCritic(reviewId) {
  return knex("critics as c") // Access critics table
    .select("c.*") // Return all fields from the critics table
    .join("reviews as r", "c.critic_id", "r.critic_id") // Join reviews table by matching critic_id
    .where("r.review_id", reviewId)
    .first(); // Only return the record with matching review_id
}

// Delete a record from the reviews table matching review_id
function destroy(review_id) {
  return knex("reviews") // Access reviews table
    .where({ review_id })
    .del(); // Delete the record with the matching review_id
}

module.exports = {
  read,
  list,
  update,
  getCritic,
  delete: destroy,
};