import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateUserMutation } from '../Slice/apiSlice';

const Register = () => {
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [createUser] = useCreateUserMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createUser({ firstname, lastname, email, password }).unwrap();
      alert('Registration successful!');
      navigate('/login'); 
    } catch (err) {
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <>
      <h2>Registration Form</h2>
      <div className="scroll-box">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="firstName">First Name: </label>
            <input
              id="firstName"
              type="text"
              placeholder="First name"
              value={firstname}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <br />
          <div>
            <label htmlFor="lastName">Last Name: </label>
            <input
              id="lastName"
              type="text"
              placeholder="Last name"
              value={lastname}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <br />
          <div>
            <label htmlFor="email">Email: </label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <br />
          <div>
            <label htmlFor="password">Password: </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <br />
          <button type="submit" className="btn btn-primary">
            Register
          </button>
        </form>
      </div>
    </>
  );
};

export default Register;