var express = require('express'),
    bodyParser = require('body-parser'),
    router = express.Router(),
    mongojs = require('mongojs'),
    db = mongojs('contactlist', ['contacts']);

router
    .use(function(req, res, next) {
        if (!req.user) req.user = {
            id: 1
        };
        next();
    })
    .use(bodyParser.json())
    .route('/contact')
    .get(function(req, res) {
        db.contacts.find(function(err, data) {
            res.json(data);
        });
    })
    .post(function(req, res) {
        var contact = req.body;
        contact.userId = req.user.Id;

        db.contacts.insert(contact, function(err, data) {
            res.json(data);
        });
    });

router
    .param('id', function(req, res, next) {
        req.dbQuery = {
            id: parseInt(req.params.id, 10)
        }; // here 10 means 10 base decimal system
    })
    .route('contact/:id')
    .get(function(req, res) {
        db.contacts.findOne(req.dbQuery, function(err, data) {
            res.json(data);
        });
    })
    .put(function(req, res) {
        var contact = req.body;
        delete contact.$promise;
        delete contact.$resolved;
        db.contacts.update(req.dbQuery, contact, function(err, data) {
            res.json(data[0]);
        });
    })
    .delete(function(req, res) {
        db.contacts.remove(req.dbQuery, true, function() {
            res.json(null);
        });
    });

module.exports = router;