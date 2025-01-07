import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BookList from './components/Books';
import Navigation from './components/Navigation';
import Login from './components/Login';
import SingleBook from './components/SingleBook';
import Account from './components/Account';
import Registration from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<BookList />} />
          <Route path="/books/:id" element={<SingleBook />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;