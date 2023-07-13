const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const CRUD = require('./DB/CRUD');
const { DB } = require('./DB/DB.config');
const app = express();
const csv = require('csv-parser');
const fs = require('fs'); //for csv data reading

app.use(express.static('static'));

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
  .pipe(csv())
  .on('data', (row) => {
    IngData.push(row);
  })
  .on('end', () => {
    console.log('Ing CSV file successfully processed.');
  });

  fs.createReadStream('DB/Users.csv')
  .pipe(csv())
  .on('data', (row) => {
    IngData.push(row);
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
  res.render('Ingredients', { IngData });
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


app.post('/MyIng', (req, res) => {
  // Retrieve the form data from the request body
  const formValues = req.body;
  
  // Pass the form data to your CRUD function
  CRUD.InsertToUsersING(formValues, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error occurred');
      return;
    }
    
    // Handle the result or send a response back to the client
    res.send('Form submitted successfully');
  });
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

app.post('/NewSignUp',CRUD.InsertNewUser2);
app.get('/ALL',CRUD.SelectAllUsers);
app.get('/DeleteAll', CRUD.DeleteAllUsers);
app.get('/See', CRUD.SeeUsrIng)

// OLD DOESNT WORK
app.post('/OLDSIGNUPNOTGOOD', (req, res) => {
  CRUD.InsertNewUser(req.query, {
    send: function (response) {
      res.render('Ingredients', { IngData });
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


