"use strict";
const express = require('express'),
    http = require('http'),
    path = require('path'),
    bodyParser = require('body-parser');

process.on('uncaughtException', function (err) {
  console.error('[affront-examples] Uncaught exception: ',err);
  process.exit(1);
});

process.on('exit', function(code) {
  console.log('[affront-examples] Exiting with code:', code);
});


const app = express();

app.set('port', process.env.PORT || 5446);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, 'public')));

http.createServer(app).listen(
  app.get('port'), function(){
  	console.log('********************************************************************');
  	console.log('*                   Copyright (c) ' + new Date().getFullYear() + ' Kimanzi Mati                *');
    console.log('*                             MIT License                          *');
    console.log('*                                                                  *');
  	console.log('*                           affront-examples                       *');
  	console.log('*                                                                  *');
  	console.log("*       A small app to show how to use the affront.js library      *");
  	console.log('********************************************************************');
    console.log('affront-examples server listening on port ' + app.get('port'));
    console.log();
});
