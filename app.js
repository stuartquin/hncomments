var program = require('commander');

program
    .option('-c, --cache [type]', 'The cache type to use: redis or memory (default is redis)')
    .option('-r, --redis [port]', 'The port that Redis is running on (default is 6379)', parseInt)
    .option('-p, --port  [port]', 'The port to run the app on (default is 3000)', parseInt)
    .parse(process.argv);

var cacheType = program.cache || 'redis';
var redisPort = program.redis || 6379;
var appPort = program.port || 3000;

var express = require('express');
var app = express();

var HNComments = require("./hncomments").HNComments;
comments = new HNComments(cacheType, redisPort);

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


app.listen(appPort);
console.log('Server started on port '+appPort);
