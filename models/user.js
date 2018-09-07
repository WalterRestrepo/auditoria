var Sequelize = require('sequelize');
// var bcrypt = require('bcrypt');//Esto es para encriptar pero requiere python

// vincula la información de la base de datos
const application = require('../application.json')
// create a sequelize instance with our local postgres database information.

// crea una instancia de la base de datos
var sequelize = new Sequelize(application.database, application.username, application.password, {
    host: application.host,
    dialect: 'mysql'
})

// setup User model and its fields.
// define la estructura de la tabla usuario
var User = sequelize.define('users', {
    username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
        hooks: {
            beforeCreate: (user) => {
                const salt = "";//bcrypt.genSaltSync();
                user.password = user.password;//bcrypt.hashSync(user.password, salt);
            }
        },
        instanceMethods: {
            validPassword: function (password) {
                return bcrypt.compareSync(password, this.password);
            }
        }
    });

// create all the defined tables in the specified database.
sequelize.sync()
    .then(() => console.log('users table has been successfully created, if one doesn\'t exist'))
    .catch(error => console.log('This error occured', error));

// export User model for use in other files.
module.exports = User;