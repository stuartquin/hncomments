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
