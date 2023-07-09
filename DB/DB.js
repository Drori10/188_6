// import 
const SQL = require('mysql2');
const dbConfig = require('./DB.config');
// create connection
const connection = SQL.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
});

// open the connection
connection.connect(error =>{
    if (error) throw error;
    console.log("connected to DB");
});

module.exports = connection;