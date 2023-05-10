import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';

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

app.post('/signin', (req, res) => {
	db.select('email', 'hash')
		.from('login')
		.where('email', '=', req.body.email)
		.then((data) => {
			const isvalid = bcrypt.compareSync(req.body.password, data[0].hash);
			if (isvalid) {
				db.select('*')
					.from('users')
					.where('email', '=', req.body.email)
					.then((user) => {
						res.json(user[0]);
					})
					.catch((err) => res.status(400).json('Unable to get user'));
			} else {
				res.status(400).json('Wrong credentials.');
			}
		})
		.catch((err) => res.status(400).json('Wrong credentials.'));
});

app.post('/register', (req, res) => {
	const { email, name, password } = req.body;
	//Asyncronis method bcrypt.hash
	const hash = bcrypt.hashSync(password);
	db.transaction((trx) => {
		trx
			.insert({
				hash: hash,
				email: email,
			})
			.into('login')
			.returning('email')
			.then((loginEmail) => {
				trx('users')
					.returning('*')
					.insert({
						name: name,
						email: loginEmail[0].email,
						joined: new Date(),
					})
					.then((user) => {
						res.json(user[0]);
					});
			})
			.then(trx.commit)
			.catch(trx.rollback);
	})
		.then((response) => {
			console.log('Thank you! Your registration was successful.');
		})
		.catch((err) => res.status(400).json('Unable to register'));
});

app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	db.select('*')
		.from('users')
		.where('id', id)
		.then((user) => {
			if (user.length) {
				res.json(user[0]);
			} else {
				res.status(400).json('Not found');
			}
		})
		.catch((err) => res.status(400).json('Error getting user'));
});

app.put('/image', (req, res) => {
	const { id } = req.body;
	db('users')
		.where('id', '=', id)
		.increment({ entries: 1 })
		.returning('entries')
		.then((entries) => {
			res.json(entries[0].entries);
		})
		.catch((err) => res.status(400).json('Unable to get entries'));
});


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