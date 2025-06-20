import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingPage from '../components/LoadingPage';
import useStore from '../Store/Store';
import { toast } from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isVerifying, setIsVerifying] = useState(true); // token check
  const [isSubmitting, setIsSubmitting] = useState(false); // form submission

  const User = useStore((state) => state.User);
  const setUser = useStore((state) => state.setUser);
  const navigate = useNavigate();
  const loggedin = useStore((state) => state.loggedin);
  const setLoggedIn = useStore((state) => state.setLoggedIn);
  // Refresh Token Verification
  const RefreshTokenVerification = async () => {
    const RefreshToken = localStorage.getItem('RefreshToken');
    if (!RefreshToken) return false;

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/user/verifyToken`, {
        RefreshToken,
      });

      if (res.data.status === 'authorized') {
        localStorage.setItem('AccessToken', res.data.AccessToken);
        setUser({
          name: res.data.User.username,
          _id: res.data.User._id,
          email: res.data.User.email,
          profilephoto: res.data.User.profilephoto || '',
        });

        setLoggedIn(true);
        return true;
      }
    } catch (error) {
      console.error('Refresh token failed:', error);
    }
    finally {
      setIsVerifying(false);
      navigate('/dashboard'); // Redirect to login if refresh fails
    }
    return false;
  };

  // Access Token Verification
  const AccessTokenVerification = async () => {
    const AccessToken = localStorage.getItem('AccessToken');
    if (!AccessToken) {
      RefreshTokenVerification()
      setIsVerifying(false);
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/user/login`, {
        token: AccessToken,
      });

      if (res.data.status === 'verified') {
        setUser({
          name: res.data.User.username,
          _id: res.data.User._id,
          email: res.data.User.email,
          profilephoto: res.data.User.profilephoto || '',
        });
        setLoggedIn(true);
        console.log('user',User);
        navigate('/dashboard');
      } else {
        throw new Error('Invalid access token');
      }
    } catch (error) {
      const refreshSuccess = await RefreshTokenVerification();
      if (refreshSuccess) {
        navigate('/dashboard');
      }
      else{
        setIsVerifying(false);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    AccessTokenVerification();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');
    setIsSubmitting(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/user/login`, {
        email,
        password,
      });

      if (res.data.status === 'verified') {
        const { AccessToken, RefreshToken, User: user } = res.data;

        localStorage.setItem('AccessToken', AccessToken);
        localStorage.setItem('RefreshToken', RefreshToken);

        setUser({
          name: user.username,
          email: user.email,
          _id: user._id,
          profilephoto: user.profilephoto
        });

        setMessage('Login successful!');
        setMessageType('success');
        setLoggedIn(true);
        navigate('/dashboard');
      } else {
        setMessage(res.data.message || 'Login failed');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('Something went wrong. Please try again.');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess =async(response) => {
    const credentialresposne = response.credential;
    console.log("Google Response:", credentialresposne);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/user/google/signin`,{GoogleToken:credentialresposne})
      console.log("Google Sign In Response:", res.data);
      if (res.data.status === "success") {
        localStorage.setItem("AccessToken", res.data.token);
        setUser({
          name: res.data.user.username,
          email: res.data.user.email,
          _id: res.data.user._id,
          profilephoto: res.data.user.profilephoto,
        });
        console.log("User Data:", User);
        toast.success("Google Sign In Successful");
        setLoggedIn(true);
        navigate('/dashboard');
      }

    } catch (error) {
      toast.error("Google Sign In Failed", error);
      console.error("Google Sign In Error:", error); 
    }

  }

  if (isVerifying) return <LoadingPage />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center px-4 py-16">
      <div className="bg-white max-w-md w-full rounded-3xl p-8 md:p-10 shadow-2xl">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-800 mb-8">
          Welcome <span className="text-blue-600">Back</span>
        </h2>

        {message && (
          <div
            className={`p-3 mb-6 rounded-lg text-sm text-center ${
              messageType === 'error'
                ? 'bg-red-100 text-red-700'
                : 'bg-green-100 text-green-700'
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-600 text-sm">
          Don't have an account?{' '}
          <a href="/signup" className="text-blue-600 hover:underline font-semibold">
            Sign up here
          </a>
        </p>
        <div className='flex items-center justify-center mt-6'>
          <GoogleLogin onSuccess={(res)=>handleGoogleSuccess(res)}/>
        </div>
      </div>
    </div>
  );
}

export default Login;
