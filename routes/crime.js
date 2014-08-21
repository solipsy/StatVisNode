var express = require('express');
var router = express.Router();
var region = require ("../models/crime").Region;
var geo = require ("../models/crime").Geo;
var fs = require("fs");

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

router.get('/viz', function(req, res) {

    geo.findOne({type : "geo"}, function(err, geodocs) {
        if(!err) {
            region.find({}, function(err, datadocs) {
                if(!err) {
                    var obcGeo = geodocs.data;
                    obcGeo = JSON.parse(obcGeo);

                    for (var g = 0; g < obcGeo.features.length; g++) {
                        //console.log (obcGeo.features[g].properties.UE_IME);
                        var imeGeo = obcGeo.features[g].properties.UE_IME;
                        for (var d = 0; d < datadocs.length; d++) {
                            var imeData = datadocs[d].region;
                            if (imeGeo == imeData) {
                                obcGeo.features[g].properties.population = datadocs[d].population;
                                obcGeo.features[g].properties.regionAvg = datadocs[d].regionAvg;
                            }
                        }
                    }

                    res.render ("map",
                        {
                            title: "Map",
                            data: obcGeo
                        });

                    //res.json(200, { geo : obcGeo.features });
                } else {
                    res.json(500, { message: err });
                }
            });


        } else {
            res.json(500, { message: err });
        }
    });

});

module.exports = router;