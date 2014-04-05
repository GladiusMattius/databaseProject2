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
            connection.query('select Email, Password from Account where Email = ?', req.body.Email, 
			     function (err, result) {
                    console.log(result);
                    if(result.length > 0) {
			              res.send('Email: ' + result[0].Email + '<br />' +
					              'Password: ' + result[0].Password
					             );
                    }
                    else
                      res.send('User was not inserted.');
				 });
        }
    );
});

// Begin listening

app.listen(8009);
//console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
