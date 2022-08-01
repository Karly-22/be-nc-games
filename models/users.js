const db = require("../db/connection");

exports.fetchUsers = () => {
  return db.query("SELECT * FROM users;").then((result) => {
    return result.rows;
  });
};

exports.fetchUser = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then((res) => {
      return res.rows.length ? res.rows[0] : Promise.reject({ status: 404, msg: 'User does not exist!' });
    });
};
