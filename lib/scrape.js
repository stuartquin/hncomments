var cheerio = require('cheerio');

var Scrape = (function() {
    function Scrape() {
    }

    Scrape.prototype.parse_comments = function(data, cb) {
        var $ = cheerio.load(data);
        var main = $("center table").first().find("tr:nth-child(3) td").first();
        var sections = main.children("table");

        var form_html = $(sections[0]).find("form").first().parent().html();
        var form = form_html.replace(/action=\"\/r\"/,"action='https://news.ycombinator.com/r'");

        var points = $('.subtext > span').html().replace(' points', '');

        var comments_el = $(sections[1]);  // table

        var top_level = {
            children: [],
            indent: 0
        };
        var prev = top_level;

        // maps from indent to the parent at that indent level
        var parent_map = {
            0: top_level
        };

        var time_ago_regex = /.* ([0-9]+.*)\|/;

        comments_el.children("tr").each(function(){
            var comment_el = $(this).find("td table tr").first();

            var header_el = comment_el.find(".comhead").first();

            var vote_el = comments_el.find("td.default").prev();
            var vote_link = vote_el.find("a").first().attr("href");

            var author_el = header_el.find("a").first();
            var author = {
                name: author_el.text(),
                link: author_el.attr("href")
            };

            var time_matches = header_el.text().match(time_ago_regex);
            if( time_matches ){
                var time_ago = time_matches[1];
            } else {
                var time_ago = "";
            }

            var body = comment_el.find(".comment").html();

            var spacer = comment_el.find("td img").first();
            var indent = parseInt($(spacer).attr("width"));

            if( indent == 0 ){
                prev = top_level;
            }

            // If we change indent level
            if( indent > prev.indent ){
                parent_map[indent] = prev;
            }
            if( indent < prev.indent ){
                prev = parent_map[indent];
            }

            if(prev){
                var comment = new Comment(author, body);
                comment.indent = indent;
                comment.time_ago = time_ago;
                comment.vote_link = vote_link;
                parent_map[indent].children.push(comment);
            }

            prev = comment;
        });

        var result = {form: form, comments: top_level.children, points: points};
        cb(null, result);
    };

    return Scrape;
})();

var Comment = (function() {
    function Comment(author, body){
        this.author = author;
        this.body = body;
        this.children =  [];
        this.indent = 0;
    }
    return Comment;
})();



exports.Scrape = Scrape;
