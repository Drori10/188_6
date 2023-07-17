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

// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

//DB shit
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
    console.log('Recipe CSV file successfully processed.');
  });

fs.createReadStream('DB/Recipes.csv')
  .pipe(csv())
  .on('data', (row) => {
    RecipesData.push(row);
  })
  .on('end', () => {
    console.log('Recipe CSV file successfully processed.');
  });

  fs.createReadStream('DB/Ingredients.csv')
  .pipe(csv({ trim: true })) // Use trim option to trim whitespace characters
  .on('data', (row) => {
    IngData.push(row);
  })
  .on('end', () => {
    console.log('Ing CSV file successfully processed.');
  });

  fs.createReadStream('DB/Users.csv')
  .pipe(csv())
  .on('data', (row) => {
    CSVUserData.push(row);
  })
  .on('end', () => {
    console.log('Users CSV file successfully processed.');
  });



//PUG
app.set('view engine', 'pug');
app.set('views', './views/PUG');
app.get('/PAbout', (req, res) => {
  res.render('About');
});
app.get('/', (req, res) => {
  res.render('About');
});
app.get('/PsAbout', (req, res) => {
  res.render('s_About');
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
  // Pass the form data to your CRUD function
  CRUD.InsertToUsersING(formValues, (err, result) => {
    if (err) {
      console.log(err);
      response.status(500).send('Error occurred');
      return;
    }
    response.redirect('/UsrRec1');
  });
  });

  app.get('/UsrRec1', CRUD.FindUsrRecipes)

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

  


// Set up routes

//*********DB
//STARTUP CRUDS
// Create the table when the server starts
CRUD.CreateUserTable(null, {
  render: function (view, data) {
    console.log(data.v1); // Log the result
  },
  status: function (statusCode) {
    // Handle status if needed
  }
});

CRUD.CreateUserINGTable((err, data) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(data); // Log the result
});

CRUD.InsertCSVUsers(null, {
  render: function (view, data) {
  },
  status: function (statusCode) {
    // Handle status if needed
  }
});

CRUD.CreateRecipesTable((err, data) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(data); // Log the result
});

CRUD.InsertCSVRecipes(null, {
  render: function (view, data) {
  },
  status: function (statusCode) {
  }
});

CRUD.CreateRecipesIngredientsTable((err, data) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(data); // Log the result
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
app.get('/See', CRUD.SeeUsrIng)
app.get('/REC', CRUD.FindUsrRecipes)
app.get('/See2', CRUD.SeeUsrRec)
app.get('/See3', CRUD.SeeRecIng)
app.get('/See4', CRUD.SeeRec)
app.get('/DeleteRecipe',CRUD.DeleteRecipes)
app.get('/jontest', (req, res) => {
  CRUD.SelectUSRRec((error, UserRecipes) => {
    if (error) {
      console.error(error);
      response.status(500).send('Error occurred');
      return;
    }
    UserRecipes.render('USR_Recipes', { UserRecipes });
  });
});

//Back Route
app.get('/Back', (req, res) => {
  window.history.back();
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});


