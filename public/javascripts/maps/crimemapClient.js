console.log (year);
console.log (field);
console.log (datar);
var max,min;

if (year > 2007) {
    max = d3.max(datar.features, function(d) { return +d.properties[field][year-2008].rate;} );
    min = d3.min(datar.features, function(d) { return +d.properties[field][year-2008].rate;} );
}
else {
    max = d3.max(datar.features, function(d) { return +d.properties[field];} );
    min = d3.min(datar.features, function(d) { return +d.properties[field];} );
}

console.log (max);

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
    if (year > 2007) return quantize(geo.properties[field][year-2008].rate);
    else return quantize(geo.properties[field]);
}

function update(json, year, svgType, quantizeType) {
    svgType.selectAll("path").on("click", function(d) {

    }).on("mousemove", function(d) {
        var mouse = d3.mouse(svg.node()).map(function(d) {
            return parseInt(d);
        });
        tooltip.classed("hidden", false).attr("style", "left:" + (mouse[0] + 25) + "px;top:" + mouse[1] + "px").html(function () {
        	if (year > 2007) return d.properties.UE_IME + " " + d.properties[field][year-2008].rate;
            else return d.properties.UE_IME + " " + d.properties[field];
        });
        d3.select("#charttitle").selectAll("p").remove();
        d3.select("#charttitle").append("p").text("Upravna enota: " + d.properties.UE_IME);
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
        d3.selectAll("svg").attr("class", "BuPu");  
}

$("input[type='text']").on("click", function () {
    $(this).select();
});

d3.select("select").on("change", function() {
    d3.selectAll("svg").attr("class", this.value);
});