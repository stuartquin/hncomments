var http = require('http');
var hncomments = require("./hncomments");

comments = new hncomments.HNComments();

http.createServer(function (request, response) {

    comments.fetch(function(data){
        response.writeHead(200, {
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin' : '*'
        });
        response.end(JSON.stringify(data));
    });

}).listen(3000);
