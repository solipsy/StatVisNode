var fs = require('fs')
    , jsdom = require('jsdom-nogyp')
    , htmlStub = '<html><head></head><body><div id="dataviz-container"></div><script src="./d3.min.js"></script></body></html>'
    , document = jsdom.jsdom(htmlStub)
    , window = document.createWindow()
    , globals = {};

jsdom.env({ features : { QuerySelector : true }, html : htmlStub, done : function(errors, win) {

    // stash globals
    if ('window' in global) globals.window = global.window;
    global.window = window;
    if ('document' in global) globals.document = global.document;
    global.document = document;

    // https://github.com/chad3814/CSSStyleDeclaration/issues/3
    var CSSStyleDeclaration_prototype = window.CSSStyleDeclaration.prototype,
        CSSStyleDeclaration_setProperty = CSSStyleDeclaration_prototype.setProperty;

    CSSStyleDeclaration_prototype.setProperty = function(name, value, priority) {
        return CSSStyleDeclaration_setProperty.call(this, name + "", value == null ? null : value + "", priority == null ? null : priority + "");
    };

    var d3 = require('./public/javascripts/d3.v3.min.js');

    var el = window.document.querySelector('#dataviz-container')
        , body = window.document.querySelector('body')
        , circleId = 'a2324';

    d3.select(el)
        .append('svg:svg')
        .attr('width', 600)
        .attr('height', 300)
        .append('circle')
        .attr('cx', 300)
        .attr('cy', 150)
        .attr('r', 30)
        .attr('fill', '#26963c')
        .attr('id', circleId);

    var clientScript = "d3.select('#" + circleId + "').transition().delay(1000).attr('fill', '#f9af26')";

    d3.select(body)
        .append('script')
        .html(clientScript);

    var svgsrc = window.document.innerHTML
    fs.writeFile('index.html', svgsrc, function(err) {
        if(err) {
            console.log('error saving document', err)
        } else {
            console.log('The file was saved!')
        }
    });

    // restore globals
    if ('window' in globals) global.window = globals.window;
    else delete global.window;
    if ('document' in globals) global.document = globals.document;
    else delete global.document;
}
});