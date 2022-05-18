const {
    fetchSingleReview, 
    updateVote
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
