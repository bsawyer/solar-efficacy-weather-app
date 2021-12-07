import https from 'https';
import fs from 'fs';

const options = {
	method: 'GET',
	hostname: 'visual-crossing-weather.p.rapidapi.com',
	port: null,
	headers: {
		'x-rapidapi-host': 'visual-crossing-weather.p.rapidapi.com',
		'x-rapidapi-key': '8fff713f74msh13c8c7bca379ac1p12c2e2jsn5ed75978c284',
		'useQueryString': true
	}
};

const params = {
	location: '-34.8105,138.6112',
	aggregateHours: '1',
	contentType: 'json',
	unitGroup: 'us'
};

function fetchHours(startDateTime, endDateTime){
	return new Promise((resolve, reject) => {
		const search = new URLSearchParams({
			...params,
		  startDateTime,
			endDateTime
		});

		const req = https.request({
			...options,
			path: `/history?${search.toString()}`
		}, res => {
			const chunks = [];

			res.on('data', chunk => {
				chunks.push(chunk);
			});

			res.on('end', () => {
				const body = Buffer.concat(chunks);
				resolve(JSON.parse(body.toString()));
			});
		});

		req.end();
	});
}

const results = [];

async function fetch(){
	const total = 9000;
	const size = 499; // weird range from endpoint
	let count = 1;

	while(count * size <= total){
		const startDate = new Date('2015-01-01T00:00:00');
		startDate.setHours(startDate.getHours() + (count - 1) * size);
		const endDate = new Date('2015-01-01T00:00:00');
		endDate.setHours(endDate.getHours() + count * size);
		console.log({startDate, endDate});
		const body = await fetchHours(startDate.toISOString().replace('.000Z', ''), endDate.toISOString().replace('.000Z', ''));
		console.log('fetched');
		results.push({
			startDate,
			endDate,
			body
		});
		fs.writeFileSync(`./data/weather.json`, JSON.stringify(results, null, 2));
		count++;
	}
}

fetch()
