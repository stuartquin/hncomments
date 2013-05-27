var getHost = (function() {
    var scripts = window.document.getElementsByTagName('script');
    var index = scripts.length-1;
    var thisScript = scripts[index];
    return function() {
        return thisScript.src.match(/^(http[s]?:)?\/\/([A-Za-z0-9\.:]*)/)[2]; 
    };
})();

var css = "#hncomments-wrapper .join-text {color:#000; padding-top: 5px;} #hncomments-wrapper .hncomments-comment {padding:10px;}#hncomments-wrapper h3{color:#000;}#hncomments-wrapper{background-color:#f6f6ef}#hncomments-wrapper hr{display:none}#hncomments-header{text-shadow:none;background-color:#f60;padding:2px;line-height:12pt;margin-bottom:15px}#hncomments-header h3{font-size:10pt;margin:0;display:inline;font-weight:bold;line-height:inherit}#hncomments-header a{font-size:10pt;color:black;text-decoration:none;line-height:inherit}.hncomments-headline{font-size:8pt;color:#828282;font-family:Verdana;margin-bottom:5px}.hncomments-headline a{text-decoration:none;color:#828282;font-family:Verdana}.hncomments-body{font-size:9pt;font-family:Verdana;margin-bottom:15px}.hncomments-body p{margin-top:8px;margin-bottom:0}.hncomments-body a{color:black}";

var HNComments = (function() {
    HNComments.comment_count = 0;
    HNComments.total_comments = 0;

    function HNComments() {
        this.hn_el = window.document.getElementById("hncomments");
        this.post_id = this.hn_el.getAttribute("data-post-id");
        this.url = 'http://'+getHost()+"?id="+this.post_id;
        this.styled = this.hn_el.getAttribute('data-style');
        this.styled = (this.styled !== null && this.styled.toLowerCase() === "true");

        this.comments = [];

        HNComments.max_comments = this.hn_el.getAttribute("data-max-comments");
        HNComments.max_depth = this.hn_el.getAttribute("data-max-depth");
    }

    HNComments.prototype.fetch = function() {
        var _that = this;
        this.hn_el.innerHTML = "<center><img class='loader' src='http://"+getHost()+"/ajax-loader.gif' /></center>";
        
        var xhr = new window.XMLHttpRequest();
        xhr.open('GET', _that.url);
        xhr.onload = function() {
            _that.render(JSON.parse(xhr.response));
        };
        xhr.send();
    };

    HNComments.prototype.render = function(data) {
        var html = "";
        var post_link = "https://news.ycombinator.com/item?id="+this.post_id;

        if (this.styled) {
            var head = window.document.getElementsByTagName('head')[0];
            var style = window.document.createElement('style');
            style.type = 'text/css';
            style.appendChild(window.document.createTextNode(css));
            head.appendChild(style);
        }

        html += "<div id='hncomments-wrapper'>";

        html += "<div id='hncomments-header'>";
        html += "<hr />";
        html += "<h3><a target='_blank' href='https://github.com/stuartquin/hncomments/'>HNComments</a></h3>";
        html += "<br/><span class='join-text'>";
        html += "<a href='"+post_link+"' target='_blank'>";
        html += "Join the discussion on Hacker News";
        html += "</a></span>";
        html += "<hr />";
        html += "</div>";

        if ( data.comments ){
            HNComments.total_comments = data.comments.length;

            for( var i in data.comments ){
                var comment = new HNComment(data.comments[i]);
                this.comments.push(comment);
                var comment_str = comment.getHTML();
                if( comment_str !== null ){
                    html += comment_str;
                }
            }
        }

        if( HNComments.total_comments === 0 ){
            html += "<div class='hncomments-body'>";
            html += "This post currently has no comments, why not";
            html += " <a href='"+post_link+"'>start the discussion</a>";
            html += "</div>";
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

        var actions = "<div></div>";

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
            var comment_str = this.children[i].getHTML();
            if( comment_str ){
                container += comment_str;
            }
        }
        container    += "</div></div>";

        return container;
    };

    return HNComment;
})();

var comments = new HNComments();
comments.fetch();
