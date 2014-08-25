console.log (year);
console.log (field);
console.log (datar);
console.log (embedUrl);
var max = 0,min = 100000000;


    //max = d3.max(datar.features, function(d) { return +d.properties.splosno[field];} );
    //min = d3.min(datar.features, function(d) { return +d.properties.splosno[field];} );

min = 0;
max = 10;
getDomains();

console.log (max);

function getDomains() {
    $.each(datar.features, function (i, d) {
        var rates = d.properties[field].data.map(function (n) {
            return n.rate;
        });
        var lmin = Math.min.apply(null, rates);
        var lmax = Math.max.apply(null, rates);
        d.min = lmin;
        d.max = lmax;
        //console.log (d);
        if (lmin < min ) min = lmin;
        if (lmax > max ) max = lmax;
    });
    //console.log (years);
}

var quantize = d3.scale.quantize()
    .domain([min, max])
    .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));

var tooltip = d3.select("#map").append("div").attr("class", "tooltip");
var projection = d3.geo.mercator().scale(10000).translate([-2300, 9300]);
var path = d3.geo.path().projection(projection);
var svg = d3.select("#map").append("svg").attr("viewBox", "0 0 600 400")//height
    .attr("preserveAspectRatio", "xMinYMin");
var countries = svg.append("svg:g").attr("id", "countries").attr("class", "unused");
countries.selectAll("path").data(datar.features).enter().append("svg:path").attr("d", path);
update(datar, year, countries, "normal");


function decideColor(geo) {
	if (geo.properties[field])    return quantize(geo.properties[field].data[0].rate);
	else return 0;
}

function update(json, year, svgType, quantizeType) {
    svgType.selectAll("path").on("click", function(d) {
        console.log (d);
    }).on("mousemove", function(d) {
        var mouse = d3.mouse(svg.node()).map(function(d) {
            return parseInt(d);
        });
        tooltip.classed("hidden", false).attr("style", "left:" + (mouse[0] + 25) + "px;top:" + mouse[1] + "px").html(function () {
			return d.properties.IME;
        });
        d3.select("#charttitle").selectAll("p").remove();
        d3.select("#charttitle").append("p").text("Upravna enota: " + d.properties.IME);
        d3.select("#charttitle").append("p").attr("class", "subtitle").text("Trend gibanja kriminalnih dejanj / 10.000 preb.");
        d3.select(this).style("stroke-width", 1).style("stroke-width", 1);

    }).on("mouseout", function(d, i) {
        tooltip.classed("hidden", true);
        d3.select(this).style("stroke-width", 1).style("stroke-width", 0.5);
    })
        .attr("class", "RdYlGn")
        .attr("class", function(d) {

            return decideColor(d);
        })
        .style("stroke", "#000").style("stroke-width", .5);
        d3.selectAll("svg").attr("class", colorscheme);
}

$("input[type='text']").on("click", function () {
    $(this).select();
});


d3.select("select").on("change", function() {
    d3.selectAll("svg").attr("class", this.value);
    colorscheme = this.value;
    $("#embedurl").val('<iframe scrolling = "no" width="660" height="515" src="http://statvis-21833.onmodulus.net/' + embedUrl +  '/' + colorscheme + '" frameborder="0" allowfullscreen></iframe>');
});

$("#embedurl").val('<iframe scrolling = "no" width="660" height="515" src="http://statvis-21833.onmodulus.net/' + embedUrl +  '/Blues' + '" frameborder="0" allowfullscreen></iframe>');

Array.prototype.max = function() {
    return Math.max.apply(null, this);
};

Array.prototype.min = function() {
    return Math.min.apply(null, this);
};