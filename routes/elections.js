var express = require('express');
var router = express.Router();
var elections = require ("../models/elections").Election;
var geo = require ("../models/crime").Geo;
var fs = require("fs");

router.get('/', function(req, res) {
    elections.find({}, function(err, docs) {
        if(!err) {
            res.json(200, { elections: docs });
        } else {
            res.json(500, { message: err });
        }
    });
});

router.get('/view', function(req, res) {
    elections.find({}, function(err, docs) {
        res.render ("elections",
            {
                title: "elections",
                elections: docs
            });
         });
});

router.get('/viz/:id/:color', function(req, res) {
    var field = req.params.id;
	var color = req.params.color;

    geo.findOne({subtype : "volitve_okraji"}, function(err, geodocs) {
        if(!err) {
            elections.find({}, function(err, datadocs) {
                if(!err) {
                    var obcGeo = geodocs.data;
                    obcGeo = JSON.parse(obcGeo);
					console.log ("*************");
                    for (var g = 0; g < obcGeo.features.length; g++) {
                        //console.log (obcGeo.features[g].properties.enota);
                        
                        
                        var imeGeo = obcGeo.features[g].properties.enota;
                        for (var d = 0; d < datadocs.length; d++) {
                            var imeData = datadocs[d].shortName;
                            if (imeGeo == imeData) {
                                obcGeo.features[g].properties.unitName = datadocs[d].unitName;
                                obcGeo.features[g].properties.year = datadocs[d].year;
                                obcGeo.features[g].properties.turnover = datadocs[d].turnover;
                                obcGeo.features[g].properties.data = datadocs[d].data;
                            }
                        }
                        
                    }
					
                    res.render ("electionmap",
                        {
                            title: "Map",
                            data: obcGeo,
                            embed : '<iframe width="660" height="515" src="//localhost:3000/crime/viz" frameborder="0" allowfullscreen></iframe>',
                            datafield: field,
                            year : 1999,
                            colorscheme : color
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

    geo.findOne({subtype : "stat_obcine"}, function(err, geodocs) {
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