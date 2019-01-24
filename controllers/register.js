

const handleRegister = (db, bcrypt) => (req,res) => {
	const { name, password, email } = req.body;

	if(!name || !password || !email){ //if we give empty name or password or email to register
		return res.status(400).json('incorrect form submission');
	}

	bcrypt.hash(password, null, null, function(err, hash) {
		db.transaction(trx => {
			trx.insert({
				hash: hash,
				email: email
			})
			.into('login')
			.returning('email')
			.then(LoginEmail => {
				return trx('users')
					.returning('*')
					.insert({
						name: name,
						email: LoginEmail[0],
						joined: new Date()
					})
					.then(user => {
						res.json(user[0]);
					})
			})
			.then(trx.commit)
			.catch(trx.rollback)
		})	
		.catch(err => res.status(404).json('unable to register'))
	});
}

module.exports = {
	handleRegister: handleRegister
};