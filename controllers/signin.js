
const handleSignin = (db, bcrypt) =>  (req,resp) => {
	const { email, password } = req.body;

	db.select('email','hash').from('login')
	.where('email', '=', email)
	.then(data => {
		bcrypt.compare(password, data[0].hash, function(err, res) {
			if(res){
				return db.select('*')
				.from('users')
				.where('email', '=', email)
				.then(user => {
					resp.json(user[0])
				})
				.catch(err => resp.status(400).json('unable to get user'))
			} else{
				resp.status(400).json('wrong credentials')
			}
		})
	})
	.catch(err => resp.status(400).json('wrong credentials'))
}

module.exports = {
	handleSignin: handleSignin
};