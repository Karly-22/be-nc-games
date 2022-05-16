const express = require('express');
const app = express();

const {
    getCategories
} = require('./controllers/categories');

app.get('/api/categories', getCategories);


module.exports = app;
