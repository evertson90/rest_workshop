//Imports
var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var ObjectID = require('mongodb').ObjectID;

//Initialization
var app = express();
app.use(bodyParser.json());

//Helper functions
var registerUser = function(registrationInfo, successCallback, errorCallback) {
  if (!registrationInfo) {
    errorCallback("No registration info supplied");
    return;
  }

  MongoClient.connect("mongodb://localhost:27017/testDB", function(err, db) {
    if (err) {
      errorCallback(err);
      return;
    }
    var collection = db.collection('Account');
    collection.insert(registrationInfo);
    successCallback(JSON.stringify(registrationInfo));
    db.close();
  });
}

var getUsers = function(successCallback, errorCallback){
	MongoClient.connect("mongodb://localhost:27017/testDB", function(err, db) {
		if (err) {
			errorCallback(err);
			return;
		}
		var collection = db.collection('Account');
		var userArray = collection.find().toArray(function(err,docs){
			if (err) {
				errorCallback(err);
				return;
			}
			successCallback(docs);
		});

		db.close();
	});
}

var updateUser = function(userInfo, userId, successCallback, errorCallback) {
  if (!userInfo) {
    errorCallback("No user info supplied");
    return;
  }
  MongoClient.connect("mongodb://localhost:27017/testDB", function(err, db) {
    if (err) {
      errorCallback(err);
      return;
    }
    var collection = db.collection('Account');
    collection.update({
      _id: ObjectID(userId)
    }, {
      $set: userInfo
    });
    successCallback(JSON.stringify(userId));
    db.close();
  });
}


var deleteUser = function(userId, successCallback, errorCallback) {
  MongoClient.connect("mongodb://localhost:27017/testDB", function(err, db) {
    if (err) {
      errorCallback(err);
      return;
    }
    var collection = db.collection('Account');
    collection.remove({
      _id: ObjectID(userId)
    }, function(err, res) {
      if (res.result.n === 0) {
        errorCallback("User doesn't exist");
      } else {
        successCallback(res);
      }
      db.close();
    })
  });
}

//Routing
app.get('/', function(req, res) {
  res.send('Hello World');
})

app.get('/users', function(req, res) {
  getUsers(function(result) {
    res.json({users: result})
  }, function(err) {
    res.json({message: "Error getting users"});
  })
})

app.post('/register', function(req, res) {
  registerUser(req.body, function(result) {
    res.send("User saved: " + result)
  }, function(err) {
    res.send("Error saving user : " + err);
  })
});

app.put('/users/:user_id', function(req, res) {
  updateUser(req.body, req.params.user_id,
    function(result) {
      res.json({
        message: 'User updated!'
      });
    },
    function(err) {
      res.json({message: "Error updating user : " + err});
    });
});


app.delete('/users/:user_id', function(req, res) {
  deleteUser(req.params.user_id, function(result) {
    res.json({
      message: 'User deleted!'
    });
  }, function(err) {
    res.json({
      message: err
    });
  });
});



//Start server
var server = app.listen(8081, function() {
  var port = server.address().port
  console.log("Example app listening on port %s", port)
})
