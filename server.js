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

// Home page route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'SignIn.html'));
});

//Sign In Route
app.get('/SignIn.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'SignIn.html'));
});

//Sign Up Route
app.post('/SignUp', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'SignUp.html'));
});

// Sign in to Ingredients Route
app.post('/Ingredients', (req, res) => {
  // Retrieve the submitted form data
  res.sendFile(path.join(__dirname, 'views', 'Ingredients.html'));
});

//Recipe Route
app.post('/Recipes', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'Recipes.html'));
});

// Start the server
app.listen(2023, () => {
  console.log('Server is running on http://localhost:2023');
});
