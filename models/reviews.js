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

    return db.query('SELECT votes FROM reviews WHERE review_id = $1;', [review_id])
        .then((result) => {
            const newVote = result.rows[0].votes + inc_votes;
            
            return db.query('UPDATE reviews SET votes = $1 WHERE review_id = $2 RETURNING *;', [newVote, review_id])
        })
        .then((result) => {
            return result.rows[0];
        })

    // try {
    // const single = await this.fetchSingleReview(review_id)
    // console.log(single)
    // } catch (err) { 

    // }

    // return db.query("UPDATE reviews SET votes = $1 WHERE review_id = $2 RETURNING *;", [newVote, review_id])
    //     .then(() => {
    //     }) 
};


