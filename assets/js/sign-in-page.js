// SIGN IN/UP FUNCTIONALITY 

let logInMode = true;

document.addEventListener('DOMContentLoaded', function () {
    // Immediately check if the user is logged in
    checkLoginStatus();

    // Getting the 'Create An Account' span and forms
    const createAccountSpan = document.querySelector('#sign-in-up-text-display .blue-text');
    const signInForm = document.getElementById('signin-form');
    const signUpForm = document.getElementById('signup-form');
    const modeDisplay = document.getElementById('sign-in-up-mode-display');
    const modeSwitcherText = document.getElementById('sign-in-up-mode-switcher');
    const signInImage = document.getElementById('sign-in-up-image');


    createAccountSpan.addEventListener('click', function () {
        // Toggle the mode
        logInMode = !logInMode;

        // Update the forms' display based on the mode
        if (logInMode) {
            signInForm.style.display = 'flex';
            signUpForm.style.display = 'none';
            modeDisplay.textContent = 'Sign In';
            modeSwitcherText.textContent = 'Create An Account';
            switchImage('../assets/images/sign-in/image1.webp');
        } else {
            signInForm.style.display = 'none';
            signUpForm.style.display = 'flex';
            modeDisplay.textContent = 'Create An Account';
            modeSwitcherText.textContent = 'Sign In';
            switchImage('../assets/images/sign-in/image2.webp');
        }
    });

    // Event listener for sign-in form submission
    signInForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Prevent the default form submission
        // Gather sign in form data
        const formData = {
            email: document.getElementById('signin-email').value,
            password: document.getElementById('signin-password').value
        };

        // Call the sign-in API
        fetch('http://127.0.0.1:3000/signin', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(handleResponse)
            .catch(handleError);
    });

    // Event listener for sign-up form submission
    signUpForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Prevent the default form submission
        // Gather sign up form data
        const formData = {
            first_name: document.getElementById('signup-first-name').value,
            last_name: document.getElementById('signup-last-name').value,
            email: document.getElementById('signup-email').value,
            password: document.getElementById('signup-password').value
        };

        // Call the sign-up API
        fetch('http://127.0.0.1:3000/signup', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(handleResponse)
            .catch(handleError);
    });

    // Handle the response
    function handleResponse(response) {
        return response.json().then(data => {
            if (response.ok) {
                showPopupMessage(data.message || 'Success!', false);
                // Redirect to the user account page on success
                setTimeout(function () {
                    window.location.href = './user-account-page.html';
                }, 500);
            } else {
                showPopupMessage(data.message || 'An error occurred.', true);
            }
        }).catch(error => {
            throw new Error('Error parsing JSON response: ' + error.message);
        });
    }

    // Handle errors
    function handleError(error) {
        console.error('Error:', error);
        let message = error.message;
        if (error.message.includes('Network response was not ok')) {
            // If the error message thrown from handleResponse includes this text,
            // it means the response status was not 2xx, and we parsed an error message from the response.
            // Thus, we shouldn't append 'Please try again.' to the message.
            message = error.message.replace('Network response was not ok: ', '');
        } else {
            // For other errors (network issues, etc.), append 'Please try again.' to the message.
            message += ' Please try again.';
        }
        showPopupMessage(message, true);
    }

    function switchImage(newSrc) {
        // Fade out the image
        signInImage.classList.add('image-hidden');
    
        // Wait for the transition to complete
        setTimeout(function () {
            // Change the image source
            signInImage.src = newSrc;
    
            // Fade in the image
            signInImage.classList.remove('image-hidden');
        }, 500); // This timeout duration should match the CSS transition time
    }
});



function checkLoginStatus() {
    fetch('http://127.0.0.1:3000/checkLogin', {
        method: 'GET',
        credentials: 'include' // Needed to include the session cookie
    })
    .then(response => response.json())
    .then(data => {
        if (data.loggedIn) {
            // Wait for the popup message to disappear, then redirect
            setTimeout(function () {
                window.location.href = './user-account-page.html';
            }, 500);
        }
        // If not logged in, do nothing and allow the user to sign in or sign up
    })
    .catch(error => {
        console.error('Error checking login status:', error);
    });
}

// ===============================/ SIGN IN/UP FUNCTIONALITY  /===

// SUCCESS POPUP

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

// ===============================/ SUCCESS POPUP /===

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