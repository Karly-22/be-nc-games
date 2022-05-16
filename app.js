const express = require('express');
const app = express();

const {
    getCategories
} = require('./controllers/categories');

app.get('/api/categories', getCategories);

app.all('/api/*',(req, res) => {
    res.status(404).send({ msg: 'Route not found'})
})

app.use((err, req, res, next) => {
    console.log(err);
    res.sendStatus(500);
  });

module.exports = app;
