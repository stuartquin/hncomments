var HNComments = (function() {
    function HNComments() {
        this.hn_el = document.getElementById("hncomments")
        this.post_id = this.hn_el.getAttribute("data-post-id");
        this.url = "http://localhost:3000?id="+this.post_id;
        this.comments = [];
    }

    HNComments.prototype.fetch = function() {
        var _that = this;
        $.getJSON(this.url, function(data) {
            _that.render(data);
        });
    };

    HNComments.prototype.render = function(data) {
        var html = "";
        html += data.form;

        for( i in data.comments ){
            var comment = new HNComment(data.comments[i]);
            this.comments.push(comment);
            html += comment.getHTML();
        }

        document.getElementsByTagName("head")[0].innerHTML += "<link rel='stylesheet' href='style.css'>";
        this.hn_el.innerHTML = html;
    }

    return HNComments;
})();


// Represents a single hackernews comment
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

        var headline = "<div class='hncomments-headline'>";
        headline += "<a href='https://news.ycombinator.com/"+ this.comment.author.link +"'>"
        headline += this.comment.author.name+"</a>";
        headline += "<span class='hncomments-time'> - "+this.comment.time_ago+"</span>";
        headline += "</div>";

        var actions = "<div>";
        actions += "<a href='https://news.ycombinator.com/"+this.comment.vote_link+"'>";
        actions += "Up Vote</a>";
        actions += "</div>";

        var body = "<div class='hncomments-body'>";
        body += this.comment.body;
        body += "</div>";
        body += actions;
        body += "<hr />";

        var container = "<div class='hncomments-comment'";
        container    += " style='margin-left:20px'>";

        container    +=  headline + body;
        container    += "<div class='hncomments-children'>";
        for( var i in this.children ){
            container += this.children[i].getHTML();
        }
        container    += "</div></div>";

        return container;
    }

    return HNComment;
})();

comments = new HNComments();
comments.fetch();
