// ReviewForm.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAddReviewMutation } from '../Slice/apiSlice';
import { useSelector } from 'react-redux';

const ReviewForm = () => {
  const { id } = useParams(); // Get the book ID from the URL
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const token = useSelector((state) => state.auth.token);
  const [addReview] = useAddReviewMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert('Please log in to submit a review.');
      return;
    }

    try {
      await addReview({
        bookId: id,
        review: {
          text: reviewText,
          rating,
        },
      }).unwrap();
      setReviewText('');
      setRating(0);
      alert('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again later.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="reviewText">Review:</label>
        <textarea
          id="reviewText"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="rating">Rating:</label>
        <select
          id="rating"
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value, 10))}
        >
          <option value={0}>Select Rating</option>
          {[1, 2, 3, 4, 5].map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>
      <button type="submit">Submit Review</button>
    </form>
  );
};

export default ReviewForm;