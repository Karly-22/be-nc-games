const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

const { getApiJson } = require("./controllers/api");

const { getCategories } = require("./controllers/categories");

const {
  getSingleReview,
  patchUpdateVote,
  getReviews,
} = require("./controllers/reviews");

const {
  handleCustomErrors,
  handlePSQLErrors,
  handleInternalServerError,
} = require("./controllers/errors");

const { getUsers, getUsername } = require("./controllers/users");

const {
  getReviewComments,
  postReviewComment,
  deleteComment,
  patchCommentVotes,
} = require("./controllers/comments");

app.get("/api", getApiJson);
app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getSingleReview);
app.patch("/api/reviews/:review_id", patchUpdateVote);
app.get("/api/reviews/:review_id/comments", getReviewComments);
app.post("/api/reviews/:review_id/comments", postReviewComment);
app.delete("/api/comments/:comment_id", deleteComment);
app.patch("/api/comments/:comment_id", patchCommentVotes);
app.get("/api/users", getUsers);
app.get("/api/users/:username", getUsername);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(handleInternalServerError);

module.exports = app;
