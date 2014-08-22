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

router.get('/tabela/enote/eu', function(req, res) {
    elections.find({}, function(err, docs) {
        res.render ("tables/elections",
            {
                title: "elections",
                elections: docs
            });
         });
});

router.get('/zemljevid/okraji/eu/:id/:color', function(req, res) {
    var field = req.params.id;
	var color = req.params.color;

    geo.findOne({subtype : "volitve_okraji"}, function(err, geodocs) {
        if(!err) {
            elections.find({}, function(err, datadocs) {
                if(!err) {
                    var obcGeo = geodocs.data;
                    obcGeo = JSON.parse(obcGeo);
                    for (var g = 0; g < obcGeo.features.length; g++) {
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
					
                    res.render ("maps/mapelectionsembed",
                        {
                            title: "EU Volitve 2009, rezultati za " + field,
                            data: obcGeo,
                            embed : '<iframe width="660" height="515" src="//localhost:3000/crime/viz/Reds" frameborder="0" allowfullscreen></iframe>',
                            embedUrl : 'volitve/zemljevid/okraji/eu/' + field,
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

router.get('/zemljevid/okraji/eu/:id', function(req, res) {
    var field = req.params.id;
    var color = req.params.color;

    geo.findOne({subtype : "volitve_okraji"}, function(err, geodocs) {
        if(!err) {
            elections.find({}, function(err, datadocs) {
                if(!err) {
                    var obcGeo = geodocs.data;
                    obcGeo = JSON.parse(obcGeo);
                    for (var g = 0; g < obcGeo.features.length; g++) {
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

                    if (field == "slicice") {
                        res.render ("maps/electionmapmultiples",
                            {
                                title: "EU Volitve 2009, rezultati za " + field,
                                data: obcGeo,
                                embed : '<iframe width="660" height="515" src="//localhost:3000/crime/viz/Reds" frameborder="0" allowfullscreen></iframe>',
                                datafield: field,
                                embedUrl : 'volitve/zemljevid/okraji/eu/' + field,
                                year : 1999,
                                colorscheme : "Blues"
                            });
                    }
                    else {
                        res.render ("maps/electionmap",
                            {
                                title: "EU Volitve 2009, rezultati za " + field,
                                data: obcGeo,
                                embed : '<iframe width="660" height="515" src="//localhost:3000/crime/viz/Reds" frameborder="0" allowfullscreen></iframe>',
                                datafield: field,
                                embedUrl : 'volitve/zemljevid/okraji/eu/' + field,
                                year : 1999,
                                colorscheme : "Blues"
                            });
                    }


                } else {
                    res.json(500, { message: err });
                }
            });
        } else {
            res.json(500, { message: err });
        }
    });
});

router.get('/zemljevid/okraji/eu/:id/:color', function(req, res) {
    var field = req.params.id;
    var color = req.params.color;

    geo.findOne({subtype : "volitve_okraji"}, function(err, geodocs) {
        if(!err) {
            elections.find({}, function(err, datadocs) {
                if(!err) {
                    var obcGeo = geodocs.data;
                    obcGeo = JSON.parse(obcGeo);
                    for (var g = 0; g < obcGeo.features.length; g++) {
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

                    if (field == "slicice") {
                        res.render ("maps/mapelectionsembed",
                            {
                                title: "EU Volitve 2009, rezultati za " + field,
                                data: obcGeo,
                                embed : '<iframe width="660" height="515" src="//localhost:3000/crime/viz/Reds" frameborder="0" allowfullscreen></iframe>',
                                datafield: field,
                                embedUrl : 'volitve/zemljevid/okraji/eu/' + field,
                                year : 1999,
                                colorscheme : "Blues"
                            });
                    }
                    else {
                        res.render ("maps/mapelectionsembed",
                            {
                                title: "EU Volitve 2009, rezultati za " + field,
                                data: obcGeo,
                                embed : '<iframe width="660" height="515" src="//localhost:3000/crime/viz/Reds" frameborder="0" allowfullscreen></iframe>',
                                datafield: field,
                                embedUrl : 'volitve/zemljevid/okraji/eu/' + field,
                                year : 1999,
                                colorscheme : "Blues"
                            });
                    }


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