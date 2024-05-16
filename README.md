## Get all movies

This route will return a list of all movies. Different query parameters will allow for limiting the data that is returned.

There are two different cases:

- `GET /movies`
- `GET /movies?is_showing=true`

### GET /movies

The response from the server should look like the following:

```json
{
  "data": [
    {
      "id": 1,
      "title": "Spirited Away",
      "runtime_in_minutes": 125,
      "rating": "PG",
      "description": "Chihiro ...",
      "image_url": "https://imdb-api.com/..."
    }
    // ...
  ]
}
```

### GET /movies?is_showing=true

In the event where `is_showing=true` is provided, the route should return _only those movies where the movie is currently showing in theaters._ This means you will need to check the `movies_theaters` table.

The response from the server should look identical to the response above _except_ that it may exclude some records.

## Read one movie

There are four different cases:

- `GET /movies/:movieId`
- `GET /movies/:movieId` (incorrect ID)
- `GET /movies/:movieId/theaters`
- `GET /movies/:movieId/reviews`

### GET /movies/:movieId

The response from the server should look like the following.

```json
{
  "data": {
    "id": 1,
    "title": "Spirited Away",
    "runtime_in_minutes": 125,
    "rating": "PG",
    "description": "Chihiro...",
    "image_url": "https://imdb-api.com/..."
  }
}
```

### GET /movies/:movieId (incorrect ID)

If the given ID does not match an existing movie, a response like the following should be returned:

```json
{
  "error": "Movie cannot be found."
}
```

The response will have `404` as the status code.

### GET /movies/:movieId/theaters

This route should return all the `theaters` where the movie is playing. This means you will need to check
the `movies_theaters` table.

The response from the server for a request to `/movies/1/theaters` should look like the following.

```json
{
  "data": [
    {
      "theater_id": 2,
      "name": "Hollywood Theatre",
      "address_line_1": "4122 NE Sandy Blvd.",
      "address_line_2": "",
      "city": "Portland",
      "state": "OR",
      "zip": "97212",
      "created_at": "2021-02-23T20:48:13.342Z",
      "updated_at": "2021-02-23T20:48:13.342Z",
      "is_showing": true,
      "movie_id": 1
    }
    // ...
  ]
}
```

### GET /movies/:movieId/reviews

This route should return all the `reviews` for the movie, including all the `critic` details added to a `critic` key of the review.

The response from the server for a request to `/movies/1/reviews` should look like the following.

```json
{
  "data": [
    {
      "review_id": 1,
      "content": "Lorem markdownum ...",
      "score": 3,
      "created_at": "2021-02-23T20:48:13.315Z",
      "updated_at": "2021-02-23T20:48:13.315Z",
      "critic_id": 1,
      "movie_id": 1,
      "critic": {
        "critic_id": 1,
        "preferred_name": "Chana",
        "surname": "Gibson",
        "organization_name": "Film Frenzy",
        "created_at": "2021-02-23T20:48:13.308Z",
        "updated_at": "2021-02-23T20:48:13.308Z"
      }
    }
    // ...
  ]
}
```

## Update review

This route will allow you to partially or fully update a review. If the ID is incorrect, a `404` will be returned.

### UPDATE /reviews/:reviewId

A body like the following should be passed along with the request:

```json
{
  "score": 3,
  "content": "New content..."
}
```

The response should include the entire review record with the newly patched content, and the critic information set to the `critic` property.

```json
{
  "data": {
    "review_id": 1,
    "content": "New content...",
    "score": 3,
    "created_at": "2021-02-23T20:48:13.315Z",
    "updated_at": "2021-02-23T20:48:13.315Z",
    "critic_id": 1,
    "movie_id": 1,
    "critic": {
      "critic_id": 1,
      "preferred_name": "Chana",
      "surname": "Gibson",
      "organization_name": "Film Frenzy",
      "created_at": "2021-02-23T20:48:13.308Z",
      "updated_at": "2021-02-23T20:48:13.308Z"
    }
  }
}
```

### UPDATE /reviews/:reviewId (incorrect ID)

If the given ID does not match an existing review, a response like the following should be returned:

```json
{
  "error": "Review cannot be found."
}
```

The response will have `404` as the status code response.

## Destroy review

This route will delete a review by ID. If the ID is incorrect, a `404` will be returned.

### DELETE /reviews/:reviewId

The server will respond with `204 No Content`.

### DELETE /reviews/:reviewId (incorrect ID)

If the given ID does not match an existing review, a response like the following should be returned:

```json
{
  "error": "Review cannot be found."
}
```

The response will have `404` as the status code response.

## Get all theaters

This route will return a list of all theaters. Different query parameters will allow for additional information to be included in the data that is returned.

There is one case:

- `GET /theaters`

### GET /theaters

This route should return all the `theaters` and, the movies playing at each theatre added to the `movies` key. This means you will need to check the `movies_theaters` table.

The response from the server should look like the following.

```json
{
  "data": [
    {
      "theater_id": 1,
      "name": "Regal City Center",
      "address_line_1": "801 C St.",
      "address_line_2": "",
      "city": "Vancouver",
      "state": "WA",
      "zip": "98660",
      "created_at": "2021-02-23T20:48:13.335Z",
      "updated_at": "2021-02-23T20:48:13.335Z",
      "movies": [
        {
          "movie_id": 1,
          "title": "Spirited Away",
          "runtime_in_minutes": 125,
          "rating": "PG",
          "description": "Chihiro...",
          "image_url": "https://imdb-api.com...",
          "created_at": "2021-02-23T20:48:13.342Z",
          "updated_at": "2021-02-23T20:48:13.342Z",
          "is_showing": false,
          "theater_id": 1
        }
        // ...
      ]
    }
    // ...
  ]
}
```
