
//==================================================================//

// SEARCH BAR


// Event listener for search input
document.querySelector('.planet-search-input').addEventListener('input', function (e) {
    const userInput = e.target.value;

    // Check if user input is not empty
    if (userInput.length > 0) {
        // Add the 'search-active' class when user starts typing
        document.querySelector('.planet-search-container').classList.add('planet-search-active');
        searchPlanets(userInput); // Function to search planets
    } else {
        // Remove the 'search-active' class when input is empty
        document.querySelector('.planet-search-container').classList.remove('planet-search-active');
    }
});

// Function to search planets using the API
function searchPlanets(query) {
  // Update the URL to point to your server's endpoint
  const serverApiURL = 'http://127.0.0.1:3000/api/planets/search?name=' + encodeURIComponent(query);


  $.ajax({
      method: 'GET',
      url: serverApiURL,
      contentType: 'application/json',
      success: function (result) {
          displaySearchResults(result); // Function to display results
      },
      error: function ajaxError(jqXHR) {
          console.error('Error: ', jqXHR.responseText);
      }
  });
}

// Function to display search results
function displaySearchResults(results) {
    const resultsContainer = document.createElement('div');
    resultsContainer.id = 'all-planet-search-results';

    results.forEach(planet => {
        const planetElement = document.createElement('div');
        planetElement.textContent = planet.name;
        planetElement.addEventListener('click', function () {
            window.location.href = `./planet-viewer-page.html?planet=${planet.name}`;
        });
        resultsContainer.appendChild(planetElement);
    });

    // Append results container below the search bar or replace the existing one
    const oldResults = document.getElementById('all-planet-search-results');
    if (oldResults) {
        document.querySelector('.planet-search-container').replaceChild(resultsContainer, oldResults);
    } else {
        document.querySelector('.planet-search-container').appendChild(resultsContainer);
    }

    if (results.length === 0) {
        // If there are no results, remove the 'search-active' class
        document.querySelector('.planet-search-container').classList.remove('planet-search-active');
    }
}


function hideSearchResults() {
    document.querySelector('.planet-search-container').classList.remove('planet-search-active');
    const resultsContainer = document.getElementById('all-planet-search-results');
    if (resultsContainer) {
        resultsContainer.remove();
    }
}

// Add event listener to hide search results when clicking outside
document.addEventListener('click', function (event) {
    if (!event.target.closest('.planet-search-container')) {
        hideSearchResults();
    }
});

document.querySelector('.back-button button').addEventListener('click', function() {
  window.history.back(); // Use the browser's history stack to go back
});

document.addEventListener('DOMContentLoaded', function() {
  // Select the back-to-top link
  var backToTopButton = document.querySelector('.back-to-top a');

  // Listen for a click event on the back-to-top link
  backToTopButton.addEventListener('click', function(e) {
      // Prevent the default anchor action
      e.preventDefault();

      // Smoothly scroll to the top of the page
      window.scrollTo({
          top: 0,
          behavior: 'smooth'
      });
  });
});

// ===============================/ SEARCH BAR /===

// TOGGLE ELEMENTS

function toggleVisibility(element) {
    var data = element.nextElementSibling;
    if (data.style.maxHeight) {
        data.style.maxHeight = null;
        element.parentNode.classList.remove('expanded'); // Remove the expanded class
    } else {
        data.style.maxHeight = data.scrollHeight + "px";
        element.parentNode.classList.add('expanded'); // Add the expanded class to rotate the arrow
    }
}

// ===============================/ TOGGLE ELEMENTS /===

// SOLAR SYSTEM 3D SIMULATION

const viz = new Spacekit.Simulation(document.getElementById('space-simulation'), {
    basePath: 'https://typpo.github.io/spacekit/src',
    jdPerSecond: 6,
  });
  
  // Create a background using Yale Bright Star Catalog data.
  viz.createStars();
  
  // Create our first object - the sun - using a preset space object with a label.
  viz.createObject('sun', {
    ...Spacekit.SpaceObjectPresets.SUN,
  });
  
  // Then add some planets with labels
  viz.createObject('mercury', {
    ...Spacekit.SpaceObjectPresets.MERCURY,
  });
  viz.createObject('venus', {
    ...Spacekit.SpaceObjectPresets.VENUS,
  });
  viz.createObject('earth', {
    ...Spacekit.SpaceObjectPresets.EARTH,
  });
  viz.createObject('mars', {
    ...Spacekit.SpaceObjectPresets.MARS,
  });
  viz.createObject('jupiter', {
    ...Spacekit.SpaceObjectPresets.JUPITER,
  });
  viz.createObject('saturn', {
    ...Spacekit.SpaceObjectPresets.SATURN,
  });
  viz.createObject('uranus', {
    ...Spacekit.SpaceObjectPresets.URANUS,
  });
  viz.createObject('neptune', {
    ...Spacekit.SpaceObjectPresets.NEPTUNE,
  });
  
// ===============================/ SOLAR SYSTEM 3D SIMULATION /===

// SUCCESS POPUP & NEWSLETTER

document.getElementById('newsletter-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way
  
    var email = document.getElementById('newsletter-email').value;
    if (email) { // Simple validation here, you can add more
      showPopupMessage("Confirmation Email Sent To " + email, false);
    } else {
      showPopupMessage("Please enter a valid email address.", true);
    }
  });
  
  function showPopupMessage(message, isError) {
    // Create the popup if it doesn't exist
    var popup = document.getElementById('popup-message');
    if (!popup) {
      popup = document.createElement('div');
      popup.id = 'popup-message';
      document.body.appendChild(popup);
    }
  
    // Set the message and styles
    popup.textContent = message;
    popup.style.position = 'fixed';
    popup.style.bottom = '20px';
    popup.style.right = '20px';
    popup.style.backgroundColor = isError ? 'red' : 'green';
    popup.style.color = 'white';
    popup.style.padding = '10px';
    popup.style.paddingLeft = '50px';
    popup.style.textAlign = 'right';
    popup.style.borderRadius = '5px';
    popup.style.zIndex = '1000';
    popup.style.display = 'block';
  
    // Remove the popup after 5 seconds
    setTimeout(function () {
      popup.style.display = 'none';
    }, 5000);
  }
  
  // ===============================/ SUCCESS POPUP & NEWSLETTER /===