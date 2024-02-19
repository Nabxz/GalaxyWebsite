
//==================================================================//

const articlesArray = [
    {
        id: 1,
        img: "../assets/images/Articles/secret-of-mars/articles-thumbnail.webp",
        minRead: 6,
        date: "Feb 06, 2024",
        title: "Mars Mysteries Unleashed",
        webPage: "./articles/secret-of-mars.html"
    },
    {
        id: 2,
        img: "../assets/images/Articles/apollo-11/articles-thumbnail.webp",
        minRead: 11,
        date: "Feb 07, 2024",
        title: "Moonbound: Apollo 11's Perilous Odyssey",
        webPage: "./articles/apollo-11.html"
    },
    {
        id: 3,
        img: "../assets/images/Articles/milky-way/articles-thumbnail.webp",
        minRead: 9,
        date: "Feb 07, 2024",
        title: "Navigating the Milky Way: Our Place in the Galaxy",
        webPage: "./articles/milky-way.html"
    },
    {
        id: 4,
        img: "../assets/images/Articles/rainforest/articles-thumbnail.webp",
        minRead: 8,
        date: "Feb 08, 2024",
        title: "The Hidden Marvels of the Amazon Rainforest",
        webPage: "./articles/rainforest.html"
    },
    {
        id: 5,
        img: "../assets/images/Articles/secrets-of-the-sun/articles-thumbnail.webp",
        minRead: 12,
        date: "Feb 08, 2024",
        title: "The Secrets of the Sun: Understanding Our Star",
        webPage: "./articles/secrets-of-the-sun.html"
    },
    {
        id: 6,
        img: "../assets/images/Articles/black-holes/articles-thumbnail.webp",
        minRead: 17,
        date: "Feb 08, 2024",
        title: "The Role of Black Holes in the Universe",
        webPage: "./articles/black-holes.html"
    },
    {
        id: 7,
        img: "../assets/images/Articles/space-exploration/articles-thumbnail.webp",
        minRead: 9,
        date: "Feb 09, 2024",
        title: "The Future of Space Exploration",
        webPage: "./articles/space-exploration.html"
    },
    {
        id: 8,
        img: "../assets/images/Articles/asteroids/articles-thumbnail.webp",
        minRead: 12,
        date: "Feb 09, 2024",
        title: "Asteroids, Comets, and the Origins of the Solar System",
        webPage: "./articles/asteroids.html"
    }
];

// Whats Trending
const trendingIds = [5, 6, 2, 4]; 
let currentFilter = 'all';

document.getElementById('all-articles').addEventListener('click', function() {
    currentFilter = 'all';
    setActiveFilter(this); // Set the active filter to 'All'
    populateArticles(articlesArray);
});

document.getElementById('trending').addEventListener('click', function() {
    currentFilter = 'trending';
    setActiveFilter(this); // Set the active filter to 'Trending'
    let trendingArticles = articlesArray.filter(article => trendingIds.includes(article.id));
    trendingArticles.sort((a, b) => a.id - b.id); // Assuming you want ascending order based on your last modification
    populateArticles(trendingArticles);
});

document.getElementById('my-list').addEventListener('click', function() {
    currentFilter = 'my-list';
    setActiveFilter(this); // Set the active filter to 'My List'
    let mySavedArticles = articlesArray.filter(article => savedArticles.includes(article.id));
    populateArticles(mySavedArticles);
});

function setActiveFilter(selectedElement) {
    // Remove 'active-article' class from all filter options
    document.querySelectorAll('.article-page-filter-container-filters div').forEach(filter => {
        filter.classList.remove('active-article');
    });

    // Add 'active-acheckLoginpopulateArticlesrticle' class to the clicked filter option
    selectedElement.classList.add('active-article');
}

let savedArticles = []; // This array will hold the ids of saved articles

function fetchSavedArticles() {
    return fetch('http://127.0.0.1:3000/wishlist', {
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Store the ids of the saved articles
            savedArticles = data.wishlist.map(item => item.product_id);
            if (currentFilter === 'my-list') {
                let mySavedArticles = articlesArray.filter(article => savedArticles.includes(article.id));
                populateArticles(mySavedArticles);
            } else {
                populateArticles(articlesArray); // Re-populate articles with saved state
            }
        }
    })
    .catch(error => {
        console.error('Error fetching saved articles:', error);
    });
}

function checkUserLoggedIn() {
    return fetch('http://127.0.0.1:3000/checkLogin', {
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => data.loggedIn)
    .catch(error => {
        console.error('Error checking login status:', error);
        return false;
    });
}



fetchSavedArticles();
populateArticles(articlesArray);

// Call this function to initially populate the articles based on the savedArticles array
function initialPopulate() {
    if (currentFilter === 'my-list') {
        let mySavedArticles = articlesArray.filter(article => savedArticles.includes(article.id));
        populateArticles(mySavedArticles);
    } else {
        // If it's not 'my-list', call the populateArticles with the full array or any other filter you have
        populateArticles(articlesArray);
    }
}

// Call this function once you have fetched and set your savedArticles array from your API
fetchSavedArticles().then(() => {
    // This will now work because fetchSavedArticles returns a promise.
    initialPopulate();
});

document.getElementById('sort').addEventListener('change', function() {
    const sortBy = this.value;
    let articlesToSort = [];

    if (currentFilter === 'all') {
        articlesToSort = articlesArray.slice(); // Clone all articles if filter is 'All'
    } else if (currentFilter === 'trending') {
        articlesToSort = articlesArray.filter(article => trendingIds.includes(article.id)); // Filter for trending articles
    } else if (currentFilter === 'my-list') {
        articlesToSort = articlesArray.filter(article => savedArticles.includes(article.id)); // Filter for saved articles
    }

    // Sorting logic based on the selected option
    switch (sortBy) {
        case 'date-latest':
            articlesToSort.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'date-oldest':
            articlesToSort.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'time-long':
            articlesToSort.sort((a, b) => b.minRead - a.minRead);
            break;
        case 'time-short':
            articlesToSort.sort((a, b) => a.minRead - b.minRead);
            break;
    }

    populateArticles(articlesToSort); // Populate the articles based on the current filter and sort order
});


// Modify the populateArticles function to accept an array as an argument
function populateArticles(sortedArray) {
    const articlesContainer = document.getElementById('articles-container');
    let articlesHTML = '';

    if (currentFilter === 'my-list' && savedArticles.length === 0) {
        checkUserLoggedIn().then(isLoggedIn => {
            if (isLoggedIn) {
                // User is logged in but has no saved articles
                articlesContainer.innerHTML = `
                    <div class="empty-list-message">
                        <p>Your saved articles list is currently empty. Explore our articles and save your favorites.</p>
                    </div>
                `;
            } else {
                // User is not logged in
                articlesContainer.innerHTML = `
                    <div class="sign-in-message">
                        <p>Please <a href="./sign-in-page.html">sign in</a> to view your saved articles list.</p>
                    </div>
                `;
            }
        });
        return; // Stop the function from running further
    }

    // Continue with the normal flow if the user is signed in
    sortedArray.forEach(article => {
        // Check if the article is saved
        const isSaved = savedArticles.includes(article.id);
        const saveButtonImage = isSaved ? "../assets/images/Articles/save-icon-active.webp" : "../assets/images/Articles/save-icon.webp";

        articlesHTML += `
            <div class="articles">
                <div class="articles-image">
                    <button class="save-button" data-article-id="${article.id}" data-saved="${isSaved}">
                        <img src="${saveButtonImage}" alt="save button">
                    </button>
                    <p class="min-read">${article.minRead} min read</p>
                    <a href="${article.webPage}" class="articles-link">
                        <img src="${article.img}" alt="poster-image" class="poster-image">
                    </a>
                </div>
                <a href="${article.webPage}" class="articles-link">
                    <div class="article-content">
                        <p class="date">${article.date}</p>
                        <p class="title">${article.title}</p>
                    </div>
                </a>
                <a href="${article.webPage}" class="read-article">Read Article →</a>
            </div>
        `;
    });

    articlesContainer.innerHTML = articlesHTML;


    // Add event listeners for the save buttons
    document.querySelectorAll('.save-button').forEach(button => {
        button.addEventListener('click', function() {
            const articleId = parseInt(this.getAttribute('data-article-id'));
            const isSaved = savedArticles.includes(articleId);
            if (isSaved) {
                // Remove the article from the saved articles
                removeFromWishlist(articleId, this);
            } else {
                // Save the article to the wishlist
                saveArticleToWishlist(articleId, this);
            }
        });
    });
}

// Function to save an article to the wishlist
function saveArticleToWishlist(articleId, buttonElement) {
    fetch('http://127.0.0.1:3000/wishlist/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId: articleId }),
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 403) {
                // Instead of redirecting, show a popup message prompting to sign in
                showPopupMessage('Please sign in to save articles to your list.', true);
            } else {
                throw new Error('Failed to save article to your list');
            }
        } else {
            return response.json();
        }
    })
    .then(data => {
        if (data && data.success) {
            // Change the image to the active icon
            buttonElement.querySelector('img').src = "../assets/images/Articles/save-icon-active.webp";
            // Set the data-saved attribute to true
            buttonElement.setAttribute('data-saved', 'true');
            // Add the id to the savedArticles array
            savedArticles.push(articleId);
            // Show a success message
            showPopupMessage('Article saved to your list', false);
        } else if (data) {
            // If there is a data object but the save wasn't successful
            showPopupMessage('Failed to save article to your list', true);
        }
    })
    .catch(error => {
        // Show the error message from the catch block
        showPopupMessage(error.message, true);
    });
}


function removeFromWishlist(articleId, buttonElement) {
    // Remove the article from the server's wishlist
    fetch('http://127.0.0.1:3000/wishlist/remove', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId: articleId }),
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Change the image to the inactive icon
            buttonElement.querySelector('img').src = "../assets/images/Articles/save-icon.webp";
            // Set the data-saved attribute to false
            buttonElement.setAttribute('data-saved', 'false');
            // Remove the id from the savedArticles array
            savedArticles = savedArticles.filter(id => id !== parseInt(articleId));
            // Show a popup message
            showPopupMessage('Article removed from wishlist', false);
        }
    })
    .catch(error => {
        showPopupMessage(error.message, true);
    });
}


// ===============================/ ARTICLES POPULATION /===

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

document.querySelector('.back-button button').addEventListener('click', function () {
    window.history.back(); // Use the browser's history stack to go back
});

// ===============================/ SEARCH BAR /===

// POPUP MESSAGE
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

// ===============================/ POPUP MESSAGE /===

// SWITCH LIST/GRID MODE

document.addEventListener('DOMContentLoaded', function () {
    var viewModeSelect = document.getElementById('view-mode');
    var articlesContainer = document.getElementById('articles-container');

    viewModeSelect.addEventListener('change', function () {
        if (this.value === 'grid') {
            articlesContainer.classList.add('grid-view');
            articlesContainer.classList.remove('list-view');
        } else if (this.value === 'list') {
            articlesContainer.classList.add('list-view');
            articlesContainer.classList.remove('grid-view');
        }
    });
});


// ===============================/ SWITCH LIST/GRID MODE /===

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
