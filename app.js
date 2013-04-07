var express = require('express');
var app = express();

var HNComments = require("./hncomments").HNComments;
comments = new HNComments();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    comments.fetch(req.query.id, function(error,data){
        res.send(data);
    });
});
app.listen(3000);
