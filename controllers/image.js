const Clarifai = require('clarifai'); // Installed clarifai API on the back end to improve security

const app = new Clarifai.App({
 apiKey: '6b2ee4b3c4ee4c85aa15224fb5fcdfd3'
});

const handleApiCall = (req, res) => {
	app.models
		.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
		.then(data => {
			res.json(data);
		})
		.catch(err => {
			res.status(400).json('unable to work with Clarifai API')
		})
}


const handleImageSubmit = (db) => (req,res) => {
	const { id } = req.body;
	db('users')
	.where('id', '=', id)
	.increment('entries', 1)
	.returning('entries')
	.then(entries => res.json(entries[0]))
	.catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
	handleImageSubmit: handleImageSubmit,
	handleApiCall: handleApiCall
};