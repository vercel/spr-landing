const prender = require("preact-render-to-string");
const htm = require("htm");
const { h } = require("preact");
const pmap = require("promise-map");

exports.render = prender;
exports.html = htm.bind(h);
