import express from 'express';
import knex from 'knex';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';

import {handelRegister} from './controllers/register.js';
import {handelSignin} from './controllers/signin.js';
import {handelProfileGet} from './controllers/profile_id.js';
import {handelEntries, handleApiCall} from './controllers/image.js';
//Creates a connection to our PostgreSQL smart-brain databse.
const db = knex({
	client: 'pg',
	connection: {
		connectionString: process.env.DATABASE_URL,
		host: process.env.DATABASE_HOST,
		port: process.env.PORT,
		user: process.env.DATABASE_USER,
		password: process.env.DATABASE_PW,
		database: process.env.DATABASE_DB,
	},
});

//Initializing Middleware.  
const app = express();
app.use(express.json());
app.use(cors())
// End Middleware //

// API Routes //
app.get('/', (req, res) => {
	db.select('*')
		.from('users')
		.then((users) => {
			res.send(users);
		})
		.catch((err) => res.status(400).json('An error occurred.'));
});

app.post('/signin', (req, res) => {handelSignin(req, res, db, bcrypt);});

app.post('/register', (req, res) => {handelRegister(req, res, db, bcrypt);
	//The above is an example of dependicy injection. We are
	//passing the db and bcrypt dependicies to the function being called.
});

app.get('/profile/:id', (req, res) => {handelProfileGet(req, res, db)});

app.put('/image', (req, res) => {handelEntries(req, res, db)});

app.post('/imageurl', (req, res) => {handleApiCall(req, res)});
// End API Routes //

// PORT //
const PORT = process.env.PORT
app.listen(PORT || 3000, () => {
	if (!PORT) {
		return console.log(`Port is ${PORT}. Using default port 3000 instead.`);
	}
	console.log(`Server is listening on port ${PORT}`);
});
// End Port //

/* API Routes/Endpoints 
/ --> res => this is working
/signin --> POST => success||fail
/register --> POST => user
/profile/:userId --> GET = user
/image --> PUT => user
*/