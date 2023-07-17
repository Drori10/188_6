const SQL = require('./db');
const path = require('path');
const csvtojson = require('csvtojson');
const fs = require('fs'); //csv
const createCsvWriter = require('csv-writer');


//********* USERS TABLE CRUDS:
// Create USERS Table
const CreateUserTable = (req, res) => {
    const Q1 = 'CREATE TABLE IF NOT EXISTS `USERS` (\
        ID int(9) NOT NULL,\
        Email varchar(50) NOT NULL,\
        FullName varchar(50) NOT NULL,\
        UserName varchar(50) PRIMARY KEY NOT NULL,\
        Password varchar(50) NOT NULL,\
        CourseNumber varchar(3) NOT NULL\
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8';
    SQL.query(Q1, (err, mysqlres) => {
        if (err) {
            console.log(err);
            return;
        }
        return;
    })
};

// INSERT EXCEL CSV DATA TO TABLE
const InsertCSVUsers = (req, res) => {
    const csvPath = path.join(__dirname, "Users.csv");
    csvtojson().fromFile(csvPath).then((jsonObj) => {
        for (let i = 0; i < jsonObj.length; i++) {
            const element = jsonObj[i];
            const NewCsvData = {
                ID: element.ID_U,
                Email: element.Email,
                FullName: element.FullName,
                UserName: element.UserName,
                Password: element.Password,
                CourseNumber: element.CourseNumber
            };
            const Q1 = "INSERT IGNORE INTO Users SET ?";
            SQL.query(Q1, NewCsvData, (err, mysqlres) => {
                if (err) {
                    throw err
                }
            });
        }
    });
};

// Inserting New User upon sign-up To MYSQL table, along with writing to the excel csv
const InsertNewUser2 = (req, res) => {
    const username = req.body.UserName;
    
    //Checking if username is taken
    const checkQuery = 'SELECT * FROM USERS WHERE UserName = ?';
    SQL.query(checkQuery, [username], (err, result) => {
      if (err) {
        console.error('Error checking signup credentials:', err);
        res.status(500).send('Something went wrong');
        return;
      }
  
      if (result.length != 0) {
        //Username is taken
        // Display an alert pop-up message and redirect to /PSignUp
        res.send("<script>alert('Username Taken'); window.location.href = '/PSignUp';</script>");
      
    }
    else{ //Username is not taken, continue sign-up process
        const NewSignUp = {
            ID: req.body.ID,
            Email: req.body.Email,
            FullName: req.body.FullName,
            UserName: req.body.UserName,
            Password: req.body.Password,
            CourseNumber: req.body.CourseNumber
        };
        // Insert new user to CSV excel file
        const user_data = Object.values(NewSignUp);
        const csvPath = path.join(__dirname, 'Users.csv');
        const csvLine = user_data.join(',');
        const csvRow = csvLine + '\n';
        fs.appendFile(csvPath, csvRow, 'utf8', (err) => {
            if (err) {
                console.error('Error writing data to CSV file:', err);
                res.send("Something went wrong.");
                return;
            }

            // Insert New User to mysql table
            const query = "INSERT INTO USERS (ID, Email, FullName, UserName, Password, CourseNumber) VALUES (?, ?, ?, ?, ?, ?)";
            SQL.query(query, user_data, (err, mysqlres) => {
                if (err) {
                    console.log(err);
                    res.send("Something went wrong.");
                    return;
                }
                res.cookie("Username", req.body.UserName);
                res.redirect('/PSignIn');
            });
        });
    }
});
};

// ADMIN - SEE all users
const SelectAllUsers = (req, res) => {
    const Q3 = 'select * from USERS';
    SQL.query(Q3, (err, mysqlres) => {
        if (err) {
            console.log(err);
            res.status(400).send("cannot find users");
            return;
        }
        res.send(mysqlres);
        console.log("found table");
        return;
    })
};

// ADMIN - delete all users
const DeleteAllUsers = (req, res) => {
    const Q3 = 'DELETE FROM users;';
    SQL.query(Q3, (err, mysqlres) => {
        if (err) {
            console.log(err);
            res.status(400).send("cannot Delete users");
            return;
        }
        res.send(mysqlres);
        console.log("All Users Deleted");
        return;
    })
};

const loginCheck = (req, res) => {
    const username = req.body.UserName;
    const password = req.body.Password;
  
    const checkQuery = 'SELECT * FROM USERS WHERE UserName = ? AND Password = ?';
    SQL.query(checkQuery, [username, password], (err, result) => {
      if (err) {
        console.error('Error checking login credentials:', err);
        res.status(500).send('Something went wrong');
        return;
      }
  
      if (result.length > 0) {
        res.cookie('User_Name', username);
        res.redirect('/PIngredients');
    } else {
              //Display an alert pop-up message and redirect back to /login
              res.send("<script>alert('Incorrect Username or password'); window.location.href = '/PSignIn';</script>");
      }
    });
  };

//********* */ RECIPE TABLE
//Create table
const CreateRecipesTable = (req, res) => {
    const Q1 = 'CREATE TABLE IF NOT EXISTS `RECIPES` (\
        ID int(1) NOT NULL PRIMARY KEY,\
        Name varchar(50) NOT NULL,\
        Instructions varchar(250) NOT NULL,\
        Picture varchar(50) NOT NULL\
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8';
    SQL.query(Q1, (err, mysqlres) => {
        if (err) {
            console.log(err);
            res.send(err);
            return;
        }
        return;
    })
};

//Insert excel data to table
const InsertCSVRecipes = (req, res) => {
    const csvPath = path.join(__dirname, "Recipes.csv");
    csvtojson().fromFile(csvPath).then((jsonObj) => {
        for (let i = 0; i < jsonObj.length; i++) {
            const element = jsonObj[i];
            const NewCsvData = {
                ID: element.RecipeID,
                Name: element.Name,
                Instructions: element.Instructions,
                Picture: element.Picture
            };
            const Q1 = "INSERT IGNORE INTO RECIPES SET ?";
            SQL.query(Q1, NewCsvData, (err, mysqlres) => {
                if (err) {
                    throw err
                }
            });
        }
    });
};
//ADMIN-- Select all Recipes (not used)
const SeeRec = (req, res) => {
    const Q = 'select * from RECIPES';
    SQL.query(Q, (err, mysqlres) => {
        if (err) {
            console.log(err);
            res.status(400).send("cannot find RECIPES");
            return;
        }
        res.send(mysqlres);
        console.log("found RECIPES");
        return;
    })
};

//ADMIN - delete all recipes from Recipe Table
const DeleteRecipes = (req, res) => {
    const Q3 = 'DELETE FROM RECIPES;';
    SQL.query(Q3, (err, mysqlres) => {
        if (err) {
            console.log(err);
            return;
        }
        //res.send(mysqlres);
        console.log("RECIPES Deleted");
        return;
    })
};

//*********** Recipes - Ingredient table - which recipes require which ingredients
//Create table
const CreateRecipesIngredientsTable = (req, res) => {
    const Q1 = `CREATE TABLE IF NOT EXISTS \`REC_ING\` (
      R_ID int(1) NOT NULL,
      I_ID int(1) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8`;
    const Q3 = 'ALTER TABLE `REC_ING` DROP PRIMARY KEY';
    const Q2 = 'ALTER TABLE `REC_ING` ADD PRIMARY KEY (R_ID, I_ID)';
  
    SQL.query(Q1, (err, mysqlres) => {
      if (err) {
        console.log(err);
        return;
      }
  
      SQL.query(Q3, (err, mysqlres2) => {
        if (err) {
          console.log(err);
          return;
        }
  
        SQL.query(Q2, (err, mysqlres3) => {
          if (err) {
            console.log(err);
            return;
          }
        });
      });
    });
  };

// Insert into table from CSV excel data
const InsertCSVRecipesIngredients = (req, res) => {
    const csvPath = path.join(__dirname, "IngRecipesData.csv");
    csvtojson().fromFile(csvPath).then((jsonObj) => {
        for (let i = 0; i < jsonObj.length; i++) {
            const element = jsonObj[i];
            const NewCsvData = {
                R_ID: element.RecipeID,
                I_ID: element.IngredientID
            };
            const Q1 = "INSERT IGNORE INTO REC_ING SET ?";
            SQL.query(Q1, NewCsvData, (err, mysqlres) => {
                if (err) {
                    throw err
                }
            });
        }
    });
};

// ADMIN - NOT USED - select all REC_ING table
const SeeRecIng = (req, res) => {
    const Q = 'select * from REC_ING';
    SQL.query(Q, (err, mysqlres) => {
        if (err) {
            console.log(err);
            res.status(400).send("cannot find REC_ING");
            return;
        }
        res.send(mysqlres);
        console.log("found REC_ING");
        return;
    })
};

//******* Users Ingredients table (what ingredients did the user check)
//Create table
const CreateUserINGTable = (req, res) => {
    const Q1 = 'CREATE TABLE IF NOT EXISTS USR_ING (IngID int NOT NULL)';
    SQL.query(Q1, (err, mysqlres) => {
      if (err) {
        console.log(err);
        return;
      }
    });
  };

  //Delete Table
const DeleteUserING = (req, res) => {
    const Q3 = 'DELETE FROM USR_ING;';
    SQL.query(Q3, (err, mysqlres) => {
        if (err) {
            console.log(err);
            return;
        }
        //res.send(mysqlres);
        console.log("USR_ING Deleted");
        return;
    })
};

// Insert users ingredient form into table
  const InsertToUsersING = (formData, callback) => {
    const values = Object.keys(formData)
      .filter(key => key.startsWith('Row') && formData[key] === 'on')
      .map(key => [parseInt(key.replace('Row', ''), 10)]);
    
    const Q1 = 'INSERT INTO USR_ING (IngID) VALUES ?';
    SQL.query(Q1, [values], (err, result) => {
      if (err) {
        console.log(err);
        return callback(err);
      }
      
      return callback(null, result);
    });
  };
 
  //ADMIN - See user ing table
const SeeUsrIng = (req, res) => {
    const Q = 'select * from USR_ING';
    SQL.query(Q, (err, mysqlres) => {
        if (err) {
            console.log(err);
            res.status(400).send("cannot find USR_ING");
            return;
        }
        res.send(mysqlres);
        console.log("found USR_ING");
        return;
    })
};

//******** Users found recipes according to his ingredients
const FindUsrRecipes = (req, res) => {
    const deleteDataQuery = "DELETE FROM USR_RECIPES WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'USR_RECIPES')";
    const dropTableQuery = "DROP TABLE IF EXISTS USR_RECIPES";
    const createTableQuery = "CREATE TABLE USR_RECIPES (ID INT, Name VARCHAR(255), Instructions VARCHAR(255), Picture VARCHAR(255))";
    const insertDataQuery = "INSERT INTO USR_RECIPES (ID, Name, Instructions, Picture) \
    SELECT R.ID, R.Name, R.Instructions, R.Picture \
    FROM RECIPES AS R \
    JOIN REC_ING AS RI ON R.ID = RI.R_ID \
    LEFT JOIN USR_ING AS UI ON UI.IngID = RI.I_ID \
    GROUP BY R.ID, R.Name, R.Instructions, R.Picture \
    HAVING COUNT(DISTINCT RI.I_ID) = COUNT(DISTINCT UI.IngID) \
       AND COUNT(DISTINCT RI.I_ID) = (SELECT COUNT(*) FROM REC_ING WHERE R_ID = R.ID)";

    // delete data from table if exists (previous user)
    SQL.query(deleteDataQuery, (error, result) => {
        if (error) {
            console.error("Error deleting data from USR_RECIPES table:", error);
            return;
        }
        console.log("USR_RECIPES deleted if exists")
        //Drop table if exists in order to create new one for new user
        SQL.query(dropTableQuery, (error, result) => {
            if (error) {
                console.error("Error dropping USR_RECIPES table:", error);
                return;
            }
            // create table
            SQL.query(createTableQuery, (error, result) => {
                if (error) {
                    console.error("Error creating USR_RECIPES table:", error);
                    return;
                }
                //inserting correct recipes into table according to users input using sql logic
                SQL.query(insertDataQuery, (error, result) => {
                    if (error) {
                        console.error("Error inserting data into USR_RECIPES table:", error);
                        return;
                    }
                    console.log("USR_RECIPES table created and data inserted successfully");
                    res.redirect('/UsrRec2'); // Redirects to render pug with users recipes
                });
            });
        });
    }); 
};
//ADMIN -- select all user recipes (not used)
const SelectUSRRec = (callback) => {
    const Q = 'SELECT * FROM USR_RECIPES';
    SQL.query(Q, (err, mysqlres) => {
      if (err) {
        console.log(err);
        callback(err);
      } else {
        console.log("Found USR_RECIPES");
        callback(null, mysqlres);
      }
    });
  };

module.exports = {
    CreateUserTable, InsertCSVUsers, DeleteAllUsers, SelectAllUsers, //User Table Cruds
    loginCheck, InsertNewUser2,                                      // Login / Signup Cruds
    CreateRecipesTable, InsertCSVRecipes, SeeRec, DeleteRecipes,    // Recipe (excel data) Cruds 
    CreateRecipesIngredientsTable, InsertCSVRecipesIngredients, SeeRecIng, //Recipe-ingredient table
    CreateUserINGTable, DeleteUserING, InsertToUsersING, SeeUsrIng,  // Users Ingredients table
    FindUsrRecipes, SelectUSRRec                                    // Users Available recipes table
 }