// Function to set night mode
function setNightMode() {
    document.documentElement.classList.add('night-mode');
    localStorage.setItem('nightMode', 'true');
  }
  
  // Function to set day mode
  function setDayMode() {
    document.documentElement.classList.remove('night-mode');
    localStorage.setItem('nightMode', 'false');
  }
  
  // Function to toggle night mode
  function toggleNightMode() {
    const isNightMode = document.documentElement.classList.contains('night-mode');
    
    if (isNightMode) {
      setDayMode();
    } else {
      setNightMode();
    }
  }
  
  // Check if night mode preference is stored
  const isNightModeStored = localStorage.getItem('nightMode');
  
  // Apply night mode if preference exists
  if (isNightModeStored === 'true') {
    setNightMode();
  }

  

  
  
  
  
  
  
  