const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

afterAll(() => {
  db.end();
});

beforeEach(() => {
  return seed(testData);
});

describe("GET /api/categories", () => {
  test("200: should respond with an array of categories", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body: { categories } }) => {
        expect(categories).toBeInstanceOf(Array);
        expect(categories).toHaveLength(4);
        categories.forEach((category) => {
          expect(category).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });

  test("404: should return 404 not found when incorrect endpoint is passed", () => {
    return request(app)
      .get("/api/icantspellcatigorys")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toEqual("Route not found");
      });
  });
});

describe("GET /api/reviews/:review_id", () => {
  test("200: should respond with a single review object", () => {
    const review_id = 2;
    return request(app)
      .get(`/api/reviews/${review_id}`)
      .expect(200)
      .then(({ body: { review } }) => {
        expect(review).toEqual(
          expect.objectContaining({
            review_id: review_id,
            title: "Jenga",
            designer: "Leslie Scott",
            owner: "philippaclaire9",
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            review_body: "Fiddly fun for all the family",
            category: "dexterity",
            created_at: "2021-01-18T10:01:41.251Z",
            votes: 5,
          })
        );
      });
  });

  test('400: should respond with "Bad request" if not passed an integer', () => {
    return request(app)
      .get("/api/reviews/test")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  test('404: should respond with "Route not found" if passed a valid number', () => {
    return request(app)
      .get("/api/reviews/100")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("No review found for review_id: 100");
      });
  });

  test("200: should include comment_count property with the correct value for the review_id passed", () => {
    const review_id = 1;
    return request(app)
      .get(`/api/reviews/${review_id}`)
      .expect(200)
      .then(({ body: { review } }) => {
        expect(review).toEqual(
          expect.objectContaining({
            comment_count: 0,
          })
        );
      });
  });
});

describe("PATCH /api/reviews/:review_id", () => {
  test("200: should update the votes property within the selected review", () => {
    const review_id = 2;
    const userVote = { inc_votes: 10 };

    return request(app)
      .patch(`/api/reviews/${review_id}`)
      .send(userVote)
      .expect(200)
      .then(({ body: { review } }) => {
        expect(review).toEqual({
          review_id: review_id,
          title: "Jenga",
          designer: "Leslie Scott",
          owner: "philippaclaire9",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          review_body: "Fiddly fun for all the family",
          category: "dexterity",
          created_at: "2021-01-18T10:01:41.251Z",
          votes: 15,
        });
      });
  });

  test('400: should respond with "Bad request" if not passed an integer through endpoint', () => {
    const userVote = { inc_votes: 10 };

    return request(app)
      .patch("/api/reviews/test")
      .send(userVote)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  test('400: should respond with "Bad request" if user passes a string for inc_votes', () => {
    const userVote = { inc_votes: "hello" };

    return request(app)
      .patch("/api/reviews/2")
      .send(userVote)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  test('400: should respond with "Bad request" if user passes an empty object for inc_votes', () => {
    const userVote = { inc_votes: {} };

    return request(app)
      .patch("/api/reviews/2")
      .send(userVote)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  test('404: should respond with "Route not found" if passed a valid number', () => {
    const userVote = { inc_votes: 10 };

    return request(app)
      .patch("/api/reviews/100")
      .send(userVote)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("No review found for review_id: 100");
      });
  });
});

describe("GET /api/users", () => {
  test("200: should respond with list of users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/reviews", () => {
  test("200: should respond with an array of review objects", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeInstanceOf(Array);
        expect(reviews).toHaveLength(13);
        expect(reviews).toBeSortedBy("created_at", { descending: true });
        reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              review_id: expect.any(Number),
              title: expect.any(String),
              owner: expect.any(String),
              review_img_url: expect.any(String),
              category: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });

  test("200: should return a list of reviews sorted by the passed query", () => {
    return request(app)
      .get("/api/reviews?sort_by=votes")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeSortedBy("votes", { descending: true });
      });
  });

  test('400: should respond with "Bad request" if user tries to enter a non-valid sort_by query', () => {
    return request(app)
      .get("/api/reviews?sort_by=review_body")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  test("200: should return a list of reviews sorted in asc or desc (default) order", () => {
    return request(app)
      .get("/api/reviews?order_by=ASC")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeSortedBy("created_at");
      });
  });

  test('400: should respond with "Bad request" if user tries to enter a non-valid sort_by query', () => {
    return request(app)
      .get("/api/reviews?order_by=CHAOS")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  test("200: should filter the reviews by specified category", () => {
    return request(app)
      .get("/api/reviews?category=social+deduction")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeInstanceOf(Array);
        expect(reviews).toHaveLength(11);
        expect(reviews).toBeSortedBy("created_at", { descending: true });
        reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              category: expect.any(String),
            })
          );
        });
      });
  });

  test('404: should return "banana doens not exist" if user tries to enter a non-valid category', () => {
    return request(app)
      .get("/api/reviews?category=banana")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("banana does not exist");
      });
  });

  test("404: should respond with custom error if user enters valid category but there are no reviews to show", () => {
    return request(app)
      .get("/api/reviews?category=children%27s+games")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("No comments found for children's games category");
      });
  });
});

describe("GET /api/reviews/:review_id/comments", () => {
  test("200: should respond with an array of comments for given review_id", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(3);
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              review_id: expect.any(Number),
            })
          );
        });
      });
  });

  test('400: should respond with "Bad request" if not passed an integer through endpoint', () => {
    return request(app)
      .get("/api/reviews/hi/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  test('404: should respond with "Route not found" if passed a valid number but not one that matches id in path', () => {
    return request(app)
      .get("/api/reviews/100/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("No review found for review_id: 100");
      });
  });

  test("200: found review but no comments to show", () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(0);
      });
  });
});

describe("POST /api/reviews/:review_id/comments", () => {
  test("200: should add a comment object to the comments array for the specified review id", () => {
    const comment = {
      username: "mallionaire",
      body: "Fancy a game anyone?",
    };

    return request(app)
      .post("/api/reviews/2/comments")
      .send(comment)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toMatchObject({
          body: "Fancy a game anyone?",
          votes: 0,
          author: "mallionaire",
          review_id: 2,
          created_at: expect.any(String),
        });
      });
  });

  test("400: should return custom error if body does not contain both mandatory keys", () => {
    const comment = {};

    return request(app)
      .post("/api/reviews/2/comments")
      .send(comment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("No username or message input");
      });
  });

  test("400: should return custom error if body does not contain both mandatory keys", () => {
    const comment = { username: "mallionaire" };

    return request(app)
      .post("/api/reviews/2/comments")
      .send(comment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("No username or message input");
      });
  });

  test("404: should return custom error if review id in path does not exist", () => {
    const comment = {
      username: "mallionaire",
      body: "Fancy a game anyone?",
    };

    return request(app)
      .post("/api/reviews/14/comments")
      .send(comment)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("No review found for review_id: 14");
      });
  });

  test('400: should return "Bad request" if review id is not a number', () => {
    const comment = {
      username: "mallionaire",
      body: "Fancy a game anyone?",
    };

    return request(app)
      .post("/api/reviews/hiya/comments")
      .send(comment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  test('404: should return "User not found" user not in the data base tried to post', () => {
    const comment = {
      username: "snoopDog",
      body: "Fancy a game anyone?",
    };

    return request(app)
      .post("/api/reviews/2/comments")
      .send(comment)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("User not found");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: should delete given comment by comment_id", () => {
    return request(app).delete("/api/comments/6").expect(204);
  });

  test('404: should return "Route not found" if comment does not exist', () => {
    return request(app)
      .delete("/api/comments/7")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Comment does not exist");
      });
  });

  test('400: should return with "Bad request" id comment_id is not a number', () => {
    return request(app)
      .delete("/api/comments/yo")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});

describe("GET /api", () => {
  test("200: should return JSON file with list of endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toMatchObject({
          "GET /api": expect.any(Object),
          "GET /api/categories": expect.any(Object),
          "GET /api/reviews": expect.any(Object),
          "GET /api/reviews/:review_id": expect.any(Object),
          "PATCH /api/reviews/:review_id": expect.any(Object),
          "GET /api/users": expect.any(Object),
          "GET /api/reviews/:review_id/comments": expect.any(Object),
          "POST /api/reviews/:review_id/comments": expect.any(Object),
          "DELETE /api/comments/:comment_id": expect.any(Object),
        });
      });
  });
});

describe("GET /api/users/:username", () => {
  test("200: should respond with an object containing :username information", () => {
    return request(app)
      .get("/api/users/philippaclaire9")
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toEqual(
          expect.objectContaining({
            username: 'philippaclaire9',
            name: 'philippa',
            avatar_url: 'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4'
          })
        );
      });
  });

  test("404: should respond with msg if username does not exist", () => {
    return request(app)
      .get("/api/users/notahacker")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("User does not exist!")
      });
    })
});

describe.only("PATCH /api/comments/:comment_id", () => {
  test("200: should update the votes property within the selected comment", () => {
    const comment_id = 1;
    const userVoteComment = { inc_votes: 1 };

    return request(app)
      .patch(`/api/comments/${comment_id}`)
      .send(userVoteComment)
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(comment).toEqual({
          comment_id: 1,
          body: 'I loved this game too!',
          votes: 17,
          author: 'bainesface',
          review_id: 2,
          created_at: "2017-11-22T12:43:33.389Z",
          });
        });
  });

  test('400: should respond with "Bad request" if not passed an integer through endpoint', () => {
    const userVoteComment = { inc_votes: 1 };

    return request(app)
      .patch("/api/comments/test")
      .send(userVoteComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  test('400: should respond with "Bad request" if user passes a string for inc_votes', () => {
    const userVoteComment = { inc_votes: "hello" };

    return request(app)
      .patch("/api/comments/1")
      .send(userVoteComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  test('400: should respond with "Bad request" if user passes an empty object for inc_votes', () => {
    const userVoteComment = { inc_votes: {} };

    return request(app)
      .patch("/api/comments/1")
      .send(userVoteComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  test('404: should respond with "Comment does not exist" if passed a valid number but comment does not exist', () => {
    const userVoteComment = { inc_votes: 10 };

    return request(app)
      .patch("/api/comments/100000")
      .send(userVoteComment)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Comment does not exist");
      });
  });
});