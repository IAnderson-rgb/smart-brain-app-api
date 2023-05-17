import express from 'express';
import knex from 'knex';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';

import {handelRegister} from './controllers/register.js';
import {handelSignin} from './controllers/signin.js';
import {handelProfile} from './controllers/profile_id.js';
import {handelEntries} from './controllers/image.js';
//Creates a connection to our PostgreSQL smart-brain databse.
const db = knex({
	client: 'pg',
	connection: {
	  host : '127.0.0.1',
	  port : 5432,
	  user : 'postgres',
	  password : 'test',
	  database : 'smart-brain'
	}
  });

//Initializing Middleware.  
const app = express();
app.use(express.json());
app.use(cors())


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
	//passing the dependicies of the server to the function being called.
});

app.get('/profile/:id', (req, res) => {handelProfile(req, res, db)});

app.put('/image', (req, res) => {handelEntries(req, res, db)});


// PORT
app.listen(3000, () => {
    console.log('app is running on port 3000');
});


/* API Routes/Endpoints 
/ --> res => this is working
/signin --> POST => success||fail
/register --> POST => user
/profile/:userId --> GET = user
/image --> PUT => user
*/