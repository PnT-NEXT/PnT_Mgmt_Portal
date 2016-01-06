var _       = require('lodash'),
    fs      = require('fs'),
    mkdirp  = require('mkdirp'),
    mongojs = require('mongojs'),
    util    = {};

util.processError = function (err) {
    throw err;
};

/**
 * Used for converting the _id property of obj to mongodb Id obj, used together with function like _.map
 */
util.toMongoId = function (obj) {
    return mongojs.ObjectId(obj._id.toString());
};

util.strToMongoId = function (idStr) {
    return mongojs.ObjectId(idStr);
};

util.mkdir = function (path) {
    fs.exists(path, function (exists) {
        if (!exists) {
            mkdirp(path, function (err) {
                if (err) {
                    console.error(err);            
                }
            });
        }
    });
};

module.exports = util;