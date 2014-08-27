module.exports = {
    environment : {
        local : "http://localhost:4730/",
        production : "statvis-21833.onmodulus.net/"
    },
    navigation : {
        crime : {
            splosno : [{title : "Povprečje", path: "povprecje"},  {path: "rop", title: "Rop"}, {path : "spolno", title : "Spolno nasilje"}, {path: "druzinsko", title : "Družinsko nasilje"}, {path: "umor", title: "Umor in uboj"}, {path: "hudaposkodba", title: "Huda telesna poškodba"} ],
            letno   : [{title : "Povprečje", path: "povprecje"}, {path: "hudaposkodba", title: "Huda telesna poškodba"}, {path : "spolno", title : "Spolno nasilje"}, {path: "rop", title: "Rop"}],
            years : [2008,2009,2010,2011,2012,2013]
        }
    }
}