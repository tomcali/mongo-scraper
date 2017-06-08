# mongo-scraper

Week 18 Homework: Create a Web Scraper with Document Storage in MongoDB

The job is to gather information from the web in an automated fashion,
 as with a web crawler/scraper. We need to store this information
  in a MongoDB database. We need to be able to add comments about
  the stored articles. We need to view the notes and be able to
  remove those comments. And also we need to be able to remove the
  article completely.

  Complete instructions and a demo are available under the
  Instructions directory of this repository.

  We approached this project starting with the standalone node
  work. That is, concerned to get the database functions working
  first. Materials from our June 1 class were most useful in setting
  the stage for this assignment. Another reference,

  // http://www.netinstructions.com/how-to-make-a-simple-web-crawler-in-javascript-and-node-js/

  showed how to build a web crawler working from an initial URL
  and looking for particular text within web pages visited.

  This was useful because we wanted to develop
  what might be called a "focused crawler." We are looking for
  web pages that satisfy selected criteria... here the mention of
  "vue."

We completed the crawl, file checking, console logging, storage to
 the MongoDB datbase, and setup of the express web server.
 There is additional work to do on the database side, with
 parsing of the crawled text. And there is additional work to do on the client side for
user access to the database information and user addition of
comments to the database. There is a comment field, but at this
point all of those fields have the string 'none' entered.

## Technologies Used

* Git/GitHub
* node/npm with initial npm init to set up package.json
* node.js packages for website and database servers, including express,
cheerio, fs, url-parse, mongojs, and request
* MongoDB utilities, with the mongo cli and Robomongo used to set up and examine the initial database
by use scraper and a test record added to the database.

```
> use scraper
switched to db scraper
> db.scrapedData.insert({nfile: 0,
                         link: 'null',
                         body: 'null',
                         comment: 'none'})

WriteResult({ "nInserted" : 1 })
```

Working with the scraper, we could then add additional
 documents to the scraper database via node and mongojs
```
db.scrapedData.save({
    nfile: nfile,
    link: url,
    body: webpageBody,
    comment: 'none'
})
```

Pages with the search text would be saved in their entirety with the expectation
that there would be additional parsing later.

## Coding Process

* We start with GitHub, setting up the repository for the application
* Clone the repository and set up the files required for this assignment,
including .gitignore.
* npm init to set up package.json with the ability to add packages/modules with npm init -y
* Added numerous node packages with npm install --save [package-name]
* We started by developing the crawler, saving information to an
external file and logging to the console.
* The we moved on to MongoDB via mongod in the terminal application,
using Robomongo for interactive viewing
of the structure and contents of the NoSQL database

## Application Testing
Executed partial testing under node.js and on the node server.
Still much to do to get all the pieces to work together.

We scrape only when the scrape URL is entered on the localhost port 3000
This results in writing to the external file, console, and database
Scraping continues with delays to accommodate many requests,
all the while logging to files, console, and database
until a maximum number of pages is reached (10 pages in test).
Here is sample console output from a web crawl test run using
the O'Reilly website and the search word "vue." The log shows how
we cascade down the website, going from the starting URL to <a> links
from that staring URL. We were looking for "vue," which was not
present on many of the pages crawled.

```
App running on port 3000!
Visiting page https://www.oreilly.com/
Status code: 200
Found 20 relative links on page
Visiting page https://www.oreilly.com/topics/web-programming
Status code: 200
Word vue found at page https://www.oreilly.com/topics/web-programming
writing web page body to file 1

output to webpage-body-1.txt

{ nfile: 1,
  link: 'https://www.oreilly.com/topics/web-programming',
  body: ...,
  comment: 'none',
  _id: 5939c08369b4c02b7fe362f6 }
Visiting page https://www.oreilly.com/topics/software-engineering
Status code: 200
Found 100 relative links on page
Visiting page https://www.oreilly.com/all
Status code: 200
Found 212 relative links on page
Visiting page https://www.oreilly.com/topics
Status code: 200
Found 80 relative links on page
Visiting page https://www.oreilly.com/learning
Status code: 200
Found 222 relative links on page
Visiting page https://www.oreilly.com/ideas
Status code: 200
Found 222 relative links on page
Visiting page https://www.oreilly.com/ideas/page/2
Status code: 200
Found 213 relative links on page
Visiting page https://www.oreilly.com/ideas/page/3
Status code: 200
Found 213 relative links on page
Visiting page https://www.oreilly.com/ideas/page/4
Status code: 200
Found 213 relative links on page
Reached max limit of number of pages to visit.
```