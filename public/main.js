if (typeof $ == "undefined"){
    var oHead = document.getElementsByTagName('HEAD').item(0);
    var oScript= document.createElement("script");
    oScript.type = "text/javascript";
    oScript.src="http://localhost:3000/jquery.js";
    oHead.appendChild(oScript);
}

var HNComments = (function() {
    HNComments.comment_count = 0;

    function HNComments() {
        this.hn_el = document.getElementById("hncomments")
        this.post_id = this.hn_el.getAttribute("data-post-id");
        this.url = "http://localhost:3000?id="+this.post_id;
        this.comments = [];

        HNComments.max_comments = this.hn_el.getAttribute("data-max-comments");
        HNComments.max_depth = this.hn_el.getAttribute("data-max-depth");
    }

    HNComments.prototype.fetch = function() {
        var _that = this;
        this.hn_el.innerHTML = "<center><img class='loader' src='http://localhost:3000/ajax-loader.gif' /></center>";

        $.getJSON(this.url, function(data) {
            _that.render(data);
        });
    };

    HNComments.prototype.render = function(data) {
        var html = "";
        html += "<div id='hncomments-header'>";
        html += "<h3>HNComments</h3>";
        html += "<a href='https://news.ycombinator.com/item?id="+this.post_id+"' target='_blank'>";
        html += "Join The Discussion On Hacker News";
        html += "</a>";
        html += "<hr />";
        html += "</div>"

        for( i in data.comments ){
            var comment = new HNComment(data.comments[i]);
            this.comments.push(comment);
            comment_str = comment.getHTML();
            if( comment_str !== null ){
                html += comment_str;
            }
        }

        this.hn_el.innerHTML = html;
    }

    return HNComments;
})();


// Represents a hackernews comment with children
var HNComment = (function() {
    function HNComment(comment, parent_comment){
        this.parent_comment = parent_comment;
        this.children  = [];
        this.comment   = comment;

        for( var i in comment.children ){
            this.children.push(new HNComment(comment.children[i], this) );
        }
    }

    // Get HTML for this comment
    // Should include fetching HTML for all children comments
    HNComment.prototype.getHTML = function(){
        // Gone too far
        if( HNComments.max_comments && HNComments.comment_count >= HNComments.max_comments ){
            return null;
        }
        HNComments.comment_count++;

        var headline = "<div class='hncomments-headline'>";
        headline += "<a target='_blank' href='https://news.ycombinator.com/"+ this.comment.author.link +"'>"
        headline += this.comment.author.name+"</a>";
        headline += "<span class='hncomments-time'> - "+this.comment.time_ago+"</span>";
        headline += "</div>";

        var actions = "<div>";

        var body = "<div class='hncomments-body'>";
        body += this.comment.body;
        body += "</div>";
        body += actions;
        body += "<hr />";

        var container = "<div class='hncomments-comment'>";

        container +=  headline + body;
        container += "<div class='hncomments-children'";
        container += " style='margin-left:30px'>";
        for( var i in this.children ){
            comment_str = this.children[i].getHTML();
            if( comment_str ){
                container += comment_str;
            }
        }
        container    += "</div></div>";

        return container;
    }

    return HNComment;
})();

comments = new HNComments();
comments.fetch();
