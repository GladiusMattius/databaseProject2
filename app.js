// Module dependencies

var express    = require('express'),
    mysql      = require('mysql');

var path = require('path');

// Application initialization

var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'matjohnson',
        password : '3968099'
    });
    
//var app = module.exports = express.createServer();
var app = express();
app.configure(function() {
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.bodyParser());
    app.use(express.logger("short"));
})

// Database setup

    connection.query('USE matjohnson', function (err) {
        if (err) throw err;
    });

// Configuration

app.use(express.bodyParser());

// Main route sends our HTML file

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html');
});

app.get('/login', function(req, res) {
    res.sendfile(__dirname + '/login.html');
});

app.get('/createAccount', function(req, res) {
    res.sendfile(__dirname + '/createAccount.html');
});

app.get('/store', function(req, res) {
    res.sendfile(__dirname + '/store.html');
});

// Update MySQL database

/*app.post('/', function (req, res) {
    console.log(req.body);
    connection.query('INSERT INTO Account SET ?', req.body, 
        function (err, result) {
            if (err) throw err;
            res.send('User added to database with ID: ' + result.insertId);
        }
    );
});*/

app.post('/createAccount', function (req, res) {
    console.log(req.body);
    connection.query('INSERT INTO Account SET ?', req.body, 
        function (err, result) {
            if (err) throw err;
            connection.query('select Email, FirstName, LastName from Account where Email = ?', req.body.Email, 
			     function (err, result) {
                    console.log(result);
                    if(result.length > 0) {
			              res.send('Email: ' + result[0].Email + '<br />' +
					              'FirstName: ' + result[0].FirstName + '<br />' +
'LastName: ' + result[0].LastName
					             );
                    }
                    else
                      res.send('User was not inserted.');
				 });
        }
    );
});
app.post('/store', function (req, res) {
    console.log(req.body);
          connection.query('select * from Item where ItemID = ?', req.body.itemtype, 
			     function (err, result) {
                    console.log(result);
                    if(result.length > 0) {
			              res.send('Name: ' + result[0].Name + '<br />' +
					              'Description: ' + result[0].Description + '<br />' 
					             );
                    }
                    else
                      res.send('No items found.');
				 });    
});
/*
app.post('/store', function (req, res) {
    console.log(req.body);
    
    // get user by id
    if(typeof req.body.id != 'undefined') {
        connection.query('select * from users where id = ?', req.body.id, 
            function (err, result) {
                console.log(result);
                if(result.length > 0) {
                    var responseHTML = '<table class="users"><tr><th>ID</th><th>Username</th><th>Password</th></tr>';
                    responseHTML += '<tr><td>' + result[0].id + '</td>' + 
                                    '<td>' + result[0].username + '</td>' +
                                    '<td>' + result[0].password + '</td>' +
                                    '</tr></table>';
                    res.send(responseHTML);
                }
                else
                  res.send('User does not exist.');
            }
        );     
    }
    //get user by username    
    else if( typeof req.body.username != 'undefined') {
        connection.query('select username, password from users where username = ?', req.body.username, 
            function (err, result) {
                console.log(result);
                if(result.length > 0) {
  	              res.send('Username: ' + result[0].username + '<br />' +
		  	       'Password: ' + result[0].password
                );
            }
            else
                res.send('User does not exist.');
		});
    }
});

*/
// Begin listening

app.listen(8009);
//console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
