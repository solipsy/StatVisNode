console.log (field);
console.log (colorscheme);
console.log (embedUrl);
console.log (datar);
var years = [];
var gmin = 10000, gmax = 0;
var projection = d3.geo.mercator().scale(10000).translate([-2300, 9300]);
var path = d3.geo.path().projection(projection);
getYears();


var quantize = d3.scale.quantize()
    .domain([gmin, gmax])
    .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));



multiplesParties();

function getYears () {
    $.each(datar.features[0].properties.letno[field], function (i, d) {
        years.push(d);
    });
    getDomains();
}

function getDomains() {
    $.each(datar.features, function (i, d) {
        console.log(i);
        var rates = d.properties.letno[field].map(function (n) {
            return n.rate;
        });
        var lmin = Math.min.apply(null, rates);
        var lmax = Math.max.apply(null, rates);
        d.min = lmin;
        d.max = lmax;
        console.log (d);
        if (lmin < gmin ) gmin = lmin;
        if (lmax > gmax ) gmax = lmax;
    });
    console.log (years);
}

function multiplesParties () {
    $.each(years, function (i, d) {

        var divMap = d3.select("#map").append("div").attr("class", "minimap").attr("id", "minimap" + i);
        insertMultiple (divMap, i, d);
    })
    d3.selectAll("svg").attr("class", colorscheme);
}

function insertMultiple(div, id, year) {
    div.append("div").attr("class", "minititle").append("span").text(year.year);
    var msvg = d3.select("#minimap" + id).append("svg").attr("viewBox", "0 0 700 400")//height
        .attr("preserveAspectRatio", "xMinYMin");
    var mcountries = msvg.append("svg:g").attr("id", "minimap" + id);
    mcountries.selectAll("path").data(datar.features).enter().append("svg:path").attr("d", path);
    mcountries.selectAll("path")
        .attr("class", function(d) {
            return decideColor(d, year.year);
        }).style("stroke", "#000").style("stroke-width", .5);
    div.append("div").attr("class", "minidetails").append("span").text(function (d) {return 1});
}


var max,min;
/*
if (year > 2007) {
    max = d3.max(datar.features, function(d) { return +d.properties[field][year-2008].rate;} );
    min = d3.min(datar.features, function(d) { return +d.properties[field][year-2008].rate;} );
}
else {
    max = d3.max(datar.features, function(d) { return +d.properties.data[field].relative;} );
    min = d3.min(datar.features, function(d) { return +d.properties.data[field].relative;} );
}
*/

function decideColor(geo, year) {
    var qq = (geo.properties.letno[field][year - 2008].rate);
    return  quantize(+qq);
}



$("input[type='text']").on("click", function () {
    $(this).select();
});

d3.select("select").on("change", function() {
    d3.selectAll("svg").attr("class", this.value);
    colorscheme = this.value;
    $("#embedurl").val('<iframe width="660" height="515" src="//localhost:3000/' + embedUrl +  '/' + colorscheme + '" frameborder="0" allowfullscreen></iframe>');
});

$("#embedurl").val('<iframe width="660" height="515" src="//localhost:3000/' + embedUrl +  '/Blues' + '" frameborder="0" allowfullscreen></iframe>');

Array.prototype.max = function() {
    return Math.max.apply(null, this);
};

Array.prototype.min = function() {
    return Math.min.apply(null, this);
};