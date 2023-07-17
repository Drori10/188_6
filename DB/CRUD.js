const SQL = require('./db');
const path = require('path');
const csvtojson = require('csvtojson');
const fs = require('fs'); //csv
const createCsvWriter = require('csv-writer');
const csv = require('csv-parser');
const { constrainedMemory } = require('process');

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
        if (err) {
            console.log(err);
            res.status(400).send(err);
            return;
        }
        console.log("Users Table Created");
        return;
    })
};

// Users Table
const InsertCSVUsers = (req, res) => {
    const csvPath = path.join(__dirname, "Users.csv");
    csvtojson().fromFile(csvPath).then((jsonObj) => {
        for (let i = 0; i < jsonObj.length; i++) {
            const element = jsonObj[i];
            console.log(element);
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
            res.redirect('/PSignIn');
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

const CreateUserINGTable = (req, res) => {
    const Q1 = 'CREATE TABLE IF NOT EXISTS USR_ING (IngID int NOT NULL)';
    SQL.query(Q1, (err, mysqlres) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("USR_ING Table Created");
    });
  };

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
      
      // Provide any necessary data or success indicators in the callback
      return callback(null, result);
    });
  };
 
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

const loginCheck = (req, res) => {
            const username = req.body.UserName;
            const password = req.body.Password;
            console.log("username"+username +"pass"+ password) 
          
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
                return res.status(400).send(err);
              }
          
              SQL.query(Q3, (err, mysqlres2) => {
                if (err) {
                  console.log(err);
                  return res.status(400).send(err);
                }
          
                SQL.query(Q2, (err, mysqlres3) => {
                  if (err) {
                    console.log(err);
                    return res.status(400).send(err);
                  }
          
                  console.log("Primary key added to REC_ING table");
                });
              });
            });
          };

const InsertCSVRecipesIngredients = (req, res) => {
    const csvPath = path.join(__dirname, "IngRecipesData.csv");
    csvtojson().fromFile(csvPath).then((jsonObj) => {
        for (let i = 0; i < jsonObj.length; i++) {
            const element = jsonObj[i];
            console.log(element);
            const NewCsvData = {
                R_ID: element.RecipeID,
                I_ID: element.IngredientID
            };
            const Q1 = "INSERT IGNORE INTO REC_ING SET ?";
            SQL.query(Q1, NewCsvData, (err, mysqlres) => {
                if (err) {
                    throw err
                }
                console.log("********csv rec_ing inserted")
            });
        }
    });
};

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
        console.log("Recipes Table Created");
        return;
    })
};

const InsertCSVRecipes = (req, res) => {
    const csvPath = path.join(__dirname, "Recipes.csv");
    csvtojson().fromFile(csvPath).then((jsonObj) => {
        for (let i = 0; i < jsonObj.length; i++) {
            const element = jsonObj[i];
            console.log(element);
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

    // Execute the SQL query to delete data from the table
    SQL.query(deleteDataQuery, (error, result) => {
        if (error) {
            console.error("Error deleting data from USR_RECIPES table:", error);
            res.status(400).json({ error: "Error deleting data from USR_RECIPES table" });
            return;
        }
        console.log("********* USR_RECIPES deleted if exists")
        // Execute the SQL query to drop the table if it exists
        SQL.query(dropTableQuery, (error, result) => {
            if (error) {
                console.error("Error dropping USR_RECIPES table:", error);
                res.status(400).json({ error: "Error dropping USR_RECIPES table" });
                return;
            }
            // Execute the SQL query to create an empty table
            SQL.query(createTableQuery, (error, result) => {
                if (error) {
                    console.error("Error creating USR_RECIPES table:", error);
                    res.status(400).json({ error: "Error creating USR_RECIPES table" });
                    return;
                }
                // Execute the SQL query to insert data into the table
                SQL.query(insertDataQuery, (error, result) => {
                    if (error) {
                        console.error("Error inserting data into USR_RECIPES table:", error);
                        res.status(400).json({ error: "Error inserting data into USR_RECIPES table" });
                        return;
                    }
                    console.log("USR_RECIPES table created and data inserted successfully");
                });
            });
        });
    });
};

const SeeUsrRec = (callback) => {
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



module.exports = {
    loginCheck,
    CreateUserTable, InsertCSVUsers, DeleteAllUsers, InsertNewUser2, SelectAllUsers, 
    CreateUserINGTable, DeleteUserING, InsertToUsersING, SeeUsrIng,
    CreateRecipesIngredientsTable, InsertCSVRecipesIngredients, SeeRecIng,
    CreateRecipesTable, InsertCSVRecipes, SeeRec, DeleteRecipes,
    FindUsrRecipes, SeeUsrRec
 }