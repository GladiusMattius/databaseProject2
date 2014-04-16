
var express = require('express'),   // web framework
    ejs     = require('ejs'),       // templates
    mysql   = require('mysql'),     // database
    connect = require('connect');   // GET and POST request parser

var app = express();                
app.use(connect.urlencoded());
app.use(connect.json());
app.use(express.static('public'));  

app.set('view engine', 'ejs');       // set .ejs as the default template extension.
app.set('views', __dirname + '/views'); //set where view templates are located


var connection = mysql.createConnection({
    host: 'localhost',
    user: 'matjohnson',
    password: '3968099'
});

// Database setup

connection.query('USE matjohnson', function (err) {
    if (err) throw err;
});

// Configuration

app.use(express.bodyParser());

// Main route sends our HTML file

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

app.get('/login', function (req, res) {
    res.sendfile(__dirname + '/login.html');
});

app.get('/createAccount', function (req, res) {
    res.sendfile(__dirname + '/createAccount.html');
});

app.get('/store', function (req, res) {
    res.sendfile(__dirname + '/store.html');
});

/*app.get('/itemdetails', function (req, res) {
    res.sendfile(__dirname + '/itemdetails.html');
});
*/
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
                    if (result.length > 0) {
                        res.send('Email: ' + result[0].Email + '<br />' +
                            'FirstName: ' + result[0].FirstName + '<br />' +
                            'LastName: ' + result[0].LastName
                        );
                    } else
                        res.send('User was not inserted.');
                });
        }
    );
});
app.post('/store', function (req, res) {
    console.log(req.body);
    if (req.body.itemtype == 2) {
        connection.query('select * from Item', req.body.itemtype,
            function (err, result) {
                console.log(result);
                if (result.length > 0) {
                    /* <a href="/user/?id=' + result[i].id + '">' + result[i].username + '</a>*/
                    var responseHTML = '<table border= 1px solid><tr><th>Name</th><th>Description</th><th>Price</th><th>Cart</th></tr>';
                    for (var i = 0; result.length > i; i++) {
                        responseHTML += '<tr><td><a href="/itemdetails/?Name=' + result[i].Name + '">' + result[i].Name + '<a></td>' +
                            '<td>' + result[i].Description + '</td>' +
                            '<td>' + result[i].Price + '</td>' + '<td><input type="checkbox" id="box' + i + '" ></td>';
                    }
                    responseHTML += '</table><br>';
                    responseHTML += '<input type="submit" id="checkout" value="Checkout" >';
                    res.send(responseHTML);
                } else {
                    res.send('No items found.');
                }
            });

    } else {
        connection.query('select * from Item where Type = ?', req.body.itemtype,
            function (err, result) {
                console.log(result);
                if (result.length > 0) {
                    var responseHTML = '<table border= 1px solid><tr><th>Name</th><th>Description</th><th>Price</th><th>Cart</th></tr>';
                    for (var i = 0; result.length > i; i++) {
                        responseHTML += '<tr><td><a href="" >' + result[i].Name + '<a></td>' +
                            '<td>' + result[i].Description + '</td>' +
                            '<td>' + result[i].Price + '</td>' + '<td><input type="checkbox" id="box' + i + '" ></td>';
                    }
                    responseHTML += '</table><br>';
                    responseHTML += '<input type="submit" id="checkout" value="Checkout" >';
                    res.send(responseHTML);
                } else
                    res.send('No items found.');
            });
    }
});
app.get('/itemdetails', function (req, res) {
    console.log(req.query);
    connection.query('select * from Item where Name = ?', req.query.Name,
        function (err, result) {
            console.log(result);
            var responseHTML = '<p>Name: ' + result[0].Name + '<br> Description: ' +
                result[0].Description + '</p>'

            res.send(responseHTML);
        }
    );
});


app.get('/ejsdemo', function (req, res) {
    console.log('ejs called');
    res.render('ejsdemo');
});

app.get('/lab18', function (req, res) {
    res.render('lab18');
});

// Begin listening

app.listen(8009);
//console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);