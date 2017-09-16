//Imports
var express = require('express');

//Initialization
var app = express();
app.use(bodyParser.json());

//Routing
app.get('/', function (req, res) {
   res.send('Hello World');
})

//Start server
var server = app.listen(8081, function () {
   var port = server.address().port
   console.log("Example app listening on port %s", port)
})