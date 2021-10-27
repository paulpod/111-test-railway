# 111 online protypes
Design prototypes for 111 online project

Note this is prototype code. Not intended for production use.

## Getting started
Make sure you have Node installed (on OSX via [Homebrew](https://brew.sh) is an
easy way of doing it):

`brew install node`

Clone this repo:
`git clone https://gitlab.com/111-online/nhs111-prototype-kit`

Install dependencies:
`npm install`

Start local development (Sass and Nodemon watching):
`grunt`

---

### Elasticsearch

If you want to run the search prototypes locally then you need to set up
[elasticsearch](https://www.elastic.co/products/elasticsearch).

On OSX this is simple enough through [Homebrew](https://brew.sh).
`brew install elasticsearch`
`brew install kibana`

Add the data in `/data/searchdata.json` to an ES database (see
[elasticsearch](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html)
docs for more help). Kibana as a UI is handy for this. Ensure to use pathways_inc_alias file and POST to http://localhost:9200/pathways_inc_alias/_doc/_bulk?pretty

Once your search is up and running, the prototype can run locally with the
following commands (use two Terminal tabs):
`elasticsearch`
`grunt`

---

### GP lookup widget

The GP Lookup app, used to perform the ‘Find your GP’ lookup functionality (via CORS):
`https://gitlab.com/demotive/gp-lookup`

#### Downloading and running `gp-lookup`:

Make sure you’ve got a suitable version of Ruby, and Bundler (have fun). Clone the directory then:

`bundle install`

Once that’s done, start the app with an environment variable like this:

`ALLOWED_ORIGINS=http://localhost:3000 bundle exec rackup`

This app should now be running happily. You can use it standalone at [http://localhost:9292](http://localhost:9292).

---

### Automated screenshots / visual regression

In `/backstop_data/backstop_tests` are some automated screengrab journeys. They
use [backstopjs](https://github.com/garris/BackstopJS).

At the moment this is pretty lo-fi, just using a local install of backstopjs and
running it manually:

`npm install -g backstopjs`

From within the root folder run `backstop init`

Then with `localhost` running you should be able to run (for example):

`backstop test --config/backstop_data/backstop_tests/emergency-prescriptions`

(`backstop.json`, `backstop_data/bitmaps_reference`, `backstop_data/bitmaps_test`,
`backstop_data/html_report` are all git ignored in favour of doing it lo-fi and locally)
