


// SPACE MISSIONS TABLE 

let content = "";
content += `
<div class="missions-table-scroller">
<table class="missions-events-table space-missions-table-selector">
        <tr>
            <th>Mission Name</th>
            <th>Launch Date</th>
            <th>Details</th>
        </tr>
        <!-- Mission rows will be added here -->
        <!-- Example mission row -->
        <tr>
            <td>Intuitive Machines 1 (TO 2-IM)</td>
            <td>2024-02</td>
            <td>NASA CLPS lunar lander.</td>
        </tr>
        <tr>
            <td>Chang'e 6</td>
            <td>2024-05</td>
            <td>Chinese lunar sample return mission.</td>
        </tr>
        <tr>
            <td>BepiColombo</td>
            <td>2024-09-05</td>
            <td>ESA's Mercury flyby.</td>
        </tr>
        <tr>
            <td>Martian Moon eXploration (MMX)</td>
            <td>2024-09</td>
            <td>JAXA's mission to Phobos.</td>
        </tr>
        <tr>
            <td>Europa Clipper</td>
            <td>2024-10</td>
            <td>NASA Jupiter orbiter to study Europa.</td>
        </tr>
        <tr>
            <td>Hera</td>
            <td>2024-10</td>
            <td>ESA mission to binary asteroid system.</td>
        </tr>
        <tr>
            <td>Griffin Mission 1 (VIPER)</td>
            <td>2024-11</td>
            <td>NASA CLPS lunar lander.</td>
        </tr>
        <tr>
            <td>Lucy</td>
            <td>2024-12-13</td>
            <td>NASA asteroid mission second Earth flyby.</td>
        </tr>
        <tr>
            <td>Intuitive Machines 2 (PRIME-1)</td>
            <td>2024-TBD</td>
            <td>NASA CLPS lunar rover.</td>
        </tr>
        <tr>
            <td>Lunar Trailblazer</td>
            <td>2024-TBD</td>
            <td>NASA SmallSat lunar water study mission.</td>
        </tr>
        <tr>
            <td>Blue Ghost 1 (TO 19D, Firefly)</td>
            <td>2024-TBD</td>
            <td>NASA CLPS lunar lander.</td>
        </tr>
        <tr>
            <td>EscaPADE</td>
            <td>2024-TBD</td>
            <td>Dual smallsat Mars orbiters.</td>
        </tr>
        <tr>
            <td>Intuitive Machines 3 (TO CP-11 PRISM 11)</td>
            <td>TBD</td>
            <td>Lunar lander and rovers.</td>
        </tr>
        <tr>
            <td>Dragonfly</td>
            <td>2026-TBD</td>
            <td>NASA quadcopter drone mission to Titan.</td>
        </tr>
        <tr>
            <td>Chang'e 7</td>
            <td>2026-TBD</td>
            <td>Chinese lunar survey mission.</td>
        </tr>
        <tr>
            <td>ExoMars Rover</td>
            <td>2028-TBD</td>
            <td>ESA's Mars rover, Rosalind Franklin.</td>
        </tr>
        <tr>
            <td>DAVINCI</td>
            <td>2029-06-TBD</td>
            <td>NASA Venus flyby and atmospheric probe.</td>
        </tr>
        <tr>
            <td>VERITAS</td>
            <td>2031-TBD</td>
            <td>NASA Venus orbiter.</td>
        </tr>
        <tr>
            <td>ENVISION</td>
            <td>2031-TBD</td>
            <td>ESA Venus orbiter.</td>
        </tr>
        <tr>
            <td>Lucy - Trojan Asteroid Mission</td>
            <td>2027-2033</td>
            <td>NASA mission multiple Trojan asteroid flybys.</td>
        </tr>

    </table>
</div>
`

document.getElementById('space-missions-table').innerHTML = content;


const table = document.querySelector('.space-missions-table-selector'); // Use the class you assigned to your table
if (table) {
    table.addEventListener('click', (event) => {
        if (event.target.tagName === 'TD') {
            const row = event.target.closest('tr');
            const missionName = row.querySelector('td:nth-child(1)').textContent;
            const launchDate = row.querySelector('td:nth-child(2)').textContent;
            const details = row.querySelector('td:nth-child(3)').textContent;

            const calendarLink = createGoogleCalendarLink({
                title: missionName,
                startDate: launchDate,
                endDate: launchDate, // Assuming it's a one-day event
                description: details,
                location: 'Launch Site' // You can customize the location as needed
            });

            // Open the link in a new tab
            window.open(calendarLink, '_blank');
        }
    });
}


function createGoogleCalendarLink(event) {
    // Construct Google Calendar event creation link
    const startTime = formatGoogleCalendarDate(event.startDate);
    const endTime = formatGoogleCalendarDate(event.endDate);
    const baseURL = 'https://www.google.com/calendar/render?action=TEMPLATE';
    let url = `${baseURL}&text=${encodeURIComponent(event.title)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}&sf=true&output=xml`;

    return url;
}

function formatGoogleCalendarDate(date) {
    // Format date for Google Calendar URL (YYYYMMDD)
    // This simplistic approach assumes the date is either YYYY-MM or a specific YYYY-MM-DD.
    // For more complex date handling, consider using a library like date-fns or moment.js.
    let formattedDate = date.replace(/-/g, '');
    if (formattedDate.length === 6) { // If the date format is YYYY-MM
        formattedDate += '01'; // Default to the first day of the month for start and end dates
    }
    formattedDate += 'T000000Z'; // Add time component
    return formattedDate;
}

// ===============================/ SPACE MISSIONS TABLE /===

// MISSIONS SLIDESHOW
document.addEventListener('DOMContentLoaded', function () {
    let currentSlideIndex = 0;
    const slides = document.querySelectorAll('.missicon-scroller-slide');
    const totalSlides = slides.length;
    const dotsContainer = document.querySelector('.missions-navigation-dots');

    // Function to create navigation dots
    function createDots() {
        slides.forEach((slide, index) => {
            const dot = document.createElement('img'); // Change this to 'img'
            const slideImage = slide.querySelector('img').src; // Get the source of the slide image
            dot.setAttribute('src', slideImage); // Set the dot image source
            dot.classList.add('missions-navigation-dots-dot');
            dot.addEventListener('click', function () {
                currentSlideIndex = index;
                updateSlides();
                updateDots();
            });
            dotsContainer.appendChild(dot);
        });
    }


    // Function to update the active dot
    function updateDots() {
        const dots = document.querySelectorAll('.missions-navigation-dots-dot');
        dots.forEach((dot, index) => {
            if (index === currentSlideIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // Function to update the slide visibility with fade transition
    function updateSlides() {
        slides.forEach((slide, index) => {
            slide.style.opacity = '0'; // Start by fading out all slides
        });

        // Wait for the fade-out to complete before showing the next slide
        setTimeout(() => {
            slides.forEach((slide, index) => {
                if (index === currentSlideIndex) {
                    slide.style.display = 'block';
                    setTimeout(() => {
                        slide.style.opacity = '1'; // Fade in the active slide
                        // Ensure dots are updated after the slide is fully visible
                        updateDots();
                    }, 10); // Short delay to ensure display: block takes effect
                } else {
                    slide.style.display = 'none';
                }
            });
        }, 1); // Adjust this duration to match your CSS transition time
    }


    // Create dots and initial display setup
    createDots();
    updateSlides();

    // Previous and Next button functionality
    document.getElementById('missionPrevBtn').addEventListener('click', function () {
        currentSlideIndex = (currentSlideIndex > 0) ? currentSlideIndex - 1 : totalSlides - 1;
        updateSlides();
    });

    document.getElementById('missionNextBtn').addEventListener('click', function () {
        currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
        updateSlides();
    });
});



// ===============================/ MISSIONS SLIDESHOW /===


// SEARCH BAR


// Event listener for search input
document.querySelector('.planet-search-input-white').addEventListener('input', function (e) {
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
    resultsContainer.id = 'all-planet-search-results-white';

    results.forEach(planet => {
        const planetElement = document.createElement('div');
        planetElement.textContent = planet.name;
        planetElement.addEventListener('click', function () {
            window.location.href = `./planet-viewer-page.html?planet=${planet.name}`;
        });
        resultsContainer.appendChild(planetElement);
    });

    // Append results container below the search bar or replace the existing one
    const oldResults = document.getElementById('all-planet-search-results-white');
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
    const resultsContainer = document.getElementById('all-planet-search-results-white');
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