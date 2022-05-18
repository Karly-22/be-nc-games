const express = require('express');
const app = express();

app.use(express.json());

const {
    getCategories
} = require('./controllers/categories');

const {
    getSingleReview, 
    patchUpdateVote
} = require('./controllers/reviews');

const { 
    handleCustomErrors,
    handlePSQLErrors, 
    handleInternalServerError
} = require('./controllers/errors');

const {
    getUsers
} = require('./controllers/users');

app.get('/api/categories', getCategories);
app.get('/api/reviews/:review_id', getSingleReview);
app.patch('/api/reviews/:review_id', patchUpdateVote);
app.get('/api/users', getUsers);

app.all('/*',(req, res) => {
    res.status(404).send({ msg: 'Route not found'})
})

app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(handleInternalServerError);

module.exports = app;
