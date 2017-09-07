var express = require('express');
var app = express();
var request = require('request');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/api/get', function(req, res){
  request({
      method: 'GET',
      uri: 'https://api.kursna-lista.info/b7b80a59415046c33449b6a2a96bd4d8/kursna_lista'
    }, function (error, response, body){
      if(!error && response.statusCode == 200){
        res.json(body);
      }
   })
});

app.listen(3000);