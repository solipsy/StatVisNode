var express = require('express');
var router = express.Router();
var region = require ("../models/crime").Region;

router.get('/', function(req, res) {
    region.find({}, function(err, docs) {
        if(!err) {
            res.json(200, { regions: docs });
        } else {
            res.json(500, { message: err });
        }
    });
});

router.get('/view', function(req, res) {
    region.find({}, function(err, docs) {
        res.render ("crimes",
            {
                title: "regions",
                crimes: docs
            });
         });
});

module.exports = router;