// script.js

// Get the form element
const ingredientsForm = document.getElementById('ingredients-form');

// Handle form submission
ingredientsForm.addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the form from submitting

  // Get the entered ingredients
  const ingredientsInput = document.getElementById('ingredients-input');
  const enteredIngredients = ingredientsInput.value.trim();

  // Call the function to update ingredient inventory and get suggestions
  const suggestions = updateInventory(enteredIngredients);

  // Display the suggestions dynamically
  displaySuggestions(suggestions);
});

// Function to update ingredient inventory and get suggestions
function updateInventory(enteredIngredients) {
  // Code to update ingredient inventory based on the entered ingredients
  // and retrieve suggestions based on available ingredients
  
  // Dummy data for demonstration
  const suggestions = [
    { name: 'Chicken Stir-Fry', image: 'chicken-stir-fry.jpg' },
    { name: 'Pasta Carbonara', image: 'pasta-carbonara.jpg' },
    { name: 'Vegetable Curry', image: 'vegetable-curry.jpg' }
  ];

  return suggestions;
}

// Function to display the suggestions dynamically
function displaySuggestions(suggestions) {
  const suggestionsContainer = document.createElement('div');
  suggestionsContainer.classList.add('suggestions-container');

  for (const suggestion of suggestions) {
    const dishCard = document.createElement('div');
    dishCard.classList.add('dish-card');

    const dishImage = document.createElement('img');
    dishImage.src = suggestion.image;
    dishImage.alt = suggestion.name;

    const dishName = document.createElement('h3');
    dishName.textContent = suggestion.name;

    dishCard.appendChild(dishImage);
    dishCard.appendChild(dishName);
    suggestionsContainer.appendChild(dishCard);
  }

  const mainContent = document.querySelector('main');
  mainContent.appendChild(suggestionsContainer);
}
