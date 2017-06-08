// crawler modified from
// http://www.netinstructions.com/how-to-make-a-simple-web-crawler-in-javascript-and-node-js/
// suppose we are looking for the word "vue" across popular web programming sites

// node work
var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var fs = require("fs");
var mongojs = require("mongojs");

// setting things up for MongoDB
// Database configuration
var databaseUrl = "scraper";
var collections = ["scrapedData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
    console.log("Database Error:", error);
});

// web server work
var express = require("express");
// Initialize Express
var app = express();

// // Main route (simple Hello World Message)
// app.get("/", function(req, res) {
//     res.send("Hello world");
// });

// setup for the node-based web scraper
// tested on a number of URLs
// var START_URL = "https://www.javascript.com/news/";
var START_URL = "https://www.oreilly.com/";
// var START_URL = "https://vuejs.org/";
// var START_URL = "https://www.javascript.com/news/";


var SEARCH_WORD = "vue";
var MAX_PAGES_TO_VISIT = 10;

var pagesVisited = {};
var numPagesVisited = 0;
var pagesToVisit = [];
var url = new URL(START_URL);
var baseUrl = url.protocol + "//" + url.hostname;

nfile = 0;  //initialize file counter

//
// pagesToVisit.push(START_URL);
// crawl();

function crawl() {
    if(numPagesVisited >= MAX_PAGES_TO_VISIT) {
        console.log("Reached max limit of number of pages to visit.");
        return;
    }
    var nextPage = pagesToVisit.pop();
    if (nextPage in pagesVisited) {
        // We've already visited this page, so repeat the crawl
        crawl();
    } else {
        // New page we haven't visited
        visitPage(nextPage, crawl);
    }
}

function visitPage(url, callback) {
    // Add page to our set
    pagesVisited[url] = true;
    numPagesVisited++;

    // Make the request
    console.log("Visiting page " + url);
    request(url, function(error, response, body) {
        // Check status code (200 is HTTP OK)
        console.log("Status code: " + response.statusCode);
        if(response.statusCode !== 200) {
            callback();
            return;
        }
        // Parse the document body
        var $ = cheerio.load(body);
        var isWordFound = searchForWord($, SEARCH_WORD);
        if(isWordFound) {
            console.log('Word ' + SEARCH_WORD + ' found at page ' + url);
            // if we find the desired word we write the page contents to a file
            nfile += 1; // increment file count
            console.log('writing web page body to file', nfile);
            // we parse the web page body to get rid of blank characters and linefeeds
            // this is done using .replace with regular expression
            webpageBody = $('body').text().replace(/(^[ \t]*\n)/gm, "");
            fs.writeFile("webpage-body-" + nfile + ".txt",
                webpageBody, function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("\noutput to webpage-body-" + nfile + ".txt\n");
                    }
                });

            // add document to MongoDB database scrapper collection scrapedData
            // documents saved to the database are also logged to the console for review
            db.scrapedData.save({
                    nfile: nfile,
                    link: url,
                    body: webpageBody,
                    comment: 'none'
                },
                function(error, saved) {
                    // If there's an error during this query
                    if (error) {
                        // Log the error
                        console.log(error);
                    }
                    // Otherwise,
                    else {
                        // Log the saved data
                        console.log(saved);
                    }
                });


        } else {
            collectInternalLinks($);
            // In this short program, our callback is just calling crawl()
            callback();
        }
    });
}

function searchForWord($, word) {
    var bodyText = $('html > body').text().toLowerCase();
    return(bodyText.indexOf(word.toLowerCase()) !== -1);
}

function collectInternalLinks($) {
    var relativeLinks = $("a[href^='/']");
    console.log("Found " + relativeLinks.length + " relative links on page");
    relativeLinks.each(function() {
        pagesToVisit.push(baseUrl + $(this).attr('href'));
    });
}

// Main route (simple Hello World Message)
app.get("/", function(req, res) {
    res.send("Hello world");
});

// scrape only when the scrape URL is entered on the localhost port 3000
// this results in writing to the external file, console, and database
// scraping continues with delays to accommodate many requests
// all the while logging to files, console, and database
// until a maximum number of pages is reached (10 pages in test)
app.get("/scrape", function(req, res){
    pagesToVisit.push(START_URL);
    crawl();
});

// Listen on port 3000
app.listen(3000, function() {
    console.log("App running on port 3000!");
});