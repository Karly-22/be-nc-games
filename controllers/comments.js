const { fetchReviewComments, insertReviewComment } = require('../models/comments');

exports.getReviewComments = (req, res, next) => {
    const { review_id } = req.params;
    fetchReviewComments(review_id).then((comments) => {
        res.status(200).send({ comments });
    }).catch((err) => {
        next(err);
    })
};

exports.postReviewComment = (req, res, next) => {
    const { review_id } = req.params;
    const { username, body } = req.body;

    insertReviewComment(review_id, username, body).then((comment) => {
        res.status(201).send({ comment });
    }).catch((err) => {
        if(err.code === '23503') {
            res.status(400).send({ msg: 'Bad request'})
        } else if (err.code === '23502') {
            res.status(400).send({ msg: 'No username or message input'})
        } else {
            next(err);
        }
    })
};