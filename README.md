# Northcoders House of Games API

## Summary

Link to hosted version:

As part of the Northcoders Bootcamp, we were challenged with building and developing the API for a games app to test our back-end skills. Both a test and development database of users, categories, reviews and comments were provided whilst I was tasked with building a series of endpoints that utilise various CRUD methods, including query-handling, to make the information accessible to users. TDD was also emploted to ensure the app runs as it should.

## Cloning the repo

Fork then clone the repository in the terminal using:
```
git clone >URL_GOES_HERE<
```

## Installing dependencies

cd into the repository:
```
cd >NAME_OF_REPO<
```

Install the dependencies:
```
npm install
```

## Seeding the database

Ensure scripts include the following:
```
"scripts": {
    "setup-dbs": "psql -f ./db/setup.sql"
    }
```
and
```
"scripts": {
    "seed": "node ./db/seeds/run-seed.js"
    }
```

Seed the database by running

```
npm run setup-dbs
```
then
```
npm run seed
```

## Testing

To run the test suite, ensure scripts contains the following:
```
"scripts": {
    "test": "jest"
    }
```
then write in the terminal
```
npm test
```

## Setup environment variables

If you wish to clone and use this repo locally, you must set the necessary environment variables in order to successfully connect to the two test and development databases locally.

To create the two files, write the following in the terminal:

```
touch .env.test
```
```
touch .env.development
```

Into each, add PGDATABASE=<database_name_here>, with the correct database name for that environment (see /db/setup.sql for the database names). Double check that these .env files are .gitignored.

## Requirements

You will need the following version to run the code:

- Node.js v6.9.0 or later
- Postgres v2.2.0 or later
