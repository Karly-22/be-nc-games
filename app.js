const express = require('express');
const app = express();

app.use(express.json());

const {
    getCategories
} = require('./controllers/categories');

const {
    getSingleReview, 
    patchUpdateVote,
    getReviews
} = require('./controllers/reviews');

const { 
    handleCustomErrors,
    handlePSQLErrors, 
    handleInternalServerError,
    handleInsertReviewCommentError
} = require('./controllers/errors');

const {
    getUsers
} = require('./controllers/users');

const {
    getReviewComments,
    postReviewComment
} = require('./controllers/comments');

app.get('/api/categories', getCategories);
app.get('/api/reviews', getReviews);
app.get('/api/reviews/:review_id', getSingleReview);
app.patch('/api/reviews/:review_id', patchUpdateVote);
app.get('/api/reviews/:review_id/comments', getReviewComments);
app.post('/api/reviews/:review_id/comments', postReviewComment);
app.get('/api/users', getUsers);

app.all('/*',(req, res) => {
    res.status(404).send({ msg: 'Route not found'})
})

app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(handleInternalServerError);

module.exports = app;
