


// HOME PAGE SEARCH BAR

// Event listener for search input
document.querySelector('.search-input').addEventListener('input', function (e) {
  const userInput = e.target.value;

  // Check if user input is not empty
  if (userInput.length > 0) {
    // Add the 'search-active' class when user starts typing
    document.querySelector('.search-container').classList.add('search-active');
    searchPlanets(userInput); // Function to search planets
  } else {
    // Remove the 'search-active' class when input is empty
    document.querySelector('.search-container').classList.remove('search-active');
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
  resultsContainer.id = 'search-results';

  results.forEach(planet => {
    const planetElement = document.createElement('div');
    planetElement.textContent = planet.name;
    planetElement.addEventListener('click', function () {
      window.location.href = `./pages/planet-viewer-page.html?planet=${planet.name}`;
    });
    resultsContainer.appendChild(planetElement);
  });

  // Append results container below the search bar or replace the existing one
  const oldResults = document.getElementById('search-results');
  if (oldResults) {
    document.querySelector('.search-container').replaceChild(resultsContainer, oldResults);
  } else {
    document.querySelector('.search-container').appendChild(resultsContainer);
  }

  if (results.length === 0) {
    // If there are no results, remove the 'search-active' class
    document.querySelector('.search-container').classList.remove('search-active');
  }
}


function hideSearchResults() {
  document.querySelector('.search-container').classList.remove('search-active');
  const resultsContainer = document.getElementById('search-results');
  if (resultsContainer) {
    resultsContainer.remove();
  }
}

// Add event listener to hide search results when clicking outside
document.addEventListener('click', function (event) {
  if (!event.target.closest('.search-container')) {
    hideSearchResults();
  }
});




// WHAT'S GOING ON IN SPACE BG PARTICLES

var particlesDiv = document.getElementById("particles-js");

document.addEventListener("DOMContentLoaded", function () {
  particlesJS("particles-js", {
    particles: {
      number: {
        value: 50,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: "#ffffff"
      },
      shape: {
        type: "circle",
        stroke: {
          width: 0,
          color: "#000000"
        },
        polygon: {
          nb_sides: 5
        }
      },
      opacity: {
        value: 0.5,
        random: false,
        anim: {
          enable: false,
          speed: 1,
          opacity_min: 0.1,
          sync: false
        }
      },
      size: {
        value: 3,
        random: true,
        anim: {
          enable: false,
          speed: 40,
          size_min: 0.1,
          sync: false
        }
      },
      line_linked: {
        enable: false,
        distance: 150,
        color: "#ffffff",
        opacity: 0.4,
        width: 1
      },
      move: {
        enable: true,
        speed: 1,
        direction: "right",
        random: false,
        straight: false,
        out_mode: "out",
        bounce: false,
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 1200
        }
      }
    },
    interactivity: {
      detect_on: "particlesDiv",
      events: {
        onhover: {
          enable: true,
          mode: "grab"
        },
        onclick: {
          enable: true,
          mode: "push"
        },
        resize: true
      },
      modes: {
        grab: {
          distance: 140,
          line_linked: {
            opacity: 1
          }
        },
        bubble: {
          distance: 400,
          size: 40,
          duration: 2,
          opacity: 8,
          speed: 3
        },
        repulse: {
          distance: 200,
          duration: 0.4
        },
        push: {
          particles_nb: 4
        },
        remove: {
          particles_nb: 2
        }
      }
    },
    retina_detect: true
  });
});

// ===============================/ WHATS GOING IN SPACE BG PARTICLES /===


// WHAT'S GOING ON IN EARTH BG SLIDESHOW

document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('.slider-image');
  const nextBtn = document.querySelector('.next-btn');
  const prevBtn = document.querySelector('.prev-btn');
  const dots = document.querySelectorAll('.dot');
  const pauseBtn = document.querySelector('.pause-btn');
  let currentIndex = 0;
  let autoSlideInterval;
  const slideDuration = 5000; // 5 seconds
  let isSlideshowPaused = true;

  const updateSlider = () => {
    images.forEach((img, index) => {
      if (index === currentIndex) {
        img.classList.add('active');
      } else {
        img.classList.remove('active');
      }
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  };



  const moveToNextSlide = () => {
    currentIndex = (currentIndex + 1) % images.length;
    updateSlider();
  };

  const moveToPrevSlide = () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateSlider();
  };

  const startAutoSlide = () => {
    stopAutoSlide(); // Ensure any existing interval is cleared before starting a new one
    autoSlideInterval = setInterval(moveToNextSlide, slideDuration);
    isSlideshowPaused = false; // Update the state to indicate the slideshow is playing
  };

  const stopAutoSlide = () => {
    clearInterval(autoSlideInterval);
  };

  nextBtn.addEventListener('click', () => {
    moveToNextSlide();
    stopAutoSlide();
    startAutoSlide();
  });

  prevBtn.addEventListener('click', () => {
    moveToPrevSlide();
    stopAutoSlide();
    startAutoSlide();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentIndex = index;
      updateSlider();
      stopAutoSlide();
      // Do not restart the slideshow if it's paused
    });
  });

  pauseBtn.addEventListener('click', () => {
    if (pauseBtn.textContent === '||') {
      stopAutoSlide();
      pauseBtn.textContent = '▶';
      isSlideshowPaused = true; // Update the state to paused
    } else {
      startAutoSlide();
      pauseBtn.textContent = '||';
    }
  });


  updateSlider();
  // Initially set the slider to paused state
  pauseBtn.textContent = '▶'; // Set the button to display the "play" symbol
  // Do not call startAutoSlide here, to start with the slider paused
});


// ===============================/ WHAT'S GOING ON IN EARTH BG SLIDESHOW /===

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


// WHAT'S GOING ON IN SPACE

function openTab(evt, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";

  // Check if evt is not null
  if (evt) {
    evt.currentTarget.className += " active";
  } else {
    // If evt is null, it means the function was called programmatically, not by an event
    // Find the tablink that corresponds to the tabName and add the "active" class
    for (i = 0; i < tablinks.length; i++) {
      if (tablinks[i].textContent === tabName) {
        tablinks[i].className += " active";
      }
    }
  }

  // Call a function to load content from NASA API for the selected tab.
  loadContent(tabName);
}

// Function to clear all content layouts
function clearAllLayouts() {
  // Hide all content divs
  document.getElementById('right-side-id').style.display = 'none';
  document.getElementById('astronomical-event').style.display = 'none';
  document.getElementById('space-weather').style.display = 'none';
  document.getElementById('space-missions').style.display = 'none';
  document.getElementById('images-content').style.display = 'none';
  document.getElementById('live-main').style.display = 'none';
  document.getElementById('live-sidebar').style.display = 'none';
}

function loadContent(tabName) {
  // Use NASA API to load content into Home tab divs
  if (tabName === 'Home') {
    setupHomeLayout();
    populateHomeLayout();


  } else if (tabName === 'Images') {
    setupImagesLayout();

  } else if (tabName === 'Live') {
    setupLiveLayout();
    populateLiveLayout();
  }
}



// HOME
function setupHomeLayout() {
  clearAllLayouts();
  // Display the Home layout divs
  document.getElementById('Home').style.display = 'flex';
  document.getElementById('right-side-id').style.display = 'flex';
  document.getElementById('astronomical-event').style.display = 'block';
  document.getElementById('space-weather').style.display = 'block';
  document.getElementById('space-missions').style.display = 'block';

  document.getElementById('space-weather').innerHTML = `
    <h2>Space Weather</h2>
    <p>Loading Data From NASA...</p>
  `;
  document.getElementById('astronomical-event').innerHTML = `
    <h2>Astronomical Events</h2>
    <p>Loading Data From NASA...</p>
  `;
  document.getElementById('space-missions').innerHTML = `
    <h2>Space Missions</h2>
    <p>Loading Data From NASA...</p>
  `;
}

// IMAGES
function setupImagesLayout() {
  clearAllLayouts();
  // Display the fullwidth content for Images
  document.getElementById('Images').style.display = 'flex';
  document.getElementById('images-content').style.display = 'flex';
  setupImageLayout()
}

// LIVE
function setupLiveLayout() {
  clearAllLayouts();
  // Display the Live content divs
  document.getElementById('Live').style.display = 'flex';
  document.getElementById('live-main').style.display = 'block';
  document.getElementById('live-sidebar').style.display = 'block';
  populateLiveLayout()
}


// POPULATING LAYOUTS
// HOME

function populateHomeLayout() {

  // Get the current date in YYYY-MM-DD format
  const currentDate = new Date().toISOString().split('T')[0];
  // Set the start date to 30 days prior
  const startDate = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0];

  // Update API URLs to point to your server
  const cmeUrl = `http://127.0.0.1:3000/api/nasa/cme?startDate=${startDate}&endDate=${currentDate}`;
  const flrUrl = `http://127.0.0.1:3000/api/nasa/flr?startDate=${startDate}&endDate=${currentDate}`;



  // Summary of key space weather events
  let spaceWeatherSummary = `
    <h2>Space Weather</h2>
    <div class="weather-data">
      ${displaySpaceWeatherEvent("Fastest<br>CME", "500 km/s", "The fastest coronal mass ejection recorded.", "../assets/images/homepage/weather-icons-cme.webp")}
      ${displaySpaceWeatherEvent("Strongest<br>GMS", "Kp 7", "A strong geomagnetic storm affecting satellites.", "../assets/images/homepage/weather-icons-gs.webp")}
      ${displaySpaceWeatherEvent("Largest<br>Solar Flare", "X-Class", "The most intense solar flare observed.", "../assets/images/homepage/weather-icons-solar-flare.webp")}
      ${displaySpaceWeatherEvent("SEPs<br>Intensity", "High", "Significant solar energetic particle activity.", "../assets/images/homepage/weather-icons-seps.webp")}
    </div>
  `;

  // This is an example of fetching just CME data. You can fetch other types of data similarly.
  fetch(cmeUrl)
    .then(response => response.json())
    .then(cmeData => {

      let cmeContent = '';

      // Check if CME data is available
      if (cmeData && cmeData.length > 0) {
        cmeContent += `
     <h3>Coronal Mass Ejections (Last 30 Days)</h3>
     <div class="scrollable-list">
       ${cmeData.map(event => `
         <div class="cme-event">
           <p><strong>Date:</strong> ${event.startTime}</p>
           <p><strong>Speed:</strong> ${event.speed ? event.speed + ' km/s' : 'N/A'}</p>
           <p><strong>Note:</strong> ${event.note}</p>
         </div>
       `).join('')}
     </div>`;

      } else {
        document.getElementById('space-weather').innerHTML = '<p>No recent Coronal Mass Ejections detected.</p>';
      }

      // Update the page with CME data
      document.getElementById('space-weather').innerHTML = spaceWeatherSummary;
      document.getElementById('space-weather').innerHTML += cmeContent;

      // Fetch Solar Flare data
      return fetch(flrUrl);
    })
    .then(response => response.json())
    .then(flrData => {
      // Process Solar Flare data
      let flrContent = '<h3>Recent Solar Flares</h3>';
      if (flrData && flrData.length > 0) {
        flrContent += `
      <div class="scrollable-list">
        ${flrData.map(flr => `
          <div class="solar-flare-event">
            <p><strong>Class:</strong> ${flr.classType}</p>
            <p><strong>Begin Time:</strong> ${flr.beginTime}</p>
            <p><strong>Peak Time:</strong> ${flr.peakTime}</p>
            <p><strong>End Time:</strong> ${flr.endTime}</p>
          </div>
        `).join('')}
      </div>`;
      } else {
        flrContent += '<p>No significant solar flares recorded in the past 30 days.</p>';
      }

      // Append Solar Flare data to the existing content
      document.getElementById('space-weather').innerHTML += flrContent;

      let content = "";
      content += `
  <hr syle="padding-top: 20px">
  <h1 style="text-align: center; margin-top: 20px">Trending Articles</h1>
    <div class="mini-article" style="text-align: right">
      <h3>Moonbound: Apollo 11's Perilous Odyssey!</h3>
      <p>Moonbound: Apollo 11's Perilous Odyssey" dives into the heart-stopping journey of humanity's first lunar mission. Relive the treacherous and awe-inspiring tale of Neil Armstrong, Buzz Aldrin, and Michael Collins, as they navigated the unknown dangers of space to reach the moon. This article captures the essence of their harrowing adventure, highlighting the risks and uncertainties that shadowed every moment of this monumental achievement. It's a story that intertwines the thrill of exploration with the lurking dangers of the cosmos, celebrating the brave astronauts who dared to venture into the unknown.</p>
      <img src= "../assets/images/Articles/apollo-11/image1.webp">
      <button onclick="location.href='./pages/articles/apollo-11.html';" class="read-more-btn">Discover More</button>
    </div>

    <div class="mini-article">
      <h3>Mars Mysteries Unleashed!</h3>
      <p>Embark on a journey to the Red Planet and uncover its secrets. Did you know Mars has the largest dust storms in the solar system? Or that it's home to the tallest mountain known to humankind?</p>
      <img src= "../assets/images/Articles/secret-of-mars/image1.webp">
      <button onclick="location.href='./pages/articles/secret-of-mars.html';" class="read-more-btn">Discover More</button>
    </div>

    <hr syle="padding-top: 20px">

    <h1 style="text-align: center; margin-top: 20px">Trending Videos</h1>
    <div class="mini-article" style="margin-bottom: 20px">
      <p style="margin-bottom: 10px">We Are Going - NASA</p>
      <iframe width="100%" height="360" src="https://www.youtube.com/embed/vl6jn-DdafM?si=-sRxULKfVVWrK4wh" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
    </div>

    <div class="mini-article" style="margin-bottom: 20px">
      <p style="margin-bottom: 10px">Perseverance Rover’s Descent and Touchdown on Mars - NASA</p>
      <iframe width="100%" height="360" src="https://www.youtube.com/embed/4czjS9h4Fpg?si=m4plwphmRCjVCa6k" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
    </div>

    <div class="mini-article" style="margin-bottom: 20px">
      <p style="margin-bottom: 10px">Departing Space Station Commander Provides Tour of Orbital Laboratory - NASA</p>
      <iframe width="100%" height="360" src="https://www.youtube.com/embed/doN4t5NKW-k?si=6CqduuIn5BY8y5xN" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
    </div>


  `
      document.getElementById('space-weather').innerHTML += content;


      // ASTRONOMICAL EVENTS

      content = "";
      content += `
      <h2>Astronomical Events</h2>
      <p class="calender-tip">Click An Event To Add To Google Calender</p>
      <div class="table-scroller">
        <table class="events-table">
            <tr>
                <th>Event Name</th>
                <th>Date</th>
            </tr>
            <!-- Repeat the row below for each event -->
            <tr>
                <td>Lunar Eclipse</td>
                <td>2024-05-15</td>
            </tr>
            <tr>
                <td>Lunar Eclipse</td>
                <td>2024-05-16</td>
            </tr>
            <tr>
                <td>Perseid Meteor Shower</td>
                <td>2024-08-12</td>
            </tr>
            <tr>
                <td>Total Solar Eclipse</td>
                <td>2024-04-08</td>
            </tr>
            <tr>
                <td>Geminid Meteor Shower</td>
                <td>2024-12-14</td>
            </tr>
            <tr>
                <td>Partial Lunar Eclipse</td>
                <td>2024-10-18</td>
            </tr>
            <tr>
                <td>Supermoon</td>
                <td>2024-06-17</td>
            </tr>
            <tr>
                <td>Venus at Greatest Eastern Elongation</td>
                <td>2024-03-22</td>
            </tr>
            <tr>
                <td>Conjunction of Mars and Jupiter</td>
                <td>2024-09-01</td>
            </tr>
            <tr>
                <td>Lyrid Meteor Shower</td>
                <td>2024-04-22</td>
            </tr>
            <tr>
                <td>Transit of Mercury</td>
                <td>2024-11-13</td>
            </tr>
            <tr>
                <td>Leonid Meteor Shower</td>
                <td>2024-11-17</td>
            </tr>
            <tr>
                <td>Jupiter at Opposition</td>
                <td>2024-09-26</td>
            </tr>
            <tr>
                <td>Saturn at Opposition</td>
                <td>2024-07-04</td>
            </tr>
            <tr>
                <td>Conjunction of Venus and Saturn</td>
                <td>2024-02-06</td>
            </tr>
            <tr>
                <td>Annular Solar Eclipse</td>
                <td>2024-10-02</td>
            </tr>
            <tr>
                <td>Mars at Opposition</td>
                <td>2025-01-16</td>
            </tr>
            <tr>
                <td>Orionid Meteor Shower</td>
                <td>2024-10-21</td>
            </tr>
            <tr>
                <td>Eta Aquarid Meteor Shower</td>
                <td>2024-05-06</td>
            </tr>
            <tr>
                <td>Conjunction of Venus and Jupiter</td>
                <td>2024-03-01</td>
            </tr>
            <tr>
                <td>Blue Moon</td>
                <td>2024-08-20</td>
            </tr>
        </table>
      </div>
    </div>
  `
      document.getElementById('astronomical-event').innerHTML = content;

      // Once everything is populated, set up the event listeners for the table
      setupEventListenersForAstronomicalEvents();


      // SPACE MISSIONS 
      content = "";
      content += `
  <!-- Space Missions Section -->
      <h2>Space Missions</h2>
      <p class="calender-tip">Click An Event To Add To Google Calender</p>
      <div class="table-scroller">
      <table class="events-table missions-table">
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

      document.getElementById('space-missions').innerHTML = content;

      // Once the table is populated, set up the event listeners for the missions table
      setupEventListenersForSpaceMissions();
    })
    .catch(error => {
      console.error('Error fetching Solar Flare data:', error);
      document.getElementById('space-weather').innerHTML += '<p>Error fetching Solar Flare data. Please try again later.</p>';
    });

}


function displaySpaceWeatherEvent(title, keyData, description, imageSrc) {
  return `
  <div class="weather-element">
      <h3>${title}</h3>
      <img src=${imageSrc} class="weather-icon">
      <p class="key-data">${keyData}</p>
      <p>${description}</p>
    </div>
  `;
}


document.addEventListener('DOMContentLoaded', () => {
  openTab(null, 'Home'); // Pass null for the evt parameter since there's no event
});


// Calender
function setupEventListenersForAstronomicalEvents() {
  // Wait until the astronomical events table is added to the DOM
  const table = document.querySelector('.events-table');
  if (table) {
    table.addEventListener('click', (event) => {
      // Check if the clicked element is a table cell
      if (event.target.tagName === 'TD') {
        const row = event.target.closest('tr');
        const title = row.querySelector('td:nth-child(1)').textContent;
        const date = row.querySelector('td:nth-child(2)').textContent;

        // Assuming the event lasts one day
        const calendarLink = createGoogleCalendarLink({
          title: title,
          startDate: date,
          endDate: date,
          description: `Reminder for the ${title}`,
          location: 'Sky'
        });

        // Open the link in a new tab
        window.open(calendarLink, '_blank');
      }
    });
  }
}

function createGoogleCalendarLink(eventDetails) {
  const { title, startDate, endDate, description, location } = eventDetails;

  const startTime = formatDateForGoogleCalendar(startDate);
  const endTime = formatDateForGoogleCalendar(endDate);

  // Create the URL for a Google Calendar event
  const href = encodeURI([
    'https://www.google.com/calendar/render',
    '?action=TEMPLATE',
    `&text=${title}`,
    `&dates=${startTime}/${endTime}`,
    `&details=${description}`,
    `&location=${location}`,
    `&sf=true`,
    `&output=xml`
  ].join(''));

  return href;
}

function formatDateForGoogleCalendar(date) {
  // Format the date as YYYYMMDDTHHmmssZ for Google Calendar
  // Assume date is in the format "2024-05-16"
  const formattedDate = date.replace(/-/g, '');
  const time = 'T120000Z'; // For example, setting the time as 12:00 UTC
  return formattedDate + time;
}



// Function to set up event listeners on the space missions table
function setupEventListenersForSpaceMissions() {
  const table = document.querySelector('.missions-table'); // Use the class you assigned to your table
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
}


// POPULATING LAYOUTS
// IMAGES

function setupImageLayout() {

  const planets = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];
  let content = '';


  content = '';
  content += `
  <h1>Image Of The Day</h2>
  <div class=image-of-day-container>
  </div>
  <p id="nasa-attribution">Loading Image From NASA...</p>
  `
  document.getElementById('image-of-the-day').innerHTML = content;
  fetchNasaImageOfTheDay()


  content = '<div class="gallery-container">';

  planets.forEach(planet => {
    content += `
      <div class="gallery-section">
        <h2>${planet}</h2>
        <div class="image-grid">`;

    for (let i = 1; i <= 6; i++) {
      content += `
          <img src="../assets/images/gallery/${planet}/image${i}.webp" 
               alt="${planet} Image ${i}" 
               class="gallery-image"
               onclick="openModal('../assets/images/gallery/${planet}/image${i}.webp')">
          `;
    }

    content += `
        </div>
        <a href="/gallery/${planet.toLowerCase()}" class="see-more-link">
          <p>See More</p>
        </a>
      </div>`;
  });

  content += '</div>';
  document.getElementById('images-content').innerHTML = content;

}

// Client-side JavaScript to fetch and display the NASA Image of the Day
function fetchNasaImageOfTheDay() {
  fetch('http://127.0.0.1:3000/api/nasa/image-of-the-day')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      const imageOfTheDayContainer = document.querySelector('.image-of-day-container');

      if (data && data.url) {

        if (data.media_type === 'image') {
          imageOfTheDayContainer.innerHTML = `
            <img src="${data.url}" alt="NASA Image of the Day">
            <h3>${data.title}</h3>
            <p>${data.explanation}</p>
          `;
        } else if (data.media_type === 'video') {
          imageOfTheDayContainer.innerHTML = `
            <iframe src="${data.url}" frameborder="0" allowfullscreen></iframe>
            <h3>${data.title}</h3>
            <p>${data.explanation}</p>
          `;
        }
      } else {
        throw new Error('No image data found.');
      }
    })
    .catch(error => {
      console.error('Error fetching Image of the Day:', error);
      imageOfTheDayContainer.innerHTML = '<p>Error loading the NASA Image of the Day.</p>';
    });
}





// POPULATING LAYOUTS
// LIVE

function populateLiveLayout() {
  let sideBarContent = '';
  sideBarContent += `
    <button onclick="changeVideo('https://www.youtube.com/embed/21X5lGlDOfg?si=7dCtmGEwfdAeMw-i', 'NASA TV Live')">NASA TV Live</button>
    <button onclick="changeVideo('https://www.youtube.com/embed/P9C25Un7xaM?si=VNqVH_R2BZ58Zjsl', 'Live HD View From ISS')">Live HD View From ISS</button>
    <button onclick="changeVideo('https://www.youtube.com/embed/mhJRzQsLZGg?si=RnPEoZRhOU2Vh_sv', 'Live SpaceX Starbase Development')">Live SpaceX Starbase Development</button>
    <button onclick="changeVideo('https://www.youtube.com/embed/nA9UZF-SZoQ?si=jZ2DHyMdTNhcalQH', 'Live NASA Media Channel')">Live NASA Media Channel</button>
  `;

  document.getElementById('live-sidebar').innerHTML = sideBarContent;

  // Initial content for the main area
  changeVideo('https://www.youtube.com/embed/21X5lGlDOfg?si=7dCtmGEwfdAeMw-i', 'NASA TV Live');
}

function changeVideo(url, name) {
  document.getElementById('live-main').innerHTML = `
    <div class="live-main-video">
      <iframe width="100%" height="100%" src="${url}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>
    <h1 style="margin-top: 10px; font-weight: 100;">${name}</h1>
  `;
}



// ===============================/ WHAT'S GOING ON IN SPACE /===


// WHAT'S GOING ON IN EARTH

// Call this function on initial page load to attach the event listener
function earthSectionDisplayer() {
  reattachEventListeners();
  attachCloseButtonListener();
}

// Handle the 'Enter' keydown event for search
function handleSearchKeyDown(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    var searchTerm = event.target.value.trim();
    // Call the APIs to get city and country data
    Promise.all([
      getCityData(searchTerm).then(cities => ({ cities })),
      getCountryData(searchTerm).then(countries => ({ countries }))
    ]).then(results => {
      const combinedResults = results.map(result => result.cities || result.countries).flat();
      displayResultsList(combinedResults, searchTerm);
    });
  }
}


// Function to attach event listener to the close button
function attachCloseButtonListener() {
  var closeButton = document.getElementById('close-search-results');
  if (closeButton) {
    closeButton.addEventListener('click', function () {
      // Replace the content of earth-section-display
      document.getElementById('earth-section-display').innerHTML = `
        <div class="earth-search-bar">
          <div class="earth-search-container">
            <input type="text" placeholder="Search A City Or Country" class="earth-search-input" id="earth-search-input">
          </div>
        </div>
      `;

      // Reattach the search listener to the new input
      earthSectionDisplayer();
    });
  }
}

// Function to get city data
function getCityData(searchTerm) {
  return fetch(`http://127.0.0.1:3000/api/city?name=${encodeURIComponent(searchTerm)}`, {
    method: 'GET',
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error fetching city data:', error);
    });
}


// Function to get country data
function getCountryData(searchTerm) {
  return fetch(`http://127.0.0.1:3000/api/country?name=${encodeURIComponent(searchTerm)}`, {
    method: 'GET',
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error fetching country data:', error);
    });
}



// Function to display combined city and country list
function displayResultsList(combinedResults, searchTerm) {
  var resultsContainer = document.getElementById('earth-section-display');
  if (!resultsContainer) {
    console.error('Results container not found.');
    return;
  }

  // Clear previous results
  resultsContainer.innerHTML = '';

  // Check for API limit errors in the combinedResults
  if (combinedResults.some(result => result.error)) {
    resultsContainer.innerHTML = `

    <div class="earth-section-results-container">
      <div class="close-button">
        <button id="close-search-results">Close</button>
      </div>
      <div class="earth-section-results">
      <div class="api-limit-error-message">
        <h2>API Limit Reached</h2>
        <p>We're sorry, but our search functionality is currently unavailable due to exceeding our API usage limits. Please try again later.</p>
      </div>
    </div>

    `;

    // Reattach event listeners
    reattachEventListeners();
    attachCloseButtonListener();
    return; // Exit the function early since we don't want to attempt to display search results
  }

  var content = `
    <div class="earth-section-results-container">
      <div class="close-button">
        <button id="close-search-results">Close</button>
      </div>
      <div class="earth-section-results">
      <div class="earth-search-bar">

          <div class="earth-search-container">
            <input type="text" placeholder="Search A City Or Country" class="earth-search-input" id="earth-search-input">
          </div>
        </div>

        <h1>Showing Search Results For "${searchTerm}"</h1>
        <p><i>Please Select A Country Or City</i></p>
        <hr style="margin-bottom: 20px">
        <div class="results-list"></div>
      </div>
    </div>
  `;

  // Append the new content
  resultsContainer.innerHTML = content;

  // Select the results list container within the results container
  var resultsListContainer = resultsContainer.querySelector('.results-list');

  // Check if the results are empty
  if (combinedResults.length === 0) {
    resultsListContainer.innerHTML = '<p>No City or Country found.</p>';
  } else {
    // Append cities and countries to the results list container
    combinedResults.forEach(result => {
      var isCountry = 'iso2' in result;
      var resultElement = document.createElement('div');
      resultElement.className = 'result';
      resultElement.tabIndex = 0; // Make the div focusable
      resultElement.innerHTML = `
      <h2>${result.name}</h2>
      <p>Population: ${result.population ? result.population.toLocaleString() : 'N/A'} - <i>${isCountry ? 'Country' : 'City'}</i></p>
    `;
      resultElement.onclick = function () {
        updateEarthSectionDisplay(result);
      };
      resultElement.onkeydown = function (e) {
        if (e.key === 'Enter') {
          updateEarthSectionDisplay(result);
        }
      };

      // Append result element to the results list container
      resultsListContainer.appendChild(resultElement);
    });
  }

  // Reattach event listeners
  reattachEventListeners();
  attachCloseButtonListener();
}


async function updateEarthSectionDisplay(data) {
  var content = '';
  var resultsContainer = document.getElementById('earth-section-display');

  if (!resultsContainer) {
    console.error('Results container not found.');
    return;
  }

  // Clear previous results
  resultsContainer.innerHTML = '';
  var cityName, weatherFetchUrl, lat, lon, isCountry;

  if ('iso2' in data) {
    isCountry = true;
    const cityFetchUrl = `https://api.api-ninjas.com/v1/city?name=${encodeURIComponent(data.capital)}`;

    // The data is for a country
    content = `
      <div class="earth-section-results-container">
        <div class="close-button">
          <button id="close-search-results">Close</button>
        </div>
        <div class="earth-section-results">

          <div class="earth-search-bar">
            <div class="earth-search-container">
              <input type="text" placeholder="Search A City Or Country" class="earth-search-input" id="earth-search-input">
            </div>
          </div>

          <h1>${data.name}</h1>
          <p>Population: ${data.population.toLocaleString()}</p>
          <p>GDP: $${parseInt(data.gdp).toLocaleString()}</p>
          <p>Area: ${data.surface_area.toLocaleString()} km²</p>
          <p>Capital: ${data.capital}</p>
          <p>Currency: ${data.currency.name} (${data.currency.code})</p>
          <p>Unemployment: ${data.unemployment}%</p>
          <p>GDP Growth: ${data.gdp_growth}%</p>
          <p>Infant Mortality: ${data.infant_mortality}%</p>
          <p>Fertility Rate: ${data.fertility}%</p>
          <p>Urban Population Rate: ${data.urban_population}%</p>

          <hr style="margin-top:20px; margin-bottom: 40px">

          <div id="weather-result">
            <div class="weather-info">
              <h2>Weather for ${'iso2' in data ? data.capital : data.name}</h2>
              <p>Loading Capital City Weather...</p>
            </div>
          </div>
      </div>
    `;

    // Fetch the capital city's data to get latitude and longitude
    try {
      const cityResponse = await fetch(`http://127.0.0.1:3000/api/capital-city?name=${encodeURIComponent(data.capital)}`, {
        method: 'GET',
      });


      const cityData = await cityResponse.json(); // Directly receive the parsed JSON data
      console.log(cityData);
      if (cityData) {
        lat = cityData.latitude;
        lon = cityData.longitude;
      } else {
        throw new Error('Capital city data could not be retrieved.');
      }
    } catch (error) {
      console.error('Error fetching capital city data:', error);
      // Handle error appropriately
    }


    // Now let's get the images for the country's capital city
    try {
      const pixabayResponse = await fetch(`http://127.0.0.1:3000/api/pixabay/images?q=${encodeURIComponent(data.capital)}`);
      const pixabayData = await pixabayResponse.json();
      if (pixabayData.hits && pixabayData.hits.length > 0) {
        // Process and display the images as needed
        console.log(pixabayData.hits); // Log the images or update the DOM with image URLs
      }
    } catch (error) {    
      console.error('Error fetching images from Pixabay:', error);
    }

    // For countries, we assume the capital city's weather is desired
    cityName = data.capital;
    weatherFetchUrl = `https://api.api-ninjas.com/v1/weather?city=${encodeURIComponent(data.capital)}`;
  } else {

    isCountry = false;
    // The data is for a city
    content = `
      <div class="earth-section-results-container">
        <div class="close-button">
          <button id="close-search-results">Close</button>
        </div>
        <div class="earth-section-results">

        <div class="earth-search-bar">
          <div class="earth-search-container">
            <input type="text" placeholder="Search A City Or Country" class="earth-search-input" id="earth-search-input">
          </div>
        </div>

          <h1>${data.name}, ${data.country}</h1>
          <p>Population: ${data.population.toLocaleString()}</p>
          <p>Latitude: ${data.latitude}</p>
          <p>Longitude: ${data.longitude}</p>
          <p>Capital: ${data.is_capital ? 'Yes' : 'No'}</p>

          <hr style="margin-top:20px; margin-bottom: 40px">

          <div id="weather-result">
              <div class="weather-info">
              <h2>Weather for ${'iso2' in data ? data.capital : data.name}</h2>
              <p>Loading...</p>
            </div>
          </div>
        </div>
      </div>
    `;

    lat = data.latitude;
    lon = data.longitude;
    cityName = data.name;

    // Now let's get the images for the city
    try {
      const pixabayResponse = await fetch(`http://127.0.0.1:3000/api/pixabay/images?q=${encodeURIComponent(data.name)}`);
  const pixabayData = await pixabayResponse.json();
      if (pixabayData.hits && pixabayData.hits.length > 0) {
        // Process and display the images as needed
        console.log(pixabayData.hits); // Log the images or update the DOM with image URLs
      }
    } catch (error) {
      console.error('Error fetching images from Pixabay:', error);
    }
    // For cities, use the city name
    weatherFetchUrl = `https://api.api-ninjas.com/v1/weather?city=${encodeURIComponent(data.name)}`;
  }

  resultsContainer.innerHTML = content;
  var weatherResults = document.getElementById('weather-result');
  const sunTimes = await getSunTimes(lat, lon);

  // Fetch images for the location
  const images = await fetchImagesFromPixabay(cityName);

  // Create HTML for images
  const imageHtml = images.map(image =>
    `<div class="image-container">
    <img src="${image.webformatURL}" alt="Image of ${cityName}" onclick="openModal('${image.largeImageURL}')" />
  </div>`
  ).join('');


  // Fetch weather data
  fetch(`http://127.0.0.1:3000/api/weather?city=${encodeURIComponent(cityName)}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(weatherData => {
      // Now fetch the local time using the city name
      return Promise.all([
        weatherData,
        fetch(`http://127.0.0.1:3000/api/worldtime?city=${encodeURIComponent(cityName)}`, {
          method: 'GET',
        }).then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
      ]);
    })
    .then(([weatherData, timeData]) => {

      // Now you have both the weather data and the local time data
      const localTime = new Date(timeData.datetime);
      const sunriseTime = sunTimes.sunrise;
      const sunsetTime = sunTimes.sunset;
      const goldenHourTime = sunTimes.goldenHour;
      const daylightProgress = updateDaylightProgressBar(sunriseTime, sunsetTime, timeData.datetime);



      content = `
      <div class="weather-info">

        <h2>Weather for ${'iso2' in data ? data.capital : data.name}</h2>
        <div class="weather-info-temp">
          <h1>${weatherData.temp}°C</h1>
          <p>Feels like ${weatherData.feels_like}°C</p>
        </div>
        
        <div class="weather-info-section">
          <p> Highs Of ${weatherData.max_temp}°C and Lows Of ${weatherData.min_temp}°C</p>
          <hr>
          <p>Cloud Coverage: ${weatherData.cloud_pct}%</p>
          <p>Running Conditions: ${assessRunningConditions(weatherData)}</p>
          <p>Driving Difficulty: ${assessDrivingConditions(weatherData)}</p>
        </div>

        <div class="weather-info-section-collection">

          <div class="weather-info-section-box">
            <div class="title">
              <img src="../assets/images/homepage/weather-icons-humidity.webp">
              <p>Humidity</p>
            </div>
            <div class="data">
              <p>${weatherData.humidity}%</p>
            </div>

          </div>

          <div class="weather-info-section-box">
            <div class="title">
              <img src="../assets/images/homepage/weather-icons-wind.webp">
              <p>Wind</p>
            </div>
            <div class="data">
              <p>${weatherData.wind_speed} km/h</p>
            </div>
            
          </div>

          <div class="weather-info-section-box">
            <div class="title">
              <img src="../assets/images/homepage/weather-icons-wind-direction.webp">
              <p>Wind Direction</p>
            </div>
            <div class="data">
              <p>${weatherData.wind_degrees}°</p>
            </div>
            
          </div>

          <div class="weather-info-section-box">
            <div class="title">
              <img src="../assets/images/homepage/weather-icons-precipitation.webp">
              <p>Precipitation</p>
            </div>
            <div class="data">
              <p>${estimatePrecipitationChance(weatherData)}</p>
            </div>
            
          </div>
          

        </div>
        
        <div class="weather-info-section">
          <p>Current Local Time: ${localTime.toLocaleTimeString()}</p>
        </div>

      
        <div class="weather-info-section" style="padding-bottom: 60px">

          <p>Sunrise: ${sunriseTime}</p>
          <p>Sunset: ${sunsetTime}</p>
          <p>Golden Hour: ${goldenHourTime}</p>

          <div class="daylight-progress-container">
            <div class="daylight-progress-bar" style="width: ${daylightProgress}%;">
              
            </div>
            <div class="sun-times">
              <span class="sunrise-time">Sunrise<br>${sunriseTime}</span>
              <span class="sunset-time">Sunset<br>${sunsetTime}</span>
            </div>
        </div>
      
      </div>

      <div class="weather-info-section">
        <p>Maps</p>
        <hr>
        <div id="mapid" style="height: 250px;"></div>
      </div>

      <div class="weather-info-section">
      <p>Photos</p>
      <hr>
        <div class="image-gallery">
          ${imageHtml}
        </div>
      </div>

    `;

      // Update the content again
      weatherResults.innerHTML = content;

      initializeMap(lat, lon, cityName, isCountry);


      // Reattach event listeners
      attachCloseButtonListener();
      reattachEventListeners();
      addImageClickHandlers();
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
    });
}

async function fetchImagesFromPixabay(cityName) {
  const searchTermsCity = encodeURIComponent(cityName);
  const searchTermsView = encodeURIComponent(`${cityName} view`);

  // Perform two fetch requests in parallel to your server-side endpoint
  const [cityResponse, viewResponse] = await Promise.all([
    fetch(`http://127.0.0.1:3000/api/pixabay/search?term=${searchTermsCity}`),
    fetch(`http://127.0.0.1:3000/api/pixabay/search?term=${searchTermsView}`)
  ]);

  // Wait for both promises to resolve and extract the JSON data
  const cityData = await cityResponse.json();
  const viewData = await viewResponse.json();

  // Combine the image results
  const combinedImages = [...cityData.hits, ...viewData.hits].slice(0, 12); // Limit to 12 images if there are more

  return combinedImages;
}


document.getElementById('myModal').addEventListener('click', closeModal);

function openModal(imageUrl) {
  const modal = document.getElementById('myModal');
  const modalImg = document.getElementById('img01');
  modal.style.display = 'block';
  modalImg.src = imageUrl;
}

function closeModal() {
  const modal = document.getElementById('myModal');
  modal.style.display = 'none';
}

function addImageClickHandlers() {
  const images = document.querySelectorAll('.image-container img');
  images.forEach(img => {
    img.addEventListener('click', () => openModal(img.src));
  });
}

// Function to get sunrise and sunset times from the new API
async function getSunTimes(lat, lon) {
  const url = `https://api.sunrisesunset.io/json?lat=${lat}&lng=${lon}&date=today`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.status === 'OK') {
      return {
        sunrise: data.results.sunrise,
        sunset: data.results.sunset,
        goldenHour: data.results.golden_hour
      };
    } else {
      throw new Error('Failed to fetch sun times');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}


function estimatePrecipitationChance(weatherData) {
  const { cloud_pct, humidity } = weatherData;

  // Simple logic to estimate the chance of precipitation
  if (cloud_pct > 80 && humidity > 80) {
    return 'High'; // Both high cloud coverage and humidity could indicate a higher chance of precipitation
  } else if (cloud_pct > 50) {
    return 'Moderate'; // Moderate cloud coverage alone gives a moderate chance of precipitation
  } else {
    return 'Low'; // Low cloud coverage likely means a low chance of precipitation
  }
}

function updateDaylightProgressBar(sunrise, sunset, now) {
  console.log("old times: " + sunrise + " " + sunset + " " + now);

  // Helper function to convert time string to minutes
  function convertToMinutes(timeStr) {
    const parts = timeStr.match(/(\d+):(\d+):(\d+)(\sAM|\sPM)?/);
    let hours = parseInt(parts[1], 10);
    const minutes = parseInt(parts[2], 10);

    // Adjust for 12-hour format
    if (parts[4]) {
      if (hours === 12) {
        hours = 0; // 12 AM should be 0 hours
      }
      if (parts[4].trim() === 'PM') {
        hours += 12; // Convert PM hours to 24-hour format
      }
    }

    return hours * 60 + minutes;
  }

  // Convert sunrise, sunset, and now to minutes
  const sunriseMinutes = convertToMinutes(sunrise);
  const sunsetMinutes = convertToMinutes(sunset);
  const nowMinutes = convertToMinutes(now);

  console.log("new times in minutes: sunrise = " + sunriseMinutes + ", sunset = " + sunsetMinutes + ", now = " + nowMinutes);

  // Calculate the total daylight duration and the time elapsed since sunrise
  const daylightDuration = sunsetMinutes - sunriseMinutes;
  const timeSinceSunrise = nowMinutes - sunriseMinutes;

  // Calculate the progress percentage
  const progressPercentage = (timeSinceSunrise / daylightDuration) * 100;

  // Ensure percentage is between 0 and 100
  return Math.max(0, Math.min(progressPercentage, 100));
}



function assessRunningConditions(weatherData) {
  const { temp, wind_speed, humidity } = weatherData;

  // Simple conditions to determine running difficulty
  if (temp < 0 || temp > 30) {
    return 'Poor'; // Extreme temperatures
  } else if (wind_speed > 20) {
    return 'Fair'; // High wind might make running challenging
  } else if (humidity > 90) {
    return 'Fair'; // High humidity can make running uncomfortable
  } else {
    return 'Good'; // Conditions are generally good for running
  }
}

function assessDrivingConditions(weatherData) {
  const { wind_speed, cloud_pct } = weatherData;

  // Simple conditions to determine driving difficulty
  if (wind_speed > 50) {
    return 'High'; // High wind speeds can make driving dangerous
  } else if (cloud_pct > 80) {
    return 'Moderate'; // High cloud coverage may indicate poor weather conditions
  } else {
    return 'Low'; // Conditions are generally good for driving
  }
}


// Reattach event listeners after updating content
function reattachEventListeners() {
  var searchInput = document.getElementById('earth-search-input');
  if (searchInput) {
    searchInput.removeEventListener('keydown', handleSearchKeyDown);
    searchInput.addEventListener('keydown', handleSearchKeyDown);
  }
}

function initializeMap(lat, lon, cityName, isCountry) {
  // Ensure there's a container for the map
  if (!document.getElementById('mapid')) {
    console.error('Map container not found.');
    return;
  }

  // Set different zoom levels based on whether the data is for a country or a city
  var zoomLevel = isCountry ? 6 : 13; // Zoom out more for countries

  // Initialize the map with a dynamic zoom level
  var map = L.map('mapid').setView([lat, lon], zoomLevel);

  // Set up the OSM layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);


}


// Call this function on initial page load to attach the event listener
earthSectionDisplayer();

