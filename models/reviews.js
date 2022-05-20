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

exports.fetchReviews = (sort_by = 'created_at', order_by = 'DESC', category) => {
    const queryValues = [];
    const allowedCategories = [
        'children\'s games', 
        'euro game', 
        'dexterety', 
        'social deduction', 
        'strategy', 
        'hidden-roles', 
        'push-your-luck', 
        'roll-and-write', 
        'deck-building', 
        'engine-building'];

    let queryStr = `
    SELECT 
        reviews.review_id,    
        reviews.owner, 
        reviews.title, 
        reviews.category, 
        reviews.review_img_url, 
        reviews.created_at, 
        reviews.votes, 
    COUNT(comments.review_id)::INT AS comment_count 
    FROM reviews
    LEFT JOIN comments ON comments.review_id = reviews.review_id` 
    
    if(category) {
        if(!(allowedCategories.includes(category))) {
            return Promise.reject({status: 404, msg: `${category} does not exist`})
        }
        queryStr += ` WHERE category = $1`;
        queryValues.push(category);
    }
    
    queryStr += ` GROUP BY reviews.review_id`
    
    if(!['title', 'created_at', 'votes'].includes(sort_by)) {
        return Promise.reject({status: 400, msg: 'Bad request'})
    }

    if(!['ASC', 'DESC'].includes(order_by)) {
        return Promise.reject({status: 400, msg: 'Bad request'})
    }

    queryStr += ` ORDER BY ${sort_by} ${order_by};`

    return db.query(queryStr, queryValues).then((result) => {
        if(!result.rows.length) {
            return Promise.reject({ status: 404, msg: `No comments found for ${category} category`});
        };
            return result.rows;
        });
};
