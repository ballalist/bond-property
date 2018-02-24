var express = require('express');
var app = express();

app.get('/', function(req, res) {
    res.send('You are amazing');
});

app.get('/api', function(req, res) {
    res.send('api part');
});

app.listen(8000);
