# Northcoders House of Games API

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