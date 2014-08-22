console.log (year);
console.log (field);
console.log (colorscheme);
console.log (embedUrl);
console.log (datar);
var parties = [];
var projection = d3.geo.mercator().scale(10000).translate([-2300, 9300]);
var path = d3.geo.path().projection(projection);
var quantize = d3.scale.quantize()
    .domain([0, 50])
    .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));

getParties();
multiplesParties();

function getParties () {
    $.each(datar.features[0].properties.data, function (i, d) {
       parties.push(i);
    });
}

function multiplesParties () {
    $.each(parties, function (i, d) {
        var divMap = d3.select("#map").append("div").attr("class", "minimap").attr("id", "minimap" + i);
        insertMultiple (divMap,  i, d);
    })
    d3.selectAll("svg").attr("class", colorscheme);
}

function insertMultiple(div, id, party) {
    div.append("div").attr("class", "minititle").append("span").text(party);
    var msvg = d3.select("#minimap" + id).append("svg").attr("viewBox", "0 0 700 400")//height
        .attr("preserveAspectRatio", "xMinYMin");
    var mcountries = msvg.append("svg:g").attr("id", "minimap" + id);
    mcountries.selectAll("path").data(datar.features).enter().append("svg:path").attr("d", path);
    mcountries.selectAll("path")
        .attr("class", function(d) {
            return decideColor(d, party);
        }).style("stroke", "#000").style("stroke-width", .5);

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

function decideColor(geo, party) {
    var qq = (geo.properties.data[party].relative);
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