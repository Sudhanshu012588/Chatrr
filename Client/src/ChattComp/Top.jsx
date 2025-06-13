import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import useStore from '../Store/Store';

function Top() {
  const [friends, setFriends] = useState([]);
  const [showRequestPanel, setShowRequestPanel] = useState(false);
  const [users, setUsers] = useState([]);

  const friendID = useStore((state) => state.friendId);
  const setFriendId = useStore((state) => state.setFirendId);

  // Local state to track which friend is currently selected (for highlight)
  const [selectedFriendId, setSelectedFriendId] = useState(null);

  const getUsers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/user/getUser`, {
        headers: {
          AccessToken: localStorage.getItem('AccessToken'),
        },
      });
      setUsers(response.data.users);
    } catch (error) {
      toast.error('Failed to fetch user data');
      console.error(error);
    }
  };

  const getFriends = async () => {
    const AccessToken = localStorage.getItem('AccessToken');
    if (!AccessToken) {
      toast.error('Access Token is required');
      return;
    }

    try {
      const friendsResponse = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/user/friendslist`,
        { AccessToken } // send in body (required by your backend)
      );

      if (
        friendsResponse.data.status === 'not found' ||
        !friendsResponse.data.friends
      ) {
        throw new Error('No friends found');
      }

      setFriends(friendsResponse.data.friends);
    } catch (error) {
      console.error('Error fetching friends:', error);
      toast.error("Can't fetch your friends");
    }
  };

  useEffect(() => {
    getUsers();
    getFriends();
  }, []);

  const sendFriendRequest = async (id) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/user/friendreq`,
        {
          friendID: id,
          AccessToken: localStorage.getItem('AccessToken'),
        }
      );
      toast.success(response.data.message);
    } catch (error) {
      toast.error('Error sending friend request');
      console.error(error);
    }
  };

  const handleFriendClick = (id) => {
    setSelectedFriendId(id); // highlight locally
    setFriendId(id); // update store as before
  };

  const handleOpenFriendRequestPanel = () => {
    setShowRequestPanel(true);
  };

  const handleCloseFriendRequestPanel = () => {
    setShowRequestPanel(false);
  };

  return (
    <div className="relative">
      {/* Top Bar */}
      <div className="bg-blue-200 p-4 overflow-x-auto rounded-b-2xl shadow-md">
        <div className="flex gap-6 items-center">
          {friends.map((friend, index) => (
            <div key={index} className="flex flex-col items-center">
              <button
                className="flex flex-col items-center focus:outline-none"
                onClick={() => handleFriendClick(friend._id)}
              >
                <div
                  className={`rounded-full w-12 h-12 overflow-hidden flex items-center justify-center shadow-md
                    ${
                      selectedFriendId === friend._id
                        ? 'ring-4 ring-blue-500 ring-offset-2'
                        : 'bg-gray-100'
                    }
                  `}
                >
                  <img
                    src={friend.profilephoto || '/user.png'}
                    alt="user"
                    className="w-12 h-12 object-cover rounded-full"
                  />
                </div>
                <p className="text-black text-sm mt-1">{friend.username}</p>
                <span
                  className={`text-xs ${
                    friend.status === 'Online'
                      ? 'text-green-600'
                      : friend.status === 'Away'
                      ? 'text-yellow-600'
                      : 'text-gray-500'
                  }`}
                >
                  {friend.status || 'Offline'}
                </span>
              </button>
            </div>
          ))}

          {/* Add Friend Button */}
          <div className="ml-auto">
            <button
              title="Add Friend"
              onClick={handleOpenFriendRequestPanel}
              className="w-24 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition duration-300"
            >
              <i className="fas fa-plus mr-1" /> Add
            </button>
          </div>
        </div>
      </div>

      {/* Friend Request Popup */}
      {showRequestPanel && (
        <div className="fixed top-16 mt-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-4">
          <div className="bg-white p-6 rounded-xl shadow-xl max-h-[70vh] overflow-y-auto border border-gray-300">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Send Friend Requests</h2>
              <button
                onClick={handleCloseFriendRequestPanel}
                className="text-gray-600 hover:text-gray-900 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {users.map((friend, index) => (
              <div
                key={index}
                className="mb-4 flex items-center gap-4 p-3 bg-gray-100 rounded-lg hover:shadow transition"
              >
                <div className="bg-gray-200 rounded-full w-12 h-12 overflow-hidden flex items-center justify-center">
                  <img
                    src={friend.profilephoto || '/user.png'}
                    alt="user"
                    className="w-12 h-12 object-cover rounded-full"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{friend.username}</p>
                  <p className="text-sm text-gray-600">{friend.Bio}</p>
                  <p className="text-xs text-gray-500">
                    {friend.status || 'Offline'}
                  </p>
                </div>
                <button
                  onClick={() => sendFriendRequest(friend._id)}
                  className="bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600 transition"
                >
                  Be My Friend
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Top;
