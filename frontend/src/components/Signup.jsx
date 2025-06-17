import React, { useState } from 'react';
import { auth } from '../firebase/config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaLock, FaEnvelope, FaGoogle, FaGithub, FaFacebook } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';

const Signup = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [form, setForm] = useState({ 
    email: '', 
    password: '',
    name: '' 
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, form.email, form.password);
      } else {
        await signInWithEmailAndPassword(auth, form.email, form.password);
      }
      navigate('/projectlist');
    } catch (err) {
      setError(getFriendlyError(err.code));
    } finally {
      setIsLoading(false);
    }
  };

  const getFriendlyError = (errorCode) => {
    switch(errorCode) {
      case 'auth/email-already-in-use':
        return 'This email is already in use.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/user-not-found':
        return 'No account found with this email.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      default:
        return 'An error occurred. Please try again.';
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center auth-container p-4">
      <div className="bg-white p-5 rounded-3 shadow w-100 max-w-md border">
        <div className="text-center mb-5">
          <h1 className="h3 mb-3 fw-normal text-dark">
            {isRegistering ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-secondary">
            {isRegistering ? 'Join us today!' : 'Sign in to continue'}
          </p>
        </div>
        
        <form onSubmit={handleAuth} className="mb-4">
          {isRegistering && (
            <div className="mb-3 input-group">
              <span className="input-group-text">
                <FaUser className="text-secondary" />
              </span>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
          )}
          
          <div className="mb-3 input-group">
            <span className="input-group-text">
              <FaEnvelope className="text-secondary" />
            </span>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          
          <div className="mb-3 input-group">
            <span className="input-group-text">
              <FaLock className="text-secondary" />
            </span>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="form-control"
              required
              minLength={6}
            />
          </div>
          
          {!isRegistering && (
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="form-check">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="form-check-input"
                />
                <label htmlFor="remember-me" className="form-check-label">
                  Remember me
                </label>
              </div>
              <div>
                <Link to="/reset-password" className="text-decoration-none">
                  Forgot password?
                </Link>
              </div>
            </div>
          )}
          
          {error && (
            <div className="alert alert-danger mb-3">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-100 btn btn-primary btn-lg ${isLoading ? 'disabled' : ''}`}
          >
            {isLoading ? (
              <span className="d-flex align-items-center justify-content-center">
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Processing...
              </span>
            ) : isRegistering ? (
              'Sign Up'
            ) : (
              'Sign In'
            )}
          </button>
        </form>
        
        <div className="mb-4">
          <div className="position-relative">
            <div className="position-absolute top-50 start-0 end-0 border-top"></div>
            <div className="position-relative text-center">
              <span className="px-2 bg-white text-secondary">
                Or continue with
              </span>
            </div>
          </div>
          
          <div className="d-flex justify-content-between gap-3 mt-4">
            <button className="btn btn-outline-secondary flex-grow-1">
              <FaGoogle className="text-danger" />
            </button>
            <button className="btn btn-outline-secondary flex-grow-1">
              <FaGithub className="text-dark" />
            </button>
            <button className="btn btn-outline-secondary flex-grow-1">
              <FaFacebook className="text-primary" />
            </button>
          </div>
        </div>
        
        <p className="text-center text-secondary">
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="btn btn-link p-0 text-decoration-none"
          >
            {isRegistering ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;