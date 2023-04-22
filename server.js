import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors())

const database = {
    users: [
        {
            id: '123',
            name: 'Jo',
            email: 'jo@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'notebook',
            entries: 0,
            joined: new Date()
        }
    ]
}

app.get('/', (req, res) => {
	res.send(database.users);
});

app.post('/signin', (req, res) => {
	if (
		req.body.email === database.users[0].email &&
		req.body.password === database.users[0].password
	) {
		res.json(database.users[0]);
	} else {
		res.status(400).json('error logging in');
	}
	// res.json('signin');
});

app.post('/register', (req, res) => {
	const { email, name, password } = req.body;
	bcrypt.hash(password, null, null, function(err, hash) {
		console.log(hash);
	  });
	database.users.push({
		id: '125',
		name: name,
		email: email,
		password: password,
		entries: 0,
		joined: new Date(),
	});
	res.json(database.users[database.users.length - 1]);
});

app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	let found = false;
	database.users.forEach((user) => {
		if (id === user.id) {
			found = true;
			return res.json(user);
		}
	});
	if (!found) {
		res.status(400).json('user not found');
	}
});

app.put('/image', (req, res) => {
	const { id } = req.body;
	let found = false;
	database.users.forEach((user) => {
		if (id === user.id) {
			found = true;
			user.entries++;
			return res.json(user.entries);
		}
	});
	if (!found) {
		res.status(400).json('not found');
	}
});


  
//   // Load hash from your password DB.
//   bcrypt.compare("bacon", hash, function(err, res) {
// 	  // res == true
//   });
//   bcrypt.compare("veggies", hash, function(err, res) {
// 	  // res = false
//   });

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