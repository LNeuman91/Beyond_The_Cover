// seed.js

const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
  user: 'your_db_user',
  host: 'your_db_host',
  database: 'your_db_name',
  password: 'your_db_password',
  port: 5432, // Default PostgreSQL port
});

async function seedDatabase() {
  try {
    // Users
    const hashedPassword1 = await bcrypt.hash('password123', 10);
    const hashedPassword2 = await bcrypt.hash('anotherPassword', 10);
    const hashedPassword3 = await bcrypt.hash('securePassword', 10);

    await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3), ($4, $5, $6), ($7, $8, $9)',
      ['user1', 'user1@example.com', hashedPassword1, 'user2', 'user2@example.com', hashedPassword2, 'admin', 'admin@example.com', hashedPassword3]
    );

    // Books
    await pool.query(
      'INSERT INTO books (title, author, genre, description, cover_image_url) VALUES ($1, $2, $3, $4, $5), ($6, $7, $8, $9, $10), ($11, $12, $13, $14, $15)',
      [
        'The Great Novel', 'Author A', 'Fiction', 'A captivating story.', 'https://example.com/cover1.jpg',
        'Mystery in the Night', 'Author B', 'Mystery', 'A thrilling mystery.', 'https://example.com/cover2.jpg',
        'Fantasy World', 'Author C', 'Fantasy', 'An epic fantasy adventure.', 'https://example.com/cover3.jpg'
      ]
    );

    // Reviews
    await pool.query(
      'INSERT INTO reviews (user_id, book_id, rating, comment) VALUES ($1, $2, $3, $4), ($5, $6, $7, $8), ($9, $10, $11, $12)',
      [
        1, 1, 4, 'Great book!',
        2, 2, 5, 'Loved it!',
        1, 3, 3, 'Decent read.'
      ]
    );

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    pool.end(); // Close the connection pool
  }
}

seedDatabase();