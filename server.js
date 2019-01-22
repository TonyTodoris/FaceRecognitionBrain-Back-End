const express = require('express'); // import express library
const app = express();
const bodyParser = require('body-parser'); // import body-parser library
const bcrypt = require('bcrypt-nodejs'); //import bcrypt-nodejs library for security hashing
const cors = require('cors');  //  import cors package to allow to fetch from front-end 
const knex = require('knex'); // install knexjs which is a tool to connect to the database

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : '',
    password : '',
    database : 'facerecognition'
  }
});

db.select('*').from('users').then(data =>{
	//console.log(data);
});

app.use(bodyParser.json());
app.use(cors());


const database = {
	users : []
}

app.listen(3000, ()=>{
	console.log('app is running on port 3000');
})


app.get('/', (req, res) => {
	res.json(database.users);
})

app.post('/signin', (req, res) => {
	//bcrypt.compare("bacon", hash, function(err, res) {
	//	res == true
	//});

	if(req.body.email === database.users[0].email && req.body.password === database.users[0].password){
		res.json(database.users[0]);
	} else{
		res.status(400).json('error logging in');
	}
})

app.post('/register', (req, res) => {
	const { name, password, email } = req.body;
	bcrypt.hash(password, null, null, function(err, hash) {
	   console.log(hash);
	});
	db('users')
	.returning('*')
	.insert({
		name: name,
		email: email,
		joined: new Date()
	})
	.then(user => {
		res.json(user[0]);
	})
	.catch(err => res.status(404).json('unable to register'))
	
})

app.get('/profile/:id', (req, res)=> {
	const { id } = req.params;
	db.select('*').from('users').where({
		id: id
	})
	.then(user => {
		if(user.length){
			res.json(user[0]);
		} else{
			res.status(400).json('not found');
		}
		
	})
	.catch(err=> res.status(400).json('error getting user'))
	//if(!found){
	//	res.status(400).json('not found');
	//}
})


app.put('/image', (req,res)=>{
	const { id } = req.body;
	db('users')
	.where('id', '=', id)
	.increment('entries', 1)
	.returning('entries')
	.then(entries => res.json(entries[0]))
	.catch(err => res.status(400).json('unable to get entries'))
})

//bcrypt.hash("bacon", null, null, function(err, hash) {
    // Store hash in your password DB.
//});

// Load hash from your password DB.
//bcrypt.compare("bacon", hash, function(err, res) {
    // res == true
//});
//bcrypt.compare("veggies", hash, function(err, res) {
    // res = false
//});