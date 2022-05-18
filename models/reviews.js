const db = require('../db/connection');

exports.fetchSingleReview = (review_id) => {
    return db.query(`
        SELECT reviews.*, 
        CAST(COUNT(comments.review_id) AS INT) AS comment_count 
        FROM reviews
        LEFT JOIN comments ON comments.review_id = reviews.review_id 
        WHERE reviews.review_id = $1 
        GROUP BY reviews.review_id`, [review_id])
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


