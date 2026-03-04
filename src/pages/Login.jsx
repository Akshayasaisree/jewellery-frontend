import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode';
import Loader from '../components/Loader'; // Import the Loader component

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [currentState, setCurrentState] = useState('Login');
  const [isAuthenticating, setIsAuthenticating] = useState(false); // Track authentication state
  const [loginError, setLoginError] = useState(''); // Track login error message
  const [shakeAnimation, setShakeAnimation] = useState(false); // Track shake animation
  const navigate = useNavigate();

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsAuthenticating(true); // Show loader
    setLoginError(''); // Clear any previous errors

    const body = currentState === 'Login'
      ? { email, password }
      : { name, email, password };

    try {
      const endpoint = currentState === 'Login'
        ? 'http://localhost:5002/api/auth/login'
        : 'http://localhost:5002/api/auth/signup';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.message || 'An error occurred';
        setLoginError(errorMessage);
        setShakeAnimation(true); // Trigger shake animation
        setIsAuthenticating(false); // Hide loader on error
        setTimeout(() => setShakeAnimation(false), 500); // Reset shake animation after 500ms
        console.error('Error:', errorMessage);
      } else {
        localStorage.setItem('username', email);
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId); // Store the user ID
        setTimeout(() => {
          setIsAuthenticating(false); // Hide loader
          navigate('/'); // Navigate to the desired page
        }, 1000); // Small delay to show animation after success
      }

    } catch (error) {
      setLoginError('An error occurred. Please try again.');
      setShakeAnimation(true); // Trigger shake animation
      setIsAuthenticating(false); // Hide loader on exception
      setTimeout(() => setShakeAnimation(false), 500); // Reset shake animation after 500ms
      console.error('Error:', error);
    }
  };

  const handleGoogleLoginSuccess = (credentialResponse) => {
    try {
      // Decode the Google token to extract user information
      const decodedToken = jwtDecode(credentialResponse.credential);
      const username = decodedToken.name || decodedToken.given_name;  // Extract username (or a fallback name)
  
      // Store the username in localStorage along with the token
      localStorage.setItem('token', credentialResponse.credential);
      localStorage.setItem('username', username); // Save the username to localStorage
  
      // Set authenticating state
      setIsAuthenticating(true);
  
      fetch('http://localhost:5002/api/auth/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ googleToken: credentialResponse.credential }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.userId); // Store the user ID for Google login
            setTimeout(() => {
              setIsAuthenticating(false);
              navigate('/');
            }, 1000);
          } else {
            setLoginError('Google login failed. Please try again.');
            setShakeAnimation(true);
            setIsAuthenticating(false);
            setTimeout(() => setShakeAnimation(false), 500);
          }
        })
        .catch((error) => {
          setLoginError('An error occurred with Google login.');
          setShakeAnimation(true);
          setIsAuthenticating(false);
          setTimeout(() => setShakeAnimation(false), 500);
          console.error('Error:', error);
        });
    } catch (error) {
      setLoginError('Failed to decode Google token.');
      console.error('Token decoding error:', error);
    }
  };
  
  
  

  const handleGoogleLoginFailure = () => {
    setLoginError('Google Login Failed. Please try again.');
    setShakeAnimation(true); // Trigger shake animation
    setTimeout(() => setShakeAnimation(false), 500); // Reset shake animation after 500ms
    console.error('Google Login Failed');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#f8f0d5] to-[#f3e9d1]">
      {/* Show Loader when authenticating */}
      {isAuthenticating && <Loader />}

      <form
        onSubmit={onSubmitHandler}
        className={`flex flex-col items-center w-full max-w-md p-10 space-y-8 bg-white rounded-3xl shadow-2xl animate-fadeInUp ${shakeAnimation ? 'animate-shake' : ''}`}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
          border: '1px solid #e3d4a1',
        }}
      >
        <h2 className="text-4xl font-bold text-gray-800 mb-4 font-playfair">
          {currentState === 'Login' ? 'Welcome Back' : 'Create Your Account'}
        </h2>

        {/* Display error message if login fails */}
        {loginError && (
          <div className="w-full p-3 text-center text-red-600 bg-red-100 rounded-lg animate-fadeIn">
            {loginError}
          </div>
        )}

        {/* Google Login Button with Animation */}
        <div className="google-login-container animate-fadeIn">
          {/* <GoogleLogin
            clientId="564453147944-fco1mb1nkmvnnm1o9l5djc1d9s6grplh.apps.googleusercontent.com"
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginFailure}
            theme="filled_blue"
            shape="circle"
            size="large"
            className="google-login-button animate-bounce-on-hover"
          /> */}
          <GoogleLogin
          clientId="564453147944-fco1mb1nkmvnnm1o9l5djc1d9s6grplh.apps.googleusercontent.com"
          onSuccess={handleGoogleLoginSuccess}
          onError={handleGoogleLoginFailure}
          theme="filled_blue"
          shape="circle"
          size="large"
          className="google-login-button animate-bounce-on-hover"
          useOneTap
          />
        </div>

        {/* Name Input Field (for Sign Up) */}
        {currentState === 'Sign Up' && (
          <input
            type="text"
            className="w-full px-6 py-3 border rounded-lg shadow-lg focus:ring focus:ring-opacity-50 text-gray-800"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{
              backgroundColor: '#f3e9d1',
            }}
          />
        )}

        {/* Email Input Field */}
        <input
          type="email"
          className="w-full px-6 py-3 border rounded-lg shadow-lg focus:ring focus:ring-gold-300 focus:ring-opacity-50 text-gray-800"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            backgroundColor: '#f3e9d1',
          }}
        />

        {/* Password Input Field */}
        <input
          type="password"
          className="w-full px-6 py-3 border rounded-lg shadow-lg focus:ring focus:ring-gold-300 focus:ring-opacity-50 text-gray-800"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            backgroundColor: '#f3e9d1',
          }}
        />

        {/* Toggle Between Login & Sign Up */}
        <div className="flex justify-between w-full text-sm text-gray-600">
          <p className="hover:underline cursor-pointer">Forgot Password?</p>
          {currentState === 'Login' ? (
            <p
              className="hover:underline cursor-pointer text-gold-600"
              onClick={() => setCurrentState('Sign Up')}
            >
              Create an Account
            </p>
          ) : (
            <p
              className="hover:underline cursor-pointer text-gold-600"
              onClick={() => setCurrentState('Login')}
            >
              Already have an account?
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full px-6 py-3 font-medium text-white rounded-lg shadow-lg bg-gradient-to-r from-[#d4af37] to-[#f2c800] hover:bg-gradient-to-r hover:from-[#f2c800] hover:to-[#d4af37] focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-opacity-50"
          style={{
            backgroundColor: '#d4af37',
          }}
        >
          {currentState === 'Login' ? 'Log In' : 'Sign Up'}
        </button>
      </form>

      <style>{`
        /* Fade-in animation for the container */
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Shake animation */
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          50% {
            transform: translateX(5px);
          }
          75% {
            transform: translateX(-5px);
          }
        }
      `}</style>
    </div>
  );
}

export default Login;
