const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'Niranjana', // replace with your MySQL username
    password: 'yNiru567', // replace with your MySQL password
    database: 'train_seat_booking'
});

// Connect to the database
db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to the database.');
});

// Get all seats
 ```javascript
app.get('/api/seats', (req, res) => {
    db.query('SELECT * FROM seats', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Book seats
app.post('/api/seats/book', (req, res) => {
    const { number_of_seats } = req.body;

    if (!number_of_seats || number_of_seats < 1 || number_of_seats > 7) {
        return res.status(400).json({ error: 'Invalid number of seats requested.' });
    }

    db.query('SELECT * FROM seats WHERE booked = FALSE LIMIT ?', [number_of_seats], (err, availableSeats) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (availableSeats.length < number_of_seats) {
            return res.status(400).json({ error: 'Not enough seats available.' });
        }

        const bookedSeats = availableSeats.slice(0, number_of_seats);
        const seatIds = bookedSeats.map(seat => seat.id);

        db.query('UPDATE seats SET booked = TRUE WHERE id IN (?)', [seatIds], (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ booked_seats: bookedSeats });
        });
    });
});

// Reset booking status
app.post('/api/seats/reset', (req, res) => {
    db.query('UPDATE seats SET booked = FALSE', (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'All seats have been reset.' });
    });
});

// Get seat details by ID
app.get('/api/seats/:id', (req, res) => {
    const seatId = req.params.id;
    db.query('SELECT * FROM seats WHERE id = ?', [seatId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Seat not found.' });
        }
        res.json(results[0]);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log('Server is running on http://localhost:${PORT}');
});