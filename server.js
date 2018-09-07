//console.log("Console test");
//codepen
//node server.js ->Para correr
var express = require("express");
var app = express();
var path = require("path");
var mysql = require("mysql");
const application = require('./application.json')
var Sequelize = require('sequelize');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var User = require('./models/user');
//var morgan = require('morgan');
//var bodyParser = require('body-parser');


const sequelize = new Sequelize(application.database, application.username, application.password, {
    host: application.host,
    dialect: 'mysql'
})

//Configutamos la aplicacion
app.use(cookieParser());
app.use(session({
    key: 'user_sid',
    secret: 'iushauditoria2018',
    resave: false,
    saveUninitialized: false,
    cookie: { expires: 600000 }
}));
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');
    }
    next();
});
var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/dashboard');
    } else {
        next();
    }
};

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "db_auditoria"
});

// app.get('/', sessionChecker, (req, res) => {
//     res.redirect('/login');
// });


app.route('/signup')
    .get(sessionChecker, (req, res) => {
        res.sendFile(__dirname + '/public/signup.html');
    })
    .post((req, res) => {
        User.create({
            username: req.body.username,
            password: req.body.password
        })
            .then(user => {
                req.session.user = user.dataValues;
                res.redirect('/dashboard');
            })
            .catch(error => {
                res.redirect('/signup');
            });
    });

app.route('/login')
    .get(sessionChecker, (req, res) => {
        res.sendFile(__dirname + '/public/login.html');
    })
    .post((req, res) => {
        var username = req.body.username,
            password = req.body.password;

        User.findOne({ where: { username: username } }).then(function (user) {
            if (!user) {
                res.redirect('/login');
            } else if (!user.validPassword(password)) {
                res.redirect('/login');
            } else {
                req.session.user = user.dataValues;
                res.redirect('/dashboard');
            }
        });
    });

app.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});

app.get('/dashboard', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.sendFile(__dirname + '/public/dashboard.html');
    } else {
        res.redirect('/login');
    }
});


app.get('/', function (req, res) {
    if (req.session.user && req.cookies.user_sid) {
        res.sendFile(
            path.join(
                __dirname + '/src/views/index.html'
            )
        );
    } else {
        res.redirect('/login');
    }
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

//NUEVO

//auditoria
app.get('/auditoria/get', function (req, res) {
    con.query("SELECT * FROM auditoria", function (err, result, fields) {
        if (err) throw err;
        res.json(result);
    });
});
app.get('/auditoria/get/:id', function (req, res) {
    var id = req.params.id;
    con.query("SELECT * FROM auditoria WHERE id = ?", [id], function (err, result, fields) {
        if (err) throw err;
        res.json(result);
    });
});
app.get('/auditoria/save/:empresa/:pregunta/:respuesta/:norma/:auditor', function (req, res) {
    var empresa = req.params.empresa;
    var pregunta = req.params.pregunta;
    var respuesta = req.params.respuesta;
    var norma = req.params.norma;
    var auditor = req.params.auditor;
    con.query("INSERT INTO auditoria (id, empresa, pregunta, respuesta, norma, fecha, auditor) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?);",
        [null, empresa, pregunta, respuesta, norma, auditor], function (err, result, fields) {
            if (err) throw err;
            if (result.affectedRows >= 1) {
                res.json({ insert: true });
            } else {
                res.json({ insert: false });
            }
        });
});
app.get('/auditoriaresultado/get/:idempresa', function (req, res) {
    var idempresa = req.params.idempresa;
    var consulta = "select e.nombre, e.nit, n.nombre, p.texto, a.respuesta, u.usuario, a.fecha from auditoria a ";
    consulta = consulta + "inner join empresa e on a.empresa = e.id ";
    consulta = consulta + "inner join pregunta p on a.pregunta = p.id ";
    consulta = consulta + "inner join norma n on a.norma = n.id ";
    consulta = consulta + "inner join usuario u on a.auditor = u.id ";
    consulta = consulta + "where e.id = ?;";
    con.query(consulta, [idempresa], function (err, result, fields) {
        if (err) throw err;
        res.json(result);
    });
});

//empresa
app.get('/empresa/get', function (req, res) {
    con.query("SELECT * FROM empresa", function (err, result, fields) {
        if (err) throw err;
        res.json(result);
    });
});
app.get('/empresa/get/:id', function (req, res) {
    var id = req.params.id;
    con.query("SELECT * FROM empresa WHERE id = ?", [id], function (err, result, fields) {
        if (err) throw err;
        res.json(result);
    });
});
app.get('/empresa/save/:name/:nit', function (req, res) {
    var name = req.params.name;
    var nit = req.params.nit;
    con.query("INSERT INTO empresa (id, nombre, nit) VALUES (?, ?, ?);", [null, name, nit], function (err, result, fields) {
        if (err) throw err;
        if (result.affectedRows >= 1) {
            res.json({ insert: true });
        } else {
            res.json({ insert: false });
        }
    });
});

//norma
app.get('/norma/get', function (req, res) {
    con.query("SELECT * FROM norma", function (err, result, fields) {
        if (err) throw err;
        res.json(result);
    });
});
app.get('/norma/get/:id', function (req, res) {
    var id = req.params.id;
    con.query("SELECT * FROM norma WHERE id = ?", [id], function (err, result, fields) {
        if (err) throw err;
        res.json(result);
    });
});
app.get('/norma/save/:name', function (req, res) {
    var name = req.params.name;
    con.query("INSERT INTO norma (id, nombre) VALUES (?, ?);", [null, name], function (err, result, fields) {
        if (err) throw err;
        if (result.affectedRows >= 1) {
            res.json({ insert: true });
        } else {
            res.json({ insert: false });
        }
    });
});

//preguntas
app.get('/pregunta/get', function (req, res) {
    con.query("SELECT * FROM pregunta", function (err, result, fields) {
        if (err) throw err;
        res.json(result);
    });
});
app.get('/pregunta/get/:id', function (req, res) {
    var id = req.params.id;
    con.query("SELECT * FROM pregunta WHERE id = ?", [id], function (err, result, fields) {
        if (err) throw err;
        res.json(result);
    });
});
app.get('/preguntanorma/get/:idnorma', function (req, res) {
    var idnorma = req.params.idnorma;
    con.query("SELECT * FROM pregunta WHERE norma = ?", [idnorma], function (err, result, fields) {
        if (err) throw err;
        res.json(result);
    });
});
app.get('/pregunta/save/:idnorma/:pregunta', function (req, res) {
    var idnorma = req.params.idnorma;
    var pregunta = req.params.pregunta;
    con.query("INSERT INTO pregunta (id, norma, texto) VALUES (?, ?, ?);", [null, idnorma, pregunta], function (err, result, fields) {
        if (err) throw err;
        if (result.affectedRows >= 1) {
            res.json({ insert: true });
        } else {
            res.json({ insert: false });
        }
    });
});

//usuario
app.get('/usuario/get/:id', function (req, res) {
    var id = req.params.id;
    con.query("SELECT * FROM usuario WHERE id = ?", [id], function (err, result, fields) {
        if (err) throw err;
        res.json(result);
    });
});
app.get('/usuario/login/:usuario/:clave', function (req, res) {
    var usuario = req.params.usuario;
    var clave = req.params.clave;
    con.query("SELECT * FROM usuario WHERE usuario = ? AND clave = ? LIMIT 1;", [usuario, clave], function (err, result, fields) {
        if (err) throw err;
        res.json(result);
    });
});
app.get('/usuario/save/:usuario/:clave', function (req, res) {
    var usuario = req.params.usuario;
    var clave = req.params.clave;
    con.query("INSERT INTO usuario (id, usuario, clave) VALUES (?, ?, ?);", [null, usuario, clave], function (err, result, fields) {
        if (err) throw err;
        if (result.affectedRows >= 1) {
            res.json({ insert: true });
        } else {
            res.json({ insert: false });
        }
    });
});

app.listen(3000, function () {
    console.log("Funciona 127.0.0.1:3000");
});

/*
app.get("/", function (req, res){
    res.send("Hola.");    
});
app.get("/test", function (req, res){
    res.send("Test.");    
});
app.listen(3000, function (){console.log("Funciona");});*/