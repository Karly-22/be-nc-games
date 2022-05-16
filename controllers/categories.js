const {
    fetchCategories
} = require('../models/categories');

exports.getCategories = (req, res, next) => {
    fetchCategories().then((categories) => {
        console.log({categories})
        console.table(categories)
        res.status(200).send({ categories })
    })
}