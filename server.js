const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const CRUD = require('./DB/CRUD');
const { DB } = require('./DB/DB.config');
const app = express();
const csv = require('csv-parser');
const fs = require('fs'); //for csv data reading
app.use(express.static('static'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'pug');
app.set('views', './views/PUG');
const port = 3000;

//DB csv arrays
const RecipesData = [];
const IngData = [];
const CSVUserData = [];
const IngRecipesData = [];

fs.createReadStream('DB/IngRecipesData.csv')
  .pipe(csv())
  .on('data', (row) => {
    IngRecipesData.push(row);
  })
  .on('end', () => {
  });

fs.createReadStream('DB/Recipes.csv')
  .pipe(csv())
  .on('data', (row) => {
    RecipesData.push(row);
  })
  .on('end', () => {
  });

  fs.createReadStream('DB/Ingredients.csv')
  .pipe(csv({ trim: true })) 
  .on('data', (row) => {
    IngData.push(row);
  })
  .on('end', () => {
  });

  fs.createReadStream('DB/Users.csv')
  .pipe(csv())
  .on('data', (row) => {
    CSVUserData.push(row);
  })
  .on('end', () => {
  });

//STARTUP CRUDS
CRUD.CreateUserTable(null, {
  render: function (view, data) {
  },
  status: function (statusCode) {
  }
});

CRUD.CreateUserINGTable((err, data) => {
  if (err) {
    console.log(err);
    return;
  }
});

CRUD.InsertCSVUsers(null, {
  render: function (view, data) {
  },
  status: function (statusCode) {
  }
});

CRUD.CreateRecipesTable((err, data) => {
  if (err) {
    console.log(err);
    return;
  }
});

CRUD.InsertCSVRecipes(null, {
  render: function (view, data) {
  },
  status: function (statusCode) {
  }
});

CRUD.CreateRecipesIngredientsTable1((err, data) => {
  if (err) {
    console.log(err);
    return;
  }
  CRUD.CreateRecipesIngredientsTable2((err2, data2) => {
    if (err2) {
      console.log(err2);
      return;
    }
    CRUD.CreateRecipesIngredientsTable3((err3, data3) => {
      if (err3) {
        console.log(err3);
        return;
      }
    });
  });
});

CRUD.InsertCSVRecipesIngredients(null, {
  render: function (view, data) {
  },
  status: function (statusCode) {
  }
});

//CRUDS Paths
app.post('/NewSignUp',CRUD.InsertNewUser2);
app.get('/ALL',CRUD.SelectAllUsers);
app.get('/DeleteAll', CRUD.DeleteAllUsers);
app.get('/DeleteDeleteDelete', CRUD.DELETEEVERYTHING);


//PUG
app.get('/', (req, res) => {
  res.render('About');
});
app.get('/PAbout', (req, res) => {
  res.render('About');
});
app.get('/PsAbout', (req, res) => {
  res.render('S_About');
});
app.get('/PSignIn', (req, res) => {
  res.render('SignIn');
});
app.get('/PSignUp', (req, res) => {
  res.render('SignUp');
});
app.post('/PSignUp', (req, res) => {
  res.render('SignUp');
});
app.get('/PIngredients', (req, res) => {
  // Retrieve the username from the cookie
  const username = req.cookies.User_Name;
  // Send the username to the client
  res.render('Ingredients', { username, IngData });
});
app.post('/PIngredients', (req, res) => {
  res.render('Ingredients', { IngData });
  });
app.get('/PRecipes', (req, res) => {
  res.render('Recipes', { RecipesData });
});
app.post('/PRecipes', (req, res) => {
  res.render('Recipes', { RecipesData });
});
app.get('/checkLogin', (req, res) => {
  CRUD.loginCheck(req, res);
});
app.post('/checkLogin', (req, res) => {
  CRUD.loginCheck(req, res);
});

app.post('/MyIng', (req, response) => {
  // Retrieve the form data from the request body
  const formValues = req.body;
  CRUD.DeleteUserING(req, response);
  // Pass the form data to CRUD function
  CRUD.InsertToUsersING(formValues, (err, result) => {
    if (err) {
      console.log(err);
      response.status(500).send('Error occurred');
      return;
    }
    response.redirect('/UsrRec1');
  });
  });
  app.get('/UsrRec1', CRUD.FindUsrRecipes) //redirects to /UsrRec2 on finish
  app.get('/UsrRec2', (req, response) => {
    CRUD.SelectUSRRec((error, UserRecipes) => {
      if (error) {
        console.error(error);
        response.status(500).send('Error occurred');
        return;
      }
      response.render('USR_Recipes', { UserRecipes });
    });
  });

//Back Route
app.get('/Back', (req, res) => {
  window.history.back();
});

// Start the server
app.listen(port, () => {
  console.log('Server is running on port', port);
});