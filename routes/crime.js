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

router.get('/viz/:id', function(req, res) {
    var field = req.params.id;

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
                                obcGeo.features[g].properties[field] = datadocs[d][field];
                            }
                        }
                    }

                    res.render ("map",
                        {
                            title: "Map",
                            data: obcGeo,
                            embed : '<iframe width="660" height="515" src="//localhost:3000/crime/viz" frameborder="0" allowfullscreen></iframe>',
                            datafield: field
                        });
                } else {
                    res.json(500, { message: err });
                }
            });
        } else {
            res.json(500, { message: err });
        }
    });
});

router.get('/viz/:id/:year', function(req, res) {
    var field = req.params.id;
    var year = req.params.year;

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
                                obcGeo.features[g].properties[field] = datadocs[d][field];
                            }
                        }
                    }

                    res.render ("map",
                        {
                            title: "Map",
                            data: obcGeo,
                            embed : '<iframe width="660" height="515" src="//localhost:3000/crime/viz" frameborder="0" allowfullscreen></iframe>',
                            datafield: field,
                            year : year
                        });
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