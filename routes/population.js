var express = require('express');
var router = express.Router();
var population = require ("../models/populationModel").Population;
var geo = require ("../models/geo").Geo;

router.get('/', function(req, res) {
    population.find({}, function(err, docs) {
        if(!err) {
            res.json(200, { data: docs });
        } else {
            res.json(500, { message: err });
        }
    });
});

router.get('/zemljevid/:field', function(req, res) {
	var field = req.params.field;

    geo.findOne({subtype : "stat_obcine"}, function(err, geodocs) {
        if(!err) {
        	
            population.find({}, function(err, datadocs) {
                if(!err) {
                    var obcGeo = geodocs.data;
                    obcGeo = JSON.parse(obcGeo);

                    for (var g = 0; g < obcGeo.features.length; g++) {
                        //console.log (obcGeo.features[g].properties.UE_IME);
                        var imeGeo = obcGeo.features[g].properties.IME;
                        //console.log (imeGeo);
                        for (var d = 0; d < datadocs.length; d++) {
                            var dd = JSON.parse(JSON.stringify(datadocs[d]));
                            var imeData = dd.name;
                            if (imeGeo == imeData) {
                                //console.log (imeData);
                                //obcGeo.features[g].properties = {};
                                obcGeo.features[g].properties[field] = dd[field];
                             
                            }
                        }
                    }
                    

                    res.render ("maps/populationmap",
                        {
                            title: "Prebivalstvo v Sloveniji, " + field,
                            data: obcGeo,
                            embed : '<iframe width="660" height="515" src="//localhost:3000/crime/viz" frameborder="0" allowfullscreen></iframe>',
                            datafield: field,
                            year : 1999,
                            embedUrl : 'prebivalstvo/zemljevid/' + field,
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



router.get('/grafikon/:category/:obcina', function(req, res) {
	var obcina = req.params.obcina;
    var category = req.params.category;
	
    geo.findOne({subtype : "stat_obcine"}, function(err, geodocs) {
        if(!err) {
        	
            var obcGeo = geodocs.data;
            obcGeo = JSON.parse(obcGeo);
            
        	
            population.find({}, function(err, datadocs) {
                if(!err) {
				var found = datadocs.filter(function ( obj ) {
					var sObj = JSON.parse(JSON.stringify(obj));
				    return sObj.name === obcina;
				})[0];
                  

                res.render ("charts/populationchart",
                    {
                        title: "Prebivalstvo v Sloveniji, " + category + " v " + obcina,
                        data: found,
                        embed : '<iframe width="660" height="515" src="//localhost:3000/crime/viz" frameborder="0" allowfullscreen></iframe>',
                        datafield: obcina,
                        category: category,
                        year : 1999,
                        embedUrl : 'prebivalstvo/zemljevid/' + obcina,
                        colorscheme : "Purples",
                        geoData : obcGeo
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