var getHost = (function() {
    var scripts = document.getElementsByTagName('script');
    var index = scripts.length-1;
    var thisScript = scripts[index];
    return function() {
        return thisScript.src.match(/^(http[s]?:)?\/\/([A-Za-z0-9\.:]*)/)[2]; 
    };
})();

var css = "#hncomments-wrapper{background-color:#f6f6ef}#hncomments-wrapper hr{display:none}#hncomments-header{background-color:#f60;padding:2px;line-height:12pt;margin-bottom:15px}#hncomments-header h3{font-size:10pt;margin:0;display:inline;font-weight:bold;line-height:inherit}#hncomments-header a{font-size:10pt;color:black;text-decoration:none;line-height:inherit}.hncomments-headline{font-size:8pt;color:#828282;font-family:Verdana;margin-bottom:5px}.hncomments-headline a{text-decoration:none;color:#828282;font-family:Verdana}.hncomments-body{font-size:9pt;font-family:Verdana;margin-bottom:15px}.hncomments-body p{margin-top:8px;margin-bottom:0}.hncomments-body a{color:black}";

var HNComments = (function() {
    HNComments.comment_count = 0;

    function HNComments() {
        this.hn_el = document.getElementById("hncomments");
        this.post_id = this.hn_el.getAttribute("data-post-id");
        this.url = 'http://'+getHost()+"?id="+this.post_id;
        this.styled = this.hn_el.getAttribute('data-style');
        this.comments = [];

        HNComments.max_comments = this.hn_el.getAttribute("data-max-comments");
        HNComments.max_depth = this.hn_el.getAttribute("data-max-depth");
    }

    HNComments.prototype.fetch = function() {
        var _that = this;
        this.hn_el.innerHTML = "<center><img class='loader' src='http://"+getHost()+"/ajax-loader.gif' /></center>";
        
        var xhr = new XMLHttpRequest();
        xhr.open('GET', _that.url);
        xhr.onload = function() {
            _that.render(JSON.parse(xhr.response));
        };
        xhr.send();
    };

    HNComments.prototype.render = function(data) {
        var html = '';

        if (this.styled) {
            var head = document.getElementsByTagName('head')[0];
            var style = document.createElement('style');
            style.type = 'text/css';
            style.appendChild(document.createTextNode(css));
            head.appendChild(style);
        }

        html += "<div id='hncomments-wrapper'>";

        html += "<div id='hncomments-header'>";
        html += "<h3>Comments from Hacker News</h3>";
        html += "<a href='https://news.ycombinator.com/item?id="+this.post_id+"' target='_blank'>";
        html += " | Join The Discussion";
        html += "</a>";
        html += "<hr />";
        html += "</div>";

        for( i in data.comments ){
            var comment = new HNComment(data.comments[i]);
            this.comments.push(comment);
            comment_str = comment.getHTML();
            if( comment_str !== null ){
                html += comment_str;
            }
        }
        
        html += '</div>';
        this.hn_el.innerHTML = html;
    };

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
        headline += "<a target='_blank' href='https://news.ycombinator.com/"+ this.comment.author.link +"'>";
        headline += this.comment.author.name+"</a>";
        headline += "<span class='hncomments-time'> "+this.comment.time_ago+"</span>";
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
    };

    return HNComment;
})();

comments = new HNComments();
comments.fetch();
