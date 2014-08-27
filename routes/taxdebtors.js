var express = require('express');
var router = express.Router();
var debtors = require ("../models/debtors").Debtors;
var geo = require ("../models/geo").Geo;
var _ = require("underscore");

router.get('/', function(req, res) {
    debtors.find({}, function(err, docs) {
        if(!err) {
            res.json(200, { data: docs });
        } else {
            res.json(500, { message: err });
        }
    });
});

function getArray(docs) {
    var map = {};
    var result = [];
    docs = JSON.parse(JSON.stringify(docs))
    docs.forEach(function(d) {
        var mesto  = d.mesto.replace("'", "")
        if (!map[mesto]) map[mesto] = 1;
        else map[mesto] ++;
    });

    for (var key in map) {
        if (map.hasOwnProperty(key)) {
            result.push({town: key, number: map[key]});
        }
    }
    result.sort(function (a, b) {
        if (a.number < b.number) return 1;
        if (a.number > b.number) return-1;
        return 0;
    });
    return [result, map];
}

router.get('/tabela', function(req, res) {
    debtors.find({}, function(err, docs) {
        if(!err) {
           var result = getArray(docs)[0];
            res.render ("tables/debtors",
                {
                    title: "Davčni dolžniki",
                    debtors: result
                });
        }
         else {
            res.json(500, { message: err });
        }
    });
});

router.get('/zemljevid', function(req, res) {
	var field = req.params.field;

    geo.findOne({subtype : "stat_obcine"}, function(err, geodocs) {
        if(!err) {
            debtors.find({}, function(err, datadocs) {
                if(!err) {
                    var obcGeo = geodocs.data;
                    obcGeo = JSON.parse(obcGeo);
                    var result = getArray(datadocs)[1];

                    for (var g = 0; g < obcGeo.features.length; g++) {
                        //console.log (obcGeo.features[g].properties);
                        var imeGeo = obcGeo.features[g].properties.IME;
                        //console.log (obcGeo.features[g].properties);
                        if (result[imeGeo]) {
                            console.log (imeGeo);
                            obcGeo.features[g].properties.debtors = result[imeGeo];
                        }
                        else obcGeo.features[g].properties.debtors = 0;
                    }
                    

                    res.render ("maps/debtormap",
                        {
                            title: "Dolžniki DURS",
                            data: obcGeo,
                            embed : '<iframe width="660" height="515" src="//localhost:3000/crime/viz" frameborder="0" allowfullscreen></iframe>',
                            datafield: "a",
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




module.exports = router;