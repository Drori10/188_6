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
app.set('views', './views');
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



//CRUDS Paths
app.post('/NewSignUp',CRUD.InsertNewUser2);
app.get('/ALL',CRUD.SelectAllUsers);
app.get('/DeleteAll', CRUD.DeleteAllUsers);
app.get('/DropAll', CRUD.DropAll);



//STARTUP CRUDS FLOW
app.get('/', (req, res) => {
  res.redirect('/CRUD.CreateUserTable')
});
app.get('/CRUD.CreateUserTable',CRUD.CreateUserTable);
app.get('/CRUD.InsertCSVUsers',CRUD.InsertCSVUsers);
app.get('/CRUD.CreateUserINGTable',CRUD.CreateUserINGTable);
app.get('/CRUD.CreateRecipesTable',CRUD.CreateRecipesTable);
app.get('/CRUD.InsertCSVRecipes',CRUD.InsertCSVRecipes);
app.get('/CRUD.CreateRecipesIngredientsTable',CRUD.CreateRecipesIngredientsTable);
app.get('/CRUD.InsertCSVRecipesIngredients',CRUD.InsertCSVRecipesIngredients);

//PUG
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
app.get('/PIngredients', (req, res) => {
  // Retrieve the username from the cookie
  const username = req.cookies.User_Name;
  // Send the username to the client
  res.render('Ingredients', { username, IngData });
});
app.get('/PRecipes', (req, res) => {
  res.render('Recipes', { RecipesData });
});
app.post('/checkLogin', (req, res) => {
  CRUD.loginCheck(req, res);
});
app.get('/USR_Recipes', (req, response) => {
    CRUD.SelectUSRRec((error, UserRecipes) => {
    if (error) {
      console.error(error);
      response.status(500).send('Error occurred');
      return;
    }
    response.render('USR_Recipes', { UserRecipes });
  });
});

app.post('/MyIng', (req, response) => {
  // Retrieve the form data from the request body
  const formValues = req.body;
  CRUD.DeleteUserING(req, response);
  // Pass the form data to CRUD function
  CRUD.InsertToUsersING(formValues, (err, result) => {
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


