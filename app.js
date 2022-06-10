require('dotenv').config();
const express = require('express')
const rateLimit = require("express-rate-limit")
const bodyParser = require('body-parser')
const fetch = require('node-fetch');
const app = express()


app.set('view engine', 'pug')
app.set('views', './views')
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

const limiter = rateLimit({
    windowMs: 1000,
    max: 1
})
app.use(limiter);

app.get('/',(req,res) => {
    res.render('index')
})
app.post('/', async (req,res) => {
    
    city={
        name: req.body.location,
    }
    // fucntion calls in every part of the object that it is needed to display
    const details =  await fetchWeather(city.name)  
    res.render('weatherOfLocation', details)
    // console.log(city)
})
//Echo .env && nodemon app.js
// function to fetch city from API
async function fetchWeather(city){
    return fetch(`http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${city}`)
    .then(res => res.json())
    .then(city => {
        
        let details={
            cityName: city.location.name,
            region: city.location.region,
            country: city.location.country,
            localTime: city.location.localtime,
            tempF: Math.round(city.current.temp_f),
            tempC: Math.round(city.current.temp_c),
            condition: city.current.condition.text,
            icon: city.current.condition.icon,
            maxTemp_C: city
        }
        return details
    })
}



app.listen(3000)