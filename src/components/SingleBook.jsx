// SingleBook.jsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGetBookByIdQuery,
  useAddReviewMutation,
  useGetReviewsByBookIdQuery,
} from "../Slice/apiSlice";
import { useSelector } from "react-redux";
import ReviewForm from "./ReviewForm";

const SingleBook = () => {
  const { id } = useParams();
  const { data: bookData, isLoading: bookLoading, isError: bookError } = useGetBookByIdQuery(id);
  const token = useSelector((state) => state.auth.token);
  const [addReview] = useAddReviewMutation();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { data: reviewsData, isLoading: reviewsLoading, isError: reviewsError, refetch: refetchReviews } = useGetReviewsByBookIdQuery(id);
  const reviews = reviewsData?.reviews;

  const book = bookData?.book;

  if (bookLoading) return <p>Loading book details...</p>;
  if (bookError || !book) {
    console.error("Error or no book data:", { bookError, book });
    return <p>Error loading book details. Please try again later.</p>;
  }

  const HandleAddReview = async (reviewData) => {
    try {
      alert("Review Successfully added")
      // await addReview({ bookId: id, review: reviewData }).unwrap();
      // setShowReviewForm(false);
      // alert("Review submitted successfully!");
      // refetchReviews(); // Refetch reviews after submission
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again later.");
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
      </div>
      <h3>Reviews</h3>
      {reviewsLoading ? (
        <p>Loading reviews...</p>
      ) : reviews && Array.isArray(reviews) && reviews.length > 0 ? (
        <ul>
          {reviews.map((review) => (
            <li key={review.id}>
              <p>{review.text}</p>
              <p>Rating: {review.rating}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No reviews yet.</p>
      )}

      {token ? (
        showReviewForm ? (
          <ReviewForm onSubmit={HandleAddReview} />
        ) : (
          <button className="btn btn-primary" onClick={() => setShowReviewForm(true)}>Add Review</button>
        )
      ) : (
        <p>Login to add a review.</p>
      )}
    </>
  );
};

export default SingleBook;