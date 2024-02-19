
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

// MY ACCOUNT


// DOM elements
const accountDisplayElement = document.getElementById('my-account-display');
const sidebarLinks = document.querySelectorAll('.sidebar-link');

// Event listener for sidebar links
sidebarLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const href = link.getAttribute('href');

        // Remove active class from all links and then add to the clicked one
        sidebarLinks.forEach(l => l.classList.remove('my-account-sidebar-active'));
        link.classList.add('my-account-sidebar-active');

        switch (href) {
            case '#account-details':
                fetchAndUpdateUserDetails();
                break;
            case '#research':
                fetchAndDisplayUserPlanets();
                break;
            case '#reading-list':
                // Call the function to display the reading list
                fetchAndDisplayReadingList('name-desc');
                break;
            case '#logout':
                logoutUser();
                break;
        }
    });
});

// Function to log out the user
function logoutUser() {
    fetch('http://127.0.0.1:3000/logout', {
        method: 'GET',
        credentials: 'include'
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showPopupMessage('You Successfully Signed Out.', false);
                setTimeout(() => {
                    window.location.href = './sign-in-page.html';
                }, 500);
            } else {
                showPopupMessage('Failed to log out. Please try again.', true);
            }
        })
        .catch(error => {
            console.error('Error logging out:', error);
            showPopupMessage('An error occurred while trying to log out. Please try again later.', true);
        });
}

// Function to fetch and display user planets
function fetchUserPlanets() {
    return fetch('http://127.0.0.1:3000/user-planets', {
        credentials: 'include'
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Return the entire data object, not just data.planets
                return data;
            } else {
                throw new Error('Failed to fetch planets data');
            }
        })
        .catch(error => {
            console.error('Error fetching planets:', error);
            throw error; // Rethrow to handle it in the calling function
        });
}


function sanitizeNoteForDisplay(note) {
    return note.replace(/"/g, '&quot;').replace(/\n/g, ' ');
}

function displayUserPlanets(data, selectedSortOption) {
    let contentHtml;

    if (data.success && data.planets.length > 0) {
        // Create table rows for each planet with the time added
        const rowsHtml = data.planets.map(item => {
            // Format the date for display
            const dateAdded = new Date(item.added_at).toLocaleString();
            // Sanitize the note for use in the onclick handler
            const attributeNote = sanitizeNoteForDisplay(item.note || 'No notes added');
            
            return `<tr>
                <td>${item.planet_name}</td>
                <td>${attributeNote}</td>
                <td>${dateAdded}</td>
                <td>
                    <a href="./planet-viewer-page.html?planet=${encodeURIComponent(item.planet_name)}" class="details-button">Planet Details</a>
                    <button onclick="showEditNoteModal('${item.planet_name}', '${attributeNote}')" class="details-button">Edit Note</button>
                    <button onclick="showConfirmModal('${item.planet_name}')">Delete</button>
                </td>
            </tr>`;
        }).join('');
        
        
    

        // Create the table with headings
        contentHtml = `
        <div class="planet-research-table-container">
            <table>
                <thead>
                    <tr>
                        <th>Planet Name</th>
                        <th>Notes</th>
                        <th>Date Added</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                </tbody>
            </table>
        </div>`;
    } else {
        // Placeholder text for an empty table
        contentHtml = `
        <div class="planet-research-table-container">
            <table>
                <thead>
                    <tr>
                        <th>Planet Name</th>
                        <th>Notes</th>
                        <th>Date Added</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colspan="4" class="placeholder-text">You have not added any research on planets yet.</td>
                    </tr>
                </tbody>
            </table>
        </div>`;
    }

    // Update the page description and insert the HTML into the display element
    const accountDisplayElement = document.getElementById('my-account-display');
    accountDisplayElement.innerHTML = `
    <div class="planet-research-container">
        <h2>Planet Research</h2>
        <h3>Explore and annotate your planetary discoveries.</h3>

        <label for="sort-selector">Sort By:</label>
        <select id="sort-selector">
        <option value="planetName-asc">Planet Name (A to Z)</option>
        <option value="planetName-desc">Planet Name (Z to A)</option>
        <option value="noteLength-asc">Notes Length (Short to Long)</option>
        <option value="noteLength-desc">Notes Length (Long to Short)</option>
        <option value="dateAdded-asc">Date Added (Old to New)</option>
        <option value="dateAdded-desc">Date Added (New to Old)</option>
        </select>

        <div class="research-search-bar">
            <div class="research-input-container">
                <input type="text" id="research-planet-search-input" placeholder="Add A Planet To Your Research Planets" class="research-input-field">
            </div>
        </div>
        ${contentHtml}

        <div class="articles-link-blue-ad">
        <a href="./planets-page.html">Discover Planets Here.</a>
    </div>
    </div>`;

    // Set the selected sort option after rendering the sort selector
    const sortSelector = document.getElementById('sort-selector');
    if (sortSelector && selectedSortOption) {
        sortSelector.value = selectedSortOption;
    }

    // It's assumed these functions setup event listeners for the input field and other interactive elements.
    setupResearchInputListener();
    initializeResearchInputListener();
    setupSortListener();
}

function fetchAndDisplayUserPlanets() {
    fetchUserPlanets()
        .then(planets => {
            displayUserPlanets(planets);
        })
        .catch(error => {
            console.error('Error in fetching and displaying planets:', error);
            // Handle error, e.g., show an error message to the user
        });
}

// Modify the sort listener to pass the selected sort option
function setupSortListener() {
    const sortSelector = document.getElementById('sort-selector');
    sortSelector.addEventListener('change', function () {
        const selectedOption = this.value;
        fetchUserPlanets().then(data => {
            if (data.success) {
                const sortedPlanets = sortPlanets(data.planets, selectedOption);
                // Pass the selected sort option to displayUserPlanets
                displayUserPlanets({ success: true, planets: sortedPlanets }, selectedOption);
            }
        }).catch(error => {
            console.error('Error sorting planets:', error);
        });
    });
}

function sortPlanets(planets, sortBy) {
    return planets.slice().sort((a, b) => {
        switch (sortBy) {
            case 'planetName-asc':
                return a.planet_name.localeCompare(b.planet_name);
            case 'planetName-desc':
                return b.planet_name.localeCompare(a.planet_name);
            case 'noteLength-asc':
                return (a.note || '').length - (b.note || '').length;
            case 'noteLength-desc':
                return (b.note || '').length - (a.note || '').length;
            case 'dateAdded-asc':
                return new Date(a.added_at) - new Date(b.added_at);
            case 'dateAdded-desc':
                return new Date(b.added_at) - new Date(a.added_at);
            default:
                return 0;
        }
    });
}




// Function to query and display planets based on research input
function queryAndDisplayResearchPlanets(query) {
    // Point to your server-side endpoint, ensuring the correct base URL and port
    const searchApiUrl = `http://127.0.0.1:3000/api/planetsv2?name=${encodeURIComponent(query)}`;

    $.ajax({
        method: 'GET',
        url: searchApiUrl,
        contentType: 'application/json',
        success: function (results) {
            displayResearchResults(results); // Function to display the search results
        },
        error: function ajaxError(jqXHR) {
            console.error('Error: ', jqXHR.responseText);
        }
    });
}



// Function to display the search results
function displayResearchResults(results) {
    let resultsContainer = document.getElementById('research-results-container');
    if (!resultsContainer) {
        resultsContainer = document.createElement('div');
        resultsContainer.id = 'research-results-container';
        document.querySelector('.research-input-container').appendChild(resultsContainer);
    } else {
        resultsContainer.innerHTML = ''; // Clear previous results
    }

    if (results && results.length > 0) {
        results.forEach(planet => {
            const planetElement = document.createElement('div');
            planetElement.className = 'planet-result';
            planetElement.innerHTML = `<span class="planet-name">${planet.name}</span><span class="add-planet"> + </span>`;
            planetElement.querySelector('.planet-name').addEventListener('click', () => addPlanetPrompt(planet.name));
            resultsContainer.appendChild(planetElement);
        });
        resultsContainer.style.display = 'block';
    } else {
        resultsContainer.textContent = 'No planets found.';
    }
}

// Function to show the edit note modal
function showEditNoteModal(planetName, note) {
     // Escape single quotes in planetName
     const escapedPlanetName = planetName.replace(/'/g, "\\'");

     // The rest of your code...
    const modalHtml = `
        <div id="edit-note-modal" class="modal-backdrop">
            <div class="modal-content">
                <span class="modal-close-button" onclick="closeModal('edit-note-modal')">&times;</span>
                <h2>Edit Note for ${escapedPlanetName}</h2>
                <textarea id="edit-note-text" rows="4" cols="50">${note}</textarea>
                <br>
                <button class="modal-button" onclick="saveNote('${escapedPlanetName}')">Save</button>
                <button class="delete-modal-button" onclick="closeModal('edit-note-modal')">Cancel</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.getElementById('edit-note-modal').style.display = 'block';
}


function sanitizeNoteForServer(note) {
    return note
        // Replace newline characters with space
        .replace(/\r?\n|\r/g, ' ')
        // Escape double quotes
        .replace(/"/g, '\\"')
        // Replace special characters with HTML entities
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        // Ensure non-ASCII characters are properly handled; 
        // this is generally not necessary if your page and server handle UTF-8.
}


function saveNote(planetName) {
    let updatedNote = document.getElementById('edit-note-text').value.trim();
    let sanitizedNote = sanitizeNoteForServer(updatedNote);

    // Call the API to update the note on the server
    fetch('http://127.0.0.1:3000/update-note', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ planetName, note: sanitizedNote }),
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showPopupMessage('Note updated successfully', false);
            closeModal('edit-note-modal');
            fetchAndDisplayUserPlanets();
        } else {
            showPopupMessage('Failed to update note', true);
        }
    })
    .catch(error => {
        showPopupMessage('Error updating note: ' + error.message, true);
    });
}






// Function to show note input
function showNoteInput(planetName) {
    // Replace the modal content with a form for the note
    const modalContent = document.querySelector('.modal-content');
    modalContent.innerHTML = `
        <span class="modal-close-button">&times;</span>
        <p>Add a note for ${planetName}:</p>
        <textarea id="note-text" rows="4" cols="50" placeholder="Type your note here..."></textarea>
        <br><button class="modal-button" id="submit-note" onclick="addPlanet('${planetName}', true)">Submit Note</button>
    `;

    // Close modal on close button click
    modalContent.querySelector('.modal-close-button').addEventListener('click', () => {
        const noteModal = document.getElementById('note-modal');
        noteModal.style.display = 'none';
        noteModal.remove();
    });
}


function addPlanet(planetName, withNote) {
    const data = { planetName, note: withNote ? document.getElementById('note-text').value : '' };

    fetch('http://127.0.0.1:3000/add-planet', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: 'include' // Make sure credentials include cookies and session if needed
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                showPopupMessage('Planet added successfully', false);
                // Close the modal
                const noteModal = document.getElementById('note-modal');
                if (noteModal) {
                    noteModal.remove();
                }
                // Refresh the planet list
                fetchAndDisplayUserPlanets();
            } else {
                showPopupMessage(data.message, true);
            }
        })
        .catch(error => {
            showPopupMessage(error.message, true);
        });
}


function showConfirmModal(planetName) {
    // Create the modal HTML
    const modalHtml = `
        <div id="confirm-modal" class="modal-backdrop">
            <div class="modal-content">
                <span class="modal-close-button" onclick="closeModal('confirm-modal')">&times;</span>
                <p>Are you sure you want to delete ${planetName}?</p>
                <button class="delete-modal-button" onclick="removePlanet('${planetName}')">Yes</button>
                <button class="modal-button" onclick="closeModal('confirm-modal')">No</button>
            </div>
        </div>
    `;

    // Add the modal to the body
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    // Show the modal
    document.getElementById('confirm-modal').style.display = 'block';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.remove();
    }
}


function removePlanet(planetName) {
    fetch('http://127.0.0.1:3000/remove-planet', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ planetName }),
        credentials: 'include'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // Close the modal before showing the success message and refreshing the list
                closeModal('confirm-modal');
                showPopupMessage('Planet removed successfully', false);
                // Refresh the planet list
                fetchAndDisplayUserPlanets();
            } else {
                showPopupMessage(data.message, true);
            }
        })
        .catch(error => {
            showPopupMessage(error.message, true);
        });
}





// Function to add planet without a note
function addPlanetPrompt(planetName) {
    // Create and show the modal here
    const modalHtml = `
        <div id="note-modal" class="modal-backdrop">
            <div class="modal-content">
                <span class="modal-close-button">&times;</span>
                <p>Do you want to add a note for ${planetName}?</p>
                <button class="modal-button" onclick="addPlanet('${planetName}', false)">Add without note</button>
                <button class="modal-button" onclick="showNoteInput('${planetName}')">Add with note</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const noteModal = document.getElementById('note-modal');
    noteModal.style.display = 'block';

    // Make sure to select the newly added modal close button
    document.querySelector('#note-modal .modal-close-button').addEventListener('click', () => {
        noteModal.style.display = 'none';
        noteModal.remove();
    });
}


// Function to fetch user details and update the account details HTML
function fetchAndUpdateUserDetails() {
    fetch('http://127.0.0.1:3000/user-details', {
        credentials: 'include' // Needed to include the session cookie
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {

                const greeting = getGreeting();

                // Build the HTML for the account details using the fetched data
                const accountDetailsHtml = `
                <div class="account-details-container">
                    <h2>Account Information</h2>
                    <h3>${greeting}, ${data.firstName} ${data.lastName}</h3>

                    <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
                    <p><strong>Email:</strong> ${data.email}</p>
                    <button id="change-email-btn">Change Email</button>
                    <button id="change-password-btn">Change Password</button>
                    <button id="change-name-btn">Change Name</button>

                    <div id="change-account-details-div"></div>
                </div>`;

                // Insert the HTML into the my-account-display element
                const accountDisplayElement = document.getElementById('my-account-display');
                accountDisplayElement.innerHTML = accountDetailsHtml;

                // Add event listeners for the buttons (change email, change password, change name)
                document.getElementById('change-email-btn').addEventListener('click', function () {
                    displayEmailChangeForm();
                });

                document.getElementById('change-password-btn').addEventListener('click', function () {
                    displayPasswordChangeForm();
                });

                document.getElementById('change-name-btn').addEventListener('click', function () {
                    displayNameChangeForm();
                });

                // Function to display email change form
                function displayEmailChangeForm() {
                    const emailFormHtml = `
                    <h4>Change Email</h4>
                    <form id="email-change-form">
                        <input type="email" id="old-email" placeholder="Old Email" required>
                        <input type="email" id="new-email" placeholder="New Email" required>
                        <input type="email" id="confirm-new-email" placeholder="Confirm New Email" required>
                        <br><button type="submit">Update Email</button>
                    </form>`;
                    document.getElementById('change-account-details-div').innerHTML = emailFormHtml;
                    document.getElementById('email-change-form').addEventListener('submit', handleEmailChange);
                }

                // Function to display password change form
                function displayPasswordChangeForm() {
                    const passwordFormHtml = `
                    <h4>Change Password</h4>
                    <form id="password-change-form">
                        <input type="password" id="old-password" placeholder="Old Password" required>
                        <input type="password" id="new-password" placeholder="New Password" required>
                        <input type="password" id="confirm-new-password" placeholder="Confirm New Password" required>
                        <br><button type="submit">Update Password</button>
                    </form>`;
                    document.getElementById('change-account-details-div').innerHTML = passwordFormHtml;
                    document.getElementById('password-change-form').addEventListener('submit', handlePasswordChange);
                }

                // Function to display name change form
                function displayNameChangeForm() {
                    const nameFormHtml = `
                    <h4>Change Name</h4>
                    <form id="name-change-form">
                        <input type="text" id="new-first-name" placeholder="New First Name" required>
                        <input type="text" id="new-last-name" placeholder="New Last Name" required>
                        <br><button type="submit">Update Name</button>
                    </form>`;
                    document.getElementById('change-account-details-div').innerHTML = nameFormHtml;
                    document.getElementById('name-change-form').addEventListener('submit', handleNameChange);
                }

                // Handle email change submission
                function handleEmailChange(event) {
                    event.preventDefault();
                    const oldEmail = document.getElementById('old-email').value;
                    const newEmail = document.getElementById('new-email').value;
                    const confirmNewEmail = document.getElementById('confirm-new-email').value;

                    if (newEmail !== confirmNewEmail) {
                        showPopupMessage('New emails do not match.', true);
                        return;
                    }

                    // Add validation and send the update to the server
                    updateUserDetails('/change-email', { oldEmail, newEmail });
                }

                // Handle password change submission
                function handlePasswordChange(event) {
                    event.preventDefault();
                    const oldPassword = document.getElementById('old-password').value;
                    const newPassword = document.getElementById('new-password').value;
                    const confirmNewPassword = document.getElementById('confirm-new-password').value;

                    if (newPassword !== confirmNewPassword) {
                        showPopupMessage('New passwords do not match.', true);
                        return;
                    }
                    // Add validation and send the update to the server
                    updateUserDetails('/change-password', { oldPassword, newPassword });
                }

                // Handle name change submission
                function handleNameChange(event) {
                    event.preventDefault();
                    const newFirstName = document.getElementById('new-first-name').value;
                    const newLastName = document.getElementById('new-last-name').value;
                    // Add validation and send the update to the server
                    updateUserDetails('/change-name', { newFirstName, newLastName });
                }

                // Function to update user details, generalized for different update actions
                function updateUserDetails(apiEndpoint, updateData) {
                    fetch('http://127.0.0.1:3000' + apiEndpoint, {
                        method: 'POST', // POST method for updating data
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(updateData),
                    })
                        .then(response => response.json()) // Convert the response to JSON
                        .then(data => {
                            if (data.success) {
                                showPopupMessage('Your details have been successfully updated.', false); // Show success message
                                fetchAndUpdateUserDetails(); // Refresh the user details
                            } else {
                                // Show a more specific error message based on the response
                                if (data.message.includes('Old email does not match')) {
                                    showPopupMessage('The current email you entered does not match our records. Please try again.', true);
                                } else if (data.message.includes('Old password does not match')) {
                                    showPopupMessage('The current password you entered is incorrect. Please try again.', true);
                                } else {
                                    // Fallback for other errors
                                    showPopupMessage('An error occurred while updating your details: ' + data.message, true);
                                }
                            }
                        })
                        .catch(error => {
                            console.error('Error updating user details:', error);
                            showPopupMessage('An unexpected error occurred while updating your details. Please try again later.', true);
                        });
                }

            } else {
                console.error('Failed to retrieve user details:', data.message);
                // Handle not logged in or other failures
            }
        })
        .catch(error => {
            console.error('Error fetching user details:', error);
        });
}

function getGreeting() {
    const now = new Date();
    const hour = now.getHours();
    if (hour < 12) {
        return "Good morning";
    } else if (hour < 18) {
        return "Good afternoon";
    } else {
        return "Good evening";
    }
}

// Setup listener function
function setupResearchInputListener() {
    const researchInput = document.getElementById('research-planet-search-input');
    if (researchInput) {
        // Remove previous listeners to avoid duplicates
        researchInput.removeEventListener('input', handleResearchInput);
        // Add new listener
        researchInput.addEventListener('input', handleResearchInput);
    } else {
        console.error('Search input field not found in the DOM');
    }
}


function handleResearchInput(e) {
    const researchQuery = e.target.value.trim();
    if (researchQuery.length > 0) {
        queryAndDisplayResearchPlanets(researchQuery);
    } // Do not hide results when input is empty or on outside click
}


// Function to hide search results
function removeResearchResultsVisibility() {
    const searchResultsDiv = document.getElementById('research-results-container');
    if (searchResultsDiv) {
        searchResultsDiv.style.display = 'none'; // Hide the search results container
        searchResultsDiv.innerHTML = ''; // Clear the search results
    }
}


// Function to dynamically set up the search input listener
function initializeResearchInputListener() {
    const searchInput = document.getElementById('research-planet-search-input');
    if (searchInput) {
        // Remove any previous event listeners to avoid duplicates
        searchInput.removeEventListener('input', processResearchInput);
        // Add the event listener for the 'input' event
        searchInput.addEventListener('input', processResearchInput);
    }
}

// Function to process the search input
function processResearchInput(e) {
    const inputVal = e.target.value.trim();
    if (inputVal.length > 0) {
        queryAndDisplayResearchPlanets(inputVal);
    } else {
        removeResearchResultsVisibility(); // Hide and clear results when input is empty
    }
}

// Log out event listener
document.querySelector('.logout').addEventListener('click', function (e) {
    e.preventDefault();
    logoutUser();
});

// Planet research link event listener
document.querySelector('.sidebar-link[href="#research"]').addEventListener('click', function (e) {
    e.preventDefault();
    fetchAndDisplayUserPlanets(); // This will add the input element and set up the listener
});


// Function to fetch the reading list data from the server
function fetchReadingList() {
    return fetch('http://127.0.0.1:3000/wishlist', {
        credentials: 'include'
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Return the entire data object to include success status and other metadata
                return data;
            } else {
                throw new Error('Failed to fetch reading list data');
            }
        })
        .catch(error => {
            console.error('Error fetching reading list:', error);
            throw error;
        });
}



function displayReadingList(data, sortOption) {
    let contentHtml;
    let sortSelectorHtml;

    sortSelectorHtml = `
    <label for="sort-selector">Sort By:</label>
    <select id="sort-selector" aria-label="Sort reading list">
        <option value="name-asc"${sortOption === 'name-asc' ? ' selected' : ''}>Title: Ascending</option>
        <option value="name-desc"${sortOption === 'name-desc' ? ' selected' : ''}>Title: Descending</option>
        <option value="date-asc"${sortOption === 'date-asc' ? ' selected' : ''}>Date Published: Oldest First</option>
        <option value="date-desc"${sortOption === 'date-desc' ? ' selected' : ''}>Date Published: Newest First</option>
    </select>`;


    // Check for success and non-empty wishlist before proceeding
    if (data.success && data.wishlist.length > 0) {
        let sortedList = enrichAndSortReadingList(data.wishlist, sortOption);
        const rowsHtml = sortedList.map(item => {
            // Find the article in the articlesArray using product_id to match
            const article = articlesArray.find(article => article.id === item.product_id);
            if (article) {
                return `<tr>
                <td>
                    <div class="table-article-name">
                        <img src="${article.img}"> ${article.title}
                    </div>
                </td>
                <td>${article.date}</td>
                <td>
                    <a href="${article.webPage}" class="details-button">View Article</a>
                    <button onclick="showConfirmDeleteModal(${article.id}, '${article.title}')">Delete</button>
                </td>
            </tr>`;
            }
            return ''; // Return an empty string for non-matching items
        }).join('');

        // Create the table with the appropriate headings
        contentHtml = `
            <div class="reading-list-table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Article Name</th>
                            <th>Published</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHtml}
                    </tbody>
                </table>
            </div>`;
    } else {
        // Show a placeholder when the wishlist is empty
        contentHtml = `
            <div class="reading-list-table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Article Name</th>
                            <th>Published</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colspan="3" class="placeholder-text">
                                Your reading list is currently empty. Discover new articles on our <a href="./articles-page.html" class="articles-link-blue">Articles Page</a>.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>`;
    }

    // Update the display element with the new content
    const accountDisplayElement = document.getElementById('my-account-display');
    accountDisplayElement.innerHTML = `
        <div class="reading-list-container">
            <h2>Reading List</h2>
            <h3>Your curated articles to read.</h3>
            ${sortSelectorHtml}
            ${contentHtml}
            <div class="articles-link-blue-ad">
                <a href="./articles-page.html">View Our Latest Articles Here.</a>
            </div>
        </div>`;

    // Setup event listener for the sort selector
    const sortSelector = document.getElementById('sort-selector');
    if (sortSelector) {
        sortSelector.addEventListener('change', function (event) {
            event.preventDefault();
            fetchAndDisplayReadingList(this.value);
        });
    }
}

// Function to fetch and sort the reading list
function fetchAndDisplayReadingList(sortOption) {
    fetchReadingList()
        .then(data => {
            if (!data.success) {
                throw new Error('Fetching data unsuccessful');
            }
            // Enrich and sort the fetched wishlist
            let enrichedAndSortedList = enrichAndSortReadingList(data.wishlist, sortOption);
            displayReadingList({ ...data, wishlist: enrichedAndSortedList }, sortOption);
        })
        .catch(error => {
            console.error('Error in fetching and displaying reading list:', error);
            // Handle the error, e.g., show an error message to the user
        });
}


// Adjusted sort function assuming direct sorting of readingList items
function enrichAndSortReadingList(readingList, sortOption) {
    // Enrich the reading list with title and date from articlesArray
    let enrichedList = readingList.map(item => {
        let article = articlesArray.find(article => article.id === item.product_id);
        return {
            ...item,
            title: article ? article.title : 'No title found',
            date: article ? article.date : 'No date found'
        };
    });

    // Now sort the enriched list
    enrichedList.sort((a, b) => {
        let comparison = 0;
        switch (sortOption) {
            case 'name-asc':
                comparison = a.title.localeCompare(b.title);
                break;
            case 'name-desc':
                comparison = b.title.localeCompare(a.title);
                break;
            case 'date-asc':
                comparison = new Date(a.date) - new Date(b.date);
                break;
            case 'date-desc':
                comparison = new Date(b.date) - new Date(a.date);
                break;
            default:
                // Handle unknown sortOption, if necessary
                break;
        }
        return comparison;
    });

    return enrichedList;
}




// Modify the sort listener to use the new fetchAndSortReadingList function
function setupReadingListSortListener() {
    const sortSelector = document.getElementById('sort-selector');
    sortSelector.addEventListener('change', function () {
        const selectedOption = this.value;
        fetchAndDisplayReadingList(selectedOption);
    });
}





// Function to show confirmation modal for deleting an article
function showConfirmDeleteModal(articleId, articleTitle) {
    const modalHtml = `
        <div id="confirm-delete-modal" class="modal-backdrop">
            <div class="modal-content">
                <span class="modal-close-button" onclick="closeModal('confirm-delete-modal')">&times;</span>
                <h2>Confirm Deletion</h2>
                <p>Are you sure you want to remove "${articleTitle}" from your reading list?</p>
                <button class="delete-modal-button" onclick="confirmDelete(${articleId}, \`${articleTitle}\`)">Yes</button>
                <button class="modal-button" onclick="closeModal('confirm-delete-modal')">No</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.getElementById('confirm-delete-modal').style.display = 'block';
}


// Function to remove an article from the reading list after confirmation
function confirmDelete(articleId, articleTitle) {
    fetch('http://127.0.0.1:3000/wishlist/remove', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId: articleId }),
        credentials: 'include'
    })
    .then(response => response.json()) // Directly attempt to parse JSON
    .then(data => {
        if (data.success) {
            closeModal('confirm-delete-modal');
            showPopupMessage(`"${articleTitle}" has been removed from your reading list.`, false);
            // Immediately fetch and refresh the reading list after deletion
            fetchAndDisplayReadingList(/* You need to provide the current sort option here */);
        } else {
            showPopupMessage(`Failed to remove "${articleTitle}" from your reading list.`, true);
        }
    })
    .catch(error => {
        console.error('Error processing deletion:', error);
        showPopupMessage(`Error removing "${articleTitle}" from your reading list.`, true);
    });
}


// Function to close the modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        modal.parentNode.removeChild(modal);
    }
}



// DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function () {
    fetchAndUpdateUserDetails();
});


// ===============================/ MY ACCOUNT /===


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