/* TODO - add your code to create a functional React component that renders a login form */

import React, { useState } from 'react';
import { useLoginUserMutation } from '../Slice/apiSlice';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setToken } from '../Slice/authSlice';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loginUser] = useLoginUserMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    try {
      const response = await loginUser(credentials).unwrap();
      const token = response.token;
      if (!token) {
        throw new Error('No token returned from login response');
      }
      dispatch(setToken(token));
      localStorage.setItem('token', token);
      const decoded = jwtDecode(token);
      alert(`Login successful! Welcome, ${decoded.email}.`);
      navigate('/');
    } catch (err) {
      console.error('Login failed:', err);
      alert('Invalid credentials or server error.');
    }
  };

  return (
    <>
      <div>
        <h2>Login</h2>
        <div className="scroll-box">
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email">Email:</label>
              <input
                id="email"
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <br />
            <div>
              <label htmlFor="password">Password:</label>
              <input
                id="password"
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <br />
            <button className="btn btn-primary" type="submit">
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;