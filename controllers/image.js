const handelEntries = (req, res, db) => {
	const { id } = req.body;
	db('users')
		.where('id', '=', id)
		.increment({ entries: 1 })
		.returning('entries')
		.then((entries) => {
			res.json(entries[0].entries);
		})
		.catch((err) => res.status(400).json('Unable to get entries'));
}

const handleApiCall = (req, res) => {
	const { imgLocation } = req.body;
	if (!imgLocation) {
		return res.status(400).json('Incorrect image submission');
	}
	const MODEL_ID = 'face-detection';
	const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';
	const raw = JSON.stringify({
		user_app_id: {
			user_id: 'clarifai',
			app_id: 'main',
		},
		inputs: [
			{
				data: {
					image: {
						url: imgLocation,
					},
				},
			},
		],
	});

	const requestOptions = {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			Authorization: process.env.API_CLARIFAI,
		},
		body: raw,
	};

	fetch(
		'https://api.clarifai.com/v2/models/' +
			MODEL_ID +
			'/versions/' +
			MODEL_VERSION_ID +
			'/outputs',
		requestOptions
	)
		.then((data) => data.json())
		.then((response) => {
			res.json(response);
		});
}


export { handelEntries, handleApiCall };