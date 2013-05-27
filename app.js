var program = require('commander');
var express = require('express');
var app = express();

var winston = require("winston");

var logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      handleExceptions: true
    })
  ],
  exitOnError: false
});

var HNComments = require("./hncomments").HNComments;

// Parse command line options
program
    .option('-c, --cache [type]', 'The cache type to use: redis or memory (default is redis)')
    .option('-r, --redis [port]', 'The port that Redis is running on (default is 6379)', parseInt)
    .option('-p, --port  [port]', 'The port to run the app on (default is 3000)', parseInt)
    .parse(process.argv);

var cacheType = program.cache || 'redis';
var redisPort = program.redis || 6379;
var appPort = program.port || 4000;

var comments = new HNComments(cacheType, redisPort, logger);

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
    if ( req.query.id ){
        comments.fetch(req.query.id, function(error, data){
            if ( error ){
                res.send({error: "Could not process request"}); 
                return;
            }
            res.send(data);
        });
    } else {
        res.send({error: "No ID specified"});
    }
});

app.listen(appPort);
logger.info('Server started on port: '+appPort);
logger.info('Cache Type: ' +cacheType);
