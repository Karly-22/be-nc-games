const db = require('../db/connection');

exports.fetchCategories = () => {
    return db.query('SELECT * FROM categories;')
        .then((result) => {
            console.log(result.rows)
            return result.rows;
        })
};