# HNComments

__Embeddable Hackernews comment feeds.__

Simple script for embedding Hacker News comments in a blog or article.
Contributions from @stuartquin and @saralk

## Usage

Simply embed the following script in your blog or article:

```
  <div id="hncomments" data-post-id="..."></div>
  <script src="http://hncomments.custardapp.com/main.js"></script>  
```

### data Parameters

The `id="hncomments"` element supports a range of `data-` parameters:

* data-post-id: _required_ Integer. ID of the hackernews comment thread
* data-max-comments: Integet. Amount of comments to display
* data-style: Boolean. If set to true the comments will be styled like the 'classic' hackernews feed.



    
