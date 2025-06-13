import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import acceptFriendRequest from '../utility/AcceptReq.js';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import useStore from '../Store/Store.jsx';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [friendRequests, setFriendRequests] = useState([]);
  const [value, setValue] = useState("");
  const [editing, setEditing] = useState(false);

  const profilephoto = useStore((state) => state.profilephoto);
  const setprofilephoto = useStore((state) => state.setprofilephoto);
  const setIsVerified = useStore((state) => state.setIsVerified);
  const setLoggedIn = useStore((state) => state.setLoggedIn);
  const loggedin = useStore((state) => state.loggedin);
  const setPopAdmin = useStore((state) => state.setPopAdmin);
  const pop = useStore((state) => state.popadmin);

  const handleLogout = () => {
    localStorage.removeItem('AccessToken');
    localStorage.removeItem('RefreshToken');
    setprofilephoto("");
    setIsVerified(false);
    setLoggedIn(false);
    toast.success("Logged out successfully");
    navigate('/');
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const AccessToken = localStorage.getItem("AccessToken");
      if (!AccessToken) {
        toast.error("Please login first");
        navigate('/Login');
        return;
      }

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/user/getMyID`,
          { AccessToken },
          { headers: { 'Content-Type': 'application/json' } }
        );
        const account = response.data.Account;
        setUser(account);
        setprofilephoto(account.profilephoto || '');
        setValue(account.Bio || "");
        setFriendRequests(response.data.friendRequests || []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch user data");
        navigate('/Login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, setprofilephoto]);

  const RefreshTokenVerification = async () => {
    const RefreshToken = localStorage.getItem('RefreshToken');
    if (!RefreshToken) return false;

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/user/verifyToken`, {
        RefreshToken,
      });

      if (res.data.status === 'authorized') {
        localStorage.setItem('AccessToken', res.data.AccessToken);
        const user = res.data.User;
        setUser(user);
        setprofilephoto(user.profilephoto || '');
        setLoggedIn(true);
        return true;
      }
    } catch (error) {
      console.error('Refresh token failed:', error);
    } finally {
      navigate('/dashboard');
    }
    return false;
  };

  const AccessTokenVerification = async () => {
    const AccessToken = localStorage.getItem('AccessToken');
    if (!AccessToken) {
      RefreshTokenVerification();
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/user/login`, {
        token: AccessToken,
      });

      if (res.data.status === 'verified') {
        const user = res.data.User;
        setUser(user);
        setprofilephoto(user.profilephoto || '');
        setLoggedIn(true);
        navigate('/dashboard');
      } else {
        throw new Error('Invalid access token');
      }
    } catch (error) {
      const refreshSuccess = await RefreshTokenVerification();
      if (refreshSuccess) {
        navigate('/dashboard');
      }
    }
  };

  useEffect(() => {
    if (!loggedin) {
      const AccessToken = localStorage.getItem("AccessToken");
      if (!AccessToken) {
        navigate('/login');
      }
      AccessTokenVerification();
      setLoggedIn(true)
    }
  }, []);

  const updateBio = async (val) => {
    const AccessToken = localStorage.getItem("AccessToken");
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/user/update`,
        { AccessToken, Bio: val },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setUser((prev) => ({ ...prev, Bio: val }));
      setEditing(false);
      toast.success("Bio updated");
    } catch (error) {
      toast.error("Error updating bio");
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-blue-600">Loading...</div>;
  }

  if (!user) {
    return <div className="text-center py-10 text-red-600">User not found</div>;
  }

  return (
    <div className="p-4">
      <button
                
                className="text-gray-600 hover:text-gray-900 text-lg  font-bold right-0"
                  onClick={()=>{setPopAdmin(!pop)}}
                >
                ✕
              </button>
      <div className="flex items-center gap-4 mb-4">

        <img
          src={user.profilephoto || "/user.png"}
          alt={user.username || "User"}
          className="h-16 w-16 rounded-full object-cover border shadow"
          onError={(e) => (e.currentTarget.src = "/user.png")}
          />
        
        <div>
          <h2 className="text-lg font-bold">{user.username}</h2>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>
        
      </div>
      

      <div className="mb-4">
        {!editing ? (
          <div className="flex justify-between items-center">
            <p className="text-sm">{user.Bio || "No bio set"}</p>
            <button
              onClick={() => setEditing(true)}
              className="text-sm text-blue-600 hover:underline"
            >
              Edit
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              className="border px-2 py-1 rounded w-full text-sm"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <button
              onClick={() => updateBio(value)}
              className="text-sm bg-blue-600 text-white px-2 rounded"
            >
              Save
            </button>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-md font-semibold mb-2">
          Friend Requests ({friendRequests.length})
        </h3>
        {friendRequests.length > 0 ? (
          friendRequests.map((req) => (
            <div key={req._id} className="flex items-center justify-between mb-2 p-2 bg-yellow-50 rounded">
              <div className="flex items-center gap-2">
                <img
                  src={req.profilephoto || "/user.png"}
                  className="w-8 h-8 rounded-full"
                  onError={(e) => (e.currentTarget.src = "/user.png")}
                  alt={req.username || "User"}
                />
                <div>
                  <p className="text-sm font-semibold">{req.username}</p>
                  <p className="text-xs text-gray-600">{req.Bio}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  acceptFriendRequest(localStorage.getItem("AccessToken"), req._id, "Confirm")
                    .then(() => {
                      toast.success("Accepted");
                      setFriendRequests((prev) => prev.filter((r) => r._id !== req._id));
                    })
                    .catch((err) => {
                      toast.error(err.message || "Error");
                    });
                }}
                className="bg-green-500 text-white text-xs px-2 py-1 rounded"
              >
                Confirm
              </button>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No pending requests</p>
        )}
      </div>

      <div className="mt-6">
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition duration-300 shadow-md"
          onClick={handleLogout}
        >
          LogOut
        </button>
      </div>
    </div>
  );
}

export default Dashboard;