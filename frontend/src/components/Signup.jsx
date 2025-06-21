import React, { useState } from 'react';
import { auth } from '../firebase/config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaLock, FaEnvelope, FaGoogle, FaGithub, FaFacebook, FaEye, FaEyeSlash, FaTicketAlt } from 'react-icons/fa';
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
  const [showPassword, setShowPassword] = useState(false);
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
      navigate('/dashboard');
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
    <div className="auth-page-wrapper">
      <div className="auth-card-container">
        {/* Left Branding Panel */}
        <div className="auth-left-panel">
          <div className="auth-left-content">
            <div className="auth-logo">
              <FaTicketAlt size={32} />
              <h2>BugTracker</h2>
            </div>
            <h1>WELCOME</h1>
            <p className="headline">Streamline Your Workflow</p>
            <p className="sub-headline">
              Collaborate with your team, track issues efficiently, and deliver high-quality software faster. Get started in seconds.
            </p>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="auth-right-panel">
          <div className="auth-card fade-in">
            <div className="auth-header">
              <h1>{isRegistering ? 'Create Account' : 'Sign In'}</h1>
              <p>
                {isRegistering ? 'Join us and start tracking bugs!' : 'Sign in to continue to your dashboard.'}
              </p>
            </div>
            
            <form onSubmit={handleAuth}>
              {isRegistering && (
                <div className="input-group-modern mb-3">
                  <FaUser className="input-icon" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                    className="form-control-modern"
                    required
                  />
                </div>
              )}
              
              <div className="input-group-modern mb-3">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  className="form-control-modern"
                  required
                />
              </div>
              
              <div className="input-group-modern mb-4">
                <FaLock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="form-control-modern"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="btn-show-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>
              
              {!isRegistering && (
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="form-check">
                    <input id="remember-me" name="remember-me" type="checkbox" className="form-check-input" />
                    <label htmlFor="remember-me" className="form-check-label">Remember me</label>
                  </div>
                  <div>
                    <Link to="/reset-password">Forgot password?</Link>
                  </div>
                </div>
              )}
              
              {error && (
                <div className="alert alert-danger mb-3 fade-in">
                  <strong>Error:</strong> {error}
                </div>
              )}
              
              <button type="submit" disabled={isLoading} className="btn-submit w-100">
                {isLoading ? 'Processing...' : (isRegistering ? 'Create Account' : 'Sign In')}
              </button>

              <div className="auth-divider my-4">
                <span>Or</span>
              </div>

              <button type="button" className="btn-social-other w-100">
                Sign in with other
              </button>
            </form>
            
            <div className="text-center mt-4">
              <p className="text-secondary">
                {isRegistering ? 'Already have an account?' : "Don't have an account?"}
                <button onClick={() => setIsRegistering(!isRegistering)} className="btn btn-link">
                  {isRegistering ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;