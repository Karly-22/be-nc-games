const {
  fetchReviewComments,
  insertReviewComment,
  removeComment,
  updateCommentVotes,
} = require("../models/comments");
const { fetchSingleReview } = require("../models/reviews");

exports.getReviewComments = (req, res, next) => {
  const { review_id } = req.params;
  fetchReviewComments(review_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postReviewComment = (req, res, next) => {
  const { review_id } = req.params;
  const { username, body } = req.body;

  Promise.all([
    fetchSingleReview(review_id),
    insertReviewComment(review_id, username, body),
  ])
    .then(([, comment]) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchCommentVotes = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  updateCommentVotes(comment_id, inc_votes).then((comment) => {
    res.status(200).send({ comment });
  });
};
