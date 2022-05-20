const { fetchReviewComments, insertReviewComment } = require('../models/comments');
const { fetchSingleReview } = require('../models/reviews');

exports.getReviewComments = (req, res, next) => {
    const { review_id } = req.params;
    fetchReviewComments(review_id).then((comments) => {
        res.status(200).send({ comments });
    })
    .catch((err) => {
        next(err);
    })
};

exports.postReviewComment = (req, res, next) => {
    const { review_id } = req.params;
    const { username, body } = req.body;

    Promise.all([fetchSingleReview(review_id), insertReviewComment(review_id, username, body)])
        .then(([,comment]) => {
            res.status(201).send({ comment });
        })
        .catch((err) => {
            next(err)
    });
};