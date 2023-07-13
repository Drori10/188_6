const SQL = require('./db');
const path = require('path');
const csvtojson = require('csvtojson');
const fs = require('fs'); //csv
const createCsvWriter = require('csv-writer');
const csv = require('csv-parser');

const CreateUserTable = (req, res) => {
    const Q1 = 'CREATE TABLE IF NOT EXISTS `USERS` (\
        ID int(9) NOT NULL PRIMARY KEY AUTO_INCREMENT,\
        Email varchar(50) NOT NULL,\
        FullName varchar(50) NOT NULL,\
        UserName varchar(50) NOT NULL,\
        Password varchar(50) NOT NULL,\
        CourseNumber varchar(3) NOT NULL\
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8';
    SQL.query(Q1, (err, mysqlres) => {
        //console.log("in query");
        if (err) {
            console.log(err);
            //res.status(400).send(err);
            res.status(400).render('home', { v1: err })
            return;
        }
        //res.send("hi - table created");
        res.render('home', { v1: "Table created" });
        return;
    })
};

// Users Table
const InsertCSVUsers = (req, res) => {
    const csvPath = path.join(__dirname, "Users.csv");
    csvtojson().fromFile(csvPath).then((jsonObj) => {
        console.log(jsonObj);
        for (let i = 0; i < jsonObj.length; i++) {
            const element = jsonObj[i];
            console.log(element);
            const NewCsvData = {
                ID: element.ID,
                Email: element.Email,
                FullName: element.FullName,
                UserName: element.UserName,
                Password: element.Password,
                CourseNumber: element.CourseNumber
            };
            const Q1 = "insert into Users set ?";
            SQL.query(Q1, NewCsvData, (err, mysqlres) => {
                if (err) {
                    throw err
                }
                console.log("csv data inserted to users table")
            });
        }
    });
};

const InsertNewUser2 = (req, res) => {
    const NewSignUp = {
        ID: req.body.ID,
        Email: req.body.Email,
        FullName: req.body.FullName,
        UserName: req.body.UserName,
        Password: req.body.Password,
        CourseNumber: req.body.CourseNumber
    };

    const user_data = Object.values(NewSignUp);

    const csvPath = path.join(__dirname, 'Users.csv');

    // Write the user_data to the CSV file
    const csvLine = user_data.join(',');
    const csvRow = csvLine + '\n';

    fs.appendFile(csvPath, csvRow, 'utf8', (err) => {
        if (err) {
            console.error('Error writing data to CSV file:', err);
            res.send("Something went wrong.");
            return;
        }
        const query = "INSERT INTO USERS (ID, Email, FullName, UserName, Password, CourseNumber) VALUES (?, ?, ?, ?, ?, ?)";
        SQL.query(query, user_data, (err, mysqlres) => {
            if (err) {
                console.log(err);
                res.send("Something went wrong.");
                return;
            }

            res.cookie("Username", req.body.UserName);
            res.redirect('/PIngredients');
        });
    });
};


const SelectAllUsers = (req, res) => {
    const Q3 = 'select * from USERS';
    SQL.query(Q3, (err, mysqlres) => {
        if (err) {
            console.log(err);
            res.status(400).send("cannot find users");
            return;
        }
        //res.send(mysqlres);
        res.send(mysqlres);
        console.log("found table");
        return;
    })
};

const DeleteAllUsers = (req, res) => {
    const Q3 = 'DELETE FROM users;';
    SQL.query(Q3, (err, mysqlres) => {
        if (err) {
            console.log(err);
            res.status(400).send("cannot Delete users");
            return;
        }
        //res.send(mysqlres);
        res.send(mysqlres);
        console.log("All Users Deleted");
        return;
    })
};

module.exports = {DeleteAllUsers, InsertNewUser2, CreateUserTable, SelectAllUsers, InsertCSVUsers }