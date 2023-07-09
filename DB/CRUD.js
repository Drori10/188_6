const SQL = require('./db');
const path = require('path');

const CreateUserTable = (req,res)=>{
    const Q1 = 'CREATE TABLE IF NOT EXISTS `USERS` (\
        ID int(9) NOT NULL PRIMARY KEY AUTO_INCREMENT,\
        Email varchar(50) NOT NULL,\
        FullName varchar(50) NOT NULL,\
        UserName varchar(50) NOT NULL,\
        Password varchar(50) NOT NULL,\
        CourseNumber varchar(3) NOT NULL\
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8';
        SQL.query(Q1, (err,mysqlres)=>{
        //console.log("in query");
        if (err) {
            console.log(err);
            //res.status(400).send(err);
            res.status(400).render('home', {v1: err})
            return;
        }
        //res.send("hi - table created");
        res.render('home', {v1: "Table created"});
        return;
    })};

    const InsertNewUser = (req,res)=>{
        const NewSignUp = {
            ID: req.query.idnumber,
            Email: req.query.email, 
            FullName: req.query.fullname,
            UserName: req.query.username,
            Password: req.query.password,
            CourseNumber: req.query.coursenumber
        };
        // run insert query
        const Q1 = "INSERT INTO USERS SET ?";
        sql.query(Q1, NewSignUp, (err, mysqlres)=>{
            if (err) {
                console.log(err);
                res.send("something went wrong");    
                return;
            }
            res.cookie("Username", req.query.username);
            return;
        });};

        const SelectAllUsers = (req,res)=>{
            const Q3 = 'select * from USERS';
            sql.query(Q3, (err,mysqlres)=>{
                if (err) {
                    console.log(err);
                    res.status(400).send("cannot find users");
                    return;
                }
                //res.send(mysqlres);
                res.render('selctAll', {V1:mysqlres})
                console.log("found table");
                return;
            })
        };

        module.exports = {InsertNewUser, CreateUserTable, SelectAllUsers}