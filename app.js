var express = require('express');
var app = express();

var HNComments = require("./hncomments").HNComments;
comments = new HNComments();

app.get('/', function(req, res){

    comments.fetch(req.query.id, function(error,data){
        res.set({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin' : '*'
        });
        res.send(data);
    });
});
app.listen(3000);

/*
http.createServer(function (request, response) {
    comments.fetch(function(error,data){
        response.writeHead(200, {
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin' : '*'
        });
        response.end(JSON.stringify(data));
    });

}).listen(3000);
*/
