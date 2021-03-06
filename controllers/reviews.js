const req = require('express/lib/request');
const {
    fetchSingleReview, 
    updateVote,
    fetchReviews
} = require('../models/reviews');

exports.getSingleReview = (req, res, next) => {
    const review_id = req.params.review_id;
    fetchSingleReview(review_id).then((review) => {
        res.status(200).send({ review });
    })
    .catch((err) => {
        next(err)
    })
};

exports.patchUpdateVote = (req, res, next) => {
    const { review_id } = req.params;
    const { inc_votes } = req.body;

    updateVote(review_id, inc_votes).then((review) => {
        res.status(200).send({ review });
    })
    .catch((err) => {
        next(err)
    })
};

exports.getReviews = (req, res, next) => {
    const { sort_by, order_by, category } = req.query;

    fetchReviews(sort_by, order_by, category).then((reviews) => {
        res.status(200).send({ reviews });
    })
    .catch((err) => {
        next(err)
    })
};