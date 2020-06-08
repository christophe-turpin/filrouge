const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost', // adresse du serveur
    user: 'root', // le nom d'utilisateur
    password: 'Isaac0504!', // le mot de passe
    database: 'WCS_Marseille', // le nom de la base de données
});
module.exports = connection;