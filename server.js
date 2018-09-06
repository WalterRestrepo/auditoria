//console.log("Console test");
//codepen
//node server.js ->Para correr
var express = require("express");
var app = express();
var path = require("path");
var mysql = require("mysql");

app.get('/', function (req, res) {
    res.sendFile(
        path.join(
            __dirname + '/src/views/index.html'
        )
    );
});

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "db_auditoria"
});

app.get('/crearEmpresa', function (req, res) {
    res.sendFile(
        path.join(
            __dirname + '/src/views/crearEmpresa.html'
        )
    );
});

app.get('/usuario/get/:id', function (req, res) {
    var id = req.params.id;
    con.connect(function (err) {
        if (err) throw err;
        query = "SELECT * FROM usuario WHERE id = :id";
        query = query.replace(":id", id);
        con.query(query, function (err, result, fields) {
            if (err) throw err;
            console.log(err);
            res.json(result);
        });
    });
    
});

app.get('/usuario/save/:nombre', function (req, res) {
    var nombre = req.params.nombre;
    if(nombre == "" || nombre == undefined)
    con.connect(function (err) {
        if (err) throw err;
        query = "SELECT * FROM usuario WHERE id = :id";
        query = query.replace(":id", id);
        con.query(query, function (err, result, fields) {
            if (err) throw err;
            console.log(err);
            res.json(result);
        });
    });
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