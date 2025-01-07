/* TODO - add your code to create a functional React component that renders account details for a logged in user. Fetch the account data from the provided API. You may consider conditionally rendering a message for other users that prompts them to log in or create an account.  */

import {
    useGetReservationsQuery,
    useReturnBookMutation,
    useGetBooksQuery,
  } from '../Slice/apiSlice';
  import { Link } from 'react-router-dom';
  import { useNavigate } from 'react-router-dom';
  import { jwtDecode } from 'jwt-decode';
  import { useSelector } from 'react-redux';
  import { useState } from 'react';
  import { useEffect } from 'react';
  
  export default function Account() {
    const [checkedOutBooks, setCheckedOutBooks] = useState([]);
    const navigate = useNavigate();
    const token = useSelector((state) => state.auth.token);
    const decodedToken = token ? jwtDecode(token) : {};
    const { email } = decodedToken;
    const {
      data: booksData,
      isLoading: loadingBooks,
      isError: booksError,
    } = useGetBooksQuery();
    const {
      data: reservationsData,
      isLoading: loadingReservations,
      isError: reservationsError,
    } = useGetReservationsQuery(undefined, {
      skip: !token,
    });
  
    const [returnBook] = useReturnBookMutation();
  
    useEffect(() => {
      if (!email) {
        navigate('/login');
      }
    }, [email, navigate]);
  
    useEffect(() => {
      if (booksData && reservationsData) {
        const books = booksData.books || [];
        const reservations = reservationsData.reservation || [];
  
        const updatedCheckedOutBooks = reservations.map((reservation) => {
          const matchingBook = books.find(
            (book) => book.title === reservation.title
          );
          return matchingBook
            ? { ...matchingBook, reservationId: reservation.id }
            : reservation;
        });
  
        setCheckedOutBooks(updatedCheckedOutBooks);
      }
    }, [booksData, reservationsData]);
  
    const handleReturns = async (reservationId) => {
      try {
        await returnBook(reservationId).unwrap();
        setCheckedOutBooks((prevBooks) =>
          prevBooks.filter((book) => book.reservationId !== reservationId)
        );
        alert('Selected Book has been returned.');
      } catch (error) {
        console.error('Unable to return selected book.');
        alert('Unable to return selected book, please try again!');
      }
    };
  
    if (loadingBooks || loadingReservations) {
      return <div>Loading your information, please wait! </div>;
    }
    if (booksError || reservationsError) {
      return <div>Something went wrong, please try again.</div>;
    }
  
    return (
      <>
        <div>
          <h3>Welcome, {email}</h3>
          <h2>Checked Out Books:</h2>
          <div className="scroll-box">
            {checkedOutBooks.length > 0 ? (
              <ul>
                {checkedOutBooks.map((reservation) => (
                  <li key={reservation.reservationId}>
                    {reservation.title} by {reservation.author}
                    <br />
                    <button
                      className="btn btn-primary"
                      onClick={() => handleReturns(reservation.reservationId)}
                    >
                      Return
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div>
                <p>No books have been checked out</p>
                <Link to="/">Explore our book catalog!</Link>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }