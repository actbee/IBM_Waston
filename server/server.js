const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const { json } = require('express/lib/response');
const {fetchRecipes} = require('./api/api')


var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// This responds with "Hello World" on the homepage
app.get('/', function (req, res) {
    console.log("Got a GET request for the homepage");
    res.send('Hello GET');
 })
 
 // This responds a POST request for the homepage
 app.post('/', function (req, res) {
    console.log("Got a POST request for the homepage");
    console.log("req", req);
    res.send('Hello POST');
 })
 

 // This responds a POST request for search
 app.post('/search', function (req, res) {
    console.log("Search elastic to get recipies");
    console.log("req.headers: ", req.headers);
    console.log("req.body: ", req.body);

    if (req && req.body && req.body.ingredients) {
        let ingredients = req.body.ingredients;

        let result = fetchRecipes(ingredients);
        result.then(hits => {
            res.json({
                "hits": hits.length,
                "search": hits
            });
        }).catch(function (e) {
            res.status(500, {
                error: e
            });
        });
    } else {
        res.send("ingredients doesn't exist")
    }
 })




 
 var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    
    console.log("Example app listening at http://%s:%s", host, port)
 })

