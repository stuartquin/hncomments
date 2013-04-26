# HNComments

__Embeddable Hackernews comment feeds.__

Simple script for embedding Hacker News comments in a blog or article.
Contributions from [stuartquin](http://github.com/stuartquin) and [saralk](http://github.com/saralk)


## Hosted

The version hosted on __hncomments.custardapp.com__ is intended for demo purposes only. For ensured reliability
please clone and self host.

If people really like the hosted version please get in touch and we can discuss solutions for a more permenant,
gurarnteed hosted service.


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


## Installation

hncomments is written in nodejs. It makes requests to and scrapes the required Hacker News comment streams.


```
git clone https://github.com/stuartquin/hncomments.git
cd hncomments
npm install .

node app.js 
```

By default hncomments uses [redis](http://redis.io/) for caching scraped comment feeds from Hacker News.
You can change this behaviour by setting `--cache memory` on the command line. Run `node app.js --help`
for full range of options














    
