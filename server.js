'use strict';
const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = process.env.PORT || 8080;

// Database
MongoClient.connect(process.env.MONGOLAB_URI, (err, db) => {
  if (err) return console.log(err);

  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });
  
  app.get('/:number', (req, res) => {
    db.collection('urls').find({ number: Number(req.params.number) }).toArray((err, items) => {
      if (err) console.log(err);
      
      if (items.length > 0) {
        res.redirect(items[0].url);
      } else {
        res.json({
          error: 'URL not present in the database.'
        });
      }

    });
  });

  app.get('/new/http://:url(*)', (req, res) => {
    if (/\w+\..{2,}/.test(req.params.url)) {
      let number = Math.floor(Math.random() * 10000);
      
      res.json({
        original_url: 'http://' + req.params.url,
        short_url: 'https://minigurl.herokuapp.com/' + number
      });
      
      let document = {
        number,
        url: 'http://' + req.params.url
      };
      
      db.collection('urls').save(document, (err, result) => {
        if (err) return console.log(err);
        
        console.log('Saved to DB.');

      });
    } else {
      res.json({
        error: 'Invalid URL, should follow valid https://www.example.com format.'
      });
    }
  });
  
  app.get('/new/https://:url(*)', (req, res) => {
    if (/\w+\..{2,}/.test(req.params.url)) {
      let number = Math.floor(Math.random() * 10000);
      
      res.json({
        original_url: 'https://' + req.params.url,
        short_url: 'https://minigurl.herokuapp.com/' + number
      });
      
      let document = {
        number,
        url: 'https://' + req.params.url
      };
      
      db.collection('urls').save(document, (err, result) => {
        if (err) return console.log(err);
        
        console.log('Saved to DB.');

      });
    } else {
      res.json({
        error: 'Invalid URL, should follow valid https://www.example.com format.'
      });
    }
  });
  
  app.get('/new/:url', (req, res) => {
    res.json({
      error: 'Invalid URL, should follow valid http://www.example.com format.'
    });
  });
  
  app.listen(port, function() {
    console.log('listening on ' + port);
  });
  
});
