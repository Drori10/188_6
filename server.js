// server.js

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// Create an instance of Express
const app = express();

// Serve static files from the "static" directory
app.use(express.static('static'));

// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Set up routes

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


// Ingrediients Route - GET
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

// Start the server
app.listen(2023, () => {
  console.log('Server is running on http://localhost:2023');
});


//Back Route
app.get('/Back', (req, res) => {
  window.history.back();
});

