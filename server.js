const express = require('express'); // import express library
const app = express();
const bodyParser = require('body-parser'); // import body-parser library
const bcrypt = require('bcrypt-nodejs'); //import bcrypt-nodejs library for security hashing
const cors = require('cors');  //  import cors package to allow to fetch from front-end 
const knex = require('knex'); // install knexjs which is a tool to connect to the database

const register = require('./controllers/register'); // Creating a register controller for cleaner code structure
const signin = require('./controllers/signin'); // Creating a signin controller for cleaner code structure
const profile = require('./controllers/profile'); // Creating a signin controller for cleaner code structure
const image = require('./controllers/image'); // Creating a image controller for cleaner code structure



const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true
  }
})

/*const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : '',
    password : '',
    database : 'facerecognition'
  }
});*/

db.select('*').from('users').then(data =>{
	//console.log(data);
});

app.use(bodyParser.json());
app.use(cors());



//Environmental Variables
/*const Port = process.env.PORT

app.listen(Port, ()=>{
	console.log(`app is running on port ${Port}`);
})
*/
app.listen(process.env.PORT || 3000, ()=>{
  console.log( `app is running on port${process.env.PORT}` );
})

app.get('/', (req, res) => {
	res.json("it is working");
})

app.post('/signin', signin.handleSignin(db, bcrypt))

app.post('/register', register.handleRegister(db, bcrypt))

app.get('/profile/:id', profile.handleProfileGet(db))

app.put('/image', image.handleImageSubmit(db))
app.post('/imageurl', image.handleApiCall)

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