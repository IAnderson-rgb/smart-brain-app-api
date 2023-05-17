export const handelRegister = (req, res, db, bcrypt) => {
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
}
