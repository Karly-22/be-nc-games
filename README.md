# Northcoders House of Games API

## Summary

As part of the Northcoders Bootcamp, we were challenged to build and develop a RESTful API for a board game reviewing website. This solo project helped consolidate everything we have picked up from the backend part of the course whilst strengthening my TDD skills to ensure the data can only be accessed and returned as it should.

## Link to hosted version

https://karlys-games-app.herokuapp.com/api

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
