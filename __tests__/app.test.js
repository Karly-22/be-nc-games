const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index');

afterAll(() => {
    db.end();
  });

beforeEach(() => {
    return seed(testData);
});

describe('GET /api/categories', () => {
    test('200: should respond with an array of categories', () => {
        return request(app)
            .get('/api/categories')
            .expect(200)
            .then(({ body: { categories } }) => {
                expect(categories).toBeInstanceOf(Array);
                expect(categories).toHaveLength(4);
                categories.forEach((category) => {
                    expect(category).toEqual(
                        expect.objectContaining({
                            slug: expect.any(String),
                            description: expect.any(String)
                        })
                    );
                });
            }); 
    });

    test('404: should return 404 not found when incorrect endpoint is passed', () => {
        return request(app)
            .get('/api/icantspellcatigorys')
            .expect(404)
            .then(({ body: { msg } }) => {
                expect(msg).toEqual('Route not found');
            })

    });
});

describe('GET /api/reviews/:review_id', () => {
    test('200: should respond with a single review object', () => {
        const review_id = 2;
        return request(app)
            .get(`/api/reviews/${review_id}`)
            .expect(200)
            .then(({ body: { review }}) => { 
                expect(review).toEqual(
                    expect.objectContaining({
                        review_id: review_id,
                        title: 'Jenga',
                        designer: 'Leslie Scott',
                        owner: 'philippaclaire9',
                        review_img_url:
                        'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                        review_body: 'Fiddly fun for all the family',
                        category: 'dexterity',
                        created_at: '2021-01-18T10:01:41.251Z',
                        votes: 5
                    })
                );
            });

    });

    test('400: should respond with "Bad request" if not passed an integer', () => {
        return request(app)
        .get('/api/reviews/test')
        .expect(400)
        .then(({ body: { msg } }) => {
            expect(msg).toBe('Bad request');
        });
    });

    test('404: should respond with "Route not found" if passed a valid number', () => {
        return request(app)
        .get('/api/reviews/100')
        .expect(404)
        .then(({ body: { msg }}) => {
            expect(msg).toBe('No review found for review_id: 100');
        });
    });
    
    test('200: should include comment_count property with the correct value for the review_id passed', () => {
        const review_id = 1;
        return request(app)
            .get(`/api/reviews/${review_id}`)
            .expect(200)
            .then(({ body: { review }}) => { 
                expect(review).toEqual(
                    expect.objectContaining({
                        comment_count: 0
                    })
                );
            });
    });

});

describe('PATCH /api/reviews/:review_id', () => {
    test('200: should update the votes property within the selected review', () => {
        const review_id = 2;
        const userVote = { inc_votes: 10 };

        return request(app)
            .patch(`/api/reviews/${review_id}`)
            .send(userVote)
            .expect(200)
            .then(({ body: { review }}) => { 
                expect(review).toEqual({
                    review_id: review_id,
                    title: 'Jenga',
                    designer: 'Leslie Scott',
                    owner: 'philippaclaire9',
                    review_img_url:
                    'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                    review_body: 'Fiddly fun for all the family',
                    category: 'dexterity',
                    created_at: '2021-01-18T10:01:41.251Z',
                    votes: 15 
                })
            });
    });

    test('400: should respond with "Bad request" if not passed an integer through endpoint', () => {
        const userVote = { inc_votes: 10 };

        return request(app)
        .patch('/api/reviews/test')
        .send(userVote)
        .expect(400)
        .then(({ body:{ msg } }) => {
            expect(msg).toBe('Bad request');
        });
    });

    test('400: should respond with "Bad request" if user passes a string for inc_votes', () => {
        const userVote = { inc_votes: 'hello' };

        return request(app)
        .patch('/api/reviews/2')
        .send(userVote)
        .expect(400)
        .then(({ body: { msg } }) => {
            expect(msg).toBe('Bad request');
        });
    });

    test('400: should respond with "Bad request" if user passes an empty object for inc_votes', () => {
        const userVote = { inc_votes: {} };

        return request(app)
        .patch('/api/reviews/2')
        .send(userVote)
        .expect(400)
        .then(({ body: { msg } }) => {
            expect(msg).toBe('Bad request');
        });
    });

    test('404: should respond with "Route not found" if passed a valid number', () => {
        const userVote = { inc_votes: 10 };

        return request(app)
        .patch('/api/reviews/100')
        .send(userVote)
        .expect(404)
        .then(({ body: { msg }}) => {
            expect(msg).toBe('No review found for review_id: 100');
        });
    });
});

describe('GET /api/users', () => {
    test('200: should respond with list of users', () => {
        return request(app)
            .get('/api/users')
            .expect(200)
            .then(({ body: { users }}) => {
                expect(users).toBeInstanceOf(Array);
                expect(users).toHaveLength(4);
                users.forEach((user) => {
                    expect(user).toEqual(
                        expect.objectContaining({
                            username: expect.any(String),
                            name: expect.any(String),
                            avatar_url: expect.any(String)
                        })
                    );
                });
            })
    });
});

describe('GET /api/reviews', () => {
    test('200: should respond with an array of review objects', () => {
        return request(app)
            .get('/api/reviews')
            .expect(200)
            .then(({ body: { reviews } }) => {
                expect(reviews).toBeInstanceOf(Array);
                expect(reviews).toHaveLength(13);
                reviews.forEach((review) => {
                    expect(review).toEqual(
                        expect.objectContaining({
                            review_id: expect.any(Number),
                            title: expect.any(String),
                            owner: expect.any(String),
                            review_img_url: expect.any(String),
                            category: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                            comment_count: expect.any(Number)
                        })
                    );
                });
            }); 
    });
});