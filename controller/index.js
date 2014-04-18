var express = require('express'); 
var router = express.Router(); 

router.get('/', function (req, res) {
    res.sendfile('index.html');
});

router.get('/login', function (req, res) {
    res.sendfile('login.html');
});

router.get('/createAccount', function (req, res) {
    res.sendfile('createAccount.html');
});

router.get('/store', function (req, res) {
    res.sendfile('store.html');
});

module.exports = router; 
