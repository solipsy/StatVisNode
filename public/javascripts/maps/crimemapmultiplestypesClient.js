console.log (field);
console.log (colorscheme);
console.log (embedUrl);
console.log (datar);
var types = {};
var gmin = 10000, gmax = 0;
var projection = d3.geo.mercator().scale(10000).translate([-2300, 9300]);
var path = d3.geo.path().projection(projection);
getTypes();


multiplesParties();

function getTypes () {
    $.each(datar.features[0].properties.splosno, function (i, d) {
        types[i] = {min : 10000000, max : 0};
    });
    console.log (types);
    getDomains();
}

function getDomains() {
    $.each(datar.features, function (i, d) {
        //console.log(d);
        $.each(types, function(j, k) {
        	if (types[j].min > d.properties.splosno[j]) types[j].min = d.properties.splosno[j]; 
        	if (types[j].max < d.properties.splosno[j]) types[j].max = d.properties.splosno[j];
        	
        });

    });
    //console.log (types);
}

function multiplesParties () {
    $.each(types, function (i, d) {
        var divMap = d3.select("#map").append("div").attr("class", "minimap").attr("id", "minimap" + i);
        insertMultiple (divMap, i, d);
    });
    d3.selectAll("svg").attr("class", colorscheme);
}

function insertMultiple(div, id, domain) {
    div.append("div").attr("class", "minititle").append("span").append("b").text(id);
    var msvg = d3.select("#minimap" + id).append("svg").attr("viewBox", "0 0 700 400")//height
        .attr("preserveAspectRatio", "xMinYMin");
    var mcountries = msvg.append("svg:g").attr("id", "minimap" + id);
    mcountries.selectAll("path").data(datar.features).enter().append("svg:path").attr("d", path);
    mcountries.selectAll("path")
        .attr("class", function(d) {
            return decideColor(d, domain, id);
        }).style("stroke", "#000").style("stroke-width", .5);
    div.append("div").attr("class", "minidetails").append("span").text(function (d) {return ("Min: " + domain.min + ", Max: " + domain.max);});
}



function decideColor(geo, domain, field) {
	var quantize = d3.scale.quantize()
	    .domain([domain.min, domain.max])
	    .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));	
    var qq = geo.properties.splosno[field];
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