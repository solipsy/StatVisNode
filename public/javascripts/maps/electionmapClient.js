console.log (year);
console.log (field);
console.log (colorscheme);
console.log (embedUrl);
console.log (datar);
var max,min;
var date = new Date();
var time = date.getTime();
var idFrame = "a" + time;
var scripti = '<script>function setIframeSrc() {var s = "http://statvis-21833.onmodulus.net/"' + embedUrl + '/' + colorscheme + ';var iframe1=document.getElementById(idFrame);if ( -1 == navigator.userAgent.indexOf("MSIE") ) {iframe1.src = s;} else {iframe1.location = s;}} setTimeout(setIframeSrc, 5);</script>';

if (year > 2007) {
    max = d3.max(datar.features, function(d) { return +d.properties[field][year-2008].rate;} );
    min = d3.min(datar.features, function(d) { return +d.properties[field][year-2008].rate;} );
}
else {
    max = d3.max(datar.features, function(d) { return +d.properties.data[field].relative;} );
    min = d3.min(datar.features, function(d) { return +d.properties.data[field].relative;} );
}

console.log (min + " / " + max);
  var pad = d3.format("05d"),
      quantizeCB = d3.scale.quantile().domain([min, max]).range(d3.range(9));
      
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
    return  quantize(geo.properties.data[field].relative);
}

function update(json, year, svgType, quantizeType) {
    svgType.selectAll("path").on("click", function(d) {

    }).on("mousemove", function(d) {
        var mouse = d3.mouse(svg.node()).map(function(d) {
            return parseInt(d);
        });
        tooltip.classed("hidden", false).attr("style", "left:" + (mouse[0] + 25) + "px;top:" + mouse[1] + "px").html(function () {
            return d.properties.unitName + " " + d.properties.data[field].relative;
        });
        d3.select("#charttitle").selectAll("p").remove();
        d3.select("#charttitle").append("p").text("Upravna enota: " + d.properties.UE_IME);
        d3.select("#charttitle").append("p").attr("class", "subtitle").text("Trend gibanja kriminalnih dejanj / 10.000 preb.");
        d3.select(this).style("stroke-width", 1).style("stroke-width", 1);

    }).on("mouseout", function(d, i) {
        tooltip.classed("hidden", true);
        d3.select(this).style("stroke-width", 1).style("stroke-width", 0.5);
    })
        .attr("class", function(d) {
			
            return decideColor(d);
        })
        .style("stroke", "#000").style("stroke-width", .5);
        
    d3.selectAll("svg").attr("class", colorscheme);    
}

addLinks();

function addLinks () {
    var linksDiv = d3.select("#links");
    $.each(datar.features[0].properties.data, function (i, d) {
        linksDiv.append("a")
            .attr("href", "http://localhost:4730/volitve/zemljevid/okraji/EU/" + i)
            .attr("class", "navlink")
            .text(i);
    });
}

$("input[type='text']").on("click", function () {
    $(this).select();
});

d3.select("select").on("change", function() {
    d3.selectAll("svg").attr("class", this.value);
    colorscheme = this.value;
    $("#embedurl").val('<iframe id = "' + idFrame + '" scrolling = "no" width="660" height="515" src="http://statvis-21833.onmodulus.net/' + embedUrl +  '/' + colorscheme + '" frameborder="0" allowfullscreen></iframe>' + scripti);
});

$("#embedurl").val('<iframe id = "' + idFrame + '" scrolling = "no" width="660" height="515" src="http://statvis-21833.onmodulus.net/' + embedUrl +  '/Blues' + '" frameborder="0" allowfullscreen></iframe>' + scripti);