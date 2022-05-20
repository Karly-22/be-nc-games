exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status) {
      res.status(err.status).send({ msg: err.msg });
    } else next(err);
};

exports.handlePSQLErrors = (err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({ msg: 'Bad request'}) 
    } else if(err.code === '23503' && err.detail.includes('user')) {
        res.status(404).send({ msg: 'User not found'})
    } else if(err.code === '23503' && err.detail.includes('review_id')) {
        res.status(404).send({ msg: 'Review not found'})
    } else if (err.code === '23502') {
        res.status(400).send({ msg: 'No username or message input'})
    } else {
        next(err);
    }
};

exports.handleInternalServerError = (err, req, res, next) => {
    console.log(err);
    res.sendStatus(500);
};