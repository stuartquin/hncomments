var $ = require("jquery");
var Scrape = require("./lib/scrape").Scrape;


var HNComments = (function() {
    function HNComments( id ) {
        this.base_url = "https://news.ycombinator.com/item?id=";
        this.scraper = new Scrape();
    }

    HNComments.prototype.fetch = function(id, cb) {
        var url = this.base_url+id;
        var _that = this;
        $.ajax({
            url: url,
        }).done(function(data) {
            _that.scraper.parse_comments(data, cb);
        });
    };

    return HNComments;
})();

exports.HNComments = HNComments;
