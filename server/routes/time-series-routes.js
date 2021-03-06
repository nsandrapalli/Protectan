var glob = require("glob");
var path = require("path");
var _ = require("lodash");

// for each asset level, collect the json data to configure the json-server router
// example structure: { 'assets': [ {...}, {...} ], 'enterprises': [...], ... }
var getRoutes = function() {
  var levels = ['temperature1', 'humidity1', 'co1'];
  var routes = {};
  _.each(levels, function(level) {
    routes[level] = getLevelData(level);
  });
  return routes;
};

// Pass in the name of the level
// returns an array of objects based on data in .json files in level folder
// example structure: [ { ... json file data ... }, { ... json file data ...} ]
var getLevelData = function(level) {
  var fullPath = './sample-data/time-series/' + level + '/**/*.json';
  var resolvedPath = path.resolve(__dirname, fullPath);
  var jsonObjects = [];
  var files = glob.sync(resolvedPath, {}); // all JSON files in path
  _.each(files, function(file) {
    var json = require(file); // import json data
    jsonObjects.push(json);
  });
  return jsonObjects;
};

// export the routes to be used in express/json-server in app.js
module.exports = function() {
  return getRoutes();
};
