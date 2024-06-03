# magic-brain-app-api - v1

1. Clone this repo
2. Run `npm install`
3. Run `nodemon server.js`

* You will need your own API key for the Clarifai API.

* Create an account, and get your Clarifai API key here: (https://www.clarifai.com/)

* Please note that somtimes the predictive model can be down for training. If this happens the application may not work temporarily. Please check that the API model is working here: (https://clarifai.com/clarifai/main/models/face-detection)
---  
Create a `.env` on your local. Use these environmental variables in your `.env` from the `.env.example` file or just change the values in the `.env` file to be what you want and then source `./.env` to get the variables. 
~~~
API_CLARIFAI= 'Key + yourApiKeyHere'
DATABASE_URL= 'yourDatabaseUrl'
DATABASE_HOST= 'yourDatabaseHost'
DATABASE_USER= 'yourDatabaseUser'
DATABASE_PW= 'yourDatabasePassword'
DATABASE_DB= 'yourDatabaseName'
PORT= 5432
~~~
---
The ORM for the application is [Knex.js](https://knexjs.org/guide/). For now please use the following schema to setup a [PostgreSQL](https://www.postgresql.org/) database for the application to run locally.
### Users:
~~~
CREATE TABLE users (
	ID serial PRIMARY KEY,
	name VARCHAR (100) NOT NULL,
	email text UNIQUE NOT NULL,
	entries bigint DEFAULT 0,
	joined timestamp NOT NULL
);
~~~
### Login:
~~~
CREATE TABLE login (
	ID serial PRIMARY KEY,
	hash VARCHAR (100) NOT NULL,
	email text UNIQUE NOT NULL
);
~~~
