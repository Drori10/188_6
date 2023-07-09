const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const CRUD = require('./DB/CRUD');
const { DB } = require('./DB/DB.config');
const app = express();

// Serve static files from the "static" directory
app.use(express.static('static'));

// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

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
  res.sendFile(path.join(__dirname, 'views', 'SignIn.html'));
});

// Home page route
app.get('/About', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'About.html'));
});

//Sign In Route - GET
app.get('/SignIn', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'SignIn.html'));
});
//Sign In Route - POST
app.post('/SignIn', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'SignIn.html'));
});

//Sign Up Route - GET
app.get('/SignUp', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'SignUp.html'));
});
//Sign Up Route - POST
app.post('/SignUp', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'SignUp.html'));
});

// Ingredients Route - GET
app.get('/Ingredients', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'Ingredients.html'));
});
// Ingrediients Route - POST
app.post('/Ingredients', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'Ingredients.html'));
});

//Recipe Route - GET
app.get('/Recipes', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'Recipes.html'));
});
//Recipe Route - POST
app.post('/Recipes', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'Recipes.html'));
});

//Back Route
app.get('/Back', (req, res) => {
  window.history.back();
});

// Start the server
app.listen(2023, () => {
  console.log('Server is running on http://localhost:2023');
});


