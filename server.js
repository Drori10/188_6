const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const CRUD = require('./DB/CRUD');
const { DB } = require('./DB/DB.config');
const app = express();

const csv = require('csv-parser');
const fs = require('fs');

// Serve static files from the "static" directory
app.use(express.static('static'));

// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

//DB shit
const RecipesData = [];

fs.createReadStream('DB/Recipes.csv')
  .pipe(csv())
  .on('data', (row) => {
    RecipesData.push(row);
  })
  .on('end', () => {
    console.log('CSV file successfully processed.');
    // Continue with rendering the Pug template or processing the data
  });

  app.get('/showdata', (req, res) => {
    res.render('showdata', { RecipesData });
  });
  app.get('/test', (req, res) => {
    res.render('RTemplate', { RecipesData });
  });



//PUG
app.set('view engine', 'pug');
app.set('views', './views/PUG');
app.get('/PAbout', (req, res) => {
  res.render('About');
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
  res.render('Ingredients');
});
app.post('/PIngredients', (req, res) => {
  res.render('Ingredients');
});
app.get('/PRecipes', (req, res) => {
  res.render('Recipes');
});
app.post('/PRecipes', (req, res) => {
  res.render('Recipes');
});


// Set up routes

//*********DB
// Create the table when the server starts
CRUD.CreateUserTable(null, {
  render: function (view, data) {
    console.log(data.v1); // Log the result
  },
  status: function (statusCode) {
    // Handle status if needed
  }
});

// Handle form submission and redirect to '/ingredients'
app.post('/NewSignUp', (req, res) => {
  CRUD.InsertNewUser(req.body, {
    send: function (response) {
      res.redirect('/Ingredients');
    },
    status: function (statusCode) {
      // Handle status if needed
    }
  }); 
});
app.get('/selectAll', CRUD.SelectAllUsers)

// Start page route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/html', 'SignIn.html'));
});

// Home page route
app.get('/About', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/html', 'About.html'));
});

//Sign In Route - GET
app.get('/SignIn', (req, res) => {
  let userExists = false;




  res.sendFile(path.join(__dirname, 'views/html', 'SignIn.html'));
});
//Sign In Route - POST
app.post('/SignIn', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/html', 'SignIn.html'));
});

//Sign Up Route - GET
app.get('/SignUp', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/html', 'SignUp.html'));
});
//Sign Up Route - POST
app.post('/SignUp', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/html', 'SignUp.html'));
});

// Ingredients Route - GET
app.get('/Ingredients', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/html', 'Ingredients.html'));
});
// Ingrediients Route - POST
app.post('/Ingredients', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/html', 'Ingredients.html'));
});

//Recipe Route - GET
app.get('/Recipes', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/html', 'Recipes.html'));
});
//Recipe Route - POST
app.post('/Recipes', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/html', 'Recipes.html'));
});

//Back Route
app.get('/Back', (req, res) => {
  window.history.back();
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});


