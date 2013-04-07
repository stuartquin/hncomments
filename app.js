var http = require('http');
var HNComments = require("./hncomments").HNComments;
var comments = new HNComments();
    comments.fetch(function(data){
    });

http.createServer(function (request, response) {
    comments.fetch(function(error,data){
        response.writeHead(200, {
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin' : '*'
        });
        response.end(JSON.stringify(data));
    });

}).listen(3000);
