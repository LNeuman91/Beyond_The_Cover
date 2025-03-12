// const express = require ("express")
// const app = express()

// app.post("/api/addReview",async(req,res,next)=>{
    
// }) 
// app.get("/", async(req,res,next)=>{
//    res.send("Welcome to my server") 
// })

// app.listen(3000, ()=>{
//     console.log("listening on port 3000")
// })


const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test the database connection
pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Database connected successfully:', result.rows[0].now);
  }
});

app.use(cors());
app.use(bodyParser.json());

// API routes

// Get all books
app.get('/api/books', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM books');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// Get a single book by ID
app.get('/api/books/:id', async (req, res) => {
  const bookId = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM books WHERE id = $1', [bookId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ error: 'Failed to fetch book' });
  }
});

// Get all reviews for a book
app.get('/api/books/:id/reviews', async (req, res) => {
  const bookId = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM reviews WHERE book_id = $1', [bookId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Add a review for a book
app.post('/api/books/:id/reviews', async (req, res) => {
  const bookId = req.params.id;
  const { text, rating } = req.body;

  try {
    // Basic validation (you might want to add more)
    if (!text || !rating) {
      return res.status(400).json({ error: 'Missing text or rating' });
    }

    const result = await pool.query(
      'INSERT INTO reviews (book_id, text, rating) VALUES ($1, $2, $3) RETURNING *',
      [bookId, text, rating]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ error: 'Failed to add review' });
  }
});

// Your original routes
app.post("/api/addReview", async (req, res) => {
  // Implementation for this route is now in the more specific route above ('/api/books/:id/reviews')
});

app.get("/", async (req, res) => {
  res.send("Welcome to my server");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});