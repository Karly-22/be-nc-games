const db = require('../db/connection');

exports.fetchSingleReview = (review_id) => {
    return db.query(`SELECT * FROM reviews WHERE review_id = $1`, [review_id])
    .then((result) => {
        if (!result.rows.length) {
            return Promise.reject({ status: 404, msg: `No review found for review_id: ${review_id}` })
        };
        return result.rows[0];
    });
};

exports.updateVote = (review_id, inc_votes) => {
        return db.query('UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *;', [inc_votes, review_id])
            .then((result) => {
                if(!result.rows.length) {
                    return Promise.reject({ status: 404, msg: `No review found for review_id: ${review_id}` })
                };
                return result.rows[0];
            });
    
};


