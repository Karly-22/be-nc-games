const db = require('../db/connection');

exports.fetchReviewComments = (review_id) => {
    return db.query(`
        SELECT
            comment_id,
            votes,
            created_at,
            author,
            body,
            review_id 
        FROM comments WHERE review_id = $1`, [review_id])
        .then((result) => {
            console.log(result.rows)
            if(!result.rows.length) {
                return Promise.reject({ status: 404, msg: `No review found for review_id: ${review_id}`})
            }
            return result.rows;
        });
};