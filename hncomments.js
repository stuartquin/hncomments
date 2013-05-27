var Scrape = require("./lib/scrape").Scrape;
var fs = require("fs");
var RequestCaching = require('node-request-caching');
var winston = require("winston");

var DEBUG = false;

var HNComments = (function() {
    function HNComments( cacheType, port  ) {
        this.base_url = "https://news.ycombinator.com/item?id=";
        this.scraper = new Scrape();
        this.rc = new RequestCaching({
            store: {
                adapter: cacheType
            },
            caching: {
                ttl: 60*5,
                prefix: 'hn'
            }
        });
    }

    HNComments.prototype.fetch = function(id, cb) {
        var url = this.base_url+id;
        var _that = this;

        if ( DEBUG ){
            fs.readFile("demo.html", function(err, demo){
                _that.scraper.parse_comments(demo.toString(), cb);
            });
        } else {
            this.rc.get(url, 
                   null,
                   300,
                   function (error, headers, body, cache) {
                        if ( error ) {
                            winston.error(error);
                            cb( error, null );
                            return;
                        }

                        winston.info("Scraping", url, cache);
                        _that.scraper.parse_comments(body, cb);
                   }
            );
        }
    };

    return HNComments;
})();

exports.HNComments = HNComments;
