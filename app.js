const express = require('express')
const path = require('path')
const logger = require('morgan')
const bodyParser = require('body-parser')
const neo4j = require('neo4j-driver').v1 

const app = express()
const PORT = 5000


// view engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// set up middleware
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

// connect to neo4j using the bolt protocol
const driver = neo4j.driver('bolt://localhost',neo4j.auth.basic('neo4j', 'admin'))
const session = driver.session()

// set up routes
app.get('/', (req, res => {
    session
    .run('MATCH(n:Movie RETURN n LIMIT 25') 
    .then((result) => {
        const movieArray = [];
            result.records.forEach((record) => {
            movieArray.push({
                id: record._fields[0].identity.low,
                title: record._fields[0].properties.title,
                year: record._fields[0].properties.year
            });
        });
        res.render('index')
    })
    .catch((error) => console.log(error))
}));



app.listen(PORT, () => console.log(`Server started on port ${PORT}`))


module.exports = app




