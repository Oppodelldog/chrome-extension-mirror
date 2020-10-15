var fs = require("fs");
var host = "0.0.0.0";
var port = 8080;
var express = require("express");

var app = express();
app.use('/', express.static(__dirname + '/public'));
app.listen(port, host);
