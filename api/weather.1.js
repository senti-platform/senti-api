const dotenv = require('dotenv').load()
const create = require('apisauce').create
const express = require('express')
const router = express.Router()
const verifyAPIVersion = require('../lib/verifyapiversion')

const api = create({
	baseURL: `https://api.darksky.net/forecast/${process.env.WEATHER_API}/`,
	timeout: 30000
})

// DarkSky weather API proxy
const getWeather = async (date, lat, long, lang) => {
	let response
	try {	
		response = await api.get(`${lat},${long},${date}?lang=${lang}&exclude=alerts,flags&units=si`)
	} catch (error) {
		console.error(error)
	}

	// check response	
	if (response.ok && response.status == 200) {
		console.log('API/weather returned:', response.status)
		return response.data
	} else {
		console.log('API/weather Error:', response.problem)
		return null
	}
}

/* get weather */
router.get('/:version/:date/:lat/:long/:lang', async (req, res, next) => {
	if (verifyAPIVersion(req.params.version)) {
		let response
		response = await getWeather(req.params.date, req.params.lat, req.params.long, req.params.lang)
		// res.send(JSON.stringify(response))
		res.json(response)
	} else {
		res.send(`API/weather version: ${req.params.version} not supported`)
	}
})

module.exports = router