//Imports
var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');

//Initialization
var app = express();
app.use(bodyParser.json());

//Helper functions
var registerUser = function(registrationInfo, successCallback, errorCallback) {
	if(!registrationInfo) { 
		errorCallback("No registration info supplied");
		return;
	}

	MongoClient.connect("mongodb://localhost:27017/testDB", function(err, db) {
		if(err) { 
			errorCallback(err);  
			return; 
		}

		var collection = db.collection('Account');

		//check if account already exists

		var accountFound;
		collection.findOne({"username": registrationInfo.username}, function(err, result) {
			if (err) {
				errorCallback(err);  
				return; 
			};

			if(result) {
				errorCallback("Account already exists");
				return;
			}

			collection.insert(registrationInfo);
			successCallback(JSON.stringify(registrationInfo));
			db.close();
	  	});
	});
}

//Routing
app.get('/', function (req, res) {
   res.send('Hello World');
})

app.post('/register', function(req, res) {	
	registerUser(req.body, 
	function(result) {
		res.send("User saved: " + result);
	}, 
	function(err) {
		res.send("Error saving user : " + err);
	})
})

//Start server
var server = app.listen(8081, function () {
   var port = server.address().port
   console.log("Example app listening on port %s", port)
})