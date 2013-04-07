var HNComments = (function() {
    HNComments.name = 'HNComments';

    function HNComments() {
        this.url = "http://localhost:3000?id=5506656";
        this.comments = [];
    }

    HNComments.prototype.fetch = function() {
        var _that = this;
        $.getJSON(this.url, function(data) {
            _that.render(data);
        });
    };

    HNComments.prototype.render = function(data) {
        var html = "<div>";
        for( i in data ){
            var comment = new HNComment(data[i]);
            this.comments.push(comment);
            html += comment.getHTML();
        }

        document.getElementById("hncomments").innerHTML = html;
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
        headline += "<a href='#'>"+this.comment.author.name+"</a>";
        //headline += "<span class='hncomments-time'>"+this.comment.time+"</span>";
        headline += "</div>";

        var body = "<div class='hncomments-body'>";
        body += this.comment.body;
        body += "</div>";

        var container = "<div class='hncomments-comment'";
        container    += " style='margin-left:"+this.comment.indent+"px'>";

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
