//console.log("Console test");
var express = require("express");
var app = express();
var path = require("path");

app.get('/', function (req, res) {
    res.sendFile(
        path.join(
            __dirname + '/src/views/index.html'
        )
    );
});

app.get('/crearEmpresa', function (req, res) {
    res.sendFile(
        path.join(
            __dirname + '/src/views/crearEmpresa.html'
        )
    );
});

//app.use(express.static(__dirname + ));
//materialize

app.listen(3000, function () {
    console.log("Funciona");
});




/*
app.get("/", function (req, res){
    res.send("Hola.");    
});
app.get("/test", function (req, res){
    res.send("Test.");    
});
app.listen(3000, function (){console.log("Funciona");});*/