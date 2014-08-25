console.log (year);
console.log (field);
console.log (category);
console.log (datar);
console.log (embedUrl);
console.log (geodata);

if (typeof(d3) == 'undefined') { console.log("d3 not loaded") }
else console.log ("d3 loaded");

var margin = {top: 20, right: 20, bottom: 30, left: 50};
var svg = d3.select("#chart").append("svg")
    .attr ("height", "320px")
    .attr("width", "550px")    ;
var chart = svg.append("svg:g").attr("id", "chartsvg").attr("class", "chart")
	;
var chartDiv = d3.select ("#chart")
	//.style ("border", "solid 1px black")
	;
var width = parseInt(chartDiv.style('width'), 10) - margin.left - margin.right;
var height = parseInt(chartDiv.style('height'), 10) - margin.top - margin.bottom;

console.log (width + " " + height);

var parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S.%LZ").parse; //"2008-12-01T11:45:41.084Z"
var linksDiv = d3.select("#links");

geodata.features.forEach(function(d) {
	linksDiv.append("a")
		.attr("href", "http://localhost:4730/prebivalstvo/grafikon/" + category + "/" + d.properties.IME)
		.attr("class", "navlink")
		.text(d.properties.IME);
});

datar[category].data.forEach(function (d) {
	d.date = parseDate(d.date);
	d.rate = +d.rate;
});


var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

x.domain(d3.extent(datar[category].data, function(d) { return d.date; }));
y.domain(d3.extent(datar[category].data, function(d) { return d.rate; }));

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.rate); })
        .interpolate("basis");	
        
var tooltip = d3.select("#map").append("div").attr("class", "tooltip");

svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(35," + (height + 20) + ")")
  .call(xAxis);
  
svg.append("g")
  .attr("class", "y axis")
  .attr("transform", "translate(35,20)")
  .call(yAxis)
.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .text("% tujcev v občini");

chart.append("path")
	.attr("class", "line")
	.attr("stroke", "steelblue")
	.attr("transform", "translate(35,20)")
	.attr("d", line(datar[category].data));





$("input[type='text']").on("click", function () {
    $(this).select();
});


d3.select("select").on("change", function() {
    d3.selectAll("path").attr("stroke", this.value);
    colorscheme = this.value;
    $("#embedurl").val('<iframe scrolling = "no" width="660" height="515" src="http://statvis-21833.onmodulus.net/' + embedUrl +  '/' + colorscheme + '" frameborder="0" allowfullscreen></iframe>');
});

$("#embedurl").val('<iframe scrolling = "no" width="660" height="515" src="http://statvis-21833.onmodulus.net/' + embedUrl +  '/Blues' + '" frameborder="0" allowfullscreen></iframe>');