const db = require('../db/connection');

exports.fetchSingleReview = (review_id) => {
    return db.query(`SELECT * FROM reviews WHERE review_id = $1`, [review_id])
    .then((result) => {
        if (!result.rows.length) {
            //console.log('hi')
            return Promise.reject({ status: 404, msg: 'Route not found' })
        };
        return result.rows[0];
    });
};
