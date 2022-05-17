const db = require('../db/connection');

exports.fetchSingleReview = (review_id) => {
    return db.query(`SELECT * FROM reviews WHERE review_id = $1`, [review_id])
    .then((result) => {
        if (!result.rows.length) {
            return Promise.reject({ status: 404, msg: 'Route not found' })
        };
        return result.rows[0];
    });
};

exports.updateVote = (review_id, inc_votes) => {
    if(!Number.isInteger(inc_votes)) {
        return Promise.reject({ status: 400, msg: 'Bad request: invalid input' });
    }
        return db.query('UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *;', [inc_votes, review_id])
            .then((result) => {
                if(!result.rows.length) {
                    console.log('hi')
                    return Promise.reject({ status: 404, msg: 'Route not found' })
                };
                return result.rows[0];
            });
    
};


