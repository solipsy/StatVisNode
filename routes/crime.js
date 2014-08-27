var express = require('express');
var router = express.Router();
var region = require ("../models/crime").Region;
var geo = require ("../models/geo").Geo;
var detgeo = require ("../models/geo").DetGeo;
var fs = require("fs");
var APPVAR = require("../appConst.js");

router.get('/api/:selector?/:field?', function(req, res) {
    var tail = "";
    if (req.params.field) tail = "." + req.params.field + " -_id region";
    else tail = " -_id region";
    var args = req.params.selector + tail;

    region.find({}, args, function(err, docs) {
        if(!err) {
            res.json(200, { regions: docs });
        } else {
            res.json(500, { message: err });
        }
    });
});

router.get('/tabela', function(req, res) {
    region.find({}, function(err, docs) {
        res.render ("tables/crimes",
            {
                title: "regions",
                crimes: JSON.parse(JSON.stringify(docs))
            });
         });
});

router.get('/zemljevid/okraj/:name', function(req, res) {
    var name = req.params.name;
    detgeo.findOne({nameUpper : name},   function(err, doc) {
        if(!err) {
            var dd = JSON.stringify(doc);
            dd= JSON.parse(dd);
            dd.feature.properties.test = 1;
            console.log (dd);

            res.render ("maps/crimemapsingle",
                {
                    title: "Map",
                    data: {
                        type: "FeatureCollection",
                        features : [
                            dd.feature
                        ]

                    },
                    embed : '<iframe width="660" height="515" src="http://statvis-21833.onmodulus.net/kriminal/zemljevid" frameborder="0" allowfullscreen></iframe>',
                    datafield: "test",
                    year : 1,
                    colorscheme : "Blues" 
                });


        } else {
            res.json(500, { message: err });
        }
    });
});

router.get('/zemljevid/splosno/:id', function(req, res) {
    var field = req.params.id;

    geo.findOne({subtype : "stat_upravne"}, function(err, geodocs) {
        if(!err) {
            region.find({}, function(err, datadocs) {
                if(!err) {
                    var obcGeo = geodocs.data;
                    obcGeo = JSON.parse(obcGeo);

                    for (var g = 0; g < obcGeo.features.length; g++) {
                        //console.log (obcGeo.features[g].properties.UE_IME);
                        var imeGeo = obcGeo.features[g].properties.UE_IME;
                        for (var d = 0; d < datadocs.length; d++) {
                            var dd = JSON.parse(JSON.stringify(datadocs[d]));
                            var imeData = dd.region;
                            if (imeGeo == imeData) {
                                obcGeo.features[g].properties.splosno = {};
                                obcGeo.features[g].properties.splosno[field] = dd.splosno[field];
                            }
                        }
                    }

                    res.render ("maps/crimemap",
                        {
                            title: "Kriminal v Sloveniji, " + field,
                            data: obcGeo,
                            embed : '<iframe width="660" height="515" src="//localhost:3000/crime/viz" frameborder="0" allowfullscreen></iframe>',
                            datafield: field,
                            year : 1999,
                            embedUrl : 'kriminal/zemljevid/splosno/' + field,
                            colorscheme : "Purples",
                            navigation : APPVAR.navigation.crime,
                            type : "letno"
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

router.get('/zemljevid/splosno/:id/:color', function(req, res) {
    var field = req.params.id;
    var colorscheme = req.params.color;

    geo.findOne({subtype : "stat_upravne"}, function(err, geodocs) {
        if(!err) {
            region.find({}, function(err, datadocs) {
                if(!err) {
                    var obcGeo = geodocs.data;
                    obcGeo = JSON.parse(obcGeo);

                    for (var g = 0; g < obcGeo.features.length; g++) {
                        //console.log (obcGeo.features[g].properties.UE_IME);
                        var imeGeo = obcGeo.features[g].properties.UE_IME;
                        for (var d = 0; d < datadocs.length; d++) {
                            var dd = JSON.parse(JSON.stringify(datadocs[d]));
                            var imeData = dd.region;
                            if (imeGeo == imeData) {
                                obcGeo.features[g].properties.splosno = {};
                                obcGeo.features[g].properties.splosno[field] = dd.splosno[field];
                            }
                        }
                    }

                    res.render ("maps/mapcrimeembed",
                        {
                            title: "Kriminal v Sloveniji, " + field,
                            data: obcGeo,
                            embed : '<iframe width="660" height="515" src="//localhost:3000/crime/viz" frameborder="0" allowfullscreen></iframe>',
                            datafield: field,
                            year : 1999,
                            embedUrl : 'kriminal/zemljevid/splosno/' + field,
                            colorscheme : colorscheme
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

router.get('/zemljevid/letno/:id/:year', function(req, res) {
    var field = req.params.id;
    var year = req.params.year;

    geo.findOne({subtype : "stat_upravne"}, function(err, geodocs) {
        if(!err) {
            region.find({}, function(err, datadocs) {
                if(!err) {
                    var obcGeo = geodocs.data;
                    obcGeo = JSON.parse(obcGeo);

                    for (var g = 0; g < obcGeo.features.length; g++) {
                        //console.log (obcGeo.features[g].properties.UE_IME);
                        var imeGeo = obcGeo.features[g].properties.UE_IME;
                        for (var d = 0; d < datadocs.length; d++) {
                            var dd = JSON.parse(JSON.stringify(datadocs[d]));
                            var imeData = dd.region;
                            if (imeGeo == imeData) {
                                obcGeo.features[g].properties.letno = {};
                                obcGeo.features[g].properties.letno[field] = dd.letno[field];
                            }
                        }
                    }

                    res.render ("maps/crimemap",
                        {
                            title: "Kriminal v Sloveniji, " + field + " v letu " + year,
                            data: obcGeo,
                            embed : '<iframe width="660" height="515" src="//localhost:3000/crime/viz" frameborder="0" allowfullscreen></iframe>',
                            datafield: field,
                            year : year,
                            embedUrl : 'kriminal/zemljevid/letno/' + field + "/" + year,
                            colorscheme : "Purples",
                            navigation : APPVAR.navigation.crime,
                            type : "letno"

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

router.get('/zemljevid/letno/:id/:year/:color', function(req, res) {
    var field = req.params.id;
    var year = req.params.year;
    var color = req.params.color;

    geo.findOne({subtype : "stat_upravne"}, function(err, geodocs) {
        if(!err) {
            region.find({}, function(err, datadocs) {
                if(!err) {
                    var obcGeo = geodocs.data;
                    obcGeo = JSON.parse(obcGeo);

                    for (var g = 0; g < obcGeo.features.length; g++) {
                        //console.log (obcGeo.features[g].properties.UE_IME);
                        var imeGeo = obcGeo.features[g].properties.UE_IME;
                        for (var d = 0; d < datadocs.length; d++) {
                            var dd = JSON.parse(JSON.stringify(datadocs[d]));
                            var imeData = dd.region;
                            if (imeGeo == imeData) {
                                obcGeo.features[g].properties.letno = {};
                                obcGeo.features[g].properties.letno[field] = dd.letno[field];
                            }
                        }
                    }

                    res.render ("maps/mapcrimeembed",
                        {
                            title: "Kriminal v Sloveniji, " + field + " v letu " + year,
                            data: obcGeo,
                            embed : '<iframe width="660" height="515" src="//localhost:3000/crime/viz" frameborder="0" allowfullscreen></iframe>',
                            datafield: field,
                            year : year,
                            embedUrl : 'kriminal/zemljevid/letno/' + field + "/" + year,
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

//multiples
router.get('/slicice/letno/:id', function(req, res) {
    var field = req.params.id;
    geo.findOne({subtype : "stat_upravne"}, function(err, geodocs) {
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
                            var dd = JSON.parse(JSON.stringify(datadocs[d]));
                            if (imeGeo == imeData) {
                                obcGeo.features[g].properties.letno = {};
                                obcGeo.features[g].properties.letno[field] = dd.letno[field];
                            }
                        }
                    }

                    res.render ("maps/crimemapmultiples",
                        {
                            title: "Kriminal v Sloveniji, " + field,
                            data: obcGeo,
                            embed : '<iframe width="660" height="515" src="//localhost:3000/crime/viz" frameborder="0" allowfullscreen></iframe>',
                            datafield: field,
                            embedUrl : 'slicice/letno/' + field ,
                            colorscheme : "Purples"
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

router.get('/slicice/vrste/:color?', function(req, res) {
	var color = req.params.color;
	if (!color) color = "Reds"
    console.log (APPVAR.environment.url);
    
    geo.findOne({subtype : "stat_upravne"}, function(err, geodocs) {
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
                            var dd = JSON.parse(JSON.stringify(datadocs[d]));
                            if (imeGeo == imeData) {
                                obcGeo.features[g].properties.splosno = {};
                                obcGeo.features[g].properties.splosno = dd.splosno;
                            }
                        }
                    }

                    res.render ("maps/crimemapmultiplestypes",
                        {
                            title: "Kriminal v Sloveniji po vrstah",
                            data: obcGeo,
                            embed : '<iframe width="660" height="515" src="//localhost:3000/crime/viz" frameborder="0" allowfullscreen></iframe>',
                            datafield: "vrste",
                            embedUrl : 'slicice/vrste' + color,
                            colorscheme : "Purples"
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