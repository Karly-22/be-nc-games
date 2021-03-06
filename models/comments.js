const db = require("../db/connection");

exports.fetchReviewComments = (review_id) => {
  const reviewBody = db.query(
    `SELECT review_id FROM reviews WHERE review_id = $1;`,
    [review_id]
  );
  const commentBody = db.query(`SELECT * FROM comments WHERE review_id = $1`, [
    review_id,
  ]);

  return Promise.all([reviewBody, commentBody]).then(
    ([reviewBody, commentBody]) => {
      if (!reviewBody.rows.length) {
        return Promise.reject({
          status: 404,
          msg: `No review found for review_id: ${review_id}`,
        });
      }
      return commentBody.rows;
    }
  );
};

exports.insertReviewComment = (review_id, username, body) => {
  return db
    .query(
      "INSERT INTO comments (review_id, author, body) VALUES ($1, $2, $3) RETURNING *;",
      [review_id, username, body]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.removeComment = (comment_id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *;", [
      comment_id,
    ])
    .then((result) => {
      if (!result.rows.length) {
        return Promise.reject({ status: 404, msg: "Comment does not exist" });
      }
      return result.rows[0];
    });
};

exports.updateCommentVotes = (comment_id, inc_votes) => {
  return db
    .query(
      "UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;",
      [inc_votes, comment_id]
    )
    .then((res) => {
      return res.rows.length
        ? res.rows[0]
        : Promise.reject({
            status: 404,
            msg: "Comment does not exist",
          });
    });
};
