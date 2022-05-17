const {
    fetchSingleReview
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

