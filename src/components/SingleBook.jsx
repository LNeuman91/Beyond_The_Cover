// SingleBook.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  useGetBookByIdQuery,
  useUpdateBookAvailabilityMutation,
  useLazyGetReservationsQuery,
  useAddReviewMutation,
  useGetReviewsByBookIdQuery,
} from '../Slice/apiSlice';
import { useSelector } from 'react-redux';
import ReviewForm from './ReviewForm'; // Assuming ReviewForm is in the same directory

const SingleBook = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetBookByIdQuery(id);
  const [updateBookAvailability] = useUpdateBookAvailabilityMutation();
  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const [refetchReservations] = useLazyGetReservationsQuery();
  const [addReview] = useAddReviewMutation();
  const { data: reviewsData, isLoading: loadingReviews } =
    useGetReviewsByBookIdQuery(id);
  const reviews = reviewsData?.reviews;

  const book = data?.book;

  if (isLoading) return <p>Loading book details...</p>;
  if (isError || !book) {
    console.error('Error or no book data:', { isError, book });
    return <p>Error loading book details. Please try again later.</p>;
  }

  const handleCheckout = async () => {
    if (!token) {
      alert('Please log in to check out this book.');
      return;
    }

    try {
      await updateBookAvailability({ bookId: id, available: false }).unwrap();
      await refetchReservations();
      alert('Book checked out successfully!');
      setIsCheckedOut(true);
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Failed to check out the book. Please try again later.');
    }
  };

  return (
    <>
      <h2>About the Book...</h2>
      <div className="scroll-box">
        <img src={book.coverimage} alt={book.title} />
        <h1>{book.title}</h1>
        <p>Author: {book.author}</p>
        <p>Description: {book.description}</p>
        {token ? (
          <button
            className="btn btn-primary"
            onClick={handleCheckout}
            disabled={isCheckedOut}
          >
            {isCheckedOut ? 'Checked Out' : 'Checkout'}
          </button>
        ) : (
          <button className="btn btn-primary" disabled={true}>
            Login to Checkout
          </button>
        )}
      </div>
      {/* Review Functionality */}
      <h3>Reviews</h3>
      {loadingReviews ? (
        <p>Loading reviews...</p>
      ) : (
        <ul>
          {reviews.map((review) => (
            <li key={review.id}>
              <p>{review.text}</p>
              <p>Rating: {review.rating}</p>
            </li>
          ))}
        </ul>
      )}
      <ReviewForm /> {/* Include the ReviewForm component */}
    </>
  );
};

export default SingleBook;