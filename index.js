/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var htmlMinifier = require("html-minifier");
var assign = require("object-assign");
var loaderUtils = require("loader-utils");

function getLoaderConfig(context) {
    var query = loaderUtils.getOptions(context) || {};
    var configKey = query.config || 'htmlLoader';
    var config = context.options && context.options.hasOwnProperty(configKey) ? context.options[configKey] : {};

    delete query.config;

    return assign(query, config);
}

module.exports = function(content) {
    var config = getLoaderConfig(this);
	this.cacheable && this.cacheable();
	this.value = content;
    if(typeof config.minimize === "boolean" ? config.minimize : this.minimize) {
        var allOptions = [
            "removeComments",
            "removeCommentsFromCDATA",
            "removeCDATASectionsFromCDATA",
            "collapseWhitespace",
            "conservativeCollapse",
            "removeAttributeQuotes",
            "useShortDoctype",
            "keepClosingSlash",
            "minifyJS",
            "minifyCSS",
            "removeScriptTypeAttributes",
            "removeStyleTypeAttributes",
        ];
        var minimizeOptions = assign({}, allOptions);

        allOptions.forEach(function(name) {
            if(typeof minimizeOptions[name] === "undefined") {
                minimizeOptions[name] = true;
            }
        });
        content = htmlMinifier.minify(content, minimizeOptions);
    }
	return "module.exports = " + JSON.stringify(content);
}
module.exports.seperable = true;