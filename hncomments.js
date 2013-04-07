var $ = require("jquery");
var Scrape = require("./lib/scrape").Scrape;
var fs = require("fs");
var request = require('request');

DEBUG = false;

var HNComments = (function() {
    function HNComments( id ) {
        this.base_url = "https://news.ycombinator.com/item?id=";
        this.scraper = new Scrape();
    }

    HNComments.prototype.fetch = function(id, cb) {
        var url = this.base_url+id;
        var _that = this;

        if ( DEBUG ){
            fs.readFile("demo.html", function(err, demo){
                _that.scraper.parse_comments(demo.toString(), cb);
            });
        } else {
            request(url, function (error, response, body) {
                _that.scraper.parse_comments(body, cb);
            });
        }
    };

    return HNComments;
})();

exports.HNComments = HNComments;
