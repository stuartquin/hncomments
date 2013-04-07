var $ = require("jquery");
var Scrape = require("./lib/scrape").Scrape;


var HNComments = (function() {
    HNComments.name = 'HNComments';

    function HNComments() {
        this.scraper = new Scrape();
        this.url = "https://news.ycombinator.com/item?id=5506656";
    }

    HNComments.prototype.fetch = function(cb) {
        var _that = this;
        $.ajax({
            url: this.url,
        }).done(function(data) {
            _that.scraper.parse_comments(data, cb);
        });
    };

    return HNComments;
})();

exports.HNComments = HNComments;
