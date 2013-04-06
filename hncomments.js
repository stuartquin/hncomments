$ = require("jquery");

var HNComments = (function() {
    HNComments.name = 'HNComments';

    function HNComments() {
        this.url = "http://hndroidapi.appspot.com/nestedcomments/format/json/id/5486605?appid=&callback=";
    }

    HNComments.prototype.fetch = function(cb) {
        $.ajax({
            url: this.url,
        }).done(function(data) {
            cb(data);
        });
    };

    return HNComments;
})();

exports.HNComments = HNComments;
