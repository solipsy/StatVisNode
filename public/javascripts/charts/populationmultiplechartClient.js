var parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S.%LZ").parse; //"2008-12-01T11:45:41.084Z"
var series = [];
var max = 0, min = 100000000000, tmax = new Date(1900, 0, 0), tmin = new Date(2100, 0, 0);;


if (category.length == 1) category = category[0];
else prepareData();

function prepareData() {
    $.each(category, function (i, d) {
        var member = {};
        member.data = datar[d].data;
        member.category = d;
        series.push(member);
        var lmax = d3.max(datar[d].data, function(d) { return +d.rate;} );
        var lmin = d3.min(datar[d].data, function(d) { return +d.rate;} );
        var ltmax = d3.max(datar[d].data, function(d) { return parseDate(d.date);} );
        var ltmin = d3.min(datar[d].data, function(d) { return parseDate(d.date);} );
        if (lmax > max) max = lmax;
        if (lmin < min) min = lmin;
        if (ltmax > tmax) tmax = ltmax;
        if (ltmin < tmin) tmin = ltmin;
        console.log ("Y> " + lmax + " " + lmin + " t: " + tmax + " " + tmin);
    });
}



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



var linksDiv = d3.select("#links");

geodata.features.forEach(function(d) {
	linksDiv.append("a")
		.attr("href", "http://statvis-21833.onmodulus.net/prebivalstvo/grafikon/" + category + "/" + d.properties.IME)
		.attr("class", "navlink")
		.text(d.properties.IME);
});


series.forEach(function (s) {
    console.log (s);
    s.data.forEach(function (d) {
        d.date = parseDate(d.date);
        d.rate = +d.rate;
    })
});

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

//x.domain(d3.extent(datar[category[0]].data, function(d) { return d.date; }));
x.domain([tmin, tmax]);
y.domain([min, max]);

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
var color = d3.scale.category10();
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

lines = svg.selectAll(".series")
    .data(series)
    .enter().append("g");

lines.append("path")
    .attr("d", function (d) {return line(d.data);})
    .attr ("class", "line")
    .attr("stroke", function (d) { return color(d.category);})
    .style("stroke-width", "2px")
    .style("fill", "none")
    .attr("transform", "translate(35,20)")
    .on ("mouseover", function (d) {
        var mouse = d3.mouse(svg.node()).map(function(d) {
            return parseInt(d);
        });
        //tooltip.classed("hidden", false).attr("style", "left:" + (mouse[0] + 70) + "px;top:" + (mouse[1] - 20) + "px").html(getTooltip(d));
        d3.select(this).style("stroke-width", "3px");
        //d3.select(this).style("stroke", function (d) { return color(d.name);});
        //console.log(d.label);
    })
    .on ("mouseout", function (d) {
        d3.select(this).style("stroke-width", "2px");
        d3.select(this).style("stroke", function (d) { return color(d.category);});
        //tooltip.classed("hidden", true);
    });

lines.append("text")
    .datum(function (d) { return {name : d.category, value : d.data[d.data.length - 1]};})
    .attr("transform", function (d) {return "translate(" + x(d.value.date) + "," + y(d.value.rate) + ")";})
    .attr ("x", 4)
    .attr("dy", ".35em")
    .text(function (d) {return d.name})
    .attr("fill", function (d) { return color(d.name);})
    ;


$("input[type='text']").on("click", function () {
    $(this).select();
});


d3.select("select").on("change", function() {
    d3.selectAll("path").attr("stroke", this.value);
    colorscheme = this.value;
    $("#embedurl").val('<iframe scrolling = "no" width="660" height="515" src="http://statvis-21833.onmodulus.net/' + embedUrl +  '/' + colorscheme + '" frameborder="0" allowfullscreen></iframe>');
});

$("#embedurl").val('<iframe scrolling = "no" width="660" height="515" src="http://statvis-21833.onmodulus.net/' + embedUrl +  '/Blues' + '" frameborder="0" allowfullscreen></iframe>');