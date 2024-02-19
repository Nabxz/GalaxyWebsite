const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
require('dotenv').config();
const mysql = require('mysql2');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(express.json()); // Use built-in middleware for JSON
app.use(express.urlencoded({ extended: true })); // Use built-in middleware for URL-encoded data

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});


app.use(cors({
    origin: 'http://127.0.0.1:5500', // Update with your frontend origin
    credentials: true
}));


// Create a new instance of the MySQLStore
const sessionStore = new MySQLStore({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    clearExpired: true,
    checkExpirationInterval: 900000, // How frequently expired sessions will be cleared; 15 minutes in milliseconds
    expiration: 86400000, // The maximum age of a valid session; 24 hours in milliseconds
    createDatabaseTable: true, // Whether or not to create the sessions database table, if one does not already exist
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
});


const SALT_ROUNDS = 10;

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore, // Use the session store
    cookie: {
        maxAge: 60 * 60 * 1000, // 1 hour
        httpOnly: true,
        secure: false,
    }
}));

// Handle connection errors and retries if needed
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the MySQL database:', err);
        // Implement retry logic or exit depending on your needs
    } else {
        console.log('Connected to the MySQL database.');
    }
});


// Server-side endpoint for CME data
app.get('/api/nasa/cme', async (req, res) => {
    const { startDate, endDate } = req.query;
    const cmeUrl = `https://api.nasa.gov/DONKI/CME?startDate=${startDate}&endDate=${endDate}&api_key=${process.env.NASA_API_KEY}`;

    try {
        const response = await axios.get(cmeUrl);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching CME data from NASA:', error);
        res.status(500).send('Server error occurred while fetching CME data');
    }
});

// Server-side endpoint for FLR data
app.get('/api/nasa/flr', async (req, res) => {
    const { startDate, endDate } = req.query;
    const flrUrl = `https://api.nasa.gov/DONKI/FLR?startDate=${startDate}&endDate=${endDate}&api_key=${process.env.NASA_API_KEY}`;

    try {
        const response = await axios.get(flrUrl);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching FLR data from NASA:', error);
        res.status(500).send('Server error occurred while fetching FLR data');
    }
});

// Server-side endpoint for NASA Image of the Day
app.get('/api/nasa/image-of-the-day', async (req, res) => {
    const apiURL = `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`;

    try {
        const response = await axios.get(apiURL);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching NASA Image of the Day:', error);
        res.status(500).send('Server error occurred while fetching NASA Image of the Day');
    }
});

// Server-side endpoint to get images from Pixabay
app.get('/api/pixabay/images', async (req, res) => {
    const searchTerm = req.query.q;
    const pixabayURL = `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${encodeURIComponent(searchTerm)}&image_type=photo&per_page=6`;

    try {
        const response = await axios.get(pixabayURL);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching images from Pixabay:', error);
        res.status(500).send('Server error occurred while fetching images from Pixabay');
    }
});

// Server-side endpoint to get images from Pixabay with search terms
app.get('/api/pixabay/search', async (req, res) => {
    const searchTerm = req.query.term;
    const pixabayURL = `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${encodeURIComponent(searchTerm)}&image_type=photo&per_page=6`;

    try {
        const response = await axios.get(pixabayURL);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching images from Pixabay with search terms:', error);
        res.status(500).send('Server error occurred while fetching images from Pixabay');
    }
});







// SEARCH FOR PLANETS
app.get('/api/planets/search', async (req, res) => {
    const query = req.query.name;
    const apiURL = `https://api.api-ninjas.com/v1/planets?name=${query}`;

    try {
        const apiResponse = await axios.get(apiURL, {
            headers: { 'X-Api-Key': process.env.NINJA_API_KEY },
        });
        // Respond with data received from the API Ninjas service
        res.json(apiResponse.data);
    } catch (error) {
        console.error('Error fetching planet data:', error);
        res.status(500).send('Server error occurred while fetching planet data');
    }
});


// Server-side endpoint to get planet data - v2 for user account
app.get('/api/planetsv2', async (req, res) => {
    const query = req.query.name;
    const searchApiUrl = `https://api.api-ninjas.com/v1/planets?name=${encodeURIComponent(query)}`;

    try {
        const response = await axios.get(searchApiUrl, {
            headers: { 'X-Api-Key': process.env.NINJA_API_KEY },
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching planet data from API Ninjas:', error);
        res.status(500).send('Server error occurred while fetching planet data');
    }
});

// Endpoint to get city data
app.get('/api/city', async (req, res) => {
    const searchTerm = req.query.name;
    const apiURL = `https://api.api-ninjas.com/v1/city?name=${encodeURIComponent(searchTerm)}`;

    try {
        const response = await axios.get(apiURL, {
            headers: { 'X-Api-Key': process.env.NINJA_API_KEY },
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching city data from API Ninjas:', error);
        res.status(500).send('Server error occurred while fetching city data');
    }
});

// Endpoint to get country data
app.get('/api/country', async (req, res) => {
    const searchTerm = req.query.name;
    const apiURL = `https://api.api-ninjas.com/v1/country?name=${encodeURIComponent(searchTerm)}`;

    try {
        const response = await axios.get(apiURL, {
            headers: { 'X-Api-Key': process.env.NINJA_API_KEY },
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching country data from API Ninjas:', error);
        res.status(500).send('Server error occurred while fetching country data');
    }
});

// Endpoint to get capital city data with latitude and longitude
app.get('/api/capital-city', async (req, res) => {
    const cityName = req.query.name; // Assuming you pass the city name as a query parameter
    const cityFetchUrl = `https://api.api-ninjas.com/v1/city?name=${encodeURIComponent(cityName)}`;

    try {
        const response = await axios.get(cityFetchUrl, {
            headers: { 'X-Api-Key': process.env.NINJA_API_KEY },
        });
        // Assuming API returns an array, send the first element or null if array is empty
        res.json(response.data[0] || null);
    } catch (error) {
        console.error('Error fetching capital city data from API Ninjas:', error);
        res.status(500).send('Server error occurred while fetching capital city data');
    }
});

// Endpoint for weather
app.get('/api/weather', async (req, res) => {
    const cityName = req.query.city;
    const weatherFetchUrl = `https://api.api-ninjas.com/v1/weather?city=${encodeURIComponent(cityName)}`;

    try {
        const response = await axios.get(weatherFetchUrl, {
            headers: { 'X-Api-Key': process.env.NINJA_API_KEY },
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).send('Server error occurred while fetching weather data');
    }
});

//Endpoint for time
app.get('/api/worldtime', async (req, res) => {
    const cityName = req.query.city;
    const worldtimeUrl = `https://api.api-ninjas.com/v1/worldtime?city=${encodeURIComponent(cityName)}`;

    try {
        const response = await axios.get(worldtimeUrl, {
            headers: { 'X-Api-Key': process.env.NINJA_API_KEY },
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching local time data:', error);
        res.status(500).send('Server error occurred while fetching local time data');
    }
});

// Server-side endpoint to get specific planet details
app.get('/api/planet-details', async (req, res) => {
    const planetName = req.query.name;
    const apiURL = `https://api.api-ninjas.com/v1/planets?name=${encodeURIComponent(planetName)}`;

    try {
        const response = await axios.get(apiURL, {
            headers: { 'X-Api-Key': process.env.NINJA_API_KEY },
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching planet details from API Ninjas:', error);
        res.status(500).send('Server error occurred while fetching planet details');
    }
});








// ACCOUNT CREATION
app.post('/signup', async (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    console.log('Signup request received', req.body); // Log the signup request

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Insert the new user into the database
        const query = 'INSERT INTO users (first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?)';
        db.execute(query, [first_name, last_name, email, hashedPassword], (err, result) => {
            if (err) {
                console.error('Signup error:', err);
                res.status(500).json({ success: false, message: 'Error creating user' });
            } else {
                console.log('User created successfully', result);
                res.status(201).json({ success: true, message: 'User created' });
            }
        });
    } catch (error) {
        console.error('Server error during signup:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});



// ACCOUNT SIGN IN
app.post('/signin', (req, res) => {
    const { email, password } = req.body;
    console.log('Signin request received', req.body); // Log the signin request

    // Check if the user exists in the database
    const query = 'SELECT * FROM users WHERE email = ?';
    db.execute(query, [email], async (err, users) => {
        if (err) {
            console.error('Signin error:', err);
            res.status(500).json({ success: false, message: 'Error signing in' });
        } else if (users.length === 0) {
            res.status(401).json({ success: false, message: 'Incorrect email or password' });
        } else {
            // Compare the hashed password
            const match = await bcrypt.compare(password, users[0].password_hash);
            if (match) {
                req.session.user = { id: users[0].id, email: users[0].email };
                console.log('Session user set:', req.session.user); // Log the session user info

                req.session.save(err => {
                    if (err) {
                        console.error('Session save error:', err);
                        res.status(500).send('Could not save session');
                    } else {
                        console.log('Session saved successfully', req.session);
                        res.json({ message: 'Logged in successfully', userId: users[0].id });
                    }
                });
            } else {
                res.status(401).json({ success: false, message: 'Incorrect email or password' });
            }
        }
    });
});




// GET USER DETAILS
app.get('/user-details', (req, res) => {
    // Check if the user is logged in
    if (req.session.user && req.session.user.id) {
        // Retrieve user details from the database using the user's ID from the session
        const query = 'SELECT first_name, last_name, email FROM users WHERE id = ?'; // Include email in the SELECT query
        db.execute(query, [req.session.user.id], (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).json({ success: false, message: 'Error retrieving user details' });
            } else if (results.length > 0) {
                // Send back the first name, last name, and email of the user
                res.json({
                    success: true,
                    firstName: results[0].first_name,
                    lastName: results[0].last_name,
                    email: results[0].email // Add this line to send the email
                });
            } else {
                // No user found with the ID
                res.status(404).json({ success: false, message: 'User not found' });
            }
        });
    } else {
        // User is not logged in
        res.status(403).json({ success: false, message: 'Not logged in' });
    }
});




// CHECK IF USER IS LOGGED IN
app.get('/checkLogin', (req, res) => {
    console.log('Incoming cookies: ', req.headers.cookie); // Log incoming cookies
    console.log('Session ID from cookie (connect.sid): ', req.sessionID); // Log the session ID from the cookie
    console.log('CURRENT REQ SESSION');
    console.log(req.session);
    // Attempt to retrieve session from the store using the session ID
    sessionStore.get(req.sessionID, (err, session) => {
        if (err) {
            console.error('Error retrieving session from store:', err);
            return res.status(500).json({ error: 'Error retrieving session' });
        }
        if (!session) {
            console.log('Session not found in store for ID:', req.sessionID);
            return res.json({ loggedIn: false });
        }
        console.log('Session retrieved from store:', session);

        // Check if the session has a user object
        if (session.user) {
            res.json({ loggedIn: true, user: session.user });
        } else {
            res.json({ loggedIn: false });
        }
    });
});




// CHANGE EMAIL
app.post('/change-email', async (req, res) => {
    const { oldEmail, newEmail } = req.body;
    if (!req.session.user) {
        return res.status(403).json({ success: false, message: 'Not logged in' });
    }

    const userId = req.session.user.id;
    try {
        const [user] = await db.promise().query('SELECT email FROM users WHERE id = ?', [userId]);
        if (user[0].email !== oldEmail) {
            return res.status(403).json({ success: false, message: 'Old email does not match our records' });
        }

        await db.promise().query('UPDATE users SET email = ? WHERE id = ?', [newEmail, userId]);
        res.json({ success: true, message: 'Email updated successfully' });
    } catch (err) {
        console.error('Error changing email:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});




// CHANGE PASSWORD
app.post('/change-password', async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!req.session.user) {
        return res.status(403).json({ success: false, message: 'Not logged in' });
    }

    const userId = req.session.user.id;
    try {
        const [user] = await db.promise().query('SELECT password_hash FROM users WHERE id = ?', [userId]);
        const match = await bcrypt.compare(oldPassword, user[0].password_hash);
        if (!match) {
            return res.status(403).json({ success: false, message: 'Old password does not match our records' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
        await db.promise().query('UPDATE users SET password_hash = ? WHERE id = ?', [hashedNewPassword, userId]);
        res.json({ success: true, message: 'Password updated successfully' });
    } catch (err) {
        console.error('Error changing password:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});




// CHANGE NAME
app.post('/change-name', async (req, res) => {
    const { newFirstName, newLastName } = req.body;
    if (!req.session.user) {
        return res.status(403).json({ success: false, message: 'Not logged in' });
    }

    const userId = req.session.user.id;
    try {
        await db.promise().query('UPDATE users SET first_name = ?, last_name = ? WHERE id = ?', [newFirstName, newLastName, userId]);
        res.json({ success: true, message: 'Name updated successfully' });
    } catch (err) {
        console.error('Error changing name:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});



// GET USER PLANETS
app.get('/user-planets', (req, res) => {
    if (req.session.user && req.session.user.id) {
        // Adjust the query to select additional fields
        const query = 'SELECT planet_name, note, added_at FROM user_planets WHERE user_id = ? ORDER BY added_at DESC';
        db.execute(query, [req.session.user.id], (err, results) => {
            if (err) {
                console.error('Error retrieving user planets:', err);
                res.status(500).json({ success: false, message: 'Error retrieving planets' });
            } else {
                // Send back the list of planets with all the details
                res.json({ success: true, planets: results });
            }
        });
    } else {
        // User is not logged in
        res.status(403).json({ success: false, message: 'Not logged in' });
    }
});




// ADD PLANET
app.post('/add-planet', (req, res) => {
    if (req.session.user && req.session.user.id) {
        const { planetName, note } = req.body;
        const query = 'INSERT INTO user_planets (user_id, planet_name, note) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE note = VALUES(note)';
        db.execute(query, [req.session.user.id, planetName, note || null], (err, result) => {
            if (err) {
                console.error('Error adding planet:', err);
                res.status(500).json({ success: false, message: 'Error adding planet' });
            } else {
                res.json({ success: true, message: 'Planet added successfully', planetId: result.insertId });
            }
        });
    } else {
        res.status(403).json({ success: false, message: 'Not logged in' });
    }
});



// REMOVE PLANET
app.post('/remove-planet', (req, res) => {
    if (req.session.user && req.session.user.id) {
        const { planetName } = req.body;
        const query = 'DELETE FROM user_planets WHERE user_id = ? AND planet_name = ?';
        db.execute(query, [req.session.user.id, planetName], (err, result) => {
            if (err) {
                console.error('Error removing planet:', err);
                res.status(500).json({ success: false, message: 'Error removing planet' });
            } else {
                res.json({ success: true, message: 'Planet removed successfully' });
            }
        });
    } else {
        // User is not logged in
        res.status(403).json({ success: false, message: 'Not logged in' });
    }
});



// UPDATE NOTE
app.post('/update-note', (req, res) => {
    if (req.session.user && req.session.user.id) {
        const { planetName, note } = req.body;
        const query = 'UPDATE user_planets SET note = ? WHERE user_id = ? AND planet_name = ?';
        db.execute(query, [note, req.session.user.id, planetName], (err, result) => {
            if (err) {
                console.error('Error updating note:', err);
                res.status(500).json({ success: false, message: 'Error updating note' });
            } else {
                res.json({ success: true, message: 'Note updated successfully' });
            }
        });
    } else {
        res.status(403).json({ success: false, message: 'Not logged in' });
    }
});


// FETCH WISHLIST
app.get('/wishlist', (req, res) => {
    if (req.session.user && req.session.user.id) {
        const query = 'SELECT product_id FROM wishlist_items WHERE user_id = ?';
        db.execute(query, [req.session.user.id], (err, results) => {
            if (err) {
                console.error('Error fetching wishlist:', err);
                res.status(500).json({ success: false, message: 'Error retrieving wishlist' });
            } else {
                res.json({ success: true, wishlist: results });
            }
        });
    } else {
        res.status(403).json({ success: false, message: 'Not logged in' });
    }
});



// ADD TO WISHLIST
app.post('/wishlist/add', (req, res) => {
    if (req.session.user && req.session.user.id) {
        const { productId } = req.body;
        const query = 'INSERT INTO wishlist_items (user_id, product_id) VALUES (?, ?)';
        db.execute(query, [req.session.user.id, productId], (err, result) => {
            if (err) {
                console.error('Error adding to wishlist:', err);
                res.status(500).json({ success: false, message: 'Error adding item to wishlist' });
            } else {
                res.json({ success: true, message: 'Item added to wishlist' });
            }
        });
    } else {
        res.status(403).json({ success: false, message: 'Not logged in' });
    }
});



// REMOVE FROM WISHLIST
app.post('/wishlist/remove', (req, res) => {
    if (req.session.user && req.session.user.id) {
        const { productId } = req.body;
        const query = 'DELETE FROM wishlist_items WHERE user_id = ? AND product_id = ?';
        db.execute(query, [req.session.user.id, productId], (err, result) => {
            if (err) {
                console.error('Error removing from wishlist:', err);
                res.status(500).json({ success: false, message: 'Error removing item from wishlist' });
            } else if (result.affectedRows > 0) {
                res.json({ success: true, message: 'Item removed from wishlist' });
            } else {
                res.status(404).json({ success: false, message: 'Item not found in wishlist' });
            }
        });
    } else {
        res.status(403).json({ success: false, message: 'Not logged in' });
    }
});



// LOGOUT
app.get('/logout', (req, res) => {
    // Destroy the current user session
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).json({ success: false, message: 'Error logging out. Please try again.' });
        } else {
            // Clear the cookie from the client-side if needed
            res.clearCookie('connect.sid');
            res.json({ success: true, message: 'You have been logged out successfully.' });
        }
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
