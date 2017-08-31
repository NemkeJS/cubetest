var https = require('https'),
    pem = require('pem'),
    express = require('express');

pem.createCertificate({days:1, selfSigned:true}, function(err, keys){
  var app = express();

  app.get('/',  function(req, res){
    res.send('o hai!');
  });

  https.createServer({key: keys.serviceKey, cert: keys.certificate}, app).listen(443);
});