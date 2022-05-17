exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status) {
      res.status(err.status).send({ msg: err.msg });
    } else next(err);
};

exports.handlePSQLErrors = (err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({ msg: 'Bad request'})
    } else next (err);
};

exports.handleInternalServerError = (err, req, res, next) => {
    console.log(err);
    res.sendStatus(500);
};